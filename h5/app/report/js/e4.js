(function() {
  window.ZE = window.ZE || [];
  var chart;
  //运营里程分布情况Echart图
  ZE.push(function(_result, _carBrandMap) {

    var result = _result && _result.carAvgMileageReport ? _result : {
      carAvgMileageReport: {
        seriesData: [],
        yAxisData: []
      }
    };
    $('#operateMileageFirstName').html(result.carAvgMileageReport.yAxisData[9]);
    $('#operateMileageSecondName').html(result.carAvgMileageReport.yAxisData[8]);
    $('#operateMileageThirdName').html(result.carAvgMileageReport.yAxisData[7]);
    $('#operateMileageFirstMileage').html(result.carAvgMileageReport.seriesData[9]);
    $('#operateMileageSecondMileage').html(result.carAvgMileageReport.seriesData[8]);
    $('#operateMileageThirdMileage').html(result.carAvgMileageReport.seriesData[7]);

    $('#operateMileageLastOneName').html(result.carAvgMileageReport.yAxisData[2]);
    $('#operateMileageLastTwoName').html(result.carAvgMileageReport.yAxisData[1]);
    $('#operateMileageLastThreeName').html(result.carAvgMileageReport.yAxisData[0]);
    $('#operateMileageLastOneMileage').html(result.carAvgMileageReport.seriesData[2]);
    $('#operateMileageLastTwoMileage').html(result.carAvgMileageReport.seriesData[1]);
    $('#operateMileageLastThreeMileage').html(result.carAvgMileageReport.seriesData[0]);

    var yAxisOperateMileageAvgData = result.carAvgMileageReport.yAxisData;
    var seriesOperateMileageAvgData = result.carAvgMileageReport.seriesData;

    chart = chart || echarts.init(document.getElementById('operateAvgMileageChart'), "macarons");
    if (seriesOperateMileageAvgData.length > 0) {
      for (var i = 0; i < 5; i++) {
        seriesOperateMileageAvgData[i] = {
          value: seriesOperateMileageAvgData[i],
          label: {
            normal: {
              position: "right"
            }
          }
        };
      }
    }

    var renderOption = function() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        calculable: true,
        tooltip: { show: false },
        grid: {
          left: document.documentElement.clientWidth >= 720 ? "7%" : '1%', //'7%',
          right: document.documentElement.clientWidth >= 720 ? "7%" : '3%', //'7%',
          top: '0%',
          bottom: 0,
          containLabel: true
        },
        xAxis: [{
          type: 'value',
          boundaryGap: [0, 0.01]
        }],
        yAxis: [{
          "axisLabel": {
            formatter: function(value) {
              return value.length > 4 ? value.substr(0, 4) + "\n" + value.substr(4) : value;
            },
            "interval": 0,
            "show": true,
            "textStyle": {
              "fontFamily": "微软雅黑",
              "fontSize": 12
            }
          },
          type: 'category',
          data: yAxisOperateMileageAvgData
        }],
        series: [{
          silent: true,
          itemStyle: {
            normal: {
              color: function(params) {
                //首先定义一个数组 
                var colorList = ["#99e636", "#99e636", "#99e636", "#99e636", "#99e636", '#55970f', '#55970f', '#55970f', '#55970f', '#55970f'];
                return colorList[params.dataIndex]
              },
              //以下为是否显示 
              label: {
                show: false
              }
            }
          },
          label: {
            normal: {
              formatter: '{c}公里',
              position: 'insideRight',
              show: true
            }
          },
          name: '里程',
          type: 'bar',
          data: seriesOperateMileageAvgData
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