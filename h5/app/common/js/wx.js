(function() {
  var nonceStr, signature, timestamp, appId, url;
  var config = window.pageLoadConfig || {};
  config.wx = config.wx || {
    debug: false,
    title: document.title,
    desc: document.title,
    url: document.location.href
  };

  var getRequestFn = function() {
    if ("XMLHttpRequest" in window) {
      return new XMLHttpRequest();
    }
    if ("ActiveXObject" in window) {
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
    return null;
  };
  var getSignature = function(cbFn) {

    url = config.wx.url.split("#")[0].replace(/&/g, "%26");
    var request = getRequestFn();
    if (!request) {
      return;
    }
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 200) {
          var result;
          try {
            result = JSON.parse(request.responseText);
            nonceStr = result.nonceStr;
            timestamp = result.timestamp;
            signature = result.signature;
            appId = result.appId;
            cbFn(result);
          } catch (ex) {
            console.info("请求出错", ex);
          }
        } else
          console.info("请求出错");
            cbFn(result);
      }
    };
    request.open("GET", "http://wechat.ling.cn/wechat-js-config?url=" + document.location.href.split("#")[0].replace(/&/g, "%26"), true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    request.setRequestHeader("Accept", "application/json");
    request.send();
  };

  var initWX = function() {

    wx.config({
      debug: config.wx.debug || false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appId, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名，见附录1
      jsApiList: [
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone"
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    var initApi = function() {
      //微信触发背景音乐，只需要在座位背景音乐的audio/video上设置 zbase-bg-music class，便可以自动播放。
      var $bg_music = document.getElementsByClassName("zbase-bg-music")[0];
      wx.checkJsApi({
        jsApiList: ["checkJsApi"],
        success: function(res) {
          $bg_music && $bg_music.play();
        },
        error: function() {
          $bg_music && $bg_music.play();
        }
      });
      var _url = window.DS ? DS.linkChange(url) : url;
      wx.onMenuShareTimeline({
        title: config.wx.title || document.title, // 分享标题
        link: _url, // 分享链接
        imgUrl: config.wx.imgUrl, // 分享图标
        success: function() {
          // 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareAppMessage({
        title: config.wx.title || document.title, // 分享标题
        desc: config.wx.desc || document.title, // 分享描述
        link: _url, // 分享链接
        imgUrl: config.wx.imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          // 用户确认分享后执行的回调函数
          if (window.DS) {
            try {
              DS.sendRepost("appMessage");
            } catch (ex) {
            }
          }
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareQQ({
        title: config.wx.title || document.title,
        desc: config.wx.desc || document.title, // 分享描述
        link: url, // 分享链接
        imgUrl: config.wx.imgUrl, // 分享图标
        success: function() {
          // 用户确认分享后执行的回调函数
          window.DS && DS.sendRepost("timeline");
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });
    };

    wx.ready(function() {
      if (window.DS) {
        DS.ready(initApi);
      } else {
        initApi();
      }
    });

    wx.error(function() {
      console.info(arguments);
    });
  };
  try {
    getSignature(initWX);
  } catch (ex) {
    console.info(ex);
  }

})();
