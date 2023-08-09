var IMAGES_PATH = ''; //https://stroy-monitoring.online/skew-house/'
var createHTMLImage = function () {
    var image = document.createElement('img');
    image.crossOrigin = 'anonymous';
    return image;
};
var BackgroundLayerType = 'background';
var ObjectLayerType = 'object';
var MotionBlock = /** @class */ (function () {
    function MotionBlock(params) {
        var _this = this;
        this.container = params.container; //див, в котором создавать canvas
        this.container.style.width = innerWidth + "px";
        this.container.style.height = innerWidth * 616 / 1920 + "px";
        this.images_count = params.images_count || 11; // количество изображений в анимации
        this.speed_coefficient = params.speed_coefficient || 0.5;
        this.min_speed = params.min_speed || 0.1;
        this.max_speed = params.max_speed || 1;
        this.folder = params.folder;
        this.object_folder = "";
        this.position = 0;
        this.cursor_pos = 0;
        this.locked = 0;
        this.speed = 0;
        this.over = false;
        this.center_num = 0;
        this.total_count = 0;
        this.canvas = document.createElement("canvas"); // создание элемента canvas
        this.container.appendChild(this.canvas); // помещение канваса в нужный див
        this.context = this.canvas.getContext("2d");
        this.slides = [];
        this.covers = [];
        this.slides_pre = [];
        this.covers_pre = [];
        this.need_to_draw = false;
        var labels = document.getElementsByName("object");
        var label_object;
        if (params.default_object) {
            for (var n = 0; n < labels.length; n++)
                if (labels[n].getAttribute("prefix") == "_" + params.default_object)
                    label_object = labels[n];
        }
        else {
            for (var n = 0; n < labels.length; n++)
                if (labels[n].getAttribute("prefix") == null)
                    label_object = labels[n];
        }
        if (label_object)
            setTimeout(function () { label_object.click(); }, 100);
        labels = document.getElementsByName("background");
        var label_background;
        if (params.default_background) {
            for (var n = 0; n < labels.length; n++)
                if (labels[n].getAttribute("prefix") == "_" + params.default_background)
                    label_background = labels[n];
        }
        else {
            for (var n = 0; n < labels.length; n++)
                if (labels[n].getAttribute("prefix") == null)
                    label_background = labels[n];
        }
        if (label_background)
            setTimeout(function () { label_background.click(); }, 100);
        window.addEventListener("resize", function (e) { _this.resize(); _this.need_to_draw = true; });
        window.addEventListener("focus", function (e) { _this.need_to_draw = true; });
        window.addEventListener("mousemove", function (e) {
            var last_pos = _this.pos || { x: 0, y: 0 };
            _this.pos = mouseXY(e, _this.container);
            var par = elementSize(_this.container);
            var k;
            if (_this.rect1)
                k = _this.canvas.width / _this.rect1.width;
            //******************** over Rect1 **************** здесь смотрится, находится ли курсор над объектом типа двери
            if (_this.rect1) {
                _this.overRect1 = false;
                if (_this.pos.x > _this.rect1.x1 * k)
                    if (_this.pos.x < _this.rect1.x2 * k)
                        if (_this.pos.y > _this.rect1.y1 * k)
                            if (_this.pos.y < _this.rect1.y2 * k)
                                _this.overRect1 = true;
            }
            //******************** over Rect2 **************** здесь смотрится, находится ли курсор над вторым (если таковой предусмотрен) объектом типа двери
            //if (this.rect2){
            //this.overRect2 = false;
            //if (this.pos.x > this.rect2.x1 * k) if (this.pos.x < this.rect2.x2 * k) if (this.pos.y > this.rect2.y1 * k) if (this.pos.y < this.rect2.y2 * k) this.overRect2 = true;
            //}
            if (_this.overRect1 || _this.overRect2) { // если курсор над объектом, то курсор палец и при нажатии меняется объект.
                _this.container.style.cursor = "pointer";
                _this.container.title = "Изменить дверь";
            }
            else {
                _this.container.style.cursor = "default";
                _this.container.title = "";
            }
            /*
                    let hint = document.getElementById("hint");
                if (this.overRect1 || this.overRect2){
                    this.container.style.cursor = "pointer";
                    hint.style.visibility = "visible";
                    hint.style.opacity = 1;
                    hint.style.left = (this.rect1.x2 + this.rect2.x1) / 2 * k - 60 + "px";
                    hint.style.top = par.top + (this.rect1.y1 + this.rect1.y2) / 2 * k + "px";
                }
                else{
                    this.container.style.cursor = "default";
                    hint.style.visibility = "hidden";
                    hint.style.opacity = 0;
                    hint.style.top = par.top + this.canvas.height / 2 + "px";
                }
            */
            var over = false;
            if (_this.pos.x > 0)
                if (_this.pos.x < par.width)
                    if (_this.pos.y > 0)
                        if (_this.pos.y < par.height)
                            over = true;
            //*************** over ***************
            if (_this.locked <= 0)
                if (!_this.over && over) {
                    _this.locked = 10;
                    _this.over = true;
                    if (_this.pos.x > par.width / 2)
                        _this.speed = _this.speed_coefficient;
                    else
                        _this.speed = -_this.speed_coefficient;
                }
            //*************** out ****************
            if (_this.locked <= 0)
                if (_this.over && !over) {
                    _this.locked = 30;
                    _this.cursor_pos = par.width / 2;
                    _this.over = false;
                }
            _this.need_to_draw = true;
            if (_this.locked > 0)
                return;
            //if (Math.abs(this.pos.x - this.cursor_pos) < 4) return;
            var dx = (_this.pos.x - _this.cursor_pos) / 200;
            if (Math.abs(dx) > 5)
                dx = 5 * _this.max_speed * dx / Math.abs(dx) || 0;
            _this.speed += dx * _this.speed_coefficient;
            if (Math.abs(_this.speed) > 5 * _this.max_speed)
                _this.speed = 5 * _this.max_speed * _this.speed / Math.abs(_this.speed) || 0;
            if (Math.abs(_this.speed) < 5 * _this.min_speed)
                _this.speed = 5 * _this.min_speed * _this.speed / Math.abs(_this.speed) || 0;
            _this.cursor_pos = _this.pos.x;
        });
        this.container.addEventListener("mousedown", function () {
            if (_this.overRect1 || _this.overRect2) {
                var next = void 0;
                var labels_1 = document.getElementsByName("object");
                for (var n = 0; n < labels_1.length; n++)
                    if (labels_1[n] == _this.currentObjectElement)
                        next = n + 1;
                var pre = next - 1;
                //if (pre < 0) pre = 1;
                if (next > labels_1.length - 1) {
                    next = 0;
                    pre = 2;
                }
                if (next == 0)
                    pre = 2;
                if (next != null) {
                    labels_1[pre].click();
                    labels_1[next].click();
                }
            }
        });
    }
    //****************************************************
    MotionBlock.prototype.stopLoaders = function (type) {
        var labels = document.getElementsByClassName("lang");
        //console.log(labels.length)
        for (var n = 0; n < labels.length; n++) {
            var radio = labels[n].querySelector('input');
            if (radio.name == type) {
                var caption = labels[n].querySelector('.caption');
                var loader = labels[n].querySelector('.loader');
                if (loader)
                    loader.style.opacity = '0';
                if (caption)
                    caption.style.opacity = '1';
            }
        }
    };
    //****************************************************
    MotionBlock.prototype.load = function (type, prefix, loader, caption, folder, element) {
        var loaded_count = 0;
        var THIS = this;
        THIS.backgroundComplete = true;
        //THIS.coverComplete = true;
        if (type == BackgroundLayerType)
            if (THIS.object_folder != folder)
                if (THIS.currentObjectElement) {
                    THIS.object_folder = folder;
                    change(THIS.currentObjectElement);
                }
        if (type == BackgroundLayerType)
            THIS.backgroundComplete = false;
        if (THIS.started) {
            THIS.stopLoaders(type);
            if (loader)
                loader.style.opacity = 1;
            if (caption)
                caption.style.opacity = 0;
        }
        //**************************************************************
        if (type == BackgroundLayerType) {
            THIS.center_num = Math.ceil(this.images_count / 2); // показывать один кадр, без анимации, пока все кадры не загрузились
            var slide_1 = createHTMLImage();
            slide_1.num = THIS.center_num - 1;
            slide_1.src = IMAGES_PATH + '/' + THIS.folder + "/background" + prefix + "/" + THIS.center_num + ".jpg";
            slide_1.onload = function () {
                if (!THIS.started) {
                    THIS.started = true;
                    THIS.atFirstLoaded = true;
                    THIS.slides[slide_1.num] = slide_1;
                    THIS.resize();
                    THIS.stayOnCenter = true;
                    THIS.need_to_draw = true;
                    THIS.startDraw();
                }
                THIS.full_load(type, prefix, loader, caption, folder);
            };
        }
        //**************************************************************
        if (type == ObjectLayerType) {
            THIS.coverComplete = false;
            THIS.covers_pre = [];
            THIS.currentObjectElement = element;
            var _loop_1 = function (n) {
                var cover = createHTMLImage();
                cover.num = n - 1;
                cover.src = IMAGES_PATH + '/' + THIS.folder + "/object" + prefix + "/" + THIS.object_folder + n + ".png";
                cover.onload = function () {
                    if (this.num == THIS.center_num - 1)
                        THIS.scan(cover);
                    loaded_count++;
                    THIS.covers_pre[this.num] = this;
                    THIS.need_to_draw = true;
                    if (loaded_count == THIS.images_count) {
                        THIS.coverComplete = true;
                        var wait_1 = setInterval(function () {
                            if (THIS.backgroundComplete || !THIS.started) { //.atFirstLoaded){
                                //console.log("waiting");
                                clearInterval(wait_1);
                                if (loader)
                                    loader.style.opacity = 0;
                                if (caption)
                                    caption.style.opacity = 1;
                                for (var j = 0; j < THIS.covers_pre.length; j++) {
                                    THIS.covers[j] = createHTMLImage();
                                    if (THIS.covers_pre[j])
                                        THIS.covers[j].src = THIS.covers_pre[j].src;
                                    THIS.covers[j].onload = function () {
                                        THIS.need_to_draw = true;
                                    };
                                }
                            }
                        }, 50);
                    }
                };
                cover.onerror = function () {
                    loaded_count++;
                };
            };
            for (var n = 1; n <= this.images_count; n++) {
                _loop_1(n);
            }
        }
    };
    //**************************************************
    MotionBlock.prototype.full_load = function (type, prefix, loader, caption, folder) {
        var loaded_count = 0;
        var THIS = this;
        //if (THIS.slides_pre) for (let j = 0; j < THIS.slides_pre.length; j++) try{THIS.slides[j] = null;} catch(e){}
        THIS.slides_pre = [];
        if (type == BackgroundLayerType)
            for (var n = 1; n <= this.images_count; n++) {
                var slide = createHTMLImage();
                slide.num = n - 1;
                slide.src = IMAGES_PATH + '/' + THIS.folder + "/background" + prefix + "/" + n + ".jpg";
                slide.onload = function () {
                    loaded_count++;
                    if (this.num + 1 > THIS.total_count)
                        THIS.total_count = this.num + 1;
                    THIS.slides_pre[this.num] = this;
                    if (loaded_count == THIS.images_count) {
                        THIS.backgroundComplete = true;
                        var wait2_1 = setInterval(function () {
                            //console.log("waiting2");
                            if (THIS.coverComplete) {
                                clearInterval(wait2_1);
                                for (var j = 0; j < THIS.slides_pre.length; j++)
                                    try {
                                        THIS.slides[j] = createHTMLImage();
                                        if (THIS.slides_pre[j])
                                            THIS.slides[j].num = THIS.slides_pre[j].num;
                                        if (THIS.slides_pre[j])
                                            THIS.slides[j].src = THIS.slides_pre[j].src;
                                        THIS.slides[j].onload = function () {
                                            THIS.need_to_draw = true;
                                        };
                                    }
                                    catch (e) { }
                                THIS.resize();
                                THIS.center_num = Math.floor(THIS.total_count / 2) + 1;
                                THIS.stayOnCenter = false;
                                THIS.cursor_pos = -THIS.center_num + 1;
                                THIS.need_to_draw = true;
                                if (loader)
                                    loader.style.opacity = 0;
                                if (caption)
                                    caption.style.opacity = 1;
                            }
                        }, 50);
                    }
                };
                slide.onerror = function () {
                    loaded_count++;
                };
            }
    };
    //************************************************** ищет по картинке png где непрозрачно, то есть выискивает объекты вроде дверей
    MotionBlock.prototype.scan = function (pic) {
        var mask_canvas = document.createElement('canvas');
        var mask_context = mask_canvas.getContext('2d');
        mask_canvas.width = pic.width / 4;
        mask_canvas.height = pic.height / 4;
        mask_context.drawImage(pic, 0, 0, mask_canvas.width, mask_canvas.height);
        var P = mask_context.getImageData(0, 0, mask_canvas.width, mask_canvas.height);
        this.rect1 = { x1: 10000, y1: 10000, x2: 0, y2: 0, width: mask_canvas.width };
        for (var x = 0; x < mask_canvas.width / 2; x++)
            for (var y = 0; y < mask_canvas.height; y++) {
                var num = (y * mask_canvas.width + x) * 4;
                if (P.data[num + 3] > 0) {
                    if (x < this.rect1.x1)
                        this.rect1.x1 = x - 2;
                    if (x > this.rect1.x2)
                        this.rect1.x2 = x + 3.4;
                    if (y < this.rect1.y1)
                        this.rect1.y1 = y - 1;
                    if (y > this.rect1.y2)
                        this.rect1.y2 = y + 2;
                }
            }
        this.rect2 = { x1: 10000, y1: 10000, x2: 0, y2: 0, width: mask_canvas.width }; // если два объекта, то здесь ищет второй
        for (var x = mask_canvas.width / 2 + 1; x < mask_canvas.width; x++)
            for (var y = 0; y < mask_canvas.height; y++) {
                var num = (y * mask_canvas.width + x) * 4;
                if (P.data[num + 3] > 0) {
                    if (x < this.rect2.x1)
                        this.rect2.x1 = x - 2;
                    if (x > this.rect2.x2)
                        this.rect2.x2 = x + 3.4;
                    if (y < this.rect2.y1)
                        this.rect2.y1 = y - 1;
                    if (y > this.rect2.y2)
                        this.rect2.y2 = y + 2;
                }
            }
    };
    //**************************************************
    MotionBlock.prototype.startDraw = function () {
        var THIS = this;
        this.start_time = new Date().getTime();
        redraw();
        function redraw() {
            THIS.locked--;
            if (THIS.over) {
                THIS.position += THIS.speed;
                if (THIS.position < -THIS.center_num + 1) {
                    THIS.position = -THIS.center_num + 1;
                    THIS.speed = 0;
                }
                if (THIS.position > THIS.center_num - 1) {
                    THIS.position = THIS.center_num - 1;
                    THIS.speed = 0;
                }
            }
            else {
                if (THIS.position < 0)
                    THIS.speed = THIS.speed_coefficient / 2;
                else
                    THIS.speed = -THIS.speed_coefficient / 2;
                THIS.position += THIS.speed;
            }
            var current = THIS.center_num + Math.round(THIS.position) - 1;
            if (THIS.stayOnCenter)
                current = THIS.center_num - 1;
            //*************************************************
            if (THIS.need_to_draw || THIS.locked > 0) {
                var S = THIS.slides[current];
                //console.log("draw...", current);
                if (THIS.slides[current])
                    THIS.context.drawImage(S, 0, 0, S.width, S.height, 0, 0, THIS.canvas.width, THIS.canvas.height);
                if (THIS.covers[current])
                    try {
                        THIS.context.drawImage(THIS.covers[current], 0, 0, S.width, S.height, 0, 0, THIS.canvas.width, THIS.canvas.height);
                    }
                    catch (e) { }
            }
            //***********************************
            //THIS.need_to_draw = true;
            if (THIS.over)
                if ((THIS.speed < 0 && Math.round(THIS.position) == -THIS.center_num + 1) || (THIS.speed > 0 && Math.round(THIS.position) == THIS.center_num - 1))
                    THIS.need_to_draw = false;
            if (!THIS.over)
                if (Math.round(THIS.position) == 0)
                    THIS.need_to_draw = false;
            requestAnimationFrame(redraw);
        }
    };
    //**************************************************
    MotionBlock.prototype.resize = function () {
        var par = elementSize(this.container);
        var padTop = parseInt(this.container.style.paddingTop) || 0;
        var padRight = parseInt(this.container.style.paddingRight) || 0;
        var padBottom = parseInt(this.container.style.paddingBottom) || 0;
        var padLeft = parseInt(this.container.style.paddingLeft) || 0;
        var borderTop = parseInt(this.container.style.borderTop) || 0;
        var borderRight = parseInt(this.container.style.borderRight) || 0;
        var borderBottom = parseInt(this.container.style.borderBottom) || 0;
        var borderLeft = parseInt(this.container.style.borderLeft) || 0;
        this.canvas.width = par.width - padRight - padLeft - borderRight - borderLeft;
        this.canvas.width = innerWidth;
        this.canvas.height = this.canvas.width * this.slides[this.center_num - 1].naturalHeight / this.slides[this.center_num - 1].naturalWidth;
        this.canvas.style.left = "0px";
        this.canvas.style.top = (par.height - this.canvas.height) / 2 + "px";
        this.cursor_pos = this.canvas.width / 2;
        this.container.style.width = this.canvas.width + "px";
        this.container.style.height = this.canvas.height + "px";
    };
    return MotionBlock;
}());
//*********************************************************
function mouseXY(event, element) {
    var posx = 0;
    var posy = 0;
    //e = window.event;
    // @ts-ignore
    if (!event)
        event = window.event;
    if (event.pageX || event.pageY) {
        posx = event.pageX;
        posy = event.pageY;
    }
    else if (event.clientX || event.clientY) {
        posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    // @ts-ignore
    if (element)
        if (element != window) {
            var box = element.getBoundingClientRect();
            // @ts-ignore
            posx -= parseInt(box.left) + parseInt(pageXOffset);
            // @ts-ignore
            posy -= parseInt(box.top) + parseInt(pageYOffset);
        }
    return {
        x: posx,
        y: posy
    };
}
//*********************************************************
function elementSize(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docElem = document.documentElement;
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    var width = box.width;
    var height = box.height;
    return { top: Math.round(top), left: Math.round(left), width: width, height: height };
}
