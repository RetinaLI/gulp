(function() {
  var d = 10000, swiper;
  window.moveSlider = function(_d) {
    if (_d > 100) {
      swiper.slidePrev();
    } else
      swiper.slideNext();
  };

  function changeBrandId(_brandId, _pathName, _brandName) {
    $("iframe[src!='" + _pathName + "']").each(function() {
      this.src = this.getAttribute("data-src") + "?brandId=" + _brandId;
    });
    var index = swiper.activeIndex;
    if (_brandName == "欧辉") {
      swiper.removeSlide(2);
      $('#addedPage').remove();
      // swiper.updatePagination();
      swiper.startAutoplay(d);
    } else if (_brandName != "欧辉" && swiper.slides.length == 4) {
      swiper.appendSlide('<div class="swiper-slide" ><iframe src="addedValue.html" data-src = "addedValue.html" id="addedPage" scrolling="no"></iframe></div> ');
      // swiper.updatePagination();
      swiper.startAutoplay(d);
    }
    swiper.slideTo(index);
  }
  // console.info("time", Number(global.getUrlParam("time")));
  setTimeout(function() {
    swiper = new Swiper('.swiper-container', {
      spaceBetween: 20,
      centeredSlides: true,
      autoplay: Number(global.getUrlParam("time")) || d,
      speed: 1000,
      autoplayDisableOnInteraction: false,
      pagination: '.swiper-pagination',
      paginationClickable: true,
      loop: true,
    });

  });

  $("iframe").each(function() {
    this.src = this.getAttribute("data-src");
  });

  window.changeBrandId = changeBrandId;
})();