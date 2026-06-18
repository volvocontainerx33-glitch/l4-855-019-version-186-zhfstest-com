(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

    players.forEach(function (player) {
        var video = player.querySelector("video");
        var cover = player.querySelector(".player-cover");

        if (!video || !cover) {
            return;
        }

        var stream = video.getAttribute("data-stream");
        var started = false;

        function attachAndPlay() {
            if (!stream) {
                return;
            }

            cover.classList.add("is-hidden");

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (!video.getAttribute("src")) {
                    video.setAttribute("src", stream);
                }

                video.play();
                started = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!video._hlsInstance) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });

                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play();
                    });
                    video._hlsInstance = hls;
                } else {
                    video.play();
                }

                started = true;
                return;
            }

            if (!video.getAttribute("src")) {
                video.setAttribute("src", stream);
            }

            video.play();
            started = true;
        }

        cover.addEventListener("click", attachAndPlay);

        video.addEventListener("click", function () {
            if (!started || video.paused) {
                attachAndPlay();
            }
        });

        video.addEventListener("play", function () {
            cover.classList.add("is-hidden");
        });
    });
})();
