(function() {
  window.ZE = window.ZE || [];
  var chart;
  //运营平均速度分布情况Echart图
  ZE.push(function(_result, _carBrandMap) {

    var result = _result && _result.carAvgSpeedReport ? _result : {
      carAvgSpeedReport: {
        seriesData: [],
        yAxisData: []
      }
    };


    $('#operateAvgVelocityFirstName').html(result.carAvgSpeedReport.yAxisData[9]);
    $('#operateAvgVelocitySecondName').html(result.carAvgSpeedReport.yAxisData[8]);
    $('#operateAvgVelocityThirdName').html(result.carAvgSpeedReport.yAxisData[7]);
    $('#operateAvgVelocityFirstMileage').html(result.carAvgSpeedReport.seriesData[9]);
    $('#operateAvgVelocitySecondMileage').html(result.carAvgSpeedReport.seriesData[8]);
    $('#operateAvgVelocityThirdMileage').html(result.carAvgSpeedReport.seriesData[7]);

    $('#operateAvgVelocityLastOneName').html(result.carAvgSpeedReport.yAxisData[2]);
    $('#operateAvgVelocityLastTwoName').html(result.carAvgSpeedReport.yAxisData[1]);
    $('#operateAvgVelocityLastThreeName').html(result.carAvgSpeedReport.yAxisData[0]);
    $('#operateAvgVelocityLastOneMileage').html(result.carAvgSpeedReport.seriesData[2]);
    $('#operateAvgVelocityLastTwoMileage').html(result.carAvgSpeedReport.seriesData[1]);
    $('#operateAvgVelocityLastThreeMileage').html(result.carAvgSpeedReport.seriesData[0]);

    var yAxisOperateAvgVelocityData = result.carAvgSpeedReport.yAxisData;
    var seriesOperateAvgVelocityData = result.carAvgSpeedReport.seriesData;

    chart = chart || echarts.init(document.getElementById('operateAvgVelocityChart'), "macarons");
    if (seriesOperateAvgVelocityData.length > 0) {
      for (var i = 0; i < 5; i++) {
        seriesOperateAvgVelocityData[i] = {
          value: seriesOperateAvgVelocityData[i],
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
          data: yAxisOperateAvgVelocityData
        }],
        series: [{
          silent: true,
          itemStyle: {
            normal: {
              color: function(params) {
                //首先定义一个数组 
                var colorList = ['#ffe7b0', '#ffe7b0', '#ffe7b0', '#ffe7b0', '#ffe7b0', "#ffc302", "#ffc302", "#ffc302", "#ffc302", "#ffc302"];
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
              show: true,
              formatter: '{c}KM/H',
              position: 'insideRight'
            }
          },
          name: '平均速度',
          type: 'bar',
          data: seriesOperateAvgVelocityData
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