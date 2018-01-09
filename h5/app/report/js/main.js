(function() {
  var carBrandMap = {};
  var result;
  var getUrlParams = function() {
    var params = {};
    var paramList = window.location.search.substring(1).split("&");
    var len = paramList.length;
    for (var i = 0; i < len; i += 1) {
      var _p = paramList[i],
        _index = _p.indexOf("=");
      if (_index > -1) {
        if (_index === 0) continue;
        params[decodeURIComponent(_p.split("=")[0])] = decodeURIComponent(_p.substr(_index + 1));
      } else {
        params[decodeURIComponent(_p)] = null;
      }
    }
    return params;
  };

  window.global = window.global || {};

  window.global.brandMap = {};

  window.global.is_new_energy = document.location.pathname.indexOf("new_energy") > -1;
  window.global.is_month_report = document.location.pathname.indexOf("month_report") > -1;
  window.global.lineColors = ['#c23531',  "#00BFFF", "#000000", '#EE7942'].concat(['#61a0a8', '#91c7ae', '#749f83', '#ca8622', '#6e7074', '#546570', '#c4ccd3', '#2f4554' ]);

  window.global.SPEC_BRAND = window.global.is_new_energy ? "轻商务车" : "雷萨";

  window.global.platformBrandMap = window.global.is_new_energy ? {
    "A14": "欧辉",
    "A02": "欧马可",
    "A01": "奥铃",
    "轻商务车": {"A24": 1, "A03": 1, "03": 1, "A07": 1},
    "A08": "时代"
  } : {
    "A09": "欧曼",
    "A14": "欧辉",
    "A02": "欧马可",
    "A01": "奥铃",
    "A08": "时代",
    "雷萨": {"12": 1, "A16": 1}
  };

  function bindData() {
    var url = getUrlParams().data || "";
    // var url = "./assets/50121_20170906.json";
    $.ajax({
      type: "get",
      url: url,
      dataType: "json",
      success: function(_result) {
        result = _result;
        if(result.brands) {
          for(var i = 0, ci; i < result.brands.length; i ++) {
            ci = result.brands[i];
            if(window.global.platformBrandMap[ci.code]) {
              window.global.platformBrandMap[ci.code] = ci.name;
            }
            window.global.brandMap[ci.code] = ci.name;
          }
        }

        if (result.optionWeek6AddInfo && result.optionWeek6AddInfo.section) {
          var start = new Date(result.optionWeek6AddInfo.section[0].replace(/-/g, "/") + " 00:00:00");
          var end = new Date(result.optionWeek6AddInfo.section[1].replace(/-/g, "/") + " 00:00:00");
          $('#carBrandAddStartDate').html(ZBase.Date.getDateByFormat(start, "MM/dd"));
          $('#carBrandAddEndDate').html(ZBase.Date.getDateByFormat(end, "MM/dd"));

          window.global.startDate = start;
          window.global.endDate = end;
          window.global.dayCount = (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000) + 1;
          var d = start,
            days = [];
          for (var i = 0; i < window.global.dayCount; i++) {
            days.push({
              t: ZBase.Date.getDateByFormat(d, "yyyyMMdd"),
              d: ZBase.Date.getDateByFormat(d, "yyyy-MM-dd"),
              md: ZBase.Date.getDateByFormat(d, "MM-dd")
            });
            d = new Date(start.getTime() + (i + 1) * (24 * 60 * 60 * 1000));
          }
          window.global.days = days;
        }

        $('#pushDate').html(result.optionWeek6AddInfo.totalJson.sendTime.split(" ")[0]);

        //一周安装情况Echart图
        var xAxisWeek6Data = result.optionWeek6AddInfo.totalJson.xData;

        for (i = 0; i < window.ZE.length; i++) {
          try {
            window.ZE[i](result, window.global.platformBrandMap);
          } catch (ex) {
            console.info(ex, i);
          }
        }
      }
    });
  }

  window.beforeStartLoad = function(callback) {
    callback();
  };
  window.initApp = function() {
    bindData();
  };
})();