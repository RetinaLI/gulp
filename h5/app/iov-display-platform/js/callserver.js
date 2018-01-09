(function() {

  var mode = "product";
  var SERVER_ORIGIN = mode == "develop" ? "" : "/"; //eg: http://ov.ifoton.com.cn/

  var brandMap = {},
    brandList = [];

  var drive_codes = {
    "急加速": -1,
    "急刹车": -1,
    "超长怠速": -1,
    "空挡滑行": -1,
    "猛踩油门": -1,
    "长时间刹车": -1,
    "停车立即熄火": -1,
    "冷车行驶": -1,
    "停车状态踩油门": -1,
    "粘离合": -1,
    "长时间刹车": -1,
    "长时间离合": -1
  };

  var fault_codes = {
    "点火时断电不稳定": -1,
    "催化剂罐液位传感器电压高": -1,
    "燃油增压泵总成1号电压高": -1,
    "催化剂罐温度不稳定": -1,
    "排放处理液压力传感器电压低": -1,
    "出口氮氧化物高": -1,
    "催化剂罐液位低": -1,
    "燃油含水指示器高": -1,
    "发动机曲轴转速/位置高": -1,
    "SCR催化剂罐加热器高": -1
  };

  var fault_warn_codes = {
    "疲劳驾驶预警": -1,
    "油温报警": -1,
    "超速预警": -1,
    "车辆非法点火": -1,
    "液压油位报警": -1,
    "低气压报警": -1,
    "总电压过低": -1,
    "滤油堵塞报警": -1
  };

  var cityMap = {
    "北京市": "北京",
    "新疆维吾尔自治区": "新疆",
    "重庆市": "重庆",
    "广东省": "广东",
    "浙江省": "浙江",
    "天津市": "天津",
    "广西壮族自治区": "广西",
    "内蒙古自治区": "内蒙古",
    "宁夏回族自治区": "宁夏",
    "江西省": "江西",
    "安徽省": "安徽",
    "贵州省": "贵州",
    "陕西省": "陕西",
    "辽宁省": "辽宁",
    "山西省": "山西",
    "青海省": "青海",
    "四川省": "四川",
    "江苏省": "江苏",
    "河北省": "河北",
    "西藏自治区": "西藏",
    "福建省": "福建",
    "吉林省": "吉林",
    "海南省": "海南",
    "上海市": "上海",
    "云南省": "云南",
    "湖北省": "湖北",
    "甘肃省": "甘肃",
    "湖南省": "湖南",
    "山东省": "山东",
    "河南省": "河南",
    "黑龙江省": "黑龙江",
    "澳门特别行政区": "澳门",
    "香港特别行政区": "香港",
  };

  var alarmCodeMap = {
  "电机控制器CAN通讯故障": "电机控制器通讯故障",
  "电机绕组温度传感器故障": "电机温度传感器故障",
  "电机控制器逆变器过温故障": "电机控制器逆变器故障",
  "电机控制器电机绕组过温故障": "电机绕组过温故障",
  "电机控制器超速故障": "电机控制器超速故障",
  "电机控制器过流故障": "电机控制器过流故障",
  "电机控制器过压故障": "电机控制器过压故障",
  "制动系统失效": "制动系统失效",
  "真空度低报警": "真空度低报警",
  "气泵故障等级": "气泵故障等级",
  "驾驶室未锁止状态": "驾驶室未锁止状态",
  "制动灯故障状态": "制动灯故障状态",
  "气压过低报警状态": "气压过低报警状态",
  "安全带状态": "安全带状态",
  "发动机黄色警告灯命令": "发动机黄色警告灯",
  "发动机红色警告灯命令": "发动机红色警告灯",
  "刹车片磨损": "刹车片磨损",
  "燃料指示器1中的水": "燃料指示器中的水",
  "安全带报警": "安全带报警",
  "驻车制动(手刹)": "驻车制动(手刹)",
  "空滤堵塞": "空滤堵塞",
  "驾驶室锁止": "驾驶室锁止",
  "轮间差速锁": "轮间差速锁",
  "轴间差速锁": "轴间差速锁",
  "取力器": "取力器",
  "超速报警": "超速报警",
  "油温报警": "油温报警",
  "GPS远程预锁机": "GPS远程预锁机",
  "档位不到位": "档位不到位",
  "GNSS天线短路": "GNSS天线短路",
  "RS232导出接口": "RS232导出接口",
  "摄像头2状态": "摄像头2状态",
  "终端主电源状态": "终端主电源状态",
  "GNSS天线状态": "GNSS天线状态",
  "高压互锁报警": "高压互锁报警",
  "第16箱连接故障": "第16箱连接故障",
  "第15箱连接故障": "第15箱连接故障",
  "第13箱连接故障": "第13箱连接故障",
  "第12箱连接故障": "第12箱连接故障",
  "SOC低报警(BMS)": "SOC低报警(BMS)",
  "第10箱连接故障": "第10箱连接故障",
  "第9箱连接故障": "第9箱连接故障",
  "第8箱连接故障": "第8箱连接故障",
  "第7箱连接故障": "第7箱连接故障",
  "第6箱连接故障": "第6箱连接故障",
  "第5箱连接故障": "第5箱连接故障",
  "第4箱连接故障": "第4箱连接故障",
  "第3箱连接故障": "第3箱连接故障",
  "第1箱连接故障": "第1箱连接故障",
  "温度不均衡": "温度不均衡",
  "电池单体一致性差报警": "电池单体一致性差",
  "单体电压过高": "单体电压过高",
  "第2箱连接故障": "第2箱连接故障",
  "单体蓄电池欠压报警": "单体电压过低",
  "SOC过高报警": "SOC过高报警",
  "充电过流": "充电过流",
  "SOC低报警": "SOC低报警",
  "单体电压不均衡报警": "单体电压不均衡报警",
  "温度差异报警": "温度差异报警",
  "单体过压报警": "单体过压报警",
  "单体欠压报警": "单体欠压报警",
  "充电过流报警": "充电过流报警",
  "车载储能装置类型过压报警": "储能装置类型过压",
  "车载储能装置类型欠压报警": "储能装置类型欠压",
  "充电储能系统不匹配报警": "充电储能系统不匹配",
  "终端主电源掉电": "终端主电源掉电",
  "疲劳驾驶报警": "疲劳驾驶报警",
  "超时停车": "超时停车",
  "紧急报警": "紧急报警",
  "GNSS天线未接或被剪断": "GNSS天线未接",
  "终端主电源欠压": "终端主电源欠压",
  "绝缘报警": "绝缘报警",
  "车辆非法点火": "车辆非法点火",
  "当天累计驾驶超时报警": "累计驾驶超时报警",
  "疲劳驾驶预警": "疲劳驾驶预警",
  "超速预警": "超速预警",
  "侧翻报警": "侧翻报警",
  "碰撞报警": "碰撞报警",
  "车辆非法位移": "车辆非法位移",
  "油泵DC/AC故障": "油泵DC/AC故障",
  "电机及控制器故障": "电机及控制器故障",
  "驱动电机温度报警": "驱动电机温度报警",
  "车载储能装置类型过充报警": "储能装置类型过充",
  "电机控制器温度报警": "电机控制器温度报警",
  "SOC跳变报警": "SOC跳变报警",
  "空滤阻塞报警": "空滤阻塞报警",
  "DC/DC状态报警": "DC/DC状态报警",
  "DC/DC温度报警": "DC/DC温度报警",
  "整车系统故障": "整车系统故障",
  "制动系统报警": "制动系统报警",
  "低气压报警": "低气压报警",
  "电机及MCU系统故障": "电机及MCU系统故障",
  "BMS系统故障": "BMS系统故障",
  "整车绝缘故障": "整车绝缘故障",
  "中桥制动气压报警": "中桥制动气压报警",
  "前桥制动气压报警": "前桥制动气压报警",
  "后桥制动气压报警": "后桥制动气压报警",
  "门泵应急阀开关报警": "门泵应急阀开关报警",
  "低水位报警": "低水位报警",
  "发动机冷却液温度报警": "发动机冷却液温度报警",
  "机油压力报警信号": "机油压力报警信号"
};

  var storage = {};

  var beforeCallBack = function(_hasData, _result, _cbFn, _action, _token) {
    var key = _action + "-" + _token;    
    if (_hasData) {
      if (_action == "queryHotData") {
        storage[key] = _result;
      } else if (window.localStorage) {
        try {
          window.localStorage.setItem(key, JSON.stringify(_result));
        } catch (ex) {
          storage[key] = _result;
        }
      }
      _cbFn(_result);
    } else {
      if (_action == "queryHotData" && !storage[key] || !window.localStorage && !storage[key]) return _cbFn(_result);
      var result = _action == "queryHotData" ? storage[key] : (window.localStorage.getItem(key) || storage[key]);

      if (result) {
        result = JSON.parse(result);
        _cbFn(result);
      } else {
        _cbFn(_result);
      }
    }
  };

  var SERVER_ROUTES = {
    "queryVehicleBand": ["display/user/getBrands.json", "get", function(result, next, action, token) {
      var is_addedValue = document.location.pathname.indexOf("/addedValue.html") > -1;
      brandList = result || [];
      var temp = [];
      for (var i = 0; i < brandList.length; i++) {
        if (brandList[i].name == "全部") {
          brandMap["All"] = brandList[i].token;
        } else {
          brandMap[i] = brandList[i].token;

          if (brandList[i].name == "福田戴姆勒")
            brandList[i].name = "欧曼";

          if (is_addedValue && brandList[i].name == "欧辉") continue;
          
          temp.push({
            id: i,
            code: i,
            name: brandList[i].name
          });
        }
      }

      beforeCallBack(temp.length > 0, {
        code: '10001',
        data: temp
      }, next, action, token);
    }],
    /*****index******/
    //车辆总数、在线数、今日注册数
    "querySummary": ["display/car/amount.json", "get", function(result, next, action, token) {

      result.data = {
        regTerminalCount: result.data.ALLNUM,
        onlineVehicleCount: result.data.ONLINENUM,
        dayRegTerminalCount: result.data.dayRegTerminalCount
      };

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //获取车辆分布
    "queryVehicleData": ["display/car/distribute.json", "get", function(result, next, action, token) {
      for (var map in result.data.province) {
        for (var p in result.data.province[map]) {
          result.data.province[map][cityMap[p]] = result.data.province[map][p];
          delete result.data.province[map][p];
        }
      }
      for (var map in result.data.city) {
        for (var p in result.data.city[map]) {
          result.data.city[map][cityMap[p]] = result.data.city[map][p];

          if (cityMap[p] === "澳门") {
            if (result.data.city[map][cityMap[p]]["路氹城"]) {
              continue;
            } else {
              result.data.city[map][cityMap[p]]["路氹城"] = (result.data.city[map][cityMap[p]]["路环"] || 0) + (result.data.city[map][cityMap[p]]["氹仔"] || 0);
            }
          }

          delete result.data.city[map][p];
        }
      }
      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //实时在线
    "queryVehicleRealData": ["display/car/online.json", "get", function(result, next, action, token) {
      result.code = 10001;

      for (var i = 0, ci; i < result.data.length; i++) {
        ci = result.data[i];
        result.data[i] = {
          runCount: ci.runCount || 0,
          stopCount: ci.stopCount || 0,
          count: ((ci.runCount || 0) + (ci.stopCount || 0)) || ci.COUNT,
          Hours: ci.hour || ci.HOURS
        };
      }

      result.data.reverse();
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //月注册
    "queryVehicleMonthData": ["display/car/monthRegister.json", "get", function(result, next, action, token) {
      var temp = [];

      for (var month in result.data) {
        var m = Number(month.replace("-", ""));
        if (m < 201707) continue;
        temp.push({
          opmonth: month,
          month: m,
          month_add_vehicle: result.data[month]
        });
      }

      temp.sort(function(a, b) { return a.month - b.month; });

      result.data = temp;

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],

    /*****monitor******/
    //欧辉故障预警
    "queryFaultWarnData": ["display/analysis/monthFaultWarn.json", "get", function(result, next, action, token) {
      var necessaries = [],
        temp = [];

      for (var i = 0, ci; i < result.data.length; i++) {
        ci = result.data[i];
        ci.name = ci.name.replace(/\s+/g, "");
        // console.info("'" + ci.name + "'", fault_warn_codes[ci.name]);
        if (fault_warn_codes[ci.name]) {
          necessaries.push({
            fault_id: ci.code,
            name: ci.name,
            fault_counts: ci.count
          });
        } else {
          temp.push({
            fault_id: ci.code,
            name: ci.name,
            fault_counts: ci.count
          });
        }

      }
      temp.sort(function(a, b) { return b.fault_counts - a.fault_counts; });

      if (necessaries.length < 8) {
        var len = 8 - necessaries.length;
        for (var j = 0; j < len; j++) {
          ci = temp[j];

          if (necessaries.length === 8 || !ci) break;

          necessaries.push(ci);
        }
      }

      necessaries.sort(function(a, b) { return a.name.length - b.name.length; });
      result.data = necessaries;

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //月故障码
    "queryFaultData": ["display/analysis/monthFault.json", "get", function(result, next, action, token) {
      var temp = [];
      var faultDataMap = {
        "点火时断电不稳定": "点火断电不稳定",
        "催化剂罐液位传感器电压高": "尿素传感器电压高",
        "燃油增压泵总成1号电压高": "燃油增压泵电压高",
        "催化剂罐温度不稳定": "尿素箱温度不稳",
        "排放处理液压力传感器电压低": "尿素传感器电压低",
        "出口氮氧化物高": "出口氮氧高",
        "催化剂罐液位低": "尿素液位低",
        "燃油含水指示器高": "燃油含水指示高",
        "SCR催化剂罐加热器高": "尿素加热器电压高",
        "发动机曲轴转速/位置高": "曲轴转速电压高",
      };

      var nameArr = [];

      for (var i = 0, ci; i < result.data.length; i++) {
        ci = result.data[i];
        if (!fault_codes[ci.name]) continue;
        temp.push({
          fault_id: ci.code,
          name: faultDataMap[ci.name],
          fault_counts: ci.count
        });
      }
      temp.sort(function(a, b) { return a.name.length - b.name.length; });

      result.data = temp;

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //今日报警
    "queryAlarmData": ["display/analysis/dayAlarm.json", "get", function(result, next, action, token) {

      var temp = [];

      for (var i = 0, ci; i < result.data.length; i++) {
        ci = result.data[i];
        ci.alarmName = ci.alarmName.replace(/\s/g, "");

        if(!alarmCodeMap[ci.alarmName]) continue;

        temp.push({
          alarmkind_id: i + 1,
          name: alarmCodeMap[ci.alarmName],
          alarm_counts: ci.alarmCount
        });
      }

      temp.splice(8);
      temp.sort(function(a, b) { return b.name.length - a.name.length; });
      result.data = temp;

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //数据量
    "queryCollectorData": ["display/analysis/dataAmount.json", "get", function(result, next, action, token) {
      var temp = {};
      temp.data = result;
      temp.code = 10001;
      beforeCallBack(!!temp.data, temp, next, action, token);
    }],
    //月不良驾驶
    "queryDriverData": ["display/analysis/monthBehavior.json", "get", function(result, next, action, token) {

      var temp = [];

      for (var i = 0, ci; i < result.data.length; i++) {
        ci = result.data[i];
        if (!drive_codes[ci.name]) continue;

        temp.push({
          indicatior_id: ci.type,
          drvb_counts: ci.count,
          name: ci.name
        });
      }

      result.data = temp;

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],

    /*****addedValue******/
    //经销商
    "queryDealerData": ["display/dealer/list.json", "get", function(result, next, action, token) {
      result.code = 10001;

      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //服务商
    "queryServiceStationData": ["display/servicer/list.json", "get", function(result, next, action, token) {
      result.code = 10001;

      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //车位置列表
    "queryHotData": ["display/car/locList.json", "get", function(result, next, action, token) {
      result.data = result.data || [];

      if (result.data.length < 2000) {
        for (var i = 0, ci; i < result.data.length; i++) {
          ci = result.data[i];
          // ci.hot_value = 500000;
          ci.count = ci.hot_value;
        }
      }

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //车辆运行数据
    "queryMileageTimeData": ["display/analysis/runSummary.json", "get", function(result, next, action, token) {
      result.data.run_time = result.data.run_Time;

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //行驶分析
    "queryVehicleDriveData": ["display/analysis/runAnalysis.json", "get", function(result, next, action, token) {
      for (var k in result.data) {
        for (var i = 0; i < result.data[k].length; i++) {
          result.data[k][i].to_day = result.data[k][i].today;
          result.data[k][i].run_time = result.data[k][i].runtime;
          result.data[k][i].mileage = (Number(result.data[k][i].mileage) || 0).toFixed(1);
        }
      }
      result.data.CommVehicle = result.data.CommVehicle || [];
      result.data.PassVehicle = result.data.PassVehicle || [];
      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //车速分析
    "queryAvgSpeedData": ["display/analysis/runVelocity.json", "get", function(result, next, action, token) {
      for (var k in result.data) {
        for (var i = 0; i < result.data[k].length; i++) {
          result.data[k][i].to_day = result.data[k][i].today;
          result.data[k][i].AvgSpeed = result.data[k][i].avgSpeed;
        }

        result.data[k] = result.data[k].splice(-12);
      }

      result.data.CommVehicle = result.data.CommVehicle || [];
      result.data.PassVehicle = result.data.PassVehicle || [];

      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    //欧辉monitor.html页面获取形式分析接口，不显示驾驶行为
    "queryDriveAnasyle": ["display/analysis/runAnalysis.json", "get", function(result, next, action, token) {
      var k = "CommVehicle";
      var mileage = [];
      var runtime = [];
      for (var i = 0; i < result.data[k].length; i++) {
        result.data[k][i].to_day = result.data[k][i].today;
        result.data[k][i].run_time = result.data[k][i].runtime;
        result.data[k][i].mileage = Number((Number(result.data[k][i].mileage) || 0).toFixed(1));

        mileage.push({
          average: result.data[k][i].mileage,
          to_day: result.data[k][i].to_day
        });
        runtime.push({
          average: result.data[k][i].runtime,
          to_day: result.data[k][i].to_day
        });
      }
      mileage = mileage.slice(-10);
      runtime = runtime.slice(-10);
      result.data.mileage = mileage;
      result.data.runtime = runtime;
      result.code = 10001;
      beforeCallBack(!!result.data, result, next, action, token);
    }],
    "queryStockStateData": ["displayHall/index/queryStockStateData.html", "get", function(result, next, action, token) {
      result.code = 10001;

      beforeCallBack(!!result.data, result, next, action, token);
    }],
  };


  window.ZBase = window.ZBase || {};
  window.ZBase.CallServer = {
    request: function(_action, _params, _successFn, _errorFn) {
      var actionCfg = SERVER_ROUTES[_action];

      if (!actionCfg) {
        throw "没有该配置：" + _action;
      }
      
      var token = brandMap[global.VehicleBrandID];

      if (document.location.pathname.indexOf("monitor.html") > -1 && _action === "queryVehicleData") {
        token = brandMap["All"];
      }

      var url = SERVER_ORIGIN + actionCfg[0] + (_action != "queryVehicleBand" ? "?token=" + token : "");
      $.ajax({
        type: actionCfg[1],
        dataType: 'json',
        url: url,
        success: function(result) {
          actionCfg[2](result, _successFn, _action, token);
        },
        error: function() {
          console.info("请求失败：" + url);
          actionCfg[2]({}, _successFn, _action, token);
          // _errorFn && _errorFn();
        }
      });
    }
  };

  window.ZBase.Brand = {
    get: function(_id) {
      var token = brandMap[_id];
      for (var i = 0; i < brandList.length; i++) {
        if (brandList[i].token === token) {
          return brandList[i].name;
        }
      }
    }
  };

})();