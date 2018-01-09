(function() {
  window.ZE = window.ZE || [];
  var title = "平均里程";
  var unit = "KM";
  //各品牌车辆运行平均情况Echart图
  ZE.push(function render(_result, _carBrandMap) {
    window.ZE.pipeFor_8_9_10_11("avgMileageData", "mileageByCarBrand", _result, _carBrandMap, title, unit, function(){
      return document.documentElement.clientWidth >= 720 ? "7%" : '1%';
    }, function(_value){
      return _value / 1000;
    }, function(data){
      return data.numerator == null ? data.value : (data.denominator == 0 ? 0 : Math.round(data.numerator / data.denominator)); 
    });
  });
})();