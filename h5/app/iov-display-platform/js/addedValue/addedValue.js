/**
 * Created by Administrator on 2017-02-04.
 */
var addedValue = {
  init: function() {
    global.nav(2);
    //this.brand();

    this.PassCommDringInit = this.PassCommDring();
    this.PassCommDringInit.init();

    this.PassCommSDInit = this.PassCommSD();
    this.PassCommSDInit.init(); //24小时平均速度
    this.car3Cont();
    global.bind();


    this.mileageTimeInit = this.mileageTime();
    this.mileageTimeInit.init();

    this.baiDuMapH();

    global.appMove(2);
  },

  /**百度地图高度*/
  baiDuMapH: function() {
    var _this = this;
    var brandId = global.getUrlParam('brandId');
    if (brandId == 'All' || brandId == '') {
      $('.baiduMap').css({
        height: '564px'
      });
    } else {
      $('.baiduMap').css({
        height: '888px'
      });
    }
    setTimeout(function() {
      _this.baiduMapInit = _this.baiduMap();
      _this.baiduMapInit.init();
    }, 200)
  },

  /**总服务里程和时长*/
  mileageTime: function() {
    var millageNum = global.nums(20, '.allMileageCont ul');
    var timeNum = global.nums(20, '.allTimeCont ul');
    var requAjax = function() {
      ZBase.CallServer.request("queryMileageTimeData", null, function(data) {
          if (data.code == '10001') {
            var da = data.data;
            if (da) {
              var brandId = global.getUrlParam('brandId');
              if (brandId == '1035') {
                var day = new Date();
                var todayDayTime = day.getTime();
                day.setMonth(2);
                day.setDate(8);
                day.setHours(0);
                var oldDayTime = day.getTime();
                var acc = parseInt(Math.floor((todayDayTime - oldDayTime) / 3600 / 1000)) * 2;
                var run_time = parseInt(75 + acc / 24);
                var mileage = parseInt(2252 + acc / 1.5);
                var noData = { "run_time": run_time, "mileage": mileage };
                func(noData);
              } else if (brandId == '1046') {
                var noData = { "run_time": 93854, "mileage": 3870473 };
                func(noData);
              } else {
                // window.localStorage.mileageTime = JSON.stringify(da);
                func(da);
              }
            } else {
              console.log('返回为空');
            }
          }
        });
    };

    var func = function(data) {
      var mileage = data.mileage;
      var time = Math.round(data.run_time/3.6);
      millageNum.init(mileage);
      timeNum.init(time);
    };


    var clearTime = function() {
      clearInterval(timer)
    };

    var timer;
    return {
      init: function() {
        requAjax();
        timer = setInterval(requAjax, 5 * 1000);
      },
      resetBrand: function() {
        clearTime();
        requAjax();
        timer = setInterval(requAjax, 5 * 1000);
      }
    };
  },

  PassCommSD: function() {
    var _this = this;
    var pass = this.car2(); //乘用车
    var Comm = this.car3Cont(); //商用车
    var func = function(data) {
      _this.mapZoom = _this.map ? _this.map.getZoom() : 5;
      if (data.PassVehicle.length == 0 || data.CommVehicle.length == 0) {
        $('.baiduMap,#myMap').css({ 'height': '888px' });
        setTimeout(function() {
          _this.map.centerAndZoom(new BMap.Point(103.06, 35.67138), _this.mapZoom);
        }, 200);
      } else {
        $('.baiduMap,#myMap').css({ 'height': '564px' });
        setTimeout(function() {
          _this.map.centerAndZoom(new BMap.Point(100.06, 35.67138), _this.mapZoom);
        }, 200);
      }
      if (data.PassVehicle.length == 0) {
        $('.car2').hide()
      } else {
        $('.car2').show();
        // window.localStorage.Pass = JSON.stringify(data.PassVehicle);
        pass.init(data.PassVehicle);
      }
      if (data.CommVehicle.length == 0) {
        $('.car3').hide();
      } else {
        $('.car3').show();
        // window.localStorage.Comm = JSON.stringify(data.CommVehicle);
        Comm.init(data.CommVehicle);
      }
    };
    var requAjax = function() {
      ZBase.CallServer.request("queryAvgSpeedData", null, function(data) {
        if (data.code == '10001') {
          var da = data.data;
          if (da) {
            func(da);
          } else {
            /*var dataPass = JSON.parse(window.localStorage.Pass);
            var dataComm = JSON.parse(window.localStorage.Comm);
            pass.init(dataPass);
            Comm.init(dataComm);*/
            console.log('返回为空');
          }
        }
      });
    };
    var timer;
    return {
      init: function() {
        requAjax();
        timer = setInterval(requAjax, 24 * 60 * 60 * 1000);
      },
      resetBrand: function() {
        clearInterval(timer);
        requAjax();
        timer = setInterval(requAjax, 24 * 60 * 60 * 1000);
      }
    };
    var timer;
    return {
      init: function() {
        requAjax();
        setInterval(requAjax, 24 * 60 * 60 * 1000);
      },
      resetBrand: function() {
        clearInterval(timer);
        requAjax();
        setInterval(requAjax, 24 * 60 * 60 * 1000);
      }
    };
  },

  PassCommDring: function() {
    var passDring = this.car1(); //乘用车
    var CommDring = this.bussuseCar(); //商用车
    var requAjax = function() {

      ZBase.CallServer.request("queryVehicleDriveData", null, function(data) {
        if (data.code == '10001') {
          var da = data.data;
          if (da) {
            var brandId = global.getUrlParam('brandId');
            if (brandId == '1035') {
              var noData = [{ "to_day": "02-07", "run_time": 5.6, "mileage": 142.0 }, { "to_day": "02-08", "run_time": 4.3, "mileage": 93.7 }, { "to_day": "02-09", "run_time": 5.2, "mileage": 103.6 }, { "to_day": "02-10", "run_time": 6.3, "mileage": 123.6 }, { "to_day": "02-11", "run_time": 6.7, "mileage": 112.9 }, { "to_day": "02-12", "run_time": 5.3, "mileage": 90.8 }, { "to_day": "02-13", "run_time": 3.1, "mileage": 23.5 }, { "to_day": "02-14", "run_time": 3.4, "mileage": 32.9 }, { "to_day": "02-15", "run_time": 5.7, "mileage": 99.5 }, { "to_day": "02-16", "run_time": 3.3, "mileage": 36.9 }, { "to_day": "02-17", "run_time": 4.5, "mileage": 100.8 }, { "to_day": "02-18", "run_time": 4.6, "mileage": 93.8 }, { "to_day": "02-19", "run_time": 5.4, "mileage": 105.3 }];
              $('.bussessCar').show();
              $('.car2').removeClass('show').find('.zs').css({ width: '180px', overflow: 'hidden' });
              //window.localStorage.CommDring = JSON.stringify(CommVehicle);
              CommDring.init(noData);
            } else if (brandId == '1046') {
              var noData = [{ "to_day": "02-07", "run_time": 7.6, "mileage": 285.0 }, { "to_day": "02-08", "run_time": 5.3, "mileage": 213.7 }, { "to_day": "02-09", "run_time": 6.2, "mileage": 254.6 }, { "to_day": "02-10", "run_time": 8.3, "mileage": 342.6 }, { "to_day": "02-11", "run_time": 6.7, "mileage": 275.9 }, { "to_day": "02-12", "run_time": 5.3, "mileage": 211.8 }, { "to_day": "02-13", "run_time": 6.1, "mileage": 237.5 }, { "to_day": "02-14", "run_time": 6.4, "mileage": 265.9 }, { "to_day": "02-15", "run_time": 5.7, "mileage": 234.5 }, { "to_day": "02-16", "run_time": 7.3, "mileage": 268.9 }, { "to_day": "02-17", "run_time": 6.5, "mileage": 215.8 }, { "to_day": "02-18", "run_time": 6.6, "mileage": 243.8 }, { "to_day": "02-19", "run_time": 5.4, "mileage": 253.3 }];
              $('.bussessCar').show();
              $('.car2').removeClass('show').find('.zs').css({ width: '180px', overflow: 'hidden' });
              //window.localStorage.PassDring = JSON.stringify(PassVehicle);
              passDring.init(noData);
            } else {
              var CommVehicle = da.CommVehicle;
              var PassVehicle = da.PassVehicle;
              if (CommVehicle.length == 0) {
                $('.bussessCar').hide();
                $('.car2').addClass('show').find('.zs').css({ width: '225px', overflow: 'hidden' });
              } else {
                $('.bussessCar').show();
                $('.car2').removeClass('show').find('.zs').css({ width: '180px', overflow: 'hidden' });
                //window.localStorage.CommDring = JSON.stringify(CommVehicle);
                CommDring.init(CommVehicle);
              }
              if (PassVehicle.length == 0) {
                $('.car1').hide();
              } else {
                $('.car1').show();
                //window.localStorage.PassDring = JSON.stringify(PassVehicle);
                passDring.init(PassVehicle);
              }
            }
          } else {
            console.log('返回为空');
          }
        }
      });
    };
    //var timer;
    return {
      init: function() {
        requAjax();
        //setInterval(requAjax,20000);
      },
      resetBrand: function() {
        //clearInterval(timer);
        requAjax();
        //setInterval(requAjax,20000);
      }
    };
  },

  /**商用车行驶分析*/
  bussuseCar: function() {
    var getPrevDay = function(len) {
      var date = new Date();
      var getTime = date.getTime();
      var oneDayTime = 24 * 3600 * 1000;
      var arr = [];
      for (var i = len; i > 0; i--) {
        var prevDay = new Date(getTime - oneDayTime * i);
        var month = prevDay.getMonth() + 1;
        var day = prevDay.getDate();
        month = month > 10 ? month : '0' + month;
        day = day > 10 ? day : '0' + day;
        arr.push(month + '-' + day);
      }
      return arr;
    };
    var option = {
      title: {
        text: '商用车行驶分析',
        textStyle: {
          color: '#fff',
          fontSize: '18'
        },
        left: 20
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br />{a0}: {c0}公里<br />{a1}: {c1}小时'
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '20%',
        containLabel: true
      },
      legend: {
        data: ['车辆日平均行驶里程', '车辆日平均行驶时长'],
        bottom: 10,
        textStyle: {
          color: '#fff'
        },
        selectedMode: false
      },
      xAxis: [{
        type: 'category',
        data: [ /*'16-1','16-2','16-3','16-4','16-5','16-6','16-7','16-8','16-9','16-10','16-11','16-12','16-13','16-14','16-15'*/ ],
        axisLabel: {
          rotate: 30,
          interval: 0,
          textStyle: {
            color: '#0370e7',
            fontSize: 10
          }
        },
        axisLine: {
          lineStyle: {
            color: '#111958',
            width: 2
          }
        }
      }],
      yAxis: [{
          type: 'value',
          name: '里程(公里)',
          splitNumber: 6,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#0370e7'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#16327c'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#121e5e']
            }
          },
          splitArea: {
            areaStyle: {
              color: ['#0270f1']
            }
          }
        },
        {
          type: 'value',
          name: '时长(小时)',
          /* min: 0,
           max: 24,*/
          splitNumber: 6,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#0370e7'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#16327c'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#121e5e']
            }
          }
        }
      ],
      series: [{
          name: '车辆日平均行驶里程',
          type: 'bar',
          data: [ /*134,254,233,434,235,406,237,258,296,310,299,288,277,266,255*/ ],
          itemStyle: {
            normal: {
              color: '#0270f1'
            }
          },
          animationEasingUpdate: 'cubicOut'
        },
        {
          name: '车辆日平均行驶时长',
          type: 'line',
          yAxisIndex: 1,
          data: [ /*1,2,3,4,5,6,7,8,9,10,9,8,7,6,5*/ ],
          itemStyle: {
            normal: {
              color: '#fbfe00'
            }
          }
        }
      ]
    };
    var myChart;
    var func = function(data) {
      var y1 = [];
      var y2 = [];
      var x1 = [];
      var len = data.length;
      if (len > 0) {
        for (var i = 0; i < len; i++) {
          var p = data[i];
          y1.push(p.mileage);
          y2.push(p.run_time.toFixed(1));
          if (global.VehicleBrandID != 1035) {
            x1.push(p.to_day);
          }
        }
        if (global.VehicleBrandID == 1035) {
          x1 = getPrevDay(len);
        }
      } else {
        for (var i = 0; i < 15; i++) {
          y1.push(0);
          y2.push(0);
        }
        x1 = addedValue.getMd(15);
      }
      option.xAxis[0].data = x1;
      option.series[0].data = y1;
      option.series[1].data = y2;
      myChart.setOption(option);
    };

    return {
      init: function(data, satues) {
        myChart = echarts.init(document.getElementById('bussessCarCont'));
        myChart.setOption(option);
        func(data, satues);
      },
      resetBrand: function(data, satues) {
        func(data, satues);
      }
    };
  },

  car1: function() {
    var option = {
      title: {
        text: '乘用车行驶分析',
        textStyle: {
          color: '#fff',
          fontSize: '18'
        },
        left: 20
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}<br />{a0}: {c0}公里<br />{a1}: {c1}小时'
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '20%',
        containLabel: true
      },
      legend: {
        data: ['车辆日平均行驶里程', '车辆日平均行驶时长'],
        bottom: 10,
        textStyle: {
          color: '#fff'
        },
        selectedMode: false
      },
      xAxis: [{
        type: 'category',
        data: [],
        axisLabel: {
          interval: 0,
          rotate: 30,
          textStyle: {
            color: '#0370e7'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#111958',
            width: 2
          }
        }
      }],
      yAxis: [{
          type: 'value',
          name: '里程(km)',
          /*min: 0,
          max: 6000,
          interval: 1000,*/
          /*splitNumber:6,*/
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#0370e7'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#16327c'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#121e5e']
            }
          },
          splitArea: {
            areaStyle: {
              color: ['#0270f1']
            }
          }
        },
        {
          type: 'value',
          name: '时长(h)',
          /*min: 0,
          max: 25,
          interval: 5,*/
          /*splitNumber:6,*/
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#0370e7'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#16327c'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#121e5e']
            }
          }
        }
      ],
      series: [{
          name: '车辆日平均行驶里程',
          type: 'bar',
          data: [],
          itemStyle: {
            normal: {
              color: '#0270f1'
            }
          }
        },
        {
          name: '车辆日平均行驶时长',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: [],
          itemStyle: {
            normal: {
              color: '#fbfe00'
            }
          }
        }
      ]
    };
    var myChart;
    var func = function(data, staues) {
      var y1 = [];
      var y2 = [];
      var x1 = [];
      var len = data.length;
      if (len > 0) {
        for (var i = 0; i < len; i++) {
          var p = data[i];
          y1.push(p.mileage);
          y2.push(p.run_time.toFixed(1));
          x1.push(p.to_day);
        }
      } else {
        for (var i = 0; i < 15; i++) {
          y1.push(0);
          y2.push(0);
        }
        x1 = addedValue.getMd(15);
      }
      option.xAxis[0].data = x1;
      option.series[0].data = y1;
      option.series[1].data = y2;
      myChart.setOption(option);
    };

    return {
      init: function(data, staues) {
        myChart = echarts.init(document.getElementById('car1Cont'));
        myChart.setOption(option);
        func(data, staues);
      },
      resetBrand: function(data, staues) {
        func(data, staues);
      }
    };
  },

  car2: function() {
    var option = {
      title: {
        text: '乘用车平均车速变化分析',
        left: '20',
        textStyle: {
          color: '#fff',
          fontSize: '18'
        }
      },

      tooltip: {
        trigger: 'axis',
        formatter: function(a, b, c){
          return a[0].seriesName + "<br/>" + a[0].name + "：" + a[0].value.toFixed(2) + "km/h";
        }//'{a}<br />{b0} : {c0}km/h'
      },

      grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        show: true,
        type: 'category',
        boundaryGap: true,
        axisLabel: {
          interval: 0,
          rotate: 30,
          textStyle: {
            color: '#0370e7'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#111958',
            width: 2
          }
        },
        data: []
      }],
      yAxis: [{
        type: 'value',
        name: '公里/小时',
        axisLine: {
          lineStyle: {
            color: '#0370e7'
          }
        },
        splitLine: {
          lineStyle: {
            color: ['#121e5e']
          }
        }
      }],
      series: [{
        name: '乘用车平均车速变化分析',
        type: 'line',
        stack: '总量',
        barCategoryGap: "20%",
        itemStyle: {
          normal: {
            color: '#fbfe00'
          }
        },
        smooth: true,
        showSymbol: false,
        /*areaStyle: {normal: {}},*/
        data: [],

          markPoint: {
            symbol: 'image://assets/images/monitorPoint.png',
            symbolSize: [36, 25],
            symbolOffset: [0, '-100%'],
            label: {
              normal: {
                position: 'insideTop',
                textStyle: {
                  color: '#fff'
                },
                formatter: function(a){ return a.value.toFixed(2); }
              }
            },
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
      }]
    };
    var myChart;
    var func = function(data) {
      if (data.length > 0) {
        var len = data.length;
        var x1 = [];
        var s1 = [];
        for (var i = 0; i < len; i++) {
          var p = data[i];
          x1.push(p.to_day);
          s1.push(p.AvgSpeed);
        }
        option.xAxis[0].data = x1;
        option.series[0].data = s1;
        myChart.setOption(option);
      } else {
        option.xAxis[0].data = x1;
        option.series[0].data = s1;
      }
      myChart.setOption(option);
    };

    return {
      init: function(data) {
        if (ZBase.Brand.get(global.getUrlParam('brandID')) == '伽途') {
          $('.car2').addClass('show');
        } else {
          $('.car2').removeClass('show');
        }
        myChart = echarts.init(document.getElementById('car2Cont'));
        myChart.setOption(option);
        func(data);
      },
      resetBrand: function() {
        func(data);
      }
    };

  },

  car3Cont: function() {
    var option = {
      title: {
        text: '商用车平均车速变化分析',
        left: '20',
        textStyle: {
          color: '#fff',
          fontSize: '18'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(a, b, c){
          return a[0].seriesName + "<br/>" + a[0].name + "：" + a[0].value.toFixed(2) + "km/h";
        }
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        axisLabel: {
          interval: 0,
          rotate: 30,
          textStyle: {
            color: '#0370e7'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#111958',
            width: 2
          }
        },
        data: []
      }],
      yAxis: [{
        type: 'value',
        name: '公里/小时',
        axisLine: {
          lineStyle: {
            color: '#0370e7'
          }
        },
        splitLine: {
          lineStyle: {
            color: ['#121e5e']
          }
        }
      }],
      series: [{
        name: '商用车平均车速变化分析',
        type: 'line',
        stack: '总量',
        itemStyle: {
          normal: {
            color: '#fbfe00'
          }
        },

          markPoint: {
            symbol: 'image://assets/images/monitorPoint.png',
            symbolSize: [36, 25],
            symbolOffset: [0, '-100%'],
            label: {
              normal: {
                position: 'insideTop',
                textStyle: {
                  color: '#fff'
                },
                formatter: function(a){ return a.value.toFixed(2); }
              }
            },
            data: [
              { type: 'average', name: '平均值' }
            ]
          },
        smooth: true,
        showSymbol: false,
        /*areaStyle: {normal: {}},*/
        data: [23, 54, 67, 22, 44, 89, 54, 78, 99, 87, 21, 90, 66, 66, 77, 33, 55, 34, 90, 66, 88, 90, 65, 32]
      }]
    };
    var myChart;
    var func = function(data) {
      if (data.length > 0) {
        var len = data.length;
        var x1 = [];
        var s1 = [];
        var min = 100;
        for (var i = 0; i < len; i++) {
          var p = data[i];
          x1.push(p.to_day);
          s1.push(p.AvgSpeed);
          min = min < p.AvgSpeed ? min : p.AvgSpeed;
        }
        if (min > 10) {
          min = parseInt(min / 10) * 10;
          option.yAxis[0].min = min;
        }

        option.xAxis[0].data = x1;
        option.series[0].data = s1;
        myChart.setOption(option);
      } else {
        var x1 = [];
        var s1 = [];
        option.xAxis[0].data = x1;
        option.series[0].data = s1;
      }
      myChart.setOption(option);
    };
    return {
      init: function(data) {
        myChart = echarts.init(document.getElementById('car3Cont'));
        myChart.setOption(option);
        func(data);
      },
      resetBrand: function() {
        func(data);
      }
    };
  },

  /*
   * 初始化地图
   * */
  baiduMap: function() {
    var brandId = global.getUrlParam('brandID');
    var _this = this;
    this.map = new BMap.Map("myMap"); // 创建Map实例
    this.mapZoom = 5;
    this.map.centerAndZoom(new BMap.Point(100.06, 35.67138), _this.mapZoom); // 初始化地图,设置中心点坐标和地图级别
    this.map.disableScrollWheelZoom(false); //开启鼠标滚轮缩放
    var style = [{
        "featureType": "water",
        "elementType": "all",
        "stylers": {
          "color": "#030641"
        }
      },
      {
        "featureType": "highway",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#102c8e"
        }
      },
      {
        "featureType": "highway",
        "elementType": "geometry.stroke",
        "stylers": {
          "color": "#102c8e"
        }
      },
      {
        "featureType": "arterial",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#15308c"
        }
      },
      {
        "featureType": "arterial",
        "elementType": "geometry.stroke",
        "stylers": {
          "color": "#0b3d51"
        }
      },
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": {
          "color": "#5fedf7"
        }
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": {
          "color": "#102c8e"
        }
      },
      {
        "featureType": "local",
        "elementType": "geometry",
        "stylers": {
          "color": "#15308c"
        }
      },
      {
        "featureType": "land",
        "elementType": "all",
        "stylers": {
          "color": "#001aff"
        }
      },
      {
        "featureType": "subway",
        "elementType": "geometry",
        "stylers": {
          "lightness": -70
        }
      },
      {
        "featureType": "subway",
        "elementType": "geometry.fill",
        "stylers": {
          "color": '#4a6ffb'
        }
      },
      {
        "featureType": "subway",
        "elementType": "geometry.stroke",
        "stylers": {
          "color": '#4a6ffb'
        }
      },
      {
        "featureType": "railway",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#3d55af"
        }
      },
      {
        "featureType": "railway",
        "elementType": "geometry.stroke",
        "stylers": {
          "color": "#3d55af"
        }
      },
      {
        "featureType": "building",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#000"
        }
      },
      {
        "featureType": "building",
        "elementType": "geometry",
        "stylers": {
          "color": "#022338"
        }
      },
      {
        "featureType": "green",
        "elementType": "geometry",
        "stylers": {
          "color": "#0096ff"
        }
      },
      {
        "featureType": "boundary",
        "elementType": "geometry.fill",
        "stylers": {
          "color": "#000d7f"
        }
      },
      {
        "featureType": "boundary",
        "elementType": "geometry.stroke",
        "stylers": {
          "color": "#060dc4"
        }
      },
      {
        "featureType": "manmade",
        "elementType": "all",
        "stylers": {
          "color": "#102c8e"
        }
      }
    ];
    this.map.setMapStyle({
      styleJson: style
    });
    var hotZoonAjax = function() {
      ZBase.CallServer.request("queryHotData", null, function(data) {
        if (data.code == '10001') {
          //window.localStorage.hotZoon = JSON.stringify(data.data);
          if (data.data) {
            hotZoon(data.data);
          }
          requDealer();
        }
      });
    };
    var heatmapOverlay,
      pointCollectionDealer,
      pointCollectionSrever;
    var hotZoon = function(data) {
      heatmapOverlay = new BMapLib.HeatmapOverlay({ "radius": 20 });
      _this.map.addOverlay(heatmapOverlay);
      heatmapOverlay.setDataSet({ data: data, max: 10 });
    };

    /*var options = {
        shape: BMAP_POINT_SHAPE_WATERDROP
    };*/

    var dealerData;
    var sreverData;
    var requDealer = function() {
      ZBase.CallServer.request("queryDealerData", null, function(data) {
        if (data.code == '10001') {
          //window.localStorage.dealer = JSON.stringify(data.data);
          dealerData = data.data;
          dealer(data.data);
        }
      }, function() {
        $('.mapBtn').find('a').removeClass('disabled');
      });
    };
    var requSrever = function() {
      ZBase.CallServer.request("queryServiceStationData", null, function(data) {
        if (data.code == '10001') {
          //window.localStorage.server = JSON.stringify(data.data);
          sreverData = data.data;
          srever(data.data);
        }
      }, function() {
        $('.mapBtn').find('a').removeClass('disabled');
      });
    };

    $('.mapBtn').find('a').click(function() {
      if ($(this).hasClass('disabled')) return;
      $('.mapBtn').find('a').addClass('disabled');
      var data = $(this).attr('data-title');
      if (data == 'dealer') {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          _this.map.removeOverlay(pointCollectionDealer);
        } else {
          $(this).addClass('active');
          //requDealer();
          dealer(dealerData);
        }
      } else {
        if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          _this.map.removeOverlay(pointCollectionSrever);
        } else {
          $(this).addClass('active');
          if (sreverData) {
            srever(sreverData);
          } else {
            requSrever();
          }
        }
      }
      $('.mapBtn').find('a').removeClass('disabled');
    });
    var dealer = function(data) {
      if (pointCollectionSrever) {
        _this.map.removeOverlay(pointCollectionSrever);
      }
      var options = {
        shape: BMAP_POINT_SHAPE_STAR,
        color: '#FFB7F4',
        size: BMAP_POINT_SIZE_BIG
      };
      pointCollectionDealer = new BMap.PointCollection(data, options);
      _this.map.addOverlay(pointCollectionDealer);
      $('.server').removeClass('active');
      $('.mapBtn').find('a').removeClass('disabled');
    };

    var srever = function(data) {
      if (pointCollectionDealer) {
        _this.map.removeOverlay(pointCollectionDealer);
        $('.dealer').removeClass('active');
      }
      var options = {
        shape: BMAP_POINT_SHAPE_STAR,
        color: '#FFB7F4',
        size: BMAP_POINT_SIZE_BIG
      };
      pointCollectionSrever = new BMap.PointCollection(data, options);
      _this.map.addOverlay(pointCollectionSrever);
      $('.mapBtn').find('a').removeClass('disabled');
    };
    // var timer;
    return {
      init: function() {
        hotZoonAjax();
        // timer = setInterval(hotZoonAjax, 24 * 3600 * 1000);
      },
      resetBrand: function() {
        clearInterval(timer);
        $('.dealer,.server').removeClass('active');
        if (pointCollectionDealer) {
          _this.map.removeOverlay(pointCollectionDealer);
        }
        if (pointCollectionSrever) {
          _this.map.removeOverlay(pointCollectionSrever);
        }
        hotZoonAjax();
        // timer = setInterval(hotZoonAjax, 86400000);
      }
    };
  },

  brand: function() {
    var _this = this;
    var $footerNav = $('.footerNav');
    var len = $footerNav.find('a').length;
    var navArr = ['monitor.html', 'index.html', 'addedValue.html'];
    $('.brandNav').on('click', 'a', function() {
      global.VehicleBrandID = $(this).attr('data-vehiclebrandid');
      $('.brandName').html($(this).html());

      global.VehicleBrandID = $(this).attr('data-vehiclebrandid');
      for (var i = 0; i < len; i++) {
        var href = navArr[i] + '?brandId=' + global.VehicleBrandID;
        $footerNav.find('a').eq(i).attr('href', href);
      }
      /**本月故障码*/
      //global.fault.resetBrand();

      /**总里程*/
      _this.mileageTimeInit.resetBrand();

      _this.PassCommSDInit.resetBrand(); //24小时数速度

      _this.PassCommDringInit.resetBrand();

      _this.baiduMapInit.resetBrand();
    });
  },

  getMd: function(len) {
    var date = new Date();
    var time = date.getTime();
    var arr = [];
    for (var i = len; i > 0; i--) {
      var prevDate = new Date(time - i * 86400000),
        m = prevDate.getMonth() + 1,
        d = prevDate.getDate();
      arr.push(m + '-' + d);
    }
    return arr;
  }
};
