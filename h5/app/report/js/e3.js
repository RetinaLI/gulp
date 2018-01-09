(function() {
  window.ZE = window.ZE || [];
  var chart;
  //各品牌车辆运行平均情况Echart图
  ZE.push(function(_result, _carBrandMap) {
    var result = _result && _result.carOperateAvgReport ? _result : {
      carOperateAvgReport: {
        xAxisAvgRunData: [],
        seriesAvgMileageData: [],
        seriesAvgTimeData: [],
        markPointAvgMileageData: [],
        markPointAvgTimeData: []
      }
    };
    var xAxisAvgRunData = [];
    var seriesAvgMileageData = [];
    var seriesAvgTimeData = [];
    var markPointAvgTimeData = [];
    var markPointAvgMileageData = [];
    if(!result.carOperateAvgReport.xAxisAvgRunData || result.carOperateAvgReport.xAxisAvgRunData .length == 0) return;
    var html = '<tr><th class="sort-number">序号</th><th>品牌名称</th><th>平均运营里程<br/>(公里)</th><th>平均运营时长<br/>(小时)</th>';
    //各品牌车辆运行平均情况
    if (result.carOperateAvgReport.xAxisAvgRunData.length > 6) {
      for (i = 0; i < 6; i++) {
        xAxisAvgRunData[i] = result.carOperateAvgReport.xAxisAvgRunData[i];
        seriesAvgMileageData[i] = result.carOperateAvgReport.seriesAvgMileageData[i];
        seriesAvgTimeData[i] = result.carOperateAvgReport.seriesAvgTimeData[i];
        markPointAvgTimeData[i] = result.carOperateAvgReport.markPointAvgTimeData[i];
        markPointAvgMileageData[i] = result.carOperateAvgReport.markPointAvgMileageData[i];
        html += '<tr><td>' + (i + 1) + '</td>';
        html += '<td>' + result.carOperateAvgReport.xAxisAvgRunData[i] + '</td>';
        html += '<td>' + result.carOperateAvgReport.seriesAvgMileageData[i] + '</td>';
        html += '<td>' + result.carOperateAvgReport.seriesAvgTimeData[i] + '</td>';
      }
    } else {
      xAxisAvgRunData = result.carOperateAvgReport.xAxisAvgRunData;
      seriesAvgMileageData = result.carOperateAvgReport.seriesAvgMileageData;
      seriesAvgTimeData = result.carOperateAvgReport.seriesAvgTimeData;
      markPointAvgTimeData = result.carOperateAvgReport.markPointAvgTimeData;
      markPointAvgMileageData = result.carOperateAvgReport.markPointAvgMileageData;
      for (var i = 0; i < result.carOperateAvgReport.xAxisAvgRunData.length; i++) {
        html += '<tr><td>' + (i + 1) + '</td>';
        html += '<td>' + result.carOperateAvgReport.xAxisAvgRunData[i] + '</td>';
        html += '<td>' + result.carOperateAvgReport.seriesAvgMileageData[i] + '</td>';
        html += '<td>' + result.carOperateAvgReport.seriesAvgTimeData[i] + '</td>';
      }
    }
    var max_time = Math.max.apply(null, seriesAvgTimeData) + 10;
    $("#avgRun_list").html(html);

    chart = chart || echarts.init(document.getElementById('carBrandChartAvgRun'), "macarons");
    optionCarBrandAvgRun = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: ['里程（公里）', '时间（小时）']
      },
      calculable: true,
      tooltip: { show: false },
      grid: {
        left: document.documentElement.clientWidth >= 720 ? "7%" : '1%', //'7%',
        right: document.documentElement.clientWidth >= 720 ? "7%" : '5%', //'7%',
        top: '7%',
        bottom: "15%",
        containLabel: true
      },
      xAxis: [{
        "axisLabel": {
          "interval": 0,
          "show": true,
          "rotate": "-45",
          "textStyle": {
            "fontFamily": "微软雅黑",
            "fontSize": 12
          }
        },
        type: 'category',
        name: '品牌',
        data: xAxisAvgRunData
      }],
      yAxis: [{
        type: 'value',
        name: '里程（公里）',
        max: seriesAvgMileageData[0] && seriesAvgMileageData[0] + 1000
      }, {
        type: 'value',
        name: '时间(小时)',
        max: max_time
      }],
      series: [{
          name: '里程（公里）',
          type: 'bar',
          silent: true,
          data: seriesAvgMileageData,
          label: {
            normal: {
              color: "#92d050"
            }
          },
          itemStyle: {
            normal: {
              color: "#92d050",
              //以下为是否显示 
              label: {
                show: false
              }
            }
          },
          markPoint: {
            data: markPointAvgMileageData
          }
        },
        {
          name: '时间（小时）',
          type: 'line',
          silent: true,
          yAxisIndex: 1,
          data: seriesAvgTimeData,
          itemStyle: {
            normal: {
              color: "#ffc000",
              //以下为是否显示 
              label: {
                show: false
              }
            }
          },
          lineStyle: {
            normal: {
              color: "#ffc000",
              //以下为是否显示 
              label: {
                show: false
              }
            }
          },
          markPoint: {
            data: markPointAvgTimeData
          }
        }
      ]
    };
    chart.setOption(optionCarBrandAvgRun, { notMerge: true });
    chart.resize();
    ZBase.Event.add("html-font-size-changed", function() {
      chart.resize();
    });
  });
})();