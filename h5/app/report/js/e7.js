(function() {
  window.ZE = window.ZE || [];
  //各品牌车辆运行平均情况Echart图
  ZE.push(function(_result, _carBrandMap) {

    var result = _result && _result.optionCarBrandRunInfo ? _result : {
      optionCarBrandRunInfo: {
        seriesMileAgeData: [],
        seriesRunTimeData: [],
        xAxisRunInfoData: [],
        markPointMileageData: [],
        markPointRunTimeData: [],
        OnlineData: [],
        totalJson: {
          AlarmNum: 0,
          CanNum: 0,
          LocationNum: 0,
          carNum: 0,
          mileAge: 0,
          runTime: 0,
          chargeCount: 0,
          chargePower: 0,
          unchargeCount: 0
        }
      }
    };
    var leisa = {
        seriesMileAgeData: 0,
        seriesRunTimeData: 0,
        markPointMileageData: 0,
        markPointRunTimeData: 0,
        OnlineData: 0
      },
      ci, has_leisa = false;

    for (var i = result.optionCarBrandRunInfo.xAxisRunInfoData.length - 1, ci; i >= 0; i--) {
      ci = result.optionCarBrandRunInfo.xAxisRunInfoData[i];
      if (!_carBrandMap[ci]) {
        if (_carBrandMap[window.global.SPEC_BRAND] && _carBrandMap[window.global.SPEC_BRAND][ci]) {
          has_leisa = true;
          leisa.seriesMileAgeData += result.optionCarBrandRunInfo.seriesMileAgeData[i];
          leisa.seriesRunTimeData += result.optionCarBrandRunInfo.seriesRunTimeData[i];
          leisa.OnlineData += result.optionCarBrandRunInfo.OnlineData[i][ci].carNum;
        }
        result.optionCarBrandRunInfo.xAxisRunInfoData.splice(i, 1);
        result.optionCarBrandRunInfo.seriesMileAgeData.splice(i, 1);
        result.optionCarBrandRunInfo.seriesRunTimeData.splice(i, 1);
        result.optionCarBrandRunInfo.markPointMileageData.splice(i, 1);
        result.optionCarBrandRunInfo.markPointRunTimeData.splice(i, 1);
        result.optionCarBrandRunInfo.OnlineData.splice(i, 1);
      } else {
        result.optionCarBrandRunInfo.xAxisRunInfoData[i] = _carBrandMap[ci];
        result.optionCarBrandRunInfo.markPointMileageData[i].xAxis = _carBrandMap[ci];
        result.optionCarBrandRunInfo.markPointRunTimeData[i].xAxis = _carBrandMap[ci];
        result.optionCarBrandRunInfo.OnlineData[i][_carBrandMap[ci]] = {
          name: _carBrandMap[ci],
          carNum: result.optionCarBrandRunInfo.OnlineData[i][ci].carNum,
          runTime: result.optionCarBrandRunInfo.OnlineData[i][ci].runTime,
          mileAge: result.optionCarBrandRunInfo.OnlineData[i][ci].mileAge
        };
        delete result.optionCarBrandRunInfo.OnlineData[i][ci];
      }
    }

    if (_carBrandMap[window.global.SPEC_BRAND] && has_leisa) {
      leisa.seriesMileAgeData = leisa.seriesMileAgeData;
      leisa.seriesRunTimeData = leisa.seriesRunTimeData;
      leisa.markPointMileageData = { yAxis: leisa.seriesMileAgeData, xAxis: window.global.SPEC_BRAND };
      leisa.markPointRunTimeData = { yAxis: leisa.seriesRunTimeData, xAxis: window.global.SPEC_BRAND };
      var tempnum = leisa.OnlineData;
      leisa.OnlineData = {};
      leisa.OnlineData[window.global.SPEC_BRAND] = {
        name: window.global.SPEC_BRAND,
        carNum: tempnum,
        runTime: leisa.seriesRunTimeData,
        mileAge: leisa.seriesMileAgeData
      };

      var index = result.optionCarBrandRunInfo.seriesMileAgeData.length;

      for (var i = 0; i < result.optionCarBrandRunInfo.seriesMileAgeData.length; i++) {
        if (result.optionCarBrandRunInfo.seriesMileAgeData[i] < leisa.seriesMileAgeData) {
          index = i;
          break;
        }
      }

      if (index == result.optionCarBrandRunInfo.seriesMileAgeData.length) {
        result.optionCarBrandRunInfo.xAxisRunInfoData.push(window.global.SPEC_BRAND);
        result.optionCarBrandRunInfo.seriesMileAgeData.push(leisa.seriesMileAgeData);
        result.optionCarBrandRunInfo.seriesRunTimeData.push(leisa.seriesRunTimeData);
        result.optionCarBrandRunInfo.markPointMileageData.push(leisa.markPointMileageData);
        result.optionCarBrandRunInfo.markPointRunTimeData.push(leisa.markPointRunTimeData);
        result.optionCarBrandRunInfo.OnlineData.push(leisa.OnlineData);
      } else {
        var temp = result.optionCarBrandRunInfo.xAxisRunInfoData.splice(i);
        result.optionCarBrandRunInfo.xAxisRunInfoData.push(window.global.SPEC_BRAND);
        result.optionCarBrandRunInfo.xAxisRunInfoData = result.optionCarBrandRunInfo.xAxisRunInfoData.concat(temp);

        temp = result.optionCarBrandRunInfo.seriesMileAgeData.splice(i);
        result.optionCarBrandRunInfo.seriesMileAgeData.push(leisa.seriesMileAgeData);
        result.optionCarBrandRunInfo.seriesMileAgeData = result.optionCarBrandRunInfo.seriesMileAgeData.concat(temp);

        temp = result.optionCarBrandRunInfo.seriesRunTimeData.splice(i);
        result.optionCarBrandRunInfo.seriesRunTimeData.push(leisa.seriesRunTimeData);
        result.optionCarBrandRunInfo.seriesRunTimeData = result.optionCarBrandRunInfo.seriesRunTimeData.concat(temp);

        temp = result.optionCarBrandRunInfo.markPointMileageData.splice(i);
        result.optionCarBrandRunInfo.markPointMileageData.push(leisa.markPointMileageData);
        result.optionCarBrandRunInfo.markPointMileageData = result.optionCarBrandRunInfo.markPointMileageData.concat(temp);

        temp = result.optionCarBrandRunInfo.markPointRunTimeData.splice(i);
        result.optionCarBrandRunInfo.markPointRunTimeData.push(leisa.markPointRunTimeData);
        result.optionCarBrandRunInfo.markPointRunTimeData = result.optionCarBrandRunInfo.markPointRunTimeData.concat(temp);

        temp = result.optionCarBrandRunInfo.OnlineData.splice(i);
        result.optionCarBrandRunInfo.OnlineData.push(leisa.OnlineData);
        result.optionCarBrandRunInfo.OnlineData = result.optionCarBrandRunInfo.OnlineData.concat(temp);
      }
    }


    if (!window.global.is_new_energy) {



    } else {

      $(".summary-board-wrap.new-energy").removeClass("hide");
      $("#sumPower").html(Math.round(result.optionCarBrandRunInfo.totalJson.chargePower / 10000));
      $("#chargeCount").html(Math.round(result.optionCarBrandRunInfo.totalJson.chargeCount / 10000));
      $("#dischargeCount").html(Math.round(result.optionCarBrandRunInfo.totalJson.unchargeCount / 10000));
    }

    $('#total').html(Math.round(result.optionCarBrandRunInfo.totalJson.carNum));
    $('#mileage').html(result.optionCarBrandRunInfo.totalJson.mileAge);
    $('#hours').html(result.optionCarBrandRunInfo.totalJson.runTime);
    $('#locationTotal').html(result.optionCarBrandRunInfo.totalJson.LocationNum);
    $('#canTotal').html(result.optionCarBrandRunInfo.totalJson.CanNum);

    var num = result.optionCarBrandRunInfo.totalJson.AlarmNum,
      unit = "条";

    if (num < 10000) {

    } else if (num >= 10000 && num < 100000000) {
      num = Math.round(num / 10000);
      unit = "万条";
    } else {
      num = Math.round(num / 100000000);
      unit = "亿条";
    }

    $('#alertTotal').html(num);
    $('.unit.alertTotal-unit').html(unit);


    var i = 0;
    var html = '<tr><th class = "sort-number">序号</th><th>品牌名称</th><th>车辆数</th><th>总运营里程<br/>(万公里) </th><th>总运营时长<br/>(万小时)</th>';
    $("#runInfo_list").html(html);
    $.each(result.optionCarBrandRunInfo.OnlineData, function(index, _OnlineData) {
      $.each(_OnlineData, function(key, value) {
        html += '<tr><td>' + (i + 1) + '</td>';
        html += '<td>' + key + '</td>';
        html += '<td class = "right">' + value.carNum + '</td>';
        html += '<td class = "right">' + value.mileAge + '</td>';
        html += '<td class = "right">' + value.runTime + '</td>';
      });
      i++;

    });
    $("#runInfo_list").html(html);
  });
})();