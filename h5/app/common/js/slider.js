(function(){

  var Slider = function(cfg){
    var $container, $section_elems;

    var current_index = 1, count = 0;

    var bindEvent = function(){
      $container.swipTop(function(){
        var next = current_index + 1 > count ? 1 : (current_index + 1);

        $section_elems.eq(current_index).addClass("leave");
      });
    };

    var init = function() {
      $container = $(".sections");
      $section_elems = $container.find(".section");
      count = $section_elems.length;

      bindEvent();
    };


    var _model = {};

    init();
    return _model;
  };


  window.ZBase = window.ZBase || {};
  window.ZBase.Slider = Slider;
})();