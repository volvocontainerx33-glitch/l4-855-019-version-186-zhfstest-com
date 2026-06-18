(function () {
  var video = document.getElementById('moviePlayer');
  var button = document.querySelector('[data-play-button]');

  if (!video || !button) {
    return;
  }

  var stream = video.getAttribute('data-stream');
  var prepared = false;
  var hls = null;

  function prepare() {
    if (prepared || !stream) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      return;
    }

    video.src = stream;
  }

  function play() {
    prepare();
    button.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  button.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
