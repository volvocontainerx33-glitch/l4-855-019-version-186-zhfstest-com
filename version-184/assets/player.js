function setupMoviePlayer(playbackUrl) {
  var video = document.getElementById("movie-player");
  var cover = document.querySelector(".player-cover");
  var started = false;
  var hlsInstance = null;

  if (!video || !cover || !playbackUrl) {
    return;
  }

  function begin() {
    if (!started) {
      started = true;
      video.controls = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playbackUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(playbackUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = playbackUrl;
      }
    }

    cover.classList.add("is-hidden");
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  cover.addEventListener("click", begin);

  video.addEventListener("click", function () {
    if (!started) {
      begin();
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
