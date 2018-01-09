(function() {
  window.ZE = window.ZE || [];
  var chart;
  //各品牌车辆在线情况Echart图
  ZE.push(function(_result, _carBrandMap) {

    var result = _result && _result.optionCarBrandAddAndRunInfo ? _result : {
      optionCarBrandAddAndRunInfo: {
        Q3AddData: [],
        xAxisAddAndRunData: [],
        markPointAddData: [],
        onlineData: {
          carOnlineNum: 0,
          carOnlineRate: 0
        },
        seriesAddData: []
      }
    };

    // if(!window.global.is_new_energy){
    var leisa = {
        Q3AddData: [],
        markPointAddData: [],
        seriesAddData: []
      },
      ci, cQ3;
    for (var i = result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.length - 1; i >= 0; i--) {
      ci = result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData[i];
      cQ3 = result.optionCarBrandAddAndRunInfo.Q3AddData[i];
      if (!_carBrandMap[ci]) {

        if (_carBrandMap[window.global.SPEC_BRAND] && _carBrandMap[window.global.SPEC_BRAND][ci]) {
          leisa.xAxisAddAndRunData = window.global.SPEC_BRAND;
          leisa.Q3AddData.push(result.optionCarBrandAddAndRunInfo.Q3AddData[i]);
          leisa.markPointAddData.push(result.optionCarBrandAddAndRunInfo.markPointAddData[i]);
          leisa.seriesAddData.push(result.optionCarBrandAddAndRunInfo.seriesAddData[i]);
        }

        result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.splice(i, 1);
        result.optionCarBrandAddAndRunInfo.Q3AddData.splice(i, 1);
        result.optionCarBrandAddAndRunInfo.markPointAddData.splice(i, 1);
        result.optionCarBrandAddAndRunInfo.seriesAddData.splice(i, 1);
      } else {
        var rate = cQ3.iCarNum == 0 ? 0 : (Math.round(cQ3.onLine / cQ3.iCarNum * 100));
        cQ3.onLineRate = rate;

        result.optionCarBrandAddAndRunInfo.Q3AddData[i].name = _carBrandMap[ci];
        result.optionCarBrandAddAndRunInfo.markPointAddData[i].xAxis = _carBrandMap[ci];
        result.optionCarBrandAddAndRunInfo.markPointAddData[i].yAxis = rate;
        result.optionCarBrandAddAndRunInfo.seriesAddData[i] = rate;
        result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData[i] = _carBrandMap[ci];
      }
    }
    if (_carBrandMap[window.global.SPEC_BRAND] && leisa.seriesAddData.length > 0) {
      var rate = 0,
        value = 0,
        carNum = 0;
      for (var i = 0; i < leisa.seriesAddData.length; i++) {
        value += leisa.Q3AddData[i].onLine;
        rate += leisa.Q3AddData[i].onLineRate;
        carNum += leisa.Q3AddData[i].iCarNum;
      }
      rate = Math.round(carNum == 0 ? 0 : value / carNum * 100);
      var index = result.optionCarBrandAddAndRunInfo.seriesAddData.length;

      for (var i = 0; i < result.optionCarBrandAddAndRunInfo.seriesAddData.length; i++) {
        if (result.optionCarBrandAddAndRunInfo.seriesAddData[i] < rate) {
          index = i;
          break;
        }
      }

      if (index == result.optionCarBrandAddAndRunInfo.seriesAddData.length) {

        result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.push(window.global.SPEC_BRAND);
        result.optionCarBrandAddAndRunInfo.Q3AddData.push({
          name: window.global.SPEC_BRAND,
          onLineRate: rate,
          onLine: value,
          iCarNum: carNum
        });
        result.optionCarBrandAddAndRunInfo.markPointAddData.push({
          yAxis: rate,
          xAxis: window.global.SPEC_BRAND
        });
        result.optionCarBrandAddAndRunInfo.seriesAddData.push(rate);
      } else {
        var temp = result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.splice(i);
        result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.push(window.global.SPEC_BRAND);
        result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData = result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.concat(temp);

        temp = result.optionCarBrandAddAndRunInfo.Q3AddData.splice(i);
        result.optionCarBrandAddAndRunInfo.Q3AddData.push({
          name: window.global.SPEC_BRAND,
          onLineRate: rate,
          onLine: value,
          iCarNum: carNum
        });
        result.optionCarBrandAddAndRunInfo.Q3AddData = result.optionCarBrandAddAndRunInfo.Q3AddData.concat(temp);

        temp = result.optionCarBrandAddAndRunInfo.markPointAddData.splice(i);
        result.optionCarBrandAddAndRunInfo.markPointAddData.push({
          yAxis: rate,
          xAxis: window.global.SPEC_BRAND
        });
        result.optionCarBrandAddAndRunInfo.markPointAddData = result.optionCarBrandAddAndRunInfo.markPointAddData.concat(temp);
      }
    }

    // }

    var html = '<tr><th class="sort-number">序号</th><th>品牌名称</th><th>总数</th><th>在线数<br/>(辆)</th><th>在线率<br/>(%)</th>';
    //各品牌在线情况
    var Q3AddData = result.optionCarBrandAddAndRunInfo.Q3AddData;
    var xAxisAddAndRunData = [];
    var seriesAddData = [];
    var markPointAddData = [];
    var carNums = [],
      markPointCarNumData = [];

    // if (result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.length > 6) {
    for (i = 0; i < result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.length; i++) {
      xAxisAddAndRunData[i] = (result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData[i]);
      seriesAddData[i] = result.optionCarBrandAddAndRunInfo.seriesAddData[i];
      markPointAddData[i] = result.optionCarBrandAddAndRunInfo.markPointAddData[i];
      carNums[i] = result.optionCarBrandAddAndRunInfo.Q3AddData[i].iCarNum;
      markPointCarNumData[i] = {
        xAxis: xAxisAddAndRunData[i],
        yAxis: carNums[i]
      };
      html += '<tr><td>' + (i + 1) + '</td>';
      html += '<td>' + Q3AddData[i].name + '</td>';
      html += '<td>' + (Q3AddData[i].iCarNum || 0) + '</td>';
      html += '<td>' + Q3AddData[i].onLine + '</td>';
      html += '<td>' + Q3AddData[i].onLineRate + '</td>';
    }
    // } else {
    //   xAxisAddAndRunData = (result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData);
    //   seriesAddData = result.optionCarBrandAddAndRunInfo.seriesAddData;
    //   markPointAddData = result.optionCarBrandAddAndRunInfo.markPointAddData;
    //   for (var i = 0; i < result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.length; i++) {
    //     html += '<tr><td>' + (i + 1) + '</td>';
    //     html += '<td>' + Q3AddData[i].name + '</td>';
    //     html += '<td>' + Q3AddData[i].onLine + '</td>';
    //     html += '<td>' + Q3AddData[i].onLineRate + '</td>';
    //   }
    // }
    $("#online_list").html(html);

    var num = result.optionWeek6AddInfo.totalJson.carTotalNum,
      unit = "辆";
    if (num < 10000) {

    }

    $('#carNum').html(num);
    $(".carNum").html(unit);

    var num = result.optionCarBrandAddAndRunInfo.onlineData.carOnlineNum,
      unit = "辆";
    if (num < 10000) {

    }



    $('#carBrandOnlineNum').html(num);
    $(".carBrandOnlineNum").html(unit);
    $('#carBrandOnlineRate').html(result.optionCarBrandAddAndRunInfo.onlineData.carOnlineRate);


    chart = chart || echarts.init(document.getElementById('carBrandAddAndRunInfo'), "macarons");

    var renderOption = function() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        calculable: true,
        tooltip: { show: false },
        grid: {
          left: "8%",
          right: "13%",
          containLabel: true
        },
        xAxis: [{
          "axisLabel": {
            "interval": 0,
            "show": true,
            "rotate": document.documentElement.clientWidth >= 720 ? "0" : '45', //'7%',"45",
            "textStyle": {
              "fontFamily": "微软雅黑",
              "fontSize": 12
            }
          },
          type: 'category',
          data: xAxisAddAndRunData
        }],
        yAxis: [
        // {
        //   type: 'value',
        //   name: '车辆数'
        // }, 
        {
          type: 'value',
          name: '在线率(%)',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: "{value}%"
          }
        }],
        series: [
        // {
        //     name: '车辆数',
        //     type: 'bar',
        //     silent: true,
        //     data: carNums,
        //     label: {
        //       normal: {
        //         color: "#92d050"
        //       }
        //     },
        //     itemStyle: {
        //       normal: {
        //         color: "#92d050",
        //         //以下为是否显示 
        //         label: {
        //           show: false
        //         }
        //       }
        //     },
        //     markPoint: {
        //       symbolSize: 80,
        //       data: markPointCarNumData
        //     }
        //   },
          {
            name: '在线率(%)',
            type: 'line',
            // yAxisIndex: 1,
            silent: true,
            lineStyle: {
              normal: {
                color: "#00b0f0"
              }
            },
            itemStyle: {
              normal: {
                color: "#00b0f0"
              }
            },
            data: seriesAddData,
            markPoint: {
              data: markPointAddData,
              label: {
                normal: {
                  backgroundColor: "#00b0f0",
                  color: "red"
                }
              }
            }
          }
        ]
      };

    };

    chart.setOption(renderOption(), { notMerge: true });
    ZBase.Event.add("html-font-size-changed", function() {
      chart.setOption(renderOption(), { notMerge: true });
      chart.resize();
    });
  });
})();