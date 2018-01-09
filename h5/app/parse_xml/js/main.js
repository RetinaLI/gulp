(function() {
  window.beforeStartLoad = function(callback) {
    callback();
  };
  window.initApp = function() {

    var $uploaf_file = $("#uploaf_file");
    var $a = $("a");

    $("#btn_export").click(function() {
      $a.attr("href", "");
      $a.hide();
      var data = new FormData();
      $.each($uploaf_file[0].files, function(i, file) {
        data.append('file-' + i, file);
      });
      $.ajax({
        url: 'http://localhost:9201/api/foton/tools/test-report-xml-to-excel',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function(data) {
          if(data.file) {
            $a.show().attr("href", data.file);
          }
        }
      });
    });
  };
})();