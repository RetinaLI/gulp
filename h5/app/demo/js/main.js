(function(){
  window.beforeStartLoad = function(callback){
    callback();
  };
  window.initApp = function(){
    var $txt = document.getElementById("txt");
    $txt.onchange = function(){
      console.info("onchange");
    };
    $txt.onpropertychange = function(){
      console.info("onpropertychange");
    };
  };
})();