(function() {

  window.ZE.pipeFor_8_9_10_11 = function(
    _dataProName, _containerId, _result, _carBrandMap, _title, _unit, 
    _gridLeftFn, _valueViewFn, _valueFn) {
    var chart;
    var title = _title;
    var unit = _unit;

    var result = _result && _result.carOperateAvgReport ? _result : {
      carOperateAvgReport: {
        // avgWorkTimeData: []
      }
    };

    var data = result.carOperateAvgReport[_dataProName] || [];

    var xData = [],
      xDataHash = {};
    var yData = [];
    var legendData = [],
      legendDataHash = {};
    var dayCount = window.global.days.length;
    // if (!window.global.is_new_energy) {

    var leisa = {},
      tempDate = 0,
      has_leisa = false;
    for (var i = data.length - 1, ci, date; i >= 0; i--) {
      ci = data[i];

      if (!_carBrandMap[ci.code]) {
        if (_carBrandMap[window.global.SPEC_BRAND] && _carBrandMap[window.global.SPEC_BRAND][ci.code]) {
          tempDate = Number(ci.date.replace(/-/g, ""));
          leisa[tempDate] = leisa[tempDate] || { name: window.global.SPEC_BRAND, d: tempDate, date: ci.date, value: [] };
          leisa[tempDate].value.push(ci);
          has_leisa = true;
        }
        data.splice(i, 1);
      } else {
        ci.value = _valueFn(ci);
        data[i].name = _carBrandMap[ci.code];
      }
    }

    if (_carBrandMap[window.global.SPEC_BRAND]) {
      var temp = [],
        sum_numerator = 0, sum_denominator = 0;
      for (var k in leisa) {
        sum_numerator = 0;
        sum_denominator = 0;
        for (var j = 0; j < leisa[k].value.length; j++) {
          sum_numerator += leisa[k].value[j].numerator;
          sum_denominator += leisa[k].value[j].denominator;
        }
        leisa[k].value = _valueFn({ numerator: sum_numerator, denominator: sum_denominator });
        temp.push(leisa[k]);
      }

      temp.sort(function(a, b) { return a.d - b.d; });

      data = data.concat(temp);
    }
    // }
    var tempBrandMap = {};
    for (var i = 0, ci; i < data.length; i++) {
      ci = data[i];
      tempBrandMap[ci.name] = tempBrandMap[ci.name] || {};
      tempBrandMap[ci.name][ci.date.replace(/-/g, "")] = ci;
    }
    var cb;
    for (var brand in tempBrandMap) {
      cb = tempBrandMap[brand];

      for (var i = 0, d; i < dayCount; i++) {
        d = window.global.days[i];

        if (cb[d.t] != null) {
          cb[d.t].t = d.t;
          continue;
        }
        cb[d.t] = {
          date: d.d,
          name: brand,
          value: 0,
          t: d.t
        };
      }
    }
    var tempArr = [],
      tempSumArr = [];
    for (var brand in tempBrandMap) {
      cb = tempBrandMap[brand];
      tempArr = [];
      for (var m in cb) {
        tempArr.push(cb[m]);
      }
      tempArr.sort(function(a, b) { return a.t - b.t; });
      tempSumArr.push(tempArr);
    }


    data = [].concat.apply([], tempSumArr);

    for (var i = 0; i < dayCount; i++) {
      xData.push(window.global.days[i].md);
    }

    for (var i = 0, ci, date; i < data.length; i++) {
      ci = data[i];
      ci.value = _valueViewFn(ci.value); //Math.round(ci.value / 60 / 60);
      date = ci.date.substr(5);

      if (!legendDataHash[ci.name]) {
        legendDataHash[ci.name] = [];
        legendData.push({
          name: ci.name,
          icon: "roundRect"
        });
        yData.push({
          name: ci.name,
          type: 'line',
          silent: true,
          smooth: true,
          lineStyle: {
            normal: {
              color: window.global.lineColors[yData.length]
            }
          },
          itemStyle: {
            normal: {
              color: window.global.lineColors[yData.length]
            }
          },
          data: legendDataHash[ci.name]
          // markPoint: {
          //   data: {
          //     xAxis: ci.name,
          //     yAxis: ci.value
          //   },
          //   label: {
          //     normal: {
          //       backgroundColor: "#00b0f0",
          //       color: "red"
          //     }
          //   }
          // }
        });
      }
      legendDataHash[ci.name].push(ci.value);
    }


    var interval = 0;

    if (document.documentElement.clientWidth >= 720) {
      interval = dayCount <= 7 ? 0 : dayCount == 30 ? 4 : 5;
    } else {
      interval = dayCount <= 7 ? 1 : dayCount == 31 ? 9 : 8;
    }
    var renderOption = function() {
      return {
        title: {
          text: title + "（" + unit + "）",
          left: "center"
        },
        legend: {
          bottom: 0,
          show: true,
          data: legendData
        },
        calculable: true,
        tooltip: {
          show: document.documentElement.clientWidth >= 720,
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: _gridLeftFn(), //'7%',
          right: "13%",
          containLabel: true
        },
        xAxis: [{
          "axisLabel": {
            "interval": interval,
            "show": true,
            "textStyle": {
              "fontFamily": "微软雅黑",
              "fontSize": 12,
              align: "center"
            }
          },
          axisTick: {
            alignWithLabel: true
          },
          type: 'category',
          name: '时间',
          data: xData
        }],
        yAxis: [{
          type: 'value',
          min: 0,
          axisLabel: {
            formatter: "{value}" + unit
          }
        }],
        series: yData
      };
    }
    chart = chart || echarts.init(document.getElementById(_containerId), "macarons");
    chart.setOption(renderOption(), { notMerge: true });
    ZBase.Event.add("html-font-size-changed", function() {
      chart.setOption(renderOption(), { notMerge: true });
      chart.resize();
    });
  };
})();