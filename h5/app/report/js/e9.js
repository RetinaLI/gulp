(function() {
  window.ZE = window.ZE || [];
  var title = "平均时长";
  var unit = "小时";
  //各品牌车辆运行平均情况Echart图
  ZE.push(function render(_result, _carBrandMap) {
    window.ZE.pipeFor_8_9_10_11("avgWorkTimeData", "hourByCarBrand", _result, _carBrandMap, title, unit, function(){
      return document.documentElement.clientWidth >= 720 ? "7%" : '1%';
    }, function(_value){
      _value = _value || 0;
      return (_value / 60 / 60).toFixed(5);
    }, function(data){
      return data.numerator == null ? data.value : (data.denominator == 0 ? 0 : Math.round(data.numerator / data.denominator)); 
    });
  });
})();