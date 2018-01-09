(function() {
  window.ZBase = window.ZBase || {};

  ZBase.Date = ZBase.Date || {};
  /*
      para:
        _date: date string, e.g. 2010-01-01 9:20:30 or 2010/01/01 9:20:30
        _format: format string, e.g. "yyyy-MM-dd HH:mm:ss"
      return
        string
  */
  ZBase.Date.getDateByFormat = function(_dateStr, _formatType, _ifSupplyZero) {
    _ifSupplyZero = _ifSupplyZero == undefined ? true : _ifSupplyZero;
    try {
      if (_dateStr == null || _dateStr === "") return "";
      var _dateObj = typeof _dateStr == "number" ? new Date(_dateStr) : typeof _dateStr == "string" ? new Date((_dateStr + "").replace(/-/g, "/")) : _dateStr,
        dateFormat = _formatType || "yyyy-MM-dd HH:mm:ss";

      dateFormat = dateFormat.replace("yyyy", _dateObj.getFullYear());
      var _month = _dateObj.getMonth() + 1,
        _day = _dateObj.getDate(),
        _hour = _dateObj.getHours(),
        _minute = _dateObj.getMinutes(),
        _second = _dateObj.getSeconds();
      dateFormat = dateFormat.replace("MM", _month > 9 ? _month : ((_ifSupplyZero ? "0" : "") + _month));
      dateFormat = dateFormat.replace("dd", _day > 9 ? _day : ((_ifSupplyZero ? "0" : "") + _day));
      dateFormat = dateFormat.replace("HH", _hour > 9 ? _hour : ((_ifSupplyZero ? "0" : "") + _hour));
      dateFormat = dateFormat.replace("mm", _minute > 9 ? _minute : ("0" + _minute));
      dateFormat = dateFormat.replace("ss", _second > 9 ? _second : ("0" + _second));

      return dateFormat;
    } catch (ex) {
      return _dateStr;
    }
  };
})();