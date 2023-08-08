
class MotionBlockMobile {
    constructor(params) {

			this.container = params.container;

			this.background_div = document.getElementById("scene_background_mobile");
			this.object_div = document.getElementById("scene_decor_mobile");

			this.images_count = params.images_count || 11;

			this.folder = params.folder;
			this.object_folder = "";

			this.covers = [];
			this.slides_pre = [];
			this.covers_pre = [];

			this.loader = document.getElementsByClassName("loader_big"); if (this.loader.length > 0) this.loader = this.loader[0];

			let hints = document.getElementsByClassName("fence_color_tooltip_mobile"); if (hints.length > 0) this.background_hint = hints[0];
				hints = document.getElementsByClassName("fence_decor_tooltip_mobile"); if (hints.length > 0) this.object_hint = hints[0];

			let labels = document.getElementsByName("object");
			let label_object;
			if (params.default_object){
				for (let n = 0; n < labels.length; n++) if (labels[n].getAttribute("prefix") == "_" + params.default_object) label_object = labels[n];
			}
				else {for (let n = 0; n < labels.length; n++) if (labels[n].getAttribute("prefix") == null) label_object = labels[n];}
			if (label_object) setTimeout(() => {label_object.click();}, 100);			


			labels = document.getElementsByName("background");
			let label_background;
			if (params.default_background){
				for (let n = 0; n < labels.length; n++) if (labels[n].getAttribute("prefix") == "_" + params.default_background) label_background = labels[n];
			}
				else {for (let n = 0; n < labels.length; n++) if (labels[n].getAttribute("prefix") == null) label_background = labels[n];}
			if (label_background) setTimeout(() => {label_background.click(); }, 100);

			this.resize();
			window.addEventListener("resize", (e) => {this.resize();});

			var THIS = this;

			//document.getElementsByClassName("fence_decor_tooltip_mobile")[0].on = function(){
				//if (motionBlockMobile) motionBlockMobile.nextObject();
				//this.style.opacity = 0;
			//};

			//********************************************************************************
			this.container.onclick = function(e){ 
				var pos = mouseXY(e, THIS.container);
					var W = parseInt(THIS.container.style.width);
					var H = parseInt(THIS.container.style.height);
					console.log(pos, W, H, pos.x/W, pos.y/H);
					THIS.selected = "";
				if (pos.y > H * 0.11) if (pos.y < H * 0.83) if (pos.x > W * 0.25) if (pos.x < W * 0.79) THIS.selected = "gate"; // выяснение, нажал ли на дом или дверь
				if (pos.x > W * 0.59) if (pos.x < W * 0.69) if (pos.y > H * 0.55) if (pos.y < H * 0.80) THIS.selected = "decor";
					console.log(THIS.selected);
					if (THIS.selected == "gate")  if (!THIS.background_loading) THIS.nextBackground(); // нажал на дом - показать следующий цвет дома
					if (THIS.selected == "decor") if (!THIS.object_loading) THIS.nextObject(); // нажал на дверь - показать следующую дверь
			}

    }

			//****************************************************
			nextBackground(){
				let next;
				let labels = document.getElementsByName("background");
				for (let n = 0; n < labels.length; n++) if (labels[n] == this.currentBackgroundElement) next = n + 1;
				if (!next) next = 1;
				var pre = next - 1;
				//if (pre < 0) pre = 1;
				if (next > labels.length - 1) next = 0;
				if (next == 0) pre = 1;
				if (next != null){
					//labels[pre].click();
					labels[next].click();
				}
			}

			//****************************************************
			nextObject(){
				let next;
				let labels = document.getElementsByName("object");
				for (let n = 0; n < labels.length; n++) if (labels[n] == this.currentObjectElement) next = n + 1;
				var pre = next - 1;
				//if (pre < 0) pre = 1;
				if (next > labels.length - 1) next = 0;
				if (next == 0) pre = 1;
				if (next != null){
					//labels[pre].click();
					labels[next].click();
				}
			}


			//****************************************************
			load(type, prefix, loader, caption, folder, element){

				let THIS = this;

				if (type == "background"){
					if (THIS.object_folder != folder)
					if (THIS.currentObjectElement){
						THIS.object_folder = folder;
						change(THIS.currentObjectElement);
					}							
					THIS.currentBackgroundElement = element;
				}

				if (type == "background"){
					if (THIS.loader) THIS.loader.style.opacity = 1;
					if (THIS.backgroundLoaded){
						if (THIS.background_hint){
							THIS.background_hint.style.opacity = 1;
							THIS.background_hint.style.transition = "0.5s";
							THIS.background_hint.style.opacity = 0;
						}
					}
						THIS.backgroundLoaded = true;
				}

				if (type == "object"){
					if (THIS.objectLoaded){
						if (THIS.object_hint){
							THIS.object_hint.style.opacity = 0;
							THIS.object_hint.style.transition = "0.5s";
							THIS.object_hint.style.opacity = 0;
							THIS.object_hint.style.visibility = "hidden";
							THIS.object_hint.style.hided = true;
						}
					}
						THIS.objectLoaded = true;
				}

				//**************************************************************
				if (type == "background"){
						THIS.background_loading = true;
					var center_num = Math.ceil(this.images_count / 2);
					let slide = document.createElement("img");
					slide.src = THIS.folder + "/background" + prefix + "/" + center_num + ".jpg";
					slide.onload = function(){
						THIS.background_div.style.background = "url('" + THIS.folder + "/background" + prefix + "/" + center_num + ".jpg')";
						THIS.background_div.style.backgroundPosition = "12% 50%";
						THIS.background_div.style.backgroundSize = "cover";	//innerWidth * 0.75 / slide.naturalHeight * 100 + "%";
						if (THIS.loader) THIS.loader.style.opacity = 0;
						THIS.background_loading = false;
					}
				}

				//**************************************************************
				if (type == "object"){
						THIS.object_loading = true;
					THIS.currentObjectElement = element;
					var center_num = Math.ceil(this.images_count / 2);
					let slide = document.createElement("img");
					slide.src = THIS.folder + "/object" + prefix + "/" + THIS.object_folder + center_num + ".png";
					slide.onload = function(){
						THIS.object_div.style.background	= "url(" + THIS.folder + "/object" + prefix + "/" + THIS.object_folder + center_num + ".png)";
						THIS.object_div.style.backgroundPosition = "12% 50%";
						THIS.object_div.style.backgroundSize = "cover";	//innerWidth * 0.75 / slide.naturalHeight * 100 + "%";
						THIS.object_div.style.position = "absolute";
						THIS.object_div.style.left = "0px";
						THIS.object_div.style.top = "0px";
						if (THIS.loader) THIS.loader.style.opacity = 0;
						THIS.object_loading = false;
					}
				}			
			}



			//**************************************************
			resize(){
				let par = elementSize(this.container);

				let padTop = parseInt(this.container.style.paddingTop) || 0;
				let padRight = parseInt(this.container.style.paddingRight) || 0;
				let padBottom = parseInt(this.container.style.paddingBottom) || 0;
				let padLeft = parseInt(this.container.style.paddingLeft) || 0;

				let borderTop = parseInt(this.container.style.borderTop) || 0;
				let borderRight = parseInt(this.container.style.borderRight) || 0;
				let borderBottom = parseInt(this.container.style.borderBottom) || 0;
				let borderLeft = parseInt(this.container.style.borderLeft) || 0;

				//this.canvas.width = par.width - padRight - padLeft - borderRight - borderLeft;
				//this.canvas.width = innerWidth * 4;
				//this.canvas.height = innerWidth * 0.75 * 4; // this.canvas.width * this.slides[this.center_num - 1].naturalHeight / this.slides[this.center_num - 1].naturalWidth;
				//this.context.scale(0.25, 0.25);
				//this.canvas.style.left = "0px";
				//this.canvas.style.top = (par.height - this.canvas.height) / 2 + "px";
				//this.cursor_pos = this.canvas.width / 2;

				this.container.style.width = innerWidth + "px";
				this.container.style.height = innerWidth * 0.75 + "px";

				document.getElementById("scene_background_mobile").style.width = innerWidth + "px";
				document.getElementById("scene_background_mobile").style.height = innerWidth * 0.75 + "px";

				document.getElementById("scene_decor_mobile").style.width = innerWidth + "px";
				document.getElementById("scene_decor_mobile").style.height = innerWidth * 0.75 + "px";
			}

}

	//*********************************************************
	function mouseXY(event, element){
		let posx = 0;
		let posy = 0;

		//e = window.event;
		if (!event) var event = window.event;

		if (event.pageX || event.pageY) {
			posx = event.pageX;
			posy = event.pageY;
		}
		else if (event.clientX || event.clientY) {
			posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
		}
  
		if (element) if (element != window){
			let box = element.getBoundingClientRect(); 
			posx -= parseInt(box.left) + parseInt(pageXOffset);
			posy -= parseInt(box.top) + parseInt(pageYOffset);
		}

		return {
			x: posx,
			y: posy
		}
	}

    //*********************************************************
    function elementSize(elem) {
      var box = elem.getBoundingClientRect()

      var body = document.body
      var docElem = document.documentElement

      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

      var clientTop = docElem.clientTop || body.clientTop || 0
      var clientLeft = docElem.clientLeft || body.clientLeft || 0

      var top  = box.top +  scrollTop - clientTop
      var left = box.left + scrollLeft - clientLeft
	  var width = box.width;
	  var height = box.height;

      return { top: Math.round(top), left: Math.round(left), width: width, height: height}
   }


