(function() {
  window.ZE = window.ZE || [];
  var chart;
  //一周安装情况Echart图
  ZE.push(function(_result, _carBrandMap) {

    var result = _result && _result.optionWeek6AddInfo ? _result : {
      optionWeek6AddInfo: {
        totalJson: {
          markPointData: [],
          "carTotalNum": 0,
          "addCarNum1": 0,
          "addCarNum2": 0,
          "addRate": 0,
          "xData": [],
          "sendTime": ""
        }
      }
    };
    // if(!window.global.is_new_energy){
    var others = [],
      leisa = 0,
      ci, has_leisa = false;

    for (var i = result.optionWeek6AddInfo.totalJson.xData.length - 1; i >= 0; i--) {
      ci = result.optionWeek6AddInfo.totalJson.xData[i];
      if (_carBrandMap[ci]) {
        result.optionWeek6AddInfo.totalJson.xData[i] = _carBrandMap[ci];
        result.optionWeek6AddInfo.totalJson.markPointData[i].name = _carBrandMap[ci];
      } else {
        if (_carBrandMap[window.global.SPEC_BRAND] && _carBrandMap[window.global.SPEC_BRAND][ci]) {
          has_leisa = true;
          leisa += result.optionWeek6AddInfo.totalJson.markPointData[i].value;
        } else
          others.push(result.optionWeek6AddInfo.totalJson.markPointData[i]);
        result.optionWeek6AddInfo.totalJson.markPointData.splice(i, 1);
        result.optionWeek6AddInfo.totalJson.xData.splice(i, 1);
      }
    }
    if (_carBrandMap[window.global.SPEC_BRAND] && has_leisa) {
      result.optionWeek6AddInfo.totalJson.xData.push(window.global.SPEC_BRAND);
      result.optionWeek6AddInfo.totalJson.markPointData.push({
        name: window.global.SPEC_BRAND,
        value: leisa
      });
    }

    if (others.length > 0) {
      result.optionWeek6AddInfo.totalJson.xData.push("其它");
      var otherValue = 0;
      for (var i = 0; i < others.length; i++) {
        otherValue += others[i].value;
      }
      result.optionWeek6AddInfo.totalJson.markPointData.push({
        name: "其它",
        value: otherValue
      });
    }
    // }

    $('#carBrandAddNum').html(result.optionWeek6AddInfo.totalJson.carTotalNum);
    $('#carBrandNewNum').html(result.optionWeek6AddInfo.totalJson.addCarNum1);
    $('#lastNewAdd').html(result.optionWeek6AddInfo.totalJson.addCarNum2);


    var xAxisWeek6Data = result.optionWeek6AddInfo.totalJson.xData;
    var markPointWeek6OnlineData = result.optionWeek6AddInfo.totalJson.markPointData;
    markPointWeek6OnlineData.sort(function(a, b) { return b.value - a.value; });

    var addRate = result.optionWeek6AddInfo.totalJson.addCarNum1 - result.optionWeek6AddInfo.totalJson.addCarNum2;
    var per_addRate = result.optionWeek6AddInfo.totalJson.addCarNum2 == result.optionWeek6AddInfo.totalJson.addCarNum1 ? 0 : result.optionWeek6AddInfo.totalJson.addCarNum2 == 0 ? 100 : Math.round((Math.abs(addRate) / result.optionWeek6AddInfo.totalJson.addCarNum2) * 100);
    if (addRate >= 0) {
      $('#weekRateName').html("环比增长");
      $('#weekRate').html(per_addRate);
    } else {
      $('#weekRateName').html("环比下降");
      $('#weekRate').html(per_addRate);
    }

    chart = chart || echarts.init(document.getElementById('week6AddInfo'), "macarons");
    var renderOption = function() {
      return {
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          top: document.documentElement.clientWidth >= 720 ? "15px" : '5%',
          right: document.documentElement.clientWidth >= 720 ? "10%" : '0%',
          data: xAxisWeek6Data,
          formatter: function(value) {
            return value.length >= 5 ? value.substr(0, 3) + "\n" + value.substr(3) : value;
          }
        },
        series: [{
          name: '新增车辆数',
          silent: true,
          type: 'pie',
          radius: document.documentElement.clientWidth >= 720 ? "70%" : '43%',
          center: document.documentElement.clientWidth >= 720 ? ["50%", "50%"] : ['40%', '40%'],
          itemStyle: {
            normal: {
              color: function(params) {
                //首先定义一个数组
                var colorList = ["#2382d3", "#ff5608", "#ffc000", "#baeaf1", "#ffe7b0", '#92d050', "#01c0c8", '#00b0f0'];
                return colorList[params.dataIndex]
              },
              //以下为是否显示
              label: {
                show: true
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: markPointWeek6OnlineData
        }]
      };
    };
    chart.setOption(renderOption(), { notMerge: true });
    ZBase.Event.add("html-font-size-changed", function() {
      chart.setOption(renderOption(), { notMerge: true });
      chart.resize();
    });
  });
})();