(function() {
  window.ZE = window.ZE || [];
  var title = "平均耗电量";
  var unit = "度";
  //各品牌车辆运行平均情况Echart图
  ZE.push(function render(_result, _carBrandMap) {
    if (window.global.is_new_energy) {
      $("#powerByCarBrand").removeClass("hide");
    } else return;
    window.ZE.pipeFor_8_9_10_11("avgUnChargePowerData", "powerByCarBrand", _result, _carBrandMap, title, unit, function(){
      return document.documentElement.clientWidth >= 720 ? "7%" : '1%';
    }, function(_value){
      return _value;
    }, function(data){
      return data.numerator == null ? data.value : (data.denominator == 0 ? 0 : Math.round(data.numerator / data.denominator)); 
    });
  });
})();