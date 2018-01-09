/**
 * Created by Administrator on 2017-01-27.
 */
var index = {
  init: function() {
    global.nav(0);
    //this.brand();

    var brandId = global.getUrlParam('brandId');
    if (ZBase.Brand.get(brandId) == '欧辉') {
      $('.index1').find('.time').show();
      $('#drivingInner').css({
        'height': '100%'
      });
      this.overDetter();
    } else if (brandId == '1075') {
      //本月报警排名
      $('.index1').find('.time').hide();
    } else {
      /**不规范驾驶行为*/
      $('#drivingInner').css({
        'height': '110%'
      });
      $('.index1').find('.time').hide();
      this.drivingInit = this.driving();
      this.drivingInit.init();
    }


    if (ZBase.Brand.get(brandId) == '伽途') {
      this.carSpeedInit = this.carSpeedForJiatu();
      this.carSpeedInit.init();
    } else {
      /**本月故障码*/
      this.faultInit = this.fault();
      this.faultInit.init();
    }

    this.collectionMap = this.map();
    this.collectionMap.init();

    /*报警*/
    this.alermInit = this.alerm();
    this.alermInit.init();

    global.bind();
    global.appMove(0);
  },



  /**欧辉一周行驶里程*/
  overDetter: function() {
    var option = {
      title: {
        text: '行驶分析',
        textStyle: {
          color: '#fff',
          fontSize: '18'
        },
        left: 20
      },
      tooltip: {
        trigger: 'item',
        position: 'right'
        //formatter:'{b}<br />{a0}: {c0}公里<br />{a1}: {c1}小时'
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
          barWidth: 20,
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
    var myChart = echarts.init(document.getElementById('drivingInner'));
    var tequAjax = function() {
      ZBase.CallServer.request("queryDriveAnasyle", null, function(data) {
        if (data.code == '10001') {
          var da = data.data;
          if (da) {
            func(data.data);
          }
        }
      });
    };
    var func = function(data) {
      var runtime = data.runtime;
      var mileage = data.mileage;
      var runtimeLen = runtime.length;
      var mileageLen = mileage.length;
      var x1 = [],
        y1 = [],
        y2 = [];
      for (var i = 0; i < runtimeLen; i++) {
        var runtimeI = runtime[i];
        for (var j = 0; j < mileageLen; j++) {
          if (runtimeI.to_day == mileage[i].to_day) {
            x1.push(runtimeI.to_day);
            y1.push((mileage[i].average).toFixed(1));
            y2.push((runtimeI.average).toFixed(1));
            break;
          }
        }
      }
      option.xAxis[0].data = x1;
      option.series[0].data = y1;
      option.series[1].data = y2;
      myChart.setOption(option);
    };
    tequAjax();
    var timer = setInterval(tequAjax, 24 * 60 * 60 * 1000);
  },

  /**雷萨最近一个月报警排名*/
  alermP: function() {
    var option = {
      title: {
        text: '本月报警排名',
        textStyle: {
          color: '#fff',
          fontSize: '18'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}'
      },
      grid: {
        left: '-2%%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },

      calculable: true,
      xAxis: [{
        type: 'category',
        data: [],
        axisLabel: {
          rotate: 30,
          interval: 0,
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
        axisLabel: {
          show: false,
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
      }],
      series: [{
          name: '本月报警排名',
          type: 'bar',
          data: [],
          itemStyle: {
            normal: {
              color: '#0270f1'
            }
          },
          barWidth: 30
        }

      ]
    };
  },

  /**不规范驾驶行为*/
  driving: function() {

    var option = {
      title: {
        text: '当月不规范驾驶行为分析',
        textStyle: {
          color: '#fff',
          fontSize: '18'
        }
      },
      tooltip: {
        position: 'right'
      },
      radar: {
        name: {
          textStyle: {
            color: '#fff',
            fontSize: 14,
            align:'left',
          },
          formatter:function (text) {              
            text = text.length < 5 ? text : text.replace(/\S{3}/g,function (match) {                
                return match + '\n'
            })
            return text
          }
        },
        radius: '60%',
        splitNumber: 10,
        axisLine: {
          show: false
        },
        splitArea: {
          areaStyle: {
            color: 'rgba(255, 255, 255, 0)'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#0a2c73'
          }
        },
        /*nameGap:5,*/
        // shape: 'circle',
        indicator: [
          { name: '急刹车' }
        ]
      },
      series: [{
        name: '不规范驾驶行为分析',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [{
          value: [4300]
        }],
        lineStyle: {
          normal: {
            color: '#1bd4c4'
          }
        },
        itemStyle: {
          normal: {
            color: '#1bd4c4'
          }
        }
      }]
    };

    var requAjax = function() {
      ZBase.CallServer.request("queryDriverData", null, function(data) {
        if (data.code == '10001') {
          var da = data.data;
          if (da) {
            // window.localStorage.driving = JSON.stringify(da);
            func(da);
          } else {
            /*var data = JSON.parse(window.localStorage.driving);
            func(data);*/
            console.log('返回为空');
          }
        }
      });
    };
    var myChart;
    var func = function(data) {
      var len = data.length;
      var nameArr = [];
      var valueArr = [];
      for (var i = 0; i < len; i++) {
        var p = data[i];
        var nameObj = {
          name: p.name
          /*,
                              max:p.drvb_counts*1.2*/
        };
        valueArr.push(p.drvb_counts);
        nameArr.push(nameObj);
      }
      option.radar.indicator = nameArr;
      option.series[0].data[0].value = valueArr;
      myChart.setOption(option);
    };

    var timer;
    var clearTime = function() {
      clearInterval(timer);
    };

    return {
      init: function() {
        myChart = echarts.init(document.getElementById('drivingInner'));
        myChart.setOption(option);
        requAjax();
        timer = setInterval(requAjax, 24 * 60 * 60 * 1000);
      },
      resetBrand: function() {
        clearTime();
        requAjax();
        timer = setInterval(requAjax, 24 * 60 * 60 * 1000);
      }
    };
    myChart.setOption(option);
  },

  carSpeedForJiatu: function() {
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
        }
      },

      grid: {
        left: '4%',
        right: '4%',
        bottom: '10%',
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
        data: []
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

    var requAjax = function() {
      ZBase.CallServer.request("queryAvgSpeedData", null, function(data) {
        if (data.code == '10001') {
          var da = data.data;
          if (da) {
            func(da.PassVehicle);
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
        myChart = echarts.init(document.getElementById('faultInner'));
        myChart.setOption(option);
        requAjax();
        timer = setInterval(requAjax, 24 * 60 * 60 * 1000);
      },
      resetBrand: function() {
        requAjax();
        timer = setInterval(requAjax, 24 * 60 * 60 * 1000);
      }
    };

  },

  /*本月故障码*/
  fault: function() {
    var brandName = ZBase.Brand.get(global.getUrlParam("brandId"));
    var option = {
      title: {
        text: "本月故障报警",
        textStyle: {
          color: '#fff',
          fontSize: '18'
        }
      },
      tooltip: {
        //trigger: 'axis',
        trigger: 'item',
        position: 'right',
        formatter: '{b}<br />{a0}: {c0}'
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '30%',
        containLabel: true
      },

      calculable: true,
      xAxis: [{
        type: 'category',
        data: [],
        axisLabel: {
          rotate: 30,
          interval: 0,
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
        axisLabel: {
          show: true,
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
      }],
      series: [{
          name: '故障',
          type: 'line',
          data: [],
          itemStyle: {
            normal: {
              color: '#fbfe00'
            }
          },
          smooth: true,
          showSymbol: false,

          markPoint: {
            symbol: 'image://assets/images/monitorPoint.png',
            symbolSize: [72, 30],
            symbolOffset: [0, '-100%'],
            label: {
              normal: {
                position: 'insideTop',
                textStyle: {
                  color: '#fff'
                }
              }
            },
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }

      ]
    };

    var requAjax = function() {
      ZBase.CallServer.request("queryFaultWarnData", null, function(data) {
        if (data.code == '10001') {
          var da = data.data;
          if (da) {
            // window.localStorage.fault = JSON.stringify(da);
            func(da, true);
          } else {
            /*var data = JSON.parse(window.localStorage.fault);
            func(data,false);*/
            console.log('返回为空');
          }
        }
      });
    };

    var myChart;
    var func = function(data, staues) {
      var len = data.length;
      var counts = [];
      var name = [];
      if (staues) {
        for (var i = 0; i < len; i++) {
          var p = data[i];
          counts.push(p.fault_counts);
          name.push(p.name);
        }
      } else {
        for (var i = 0; i < len; i++) {
          var p = data[i];
          counts.push(0);
          name.push(p.name);
        }
      }
      option.series[0].data = counts;
      option.xAxis[0].data = name;
      if (!myChart) {
        myChart = echarts.init(document.getElementById('faultInner'));
      }
      myChart.setOption(option);
    };
    var timer;
    var cleraTime = function() {
      clearInterval(timer);
    };
    return {
      init: function() {
        var myChart = echarts.init(document.getElementById('faultInner'));
        myChart.setOption(option);
        requAjax();
        timer = setInterval(requAjax,24 * 60 * 60 * 1000);
      },
      resetBrand: function() {
        cleraTime();
        requAjax();
        timer = setInterval(requAjax,24 * 60 * 60 * 1000);
      }
    };

  },

  map: function() {
    var series = [];
    var geoCoordMap = {
      '广东': [113.14, 23.08],
      '广州市': [113.533333, 23.333333],
      '韶关市': [113.603757, 24.816174],
      '深圳市': [114.066112, 22.548515],
      '珠海市': [113.583235, 22.076392],
      '汕头市': [116.688739, 23.359289],
      '佛山市': [113.09999, 23.023333],
      '江门市': [112.588165, 22.184459],
      '湛江市': [110.365494, 21.277163],
      '茂名市': [110.931773, 21.669051],
      '肇庆市': [112.371770, 23.552984],
      '惠州市': [114.423348, 23.116409],
      '梅州市': [116.129179, 24.294311],
      '汕尾市': [115.381693, 22.791322],
      '河源市': [114.807097, 23.949829],
      '阳江市': [111.989051, 21.864421],
      '清远市': [113.062619, 23.988238],
      '东莞市': [113.82222, 23.013333],
      '中山市': [113.399023, 22.522262],
      '揭阳市': [116.179220, 23.155773],
      '潮州市': [116.629430, 23.662923],
      '云浮市': [112.051045, 22.917895],

      '青海': [95.78, 35.68],
      '西宁市': [101.784269, 36.623477],
      '海东市': [102.285207, 36.117610],
      '海北藏族自治州': [100.707395, 37.860702],
      '黄南藏族自治州': [101.921495, 35.026125],
      '海南藏族自治州': [100.026831, 36.092132],
      '果洛藏族自治州': [99.251341, 34.477207],
      '玉树藏族自治州': [95.513080, 34.011061],
      '海西蒙古族藏族自治州': [97.377823, 37.382839],

      '四川': [102.04, 30.40],
      '成都市': [104.071216, 30.576279],
      '自贡市': [104.784891, 29.345379],
      '攀枝花市': [101.725262, 26.588109],
      '泸州市': [105.449092, 28.877577], //数据没匹配到图
      '德阳市': [104.404319, 31.133105],
      '绵阳市': [104.686164, 31.473364],
      '广元市': [105.849993, 32.441808],
      '遂宁市': [105.599152, 30.539156],
      '内江市': [105.065028, 29.585836],
      '乐山市': [103.771930, 29.558141],
      '南充市': [106.117231, 30.843297],
      '眉山市': [103.855070, 30.081369],
      '宜宾市': [104.648103, 28.757610],
      '广安市': [106.639772, 30.461708],
      '达州市': [107.474504, 31.214347],
      '雅安市': [103.046360, 30.021277],
      '巴中市': [106.753912, 31.872851],
      '资阳市': [104.734415, 30.134846],
      '阿坝藏族羌族自治州': [102.231186, 31.905609],
      '甘孜藏族自治州': [100.969084, 30.055207],
      '凉山彝族自治州': [102.273965, 27.887685],

      '海南': [110.20, 20.02],
      '三亚市': [109.5, 18.25],
      '海口市': [110.406424, 19.850057],
      '五指山市': [109.52, 18.78],
      '琼海市': [110.47, 19.25],
      '儋州市': [109.57, 19.52],
      '文昌市': [110.8, 19.55],
      '万宁市': [110.4, 18.8],
      '东方市': [108.63, 19.1],
      '澄迈县': [110.0, 19.73],
      '定安县': [110.32, 19.7],
      '屯昌县': [110.1, 19.37],
      '临高县': [109.68, 19.92],
      '白沙黎族自治县': [109.45, 19.23],
      '昌江黎族自治县': [109.05, 19.25],
      '乐东黎族自治县': [109.17, 18.75],
      '陵水黎族自治县': [110.03, 18.5],
      '保亭黎族苗族自治县': [109.7, 18.63],
      '琼中黎族苗族自治县': [109.83, 19.03],

      '陕西': [108.57, 34.17], //http://www.gpsspg.com/maps.htm
      '西安市': [108.946306, 34.147436],
      '铜川市': [108.951558, 35.092957],
      '宝鸡市': [107.243899, 34.367747],
      '咸阳市': [108.715712, 32.885599],
      '渭南市': [109.686739, 34.805687],
      '延安市': [109.496361, 36.591003],
      '汉中市': [107.030197, 33.073820],
      '榆林市': [109.741195, 38.290886],
      '安康市': [109.035920, 32.690575],
      '商洛市': [109.946880, 33.576525],

      '甘肃': [95.78, 39.68],
      '兰州市': [103.540692, 36.367312],
      '嘉峪关市': [98.296514, 39.778268],
      '金昌市': [102.194197, 38.525777],
      '白银市': [104.144182, 36.550821],
      '天水市': [105.731276, 34.587162],
      '武威市': [102.644524, 37.934078],
      '张掖市': [100.456221, 38.932187],
      '平凉市': [106.671741, 35.249266],
      '酒泉市': [96.500427, 39.738615],
      '庆阳市': [107.649305, 35.916096],
      '定西市': [104.631662, 35.187354],
      '陇南市': [104.928233, 33.406825],
      '临夏回族自治州': [103.217303, 35.607475],
      '甘南藏族自治州': [102.917605, 34.589010],

      '云南': [100.42, 23.04],
      '昆明市': [102.839667, 24.885953],
      '曲靖市': [103.802685, 25.496328],
      '玉溪市': [102.553700, 24.357512],
      '保山市': [99.168373, 25.117882],
      '昭通市': [103.723311, 27.344057],
      '丽江市': [100.733570, 27.062521],
      '普洱市': [100.983630, 22.792421],
      '临沧市': [100.095280, 23.890530],
      '楚雄彝族自治州': [101.534082, 25.051226],
      '红河哈尼族彝族自治州': [103.382150, 23.369914],
      '文山壮族苗族自治州': [104.421606, 23.704187],
      '西双版纳傣族自治州': [100.803836, 22.013792],
      '大理白族自治州': [100.274223, 25.612206],
      '德宏傣族景颇族自治州': [98.591419, 24.438031],
      '怒江傈僳族自治州': [98.763184, 26.823734],
      '迪庆藏族自治州': [99.709476, 27.825264],

      '湖南': [111.59, 27.12],
      '长沙市': [112.945333, 28.233971],
      '株洲市': [113.440431, 27.433737],
      '湘潭市': [112.750575, 27.735850],
      '衡阳市': [112.578397, 26.899517],
      '邵阳市': [111.474133, 27.245167],
      '岳阳市': [113.135679, 28.863262],
      '常德市': [111.704994, 29.037723],
      '张家界市': [110.484925, 29.122477],
      '益阳市': [112.361677, 28.559818],
      '郴州市': [113.021311, 25.776711],
      '永州市': [111.618703, 26.426612],
      '怀化市': [110.008116, 27.575595],
      '娄底市': [111.881082, 27.703196],
      '湘西土家族苗族自治州': [109.745507, 28.317399],

      '湖北': [112.17, 30.35],
      '武汉市': [114.311831, 30.598428],
      '黄石市': [115.045433, 29.885336],
      '十堰市': [110.804540, 32.635042],
      '宜昌市': [111.292971, 30.697602],
      '襄阳市': [112.129091, 32.014786],
      '鄂州市': [114.901557, 30.396522],
      '荆门市': [112.205843, 31.041792],
      '孝感市': [113.922962, 30.930712],
      '荆州市': [112.247220, 30.340606],
      '黄冈市': [115.578872, 30.859422],
      '咸宁市': [114.328967, 29.847123],
      '随州市': [113.389071, 31.696341],
      '恩施土家族苗族自治州': [109.494763, 30.277908],
      '仙桃市': [113.45, 30.37],
      '天门市': [113.17, 30.67],
      '潜江市': [112.88, 30.42],
      '神农架林区': [110.67, 31.75],

      '黑龙江': [126.36, 47.44],
      '哈尔滨市': [126.542417, 45.807782],
      '齐齐哈尔市': [123.924531, 47.360087],
      '鸡西市': [130.976161, 45.300906],
      '鹤岗市': [130.304284, 47.356043],
      '双鸭山市': [131.865442, 46.652966],
      '大庆市': [124.889727, 46.593216], //
      '伊春市': [128.847040, 47.733329],
      '佳木斯市': [130.326960, 46.806581],
      '七台河市': [131.009618, 45.776512],
      '牡丹江市': [129.698976, 44.558647],
      '黑河市': [127.335014, 49.351193],
      '绥化市': [126.555678, 46.658789], //
      '大兴安岭地区': [124.598660, 51.929930],

      '贵州': [106.02, 26.35],
      '贵阳市': [106.636816, 26.652747],
      '六盘水市': [104.836786, 26.599086],
      '遵义市': [106.933658, 27.731749],
      '安顺市': [105.952622, 26.259904],
      '铜仁市': [108.668558, 27.674903],
      '黔西南布依族苗族自治州': [105.410858, 25.395974],
      '毕节市': [105.333323, 26.908562],
      '黔东南苗族侗族自治州': [108.489306, 26.589678],
      '黔南布依族苗族自治州': [106.964023, 25.834003],

      '山东': [117.00, 36.40],
      '济南市': [117.001319, 36.671624],
      '青岛市': [120.389445, 36.072358],
      '淄博市': [118.061254, 36.819182],
      '枣庄市': [117.328513, 34.816569],
      '东营市': [118.681046, 37.439990],
      '烟台市': [121.454425, 37.469868],
      '潍坊市': [119.168138, 36.713212],
      '济宁市': [116.593852, 35.420269],
      '泰安市': [117.094893, 36.205965],
      '威海市': [122.128245, 37.019322],
      '日照市': [119.333606, 35.422798],
      '莱芜市': [117.683221, 36.219357],
      '临沂市': [118.362990, 35.110531],
      '德州市': [116.565825, 37.141313],
      '聊城市': [115.992077, 36.462681],
      '滨州市': [117.979200, 37.388387],
      '菏泽市': [115.26, 35.14],

      '江西': [114.95, 26.40],
      '南昌市': [115.864528, 28.687675],
      '景德镇市': [117.184967, 29.274337],
      '萍乡市': [113.860770, 27.628970],
      '九江市': [116.007993, 29.311328],
      '新余市': [114.923664, 27.823541],
      '鹰潭市': [117.075765, 28.265879],
      '赣州市': [114.941260, 25.837179],
      '吉安市': [115.00027, 27.119751],
      '宜春市': [114.522683, 28.320089],
      '抚州市': [116.364627, 27.653603],
      '上饶市': [117.950028, 28.460864],

      '河南': [113.40, 33.46],
      '郑州市': [113.631349, 34.753488],
      '开封市': [114.413904, 34.602941],
      '洛阳市': [112.460033, 34.624376],
      '平顶山市': [113.198935, 33.772051],
      '安阳市': [114.399600, 36.103649],
      '鹤壁市': [114.304044, 35.752656],
      '新乡市': [113.933349, 35.308973],
      '焦作市': [113.248557, 35.221493],
      '濮阳市': [115.035917, 35.767586],
      '许昌市': [113.858804, 34.041737],
      '漯河市': [114.023230, 33.587703],
      '三门峡市': [111.206832, 34.578442],
      '南阳市': [112.535009, 32.996701],
      '商丘市': [115.662798, 34.420378],
      '信阳市': [114.399264, 32.153186],
      '周口市': [114.703433, 33.631958],
      '驻马店市': [114.029465, 33.017546],

      '河北': [114.54, 37.63],
      '石家庄市': [114.520828, 38.048684],
      '唐山市': [118.187036, 39.636673],
      '秦皇岛市': [119.606184, 39.941259],
      '邯郸市': [114.545808, 36.631222],
      '邢台市': [114.510889, 37.076646],
      '保定市': [115.471052, 38.5880055],
      '张家口市': [114.894165, 40.830172],
      '承德市': [117.969798, 40.957855],
      '沧州市': [116.845272, 38.310220],
      '廊坊市': [116.690340, 39.543520],
      '衡水市': [115.676942, 37.745166],

      '山西': [112.33, 35.84],
      '太原市': [112.557060, 37.876885],
      '大同市': [113.306446, 40.082539],
      '阳泉市': [113.587087, 37.862340],
      '长治市': [113.123046, 36.201585],
      '晋城市': [112.857706, 35.496081],
      '朔州市': [112.438184, 39.337890],
      '晋中市': [112.959375, 37.292757],
      '运城市': [111.013379, 35.032587],
      '忻州市': [112.740804, 38.422382],
      '临汾市': [111.526153, 36.094052],
      '吕梁市': [111.148086, 37.525476],

      '安徽': [117.17, 30.02],
      '合肥市': [117.235447, 31.826870],
      '芜湖市': [118.439561, 31.358798],
      '蚌埠市': [117.395835, 32.921498],
      '淮南市': [117.006189, 32.631837],
      '马鞍山市': [118.512691, 31.676330],
      '淮北市': [116.804878, 33.960640],
      '铜陵市': [117.818795, 30.950899],
      '安庆市': [116.670127, 30.548594],
      '黄山市': [118.345096, 29.721365],
      '滁州市': [118.323252, 32.308165],
      '阜阳市': [115.821389, 32.895879],
      '宿州市': [117.270454, 33.652034],
      '巢湖市': [117.680490, 31.408733],
      '六安市': [116.529651, 31.741226],
      '亳州市': [116.185767, 33.350774],
      '池州市': [117.497839, 30.370980],
      '宣城市': [118.765196, 30.646576],

      '福建': [118.18, 25.05],
      '福州市': [119.18, 26.05],
      '厦门市': [118.095915, 24.485821],
      '莆田市': [119.014232, 25.459960],
      '三明市': [117.645742, 26.269683],
      '泉州市': [118.682316, 24.880242],
      '漳州市': [117.453827, 24.219197],
      '南平市': [118.184300, 26.647662],
      '龙岩市': [117.023668, 25.081257],
      '宁德市': [119.554701, 26.671748],

      '浙江': [120.10, 28.16],
      '杭州市': [120.161693, 30.280059],
      '宁波市': [121.556686, 29.880177],
      '温州市': [120.705869, 28.001095],
      '嘉兴市': [120.762045, 30.750912],
      '湖州市': [120.094566, 30.899015],
      '绍兴市': [120.586673, 30.036519],
      '金华市': [119.654027, 29.084455],
      '衢州市': [118.880768, 28.941661],
      '舟山市': [122.214339, 29.991092],
      '台州市': [121.426996, 28.662297],
      '丽水市': [119.929503, 28.472979],

      '江苏': [118.56, 33.53],
      '南京市': [118.802891, 32.064735],
      '无锡市': [120.318954, 31.496704],
      '徐州市': [117.292350, 34.210143],
      '常州市': [119.980142, 31.816791],
      '苏州市': [120.589613, 31.304566],
      '南通市': [120.900301, 31.985237],
      '连云港市': [119.229571, 34.602342],
      '淮安市': [119.022429, 33.616272],
      '盐城市': [120.168187, 33.355301],
      '扬州市': [119.419107, 32.399860],
      '镇江市': [119.431494, 32.195688],
      '泰州市': [119.932115, 32.461200],
      '宿迁市': [118.282062, 33.967686],

      '吉林': [126.79, 43.54],
      '长春市': [125.330170, 44.021780],
      '吉林市': [126.556073, 43.843512],
      '四平市': [124.356844, 43.372447],
      '辽源市': [125.150107, 42.894300],
      '通化市': [125.946506, 41.733906],
      '白山市': [126.731502, 41.946430],
      '松原市': [124.831633, 45.147201],
      '白城市': [122.645302, 45.625400],
      '延边朝鲜族自治州': [129.315602, 42.897211],

      '辽宁': [123.25, 40.08],
      '沈阳市': [123.438973, 41.811339],
      '大连市': [121.621391, 38.919345],
      '鞍山市': [123.000974, 40.914122],
      '抚顺市': [124.163595, 41.886078],
      '本溪市': [123.773468, 41.299847],
      '丹东市': [124.362564, 40.405690],
      '锦州市': [121.133631, 41.100869],
      '营口市': [122.241475, 40.672565],
      '阜新市': [121.676518, 42.027983],
      '辽阳市': [123.243726, 41.274452],
      '盘锦市': [122.077269, 41.125939],
      '铁岭市': [123.848797, 42.292573],
      '朝阳市': [120.457301, 41.579487],
      '葫芦岛市': [120.843388, 40.517364],

      '台湾省': [121.30, 25.03],

      '新疆': [87.36, 43.45],
      '乌鲁木齐市': [87.623314, 43.532806],
      '克拉玛依市': [84.895870, 45.585765],
      '吐鲁番市': [89.196029, 42.957303],
      '哈密市': [93.522785, 42.824462],
      '昌吉回族自治州': [90.314822, 44.016923],
      '博尔塔拉蒙古自治州': [82.073064, 44.92168],
      '巴音郭楞蒙古自治州': [86.151584, 41.770226],
      '阿克苏地区': [80.266525, 41.174545],
      '克孜勒苏柯尔克孜自治州': [75.573127, 39.321257],
      '喀什地区': [76.596250, 37.276419],
      '和田地区': [79.928877, 37.120556],
      '伊犁哈萨克自治州': [81.330697, 43.922815],
      '塔城地区': [82.987095, 46.751068],
      '阿勒泰地区': [88.146856, 47.851367],
      '塔城地区': [82.98, 46.75],
      '阿拉尔市': [81.28, 40.55],
      '图木舒克市': [79.13, 39.85],
      '石河子市': [86.03, 44.3],
      '五家渠市': [87.53, 44.17],

      '广西': [108.19, 23.48],
      '南宁市': [108.373351, 22.823037],
      '北海市': [109.126614, 21.486955],
      '百色市': [106.624969, 23.907845],
      '防城港市': [108.361138, 21.693439],
      '贵港市': [109.604155, 23.118929],
      '桂林市': [110.296442, 25.279893],
      '桂平市': [110.085536, 23.399949],
      '河池市': [108.091898, 24.698828],
      '柳州市': [109.421980, 24.331519],
      '钦州市': [108.660890, 21.985392],
      '梧州市': [111.285647, 23.482873],
      '玉林市': [110.187430, 22.660656],
      '宜州市': [108.643090, 24.491021],
      '贺州市': [111.55, 24.42],
      '崇左市': [107.371369, 22.384864],
      '来宾市': [109.228844, 23.758266],

      '宁夏': [106.16, 38.27],
      '银川市': [106.238976, 38.492392],
      '石嘴山市': [106.390780, 38.989783],
      '吴忠市': [106.205161, 38.003863],
      '固原市': [106.249170, 36.021609],
      '中卫市': [105.203332, 37.506658],

      '内蒙古': [111.41, 40.48],
      '呼和浩特市': [111.758518, 40.247461],
      '包头市': [109.846755, 41.563636],
      '乌海市': [106.801850, 39.660154],
      '赤峰市': [118.895463, 42.264586],
      '通辽市': [122.251207, 43.658363],
      '鄂尔多斯市': [109.487314, 39.314630],
      '呼伦贝尔市': [122.772210, 49.217977],
      '巴彦淖尔市': [107.394129, 40.749427],
      '乌兰察布市': [113.140223, 41.799972],
      '兴安盟': [122.044544, 46.088444],
      '锡林郭勒盟': [116.054141, 43.939525],
      '乌兰察布盟': [115.077002, 43.988208],
      '阿拉善盟': [103.735357, 40.857806],

      '西藏': [85.08, 31.39],
      '拉萨市': [91.121025, 29.650088],
      '昌都市': [97.185582, 31.140576],
      '山南地区': [91.779601, 29.243090],
      '日喀则地区"': [88.956063, 29.268160],
      '那曲地区': [92.057800, 31.482375],
      '阿里地区': [81.151894, 33.406574],
      '林芝地区': [94.369109, 29.654792],

      '北京': [115.24, 40.55],
      '西城区': [116.37, 39.92],
      '东城区': [116.42, 39.93],
      '崇文区': [116.43, 39.88],
      '宣武区': [116.35, 39.87],
      '朝阳区': [116.43, 39.92],
      '丰台区': [116.28, 39.85],
      '石景山区': [116.22, 39.9],
      '海淀区': [116.3, 39.95],
      '怀柔区': [116.63, 40.32],
      '平谷区': [117.12, 40.13],
      //'北京市':[116.63,40.32],//此处为临时使用，后面使用更详细的区县
      '天津': [117.12, 39.02],
      '天津市': [117.12, 39.02], //此处为临时使用，后面使用更详细的区县

      '上海': [120.29, 31.14],
      '黄浦区': [121.47, 31.23],
      '卢湾区': [121.47, 31.22],
      '徐汇区': [121.43, 31.18],
      '长宁区': [121.42, 31.22],
      '静安区': [121.45, 31.23],
      '普陀区': [121.4, 31.25],
      '闸北区': [121.45, 31.25],
      '虹口区': [121.5, 31.27],
      '杨浦区': [121.52, 31.27],
      '闵行区': [121.38, 31.12],
      '宝山区': [121.48, 31.4],
      '嘉定区': [121.27, 31.38],
      '浦东新区': [121.53, 31.22],
      '松江区': [121.22, 31.03],
      '金山区': [121.33, 30.75],
      '青浦区': [121.12, 31.15],
      '南汇区': [121.75, 31.05],
      '奉贤区': [121.47, 30.92],
      '崇明县': [121.4, 31.62],

      //'上海市':[120.24,31.15], //此处为临时使用，后面使用更详细的区县
      '重庆': [107.33, 30.35],
      //'重庆市':[107.33,30.35],//此处为临时使用，后面使用更详细的区县
      '合川区': [106.15, 30.02],
      '江津区': [106.16, 29.18],
      '南川区': [107.05, 29.10],
      '永川区': [105.53, 29.23],

      '香港特别行政区': [115.12, 21.23],
      '澳门特别行政区': [115.07, 21.33]
    };
    var planePath = 'image://assets/images/indexmap.png';
    var pathUrl1 = 'image://assets/images/cityMap.png';
    var pathUrl2 = 'image://assets/images/fotonSmall.png';
    var BJData = [];
    var color = ['#5664b0', '#ffa022', '#46bee9'];
    var option = {
      legend: {
        show: false,
        data: ['北京'],
        selectedMode: 'single'
      },
      geo: {
        map: 'china',
        // top: 10,
        // left: 10,
        // bottom: 35,
        // right: 10,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#4ec2db',
              fontSize: 12
            },
            z: 2
          },
          emphasis: {
            show: true,
            textStyle: {
              color: '#4ec2db',
              fontSize: 12
            }
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#001aff',
            borderColor: '#000d7f',
            borderWidth: 3
          },
          emphasis: {
            areaColor: '#001aff'
          }
        }
      },
      series: []
    };
    var funcMap = function(data) {
      series = [];
      //var myChart = echarts.init(document.getElementById('mapInner'));
      //option.series = series;
      //myChart.setOption(option);
      BJData = [];
      for (var i in data) {
        var obj = { name: i, value: data[i] };
        var arr = [obj, { name: '北京' }];
        BJData.push(arr);
      }
      if ('forEach' in Array.prototype) {
        [
          ['北京', BJData]
        ].forEach(function(item, i) {
          series.push(
            /*{
                                        name: item[0],
                                        type: 'lines',
                                        zlevel: 1,
                                        effect: {
                                            show: true,
                                            period: 1.5,
                                            trailLength: 0,
                                            color: '#f3f2f2',
                                            symbol: 'roundRect',
                                            symbolSize: 5
                                        },
                                        lineStyle: {
                                            normal: {
                                                color: color[i],
                                                width: 0,
                                                curveness: 0.2
                                            }
                                        },
                                        data: convertData(item[1])
                                    },*/
            {
              name: item[0],
              type: 'lines',
              zlevel: 2,
              symbol: ['none', 'arrow'],
              symbolSize: 10,
              effect: {
                show: true,
                period: 1.5,
                constantSpeed: 200,
                trailLength: 0,
                symbol: planePath,
                symbolSize: 15
              },
              lineStyle: {
                normal: {
                  color: '#fff',
                  width: 1,
                  opacity: 0.6,
                  curveness: 0.2
                }
              },
              data: convertData(item[1])
            }, {
              name: item[0],
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke'
              },
              symbol: pathUrl2,
              symbolSize: 20,
              data: item[1].map(function(dataItem) {
                return {
                  name: dataItem[1].name,
                  value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
              })
            }, {
              type: 'scatter',
              coordinateSystem: 'geo',
              zlevel: 10,
              symbol: pathUrl2,
              symbolSize: 20,
              data: item[1].map(function(dataItem) {
                return {
                  name: dataItem[1].name,
                  value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
              })
            });
        });
      } else {
        var item = ['山东', BJData];
        series = [{
          name: item[0],
          type: 'lines',
          zlevel: 1,
          effect: {
            show: true,
            period: 1.5,
            trailLength: 0.7,
            color: '#f3f2f2',
            symbol: 'roundRect',
            symbolSize: 5
          },
          lineStyle: {
            normal: {
              color: color[i],
              width: 0,
              curveness: 0.2
            }
          },
          data: convertData(item[1])
        }, {
          name: item[0],
          type: 'lines',
          zlevel: 2,
          symbol: ['none', 'arrow'],
          symbolSize: 10,
          effect: {
            show: true,
            period: 1.5,
            trailLength: 0,
            symbol: planePath,
            symbolSize: 15
          },
          lineStyle: {
            normal: {
              color: color[i],
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            }
          },
          data: convertData(item[1])
        }, {
          name: item[0],
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            brushType: 'stroke'
          },
          symbol: pathUrl2,
          symbolSize: 30,
          data: item[1].map(function(dataItem) {
            return {
              name: dataItem[1].name,
              value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
            };
          })
        }, {
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 10,
          symbol: pathUrl1,
          symbolSize: 90,
          data: mapPointData
        }];
      }
      option.series = series;
      myChart.setOption(option);
    };
    var mapAjax = function() {
      ZBase.CallServer.request("queryVehicleData", null, function(data) {
        if (data.code == '10001') {
          var da = data.data;
          if (da) {
            // window.localStorage.monitorMap = JSON.stringify(da.province.onlineProvinceMap);
            funcMap(da.province.onlineProvinceMap);
          } else {
            /*var data = JSON.parse(window.localStorage.monitorMap);
            funcMap(data);*/
            console.log('返回为空');
          }
        }
      })
    };
    var convertData = function(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord]
          });
        }
      }
      return res;
    };
    //组装各城市数据
    var mapPoint = function() {
      var len = BJData.length;
      var arr = [];
      for (var i = 0; i < len; i++) {
        var BJDataC = BJData[i][0];
        var j = geoCoordMap[BJDataC.name];
        j.push(BJDataC.value);
        var obj = {
          name: BJDataC.name,
          value: j
        };
        arr.push(obj);
      }
      return arr;
    };
    var mapPointData = mapPoint();
    var myChart = echarts.init(document.getElementById('mapInner'));
    myChart.setOption(option, true);

    var allC = global.nums(11, '.allCollectionCont');
    var monthC = global.nums(11, '.MonthCollectionCont');
    var dayC = global.nums(11, '.dayCollectionCont');

    var func = function(data) {      
      data.collectionSumNum= data.collectionSumNum < 1 ? 1 : data.collectionSumNum;      
      allC.init((data.collectionSumNum).toFixed(0));
      monthC.init((data.collectionMonthNum).toFixed(0));
      dayC.init(data.collectionTodayNum);
    };
    var requAjax = function() {
      ZBase.CallServer.request("queryCollectorData", null, function(data) {
        if (data.code == '10001') {
          //window.localStorage.collection = data.data;
          func(data.data);
        } else {
          /*var data = JSON.parse(window.localStorage.collection);
          func(data);*/
          console.log('返回错误' + data.msg);
        }
      });
    };
    var timer;
    return {
      init: function() {
        requAjax();
        mapAjax();
        timer = setInterval(requAjax, 5000);
      },
      resetBrand: function() {
        clearInterval(timer);
        requAjax();
        mapAjax();
        timer = setInterval(requAjax, 5000);
      }
    };
  },

  /**
   * 今日报警分析
   * */
  alerm: function() {
    var option = {
      title: {
        text: '今日报警分析',
        x: 40,
        y: 10,
        textStyle: {
          color: '#fff',
          fontSize: '18'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        top: 'center',
        data: []
      },
      series: [{
        type: 'pie',
        radius: '60%',
        center: ['28%', '55%'],
        data: [],
        hoverOffset: 130,
        hoverAnimation: false,
        animationType: "scale",
        animationEasing: "elasticOut",
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          normal: {
            show: false
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        }
      }]
    };
    var requAjax = function() {
      ZBase.CallServer.request("queryAlarmData", null, function(data) {
        if (data.code == '10001') {
          var da = data.data;
          if (da) {
            //window.localStorage.alerm = JSON.stringify(da);
            func(da, true);
          } else {
            //var data = JSON.parse(window.localStorage.alerm);
            func(data, false);
          }
        }
      }, function() {
        var data = JSON.parse(window.localStorage.alerm);
        func(data, true);
      });
    };
    var myChart;
    var func = function(data, staues) {
      var count = [];
      var name = [];
      var colorArr = ['#ff1e78', '#ff74c5', '#00aeff', '#433be5', '#ff9600', '#219552', '#82ac31', '#fcff00'];
      if (staues) {
        var len = data.length;
        for (var i = 0; i < len; i++) {
          var p = data[i];
          var objName = {
            name: p.name,
            textStyle: { color: colorArr[i] }
          };
          var objCount = {
            value: p.alarm_counts,
            name: p.name,
            itemStyle: { normal: { color: colorArr[i] } }
          };
          name.push(objName);
          count.push(objCount);
          objName = null;
          objCount = null;
        }
      } else {
        var objName = {
          name: '暂无报警',
          textStyle: { color: colorArr[0] }
        };
        var objCount = {
          value: 0,
          name: '暂无报警',
          itemStyle: { normal: { color: colorArr[0] } }
        };
        name.push(objName);
        count.push(objCount);
      }
      option.legend.data = name;
      option.series[0].data = count;
      myChart.setOption(option, true);
    };

    var timer;
    var cleraTime = function() {
      clearInterval(timer);
    };
    return {
      init: function() {
        myChart = echarts.init(document.getElementById('alermInner'));
        myChart.setOption(option, true);
        requAjax();
        timer = setInterval(requAjax, 60 * 60 * 1000);
      },
      resetBrand: function() {
        cleraTime();
        requAjax();
        timer = setInterval(requAjax, 60 * 60 * 1000);
      }
    };
  },

  brand: function() {
    var $footerNav = $('.footerNav');
    var len = $footerNav.find('a').length;
    var _this = this;
    var navArr = ['monitor.html', 'index.html', 'addedValue.html'];
    $('.brandNav').on('click', 'a', function() {
      $('.brandName').html($(this).html());
      global.VehicleBrandID = $(this).attr('data-vehiclebrandid');
      for (var i = 0; i < len; i++) {
        var href = navArr[i] + '?brandId=' + global.VehicleBrandID;
        $footerNav.find('a').eq(i).attr('href', href);
      }
      /**不规范驾驶行为*/
      _this.drivingInit.resetBrand();

      /**本月故障码*/
      _this.faultInit.resetBrand();

      /**今日报警分析*/
      _this.alermInit.resetBrand();

      /**地图*/
      _this.collectionMap.resetBrand();

    });
  }
};