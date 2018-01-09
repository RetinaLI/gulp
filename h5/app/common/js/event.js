(function(){

  var Event = function(name) {

    var task_map = {}, event_keys = {};

    var add = function(name, fn) {

      var key = (new Date()).getTime();

      event_keys[key] = fn;

      task_map[name] = task_map[name] || { list: [] };
      task_map[name].list.push(key);

      return key;
    };

    var exec = function(fn){
      setTimeout(function(){
        try{
          fn && fn();
        }catch(ex){}
      });
    };

    var dispatch = function(name){
      if(!task_map[name] || !task_map[name].list || task_map[name].list.length === 0) return;

      var key, fn, i = 0; 
      while(true) {
        key = task_map[name].list[i];
        fn = event_keys[key];
        exec(fn);
        i ++;
        if(i >= task_map[name].list.length) break;
      }
    };

    var remove = function(name, key){
      if(!task_map[name] || !event_keys[key]) return;
      if(!fn) {
        task_map[name].list = [];
      } else {
        delete event_keys[key];
      }
    };

    return {
      name: name,
      add: add,
      dispatch: dispatch,
      remove: remove
    };
  };

  window.ZBase = window.ZBase || {};
  window.ZBase.Event = new Event();
})();