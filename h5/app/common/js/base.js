(function() {

  var canLoad = false;

  var initEnv = function() {
    var deviceWidth = document.documentElement.clientWidth;
    var size = 960;
    if (deviceWidth > size) deviceWidth = size;
    document.documentElement.style.fontSize = deviceWidth / (size / 100) + 'px';
    var orientation = window.orientation || window.screen.orientation && window.screen.orientation.angle;
    ZBase.Event.dispatch("html-font-size-changed");

    var $preloading = document.querySelector(".preloading");

    if(!$preloading) return;

    if (orientation == 180 || orientation == 0) {
      document.querySelector(".preloading").style.display = "block";
    }
    if (orientation == 90 || orientation == -90) {
      document.querySelector(".preloading").style.display = "none";
    }
  };

  var getCdnUrl = function(_url) {
    return _url;
  };

  var PageLoader = function(cfg) {
    var config = {
      files: cfg.files || [],
      completeStep: cfg.completeStep || 1, //1 or 2
      onLoadComplete: cfg.onLoadComplete || function() { /**/ },
      onLoadStepChanged: cfg.onLoadStepChanged || function(_step) {
        return _step;
      },
      onProgress: cfg.onProgress || function(){},
      customCompleteNotify: cfg.customCompleteNotify,
      beforeStartLoad: cfg.beforeStartLoad || function(callback){ callback(); }
    };
    var $datas, $data_defers, $data_posters, $data_defer_posters, $loading;
    var $zloading_text;
    var isPageLoaded = false, isAppLoaded = false;
    var sources = [],
      dataSources = [],
      dataDeferSources = [];

    var load = function(_sources, onloaded) {
      var type = "";

      var resetItem = function(_obj) {
        var tagName, _url;
        if (!_obj || !_obj.item) {
          return;
        }

        tagName = _obj.item.tagName.toLowerCase();
        _url = _obj.url;
        if (_obj.isVideo) {
          try {
            _obj.item.src = _url;
          } catch (ex) {
            /**/
          }
          return;
        }
        if (tagName === "img") {
          _obj.item.src = _url;
        } else if (tagName === "video") {
          _obj.item.poster = _url;
        } else {
          _obj.item.style.backgroundImage = "url(" + _url + ")";
        }
      };

      var loadSource = function(_obj) {
        setTimeout(function() {
          var c, cc, hasLoaded, _fn;
          switch (_obj.type) {
            case "jpg":
            case "png":
            case "jpeg":
            case "gif":
            case "ico":
            case "image":
              {
                c = new Image();
                _obj.isImage = true;
                c.style.display = "none";
                c.onload = c.onerror = function() {
                  if (c) {
                    c.onload = c.onerror = null;
                    c = null;
                  }
                  resetItem(_obj);
                  onloaded(_obj);
                };
                c.src = _obj.url;
              }
              break;
            case "mp4":
            case "mp3":
            case "ogg":
            case "wav":
            case "video":
              {
                cc = new Audio();
                hasLoaded = false;
                //console.info(_obj.url);
                _fn = function() {
                  if (hasLoaded) return;
                  hasLoaded = true;
                  if (cc) {
                    cc.oncanplaythrough = cc.oncanplay = cc.onplay = cc.onerror = cc.onsuspend = cc.onstalled = cc.onabort = null;
                    cc.removeEventListener('canplay', _fn, false);
                    cc.removeEventListener('error', _fn, false);
                    cc.removeEventListener('suspend', _fn, false);
                    cc = null;
                  }
                  resetItem(_obj);
                  onloaded(_obj);
                };
                _obj.isVideo = true;

                cc.oncanplaythrough = cc.oncanplay = cc.onplay = cc.onerror = cc.onsuspend = cc.onstalled = cc.onabort = _fn;
                cc.addEventListener('canplay', _fn, false);
                cc.addEventListener('error', _fn, false);
                cc.addEventListener('suspend', _fn, false);
                cc.style.display = "none";
                cc.src = _obj.url;
                cc.load();

                setTimeout(function() {
                  if (!hasLoaded) {
                    _fn();
                  }
                }, 10000);
              }

              break;
          }
        }, 0);
      };
      var i, ci, _ci_obj;

      onloaded = onloaded || function() { /**/ };
      for (i = 0; i < _sources.length; i++) {
        ci = _sources[i];
        _ci_obj = {};
        if (typeof ci === "string") {
          type = ci.split("?")[0].split(".");
          type = type[type.length - 1].toLowerCase();
          if (("," + ["jpg", "png", "jpeg", "gif", "ico", "mp3", "mp4", "ogg", "wav"].join() + ",").indexOf("," + type + ",") === -1) {
            type = "image";
          }
          _ci_obj = {
            url: ci,
            type: type
          };
        } else {
          _ci_obj = ci;
          if (!_ci_obj.type) {
            type = ci.url.split("?")[0].split(".");
            _ci_obj.type = type[type.length - 1].toLowerCase();
          }
        }
        loadSource(_ci_obj);
      }
    };

    var removeLoading = function() {
      if ($loading && $loading.parentNode) $loading.parentNode.removeChild($loading);
      var $preloading = document.querySelector(".preloading");
      if ($preloading && $preloading.parentNode) $preloading.parentNode.removeChild($preloading);
      
    };

    var setLoadingText = function(cur, total) {
      if ($zloading_text && cur <= total) $zloading_text.innerHTML = ((total === 0 ? 100 : parseInt(cur / total * 100)) + '%');
      if (cur === total) {
        isPageLoaded = true;
        onLoadComplete();
      }
    };

    var startLoad = function() {

      var len = sources.length,
        sum = len,
        c = 0,
        sc = 0,
        i, ci;
      var loadDeferSources = function() {
        var j = 0,
          cj;
          len = $data_defer_posters.length + $data_defers.length;
          c = 0;

        for (; j < $data_defer_posters.length; j++) {
          cj = $data_defer_posters[j];
          dataDeferSources.push({
            url: getCdnUrl(cj.getAttribute("data-defer-poster")),
            item: cj
          });
        }
        for (j = 0; j < $data_defers.length; j++) {
          cj = $data_defers[j];
          dataDeferSources.push({
            url: getCdnUrl(cj.getAttribute("data-defer")),
            item: cj
          });
        }
        load(dataDeferSources, function(){
          c++;
          sc++;
          setLoadingText(sc, sum);
          if (c === len) {
            config.onLoadStepChanged(3);
          }
        });
      };

      var loadDataSources = function() {
        len = dataSources.length;
        c = 0;
        if (len === 0) {
          return loadDeferSources();
        }
        load(dataSources, function() {
          c++;
          sc++;
          setLoadingText(sc, sum);
          if (c === len) {
            config.onLoadStepChanged(2);
            loadDeferSources();
          }
        });
      };

      var loadSources = function() {
        load(sources, function() {
          c++;
          sc++;
          setLoadingText(sc, sum);
          if (c === len) {
            config.onLoadStepChanged(1);
            loadDataSources();
          }
        });
      };

      for (i = len - 1; i >= 0; i--) {
        ci = sources[i];
        if (!ci) {
          sources.splice(i, 1);
          continue;
        }
        if (typeof ci === "string") {
          sources[i] = getCdnUrl(ci);
        } else {
          sources[i].url = getCdnUrl(ci.url);
        }
      }
      len = sources.length;
      sum = len;

      for (i = 0; i < $datas.length; i++) {
        ci = $datas[i];
        dataSources.push({
          url: getCdnUrl(ci.getAttribute("data-src")),
          item: ci
        });
      }
      for (i = 0; i < $data_posters.length; i++) {
        ci = $data_posters[i];
        dataSources.push({
          url: getCdnUrl(ci.getAttribute("data-src")),
          item: ci
        });
      }

      if (config.completeStep >= 2) {
        sum += dataSources.length;
      }
      setLoadingText(0, sum);
      if (len === 0) {
        config.onLoadStepChanged(1);
        loadDataSources();
      } else {
        loadSources();
      }
    };

    var onLoadComplete = function(){
        if(!isPageLoaded || !isAppLoaded) return;
        removeLoading();
        config.onLoadComplete(removeLoading);
    };

    var init = function() {
      isAppLoaded = !config.customCompleteNotify;
      
      ZBase.Event.add("page-loaded", function(){
        isAppLoaded = true;
        onLoadComplete();
      });

      config.beforeStartLoad(function(){
        $datas = document.querySelectorAll("[data-src]");
        $data_posters = document.querySelectorAll("[data-poster]");
        $data_defers = document.querySelectorAll("[data-defer]");
        $data_defer_posters = document.querySelectorAll("[data-defer-poster]");
        $zloading_text = document.getElementsByClassName("zbase-note")[0];
        $loading = document.getElementsByClassName("zbase-loading")[0];

        sources = config.files;
        startLoad();
      });
    };

    var _model = {};
    init();
    return _model;
  };
  initEnv();
  
  "onorientationchange" in window && window.addEventListener("onorientationchange", function(){
    setTimeout(initEnv, 500);
  }, false);
  window.addEventListener("resize", function(){
    setTimeout(initEnv, 500);
  }, false);
  window.addEventListener("load", function() {
    var fn = window.pageLoadConfig.onLoadComplete;
    var task;
    window.pageLoadConfig.onLoadComplete = function(callback){
      fn(callback);
    };

    new PageLoader(window.pageLoadConfig || {});
  });
})(this);
