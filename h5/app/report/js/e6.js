(function() {
  window.ZE = window.ZE || [];
  var chart;
  //运营出勤率分布情况Echart图
  ZE.push(function(_result, _carBrandMap) {

    var result = _result && _result.carAttendanceReport ? _result : {
      carAttendanceReport: {
        seriesData: [],
        yAxisData: []
      }
    };

    var yAxisOperateAttendanceData = result.carAttendanceReport.yAxisData;
    var seriesOperateAttendanceData = result.carAttendanceReport.seriesData;

    $('#operateAttendanceFirstName').html(result.carAttendanceReport.yAxisData[9]);
    $('#operateAttendanceSecondName').html(result.carAttendanceReport.yAxisData[8]);
    $('#operateAttendanceThirdName').html(result.carAttendanceReport.yAxisData[7]);
    $('#operateAttendanceFirstMileage').html(result.carAttendanceReport.seriesData[9]);
    $('#operateAttendanceSecondMileage').html(result.carAttendanceReport.seriesData[8]);
    $('#operateAttendanceThirdMileage').html(result.carAttendanceReport.seriesData[7]);

    $('#operateAttendanceLastOneName').html(result.carAttendanceReport.yAxisData[2]);
    $('#operateAttendanceLastTwoName').html(result.carAttendanceReport.yAxisData[1]);
    $('#operateAttendanceLastThreeName').html(result.carAttendanceReport.yAxisData[0]);
    $('#operateAttendanceLastOneMileage').html(result.carAttendanceReport.seriesData[2]);
    $('#operateAttendanceLastTwoMileage').html(result.carAttendanceReport.seriesData[1]);
    $('#operateAttendanceLastThreeMileage').html(result.carAttendanceReport.seriesData[0]);

    chart = chart || echarts.init(document.getElementById('operateAttendanceChart'), "macarons");
    if (seriesOperateAttendanceData.length > 0) {
      for (var i = 0; i < 5; i++) {
        seriesOperateAttendanceData[i] = {
          value: seriesOperateAttendanceData[i],
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
        tooltip: { show: false },
        calculable: true,
        grid: {
          left: document.documentElement.clientWidth >= 720 ? "7%" : '1%', //'7%',
          right: document.documentElement.clientWidth >= 720 ? "7%" : '3%', //'7%',
          top: "0",
          bottom: 0,
          containLabel: true
        },
        xAxis: [{
          type: 'value',
          //boundaryGap: [0, 0.01]
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
              "fontSize": 12,
              "color": "#4f4f4f"
            }
          },
          type: 'category',
          data: yAxisOperateAttendanceData
        }],
        series: [{
          silent: true,
          itemStyle: {
            normal: {
              color: function(params) {
                //首先定义一个数组 
                var colorList = ["#64baf9", "#64baf9", "#64baf9", "#64baf9", "#64baf9", '#2382d3', '#2382d3', '#2382d3', '#2382d3', '#2382d3'];
                return colorList[params.dataIndex]
              },
              //以下为是否显示 
              label: {
                formatter: '{c}%',
                show: false
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          name: '出勤率',
          type: 'bar',
          data: seriesOperateAttendanceData
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