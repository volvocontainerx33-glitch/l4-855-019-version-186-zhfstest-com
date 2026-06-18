
(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 6200);
    }

    var input = document.getElementById("siteSearch");
    if (input) {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-filter") || "").toLowerCase();
          card.classList.toggle("hidden-card", q && text.indexOf(q) === -1);
        });
      });
    }
  });
})();

function initMoviePlayer(videoId, coverId, sourceUrl) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  if (!video || !sourceUrl) return;

  var attached = false;
  var hlsInstance = null;

  function attach() {
    if (attached) return;
    attached = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = sourceUrl;
    } else if (typeof Hls !== "undefined" && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }
  }

  function begin() {
    attach();
    if (cover) cover.classList.add("hidden");
    var action = video.play();
    if (action && typeof action.catch === "function") {
      action.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener("click", begin);
  }

  video.addEventListener("click", function () {
    if (!attached || video.paused) {
      begin();
    }
  });

  video.addEventListener("play", function () {
    if (cover) cover.classList.add("hidden");
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
