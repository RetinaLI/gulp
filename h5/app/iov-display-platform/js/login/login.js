/**
 * Created by Administrator on 2017-04-13.
 */
var login = {
  init: function() {
    this.bind();
    this.onResize();
  },

  /**
   * 获取参数
   * */
  getUrlParam: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
      href = window.location.search,
      r = href.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return '';
  },

  bind: function() {
    var arr = [
      { userName: 'admin', passWord: '123456' },
      { userName: 'xny', passWord: '123456' },
      { userName: 'foton', passWord: '123456' }
    ];
    var len = arr.length;
    var userNameArr = [];
    var paddWordArr = [];
    for (var i = 0; i < len; i++) {
      userNameArr.push(arr[i].userName);
      paddWordArr.push(arr[i].passWord);
    }
    var redirect = decodeURIComponent(login.getUrlParam("redirect")) || "index.html";
    var func = function() {
      var userName = $('#userName').val();
      var passWord = $('#passWord').val();
      if ($.trim(userName) == '') {
        alert('请输入用户名');
        return;
      }
      if ($.trim(passWord) == '') {
        alert('密码不能为空');
        return;
      }
      var userNameIndex = userNameArr.indexOf(userName);
      if (userNameIndex > -1) {
        if (passWord == arr[userNameIndex].passWord) {
          window.sessionStorage.setItem("userName", userName);
          window.sessionStorage.setItem("passWord", passWord);
          setTimeout(function() {
            if (userName == 'xny') {
              window.location.href = redirect;
            } else {
              window.location.href = redirect;
            }
          }, 500);
        } else {
          alert('密码不正确');
        }
      } else {
        alert('账号不存在');
      }
    };
    $('#loginBtn').click(function() {
      func();
    });
    document.onkeydown = function(event) {
      if (event.keyCode == 13) {
        func();
      }
    }
    login.onResize();

    $(window).resize(function() {
      login.onResize();
    });
  },
  onResize: function() {
    var width = 1920,
      height = 1080;
    var dw = document.documentElement.offsetWidth / width;
    var dh = document.documentElement.offsetHeight / height;

    var d = Math.min(dw, dh);
    var x = (document.documentElement.offsetWidth - width * d) / 2;

    $(".page").css({
      "transform": "translateX(" + x + "px) scale(" + Math.min(dw, dh) + ")",
      "transform-origin": "0 0"
    });
    $(".wrapper").css({
      "transform": "translateX(" + x + "px) scale(" + Math.min(dw, dh) + ")",
      "transform-origin": "0 0"
    });
  },

};

login.init();