(function() {
  window.ZE = window.ZE || [];
  var title = "平均运营率";
  var unit = "%";
  //各品牌车辆运行平均情况Echart图
  ZE.push(function render(_result, _carBrandMap) {

    window.ZE.pipeFor_8_9_10_11("avgWorkRateData", "rateByCarBrand", _result, _carBrandMap, title, unit, function(){
      return document.documentElement.clientWidth >= 720 ? "7%" : '4%';
    }, function(_value){
      return _value;
    }, function(data){
      return data.numerator == null ? data.value : (data.denominator == 0 ? 0 : Math.round(data.numerator / data.denominator * 100)); 
    });
  });
})();