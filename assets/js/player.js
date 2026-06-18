(function () {
  window.initMoviePlayer = function (source) {
    var video = document.getElementById("movieVideo");
    var cover = document.querySelector(".player-cover");
    var ready = false;

    function attach() {
      if (!video || ready) {
        return;
      }
      ready = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      attach();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      if (video) {
        video.setAttribute("controls", "controls");
        var request = video.play();
        if (request && request.catch) {
          request.catch(function () {});
        }
      }
    }

    if (cover) {
      cover.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
    }
  };
})();
