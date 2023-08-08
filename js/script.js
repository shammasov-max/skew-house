/* -- reload page for motionblock -- */ 
window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || 
                            ( typeof window.performance != "undefined" && 
                                window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
        // Handle page restore.
        window.location.reload();
    }
});
/* -- /reload page for motionblock -- */

$(document).ready(function(){

    $(window).scroll(function(){
            var $sections = $('.link_to_scroll');
       $sections.each(function(i,el){
           var top  = $(el).offset().top-100;
           var bottom = top +$(el).height();
           var scroll = $(window).scrollTop();
           var id = $(el).attr('id');
           if( scroll > top && scroll < bottom){
               $('a.nav-link.active').removeClass('active');
               $('a.nav-link[href="#'+id+'"]').addClass('active');
   
           }
       })
    });
   
   $(".wrap_menu_link_to_scroll").on("click","a", function (event) {
        event.preventDefault();

        let hmenu = $(".test_btn").height();
        var id  = $(this).attr('href'),
        top = $(id).offset().top - hmenu;
        
        $('body,html').animate({scrollTop: top}, 800);
    });

    /*-- section show-hide FAQ --*/
    $('#show-hide-btn').click(function(){
        $('.items .item:nth-child(n+5)').slideToggle("slow");
        $('#show-hide-btn').html(
            $('#show-hide-btn').html() === '<a class="up" href="#voprosy_i_otvety_">Свернуть</a>' ? '<a class="" href="#voprosy_i_otvety2">Смотреть все ответы</a>' : '<a class="up" href="#voprosy_i_otvety_">Свернуть</a>'
        );
    });

    /*-- hint fence color selection --*/
    $('#create_fence').click(function(){
        $('.hint_fence_color_selection').fadeIn();
    });

    /*-- ban contextmenu for fence canvas --*/
    $('canvas').bind('contextmenu', function(e) {
        return false;
    });

    $(function($){
        $(document).mouseup(function (e){ 
            var div = $(".hint_fence_color_selection"); 
            if (!div.is(e.target) 
                && div.has(e.target).length === 0) { 
                div.fadeOut(); 
            }

            $('.navbar-collapse').collapse('hide'); // hide navbar-collapse - mobile - after click document
        });
    });

    /*--  removed hash tag after redirect to different page --*/
    if(window.history.pushState) {
        window.history.pushState('', '/', window.location.pathname)
    } else {
        window.location.hash = '';
    }

});
