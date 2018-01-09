(function() {
  // JavaScript Document
  function OWeiXin() {
    $.ajax({
      url: "/WebAPI/weixin.ashx",
      type: "POST",
      async: true,
      dataType: "json",
      data: { PostUrl: encodeURIComponent(shareinfo.link) },
      success: function(result) {
        var OAPI = eval(result);
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: OAPI.appId, // 必填，公众号的唯一标识
          timestamp: OAPI.timestamp, // 必填，生成签名的时间戳
          nonceStr: OAPI.nonceStr, // 必填，生成签名的随机串
          signature: OAPI.signature, // 必填，签名，见附录1
          jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        OWeiXinExp();
      },
      error: function() {
        //alert("fail");
      }
    });
  }

  // JavaScript Document
  function OWeiXinExp() {
      var $bg_music = document.getElementsByClassName("zbase-bg-music")[0];
    wx.ready(function() {
      wx.checkJsApi({
        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
          $bg_music && $bg_music.play();
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          //$('#bgmusic').mediaelementplayer({ loop: true, success: function (player, node) { player.play(); } });
        },
        error: function(res) {
          $bg_music && $bg_music.play();
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          //$('#bgmusic').mediaelementplayer({ loop: true, success: function (player, node) { player.play(); } });
        }
      });
      wx.onMenuShareTimeline({
        title: shareinfo.subtitle,
        link: shareinfo.link,
        imgUrl: shareinfo.imgUrl,
        success: function() {
          // 接口调用成功时执行的回调函数。
          $.ajax({
            url: "/H5/JDA/JShare.ashx",
            type: "POST",
            async: false,
            dataType: "text",
            data: { Type: 1, Text: title },
            success: function(result) {
              if (result != "") {}
            },
          });
        },
        fail: function() {
          // 接口调用失败时执行的回调函数
        },
        complete: function() {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        },
        trigger: function() {
          // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
        },
        cancel: function() {
          // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
        }
      });
      wx.onMenuShareAppMessage({
        title: shareinfo.title,
        desc: shareinfo.desc,
        link: shareinfo.link,
        imgUrl: shareinfo.imgUrl,
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          // 接口调用成功时执行的回调函数。
          $.ajax({
            url: "/H5/JDA/JShare.ashx",
            type: "POST",
            async: false,
            dataType: "text",
            data: { Type: 2, Text: title },
            success: function(result) {
              if (result != "") {}
            },
          });
        },
        fail: function() {
          // 接口调用失败时执行的回调函数
        },
        complete: function() {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        },
        trigger: function() {
          // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
        },
        cancel: function() {
          // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
        }
      });
      wx.onMenuShareQQ({
        title: shareinfo.title,
        desc: shareinfo.desc,
        link: shareinfo.link,
        imgUrl: shareinfo.imgUrl,
        success: function() {
          // 接口调用成功时执行的回调函数。
          $.ajax({
            url: "/H5/JDA/JShare.ashx",
            type: "POST",
            async: false,
            dataType: "text",
            data: { Type: 3, Text: title },
            success: function(result) {
              if (result != "") {}
            },
          });
        },
        fail: function() {
          // 接口调用失败时执行的回调函数
        },
        complete: function() {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        },
        trigger: function() {
          // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
        },
        cancel: function() {
          // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
        }
      });
      wx.onMenuShareWeibo({
        title: shareinfo.title,
        desc: shareinfo.desc,
        link: shareinfo.link,
        imgUrl: shareinfo.imgUrl,
        success: function() {
          // 接口调用成功时执行的回调函数。
          $.ajax({
            url: "/H5/JDA/JShare.ashx",
            type: "POST",
            async: false,
            dataType: "text",
            data: { Type: 4, Text: title },
            success: function(result) {
              if (result != "") {}
            },
          });
        },
        fail: function() {
          // 接口调用失败时执行的回调函数
        },
        complete: function() {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        },
        trigger: function() {
          // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
        },
        cancel: function() {
          // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
        }
      });
      wx.onMenuShareQZone({
        title: shareinfo.title,
        desc: shareinfo.desc,
        link: shareinfo.link,
        imgUrl: shareinfo.imgUrl,
        success: function() {
          // 接口调用成功时执行的回调函数。
          $.ajax({
            url: "/H5/JDA/JShare.ashx",
            type: "POST",
            async: false,
            dataType: "text",
            data: { Type: 5, Text: title },
            success: function(result) {
              if (result != "") {}
            },
          });
        },
        fail: function() {
          // 接口调用失败时执行的回调函数
        },
        complete: function() {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        },
        trigger: function() {
          // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
        },
        cancel: function() {
          // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
        }
      });

    });

    wx.error(function(res) {
      //alert(res.errMsg);
    });
  }
  OWeiXin();
})();
