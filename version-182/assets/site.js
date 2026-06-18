(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-site-nav]");

    if (menuButton && nav) {
        menuButton.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                showSlide(i);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }
    }

    var searchInput = document.querySelector("[data-search-input]");
    var yearFilter = document.querySelector("[data-year-filter]");
    var categoryFilter = document.querySelector("[data-category-filter]");
    var filterCards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-card]"));

    function applyFilters() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var year = yearFilter ? yearFilter.value : "";
        var category = categoryFilter ? categoryFilter.value : "";

        filterCards.forEach(function (card) {
            var text = (card.getAttribute("data-search") || "").toLowerCase();
            var cardYear = card.getAttribute("data-year") || "";
            var cardCategory = card.getAttribute("data-category") || "";
            var visible = true;

            if (query && text.indexOf(query) === -1) {
                visible = false;
            }

            if (year && cardYear !== year) {
                visible = false;
            }

            if (category && cardCategory !== category) {
                visible = false;
            }

            card.classList.toggle("is-filtered-out", !visible);
        });
    }

    if (filterCards.length) {
        [searchInput, yearFilter, categoryFilter].forEach(function (item) {
            if (item) {
                item.addEventListener("input", applyFilters);
                item.addEventListener("change", applyFilters);
            }
        });
    }

    var playerBox = document.querySelector("[data-player]");

    if (playerBox) {
        var video = playerBox.querySelector("video");
        var startButton = playerBox.querySelector("[data-player-start]");
        var stream = playerBox.getAttribute("data-stream");
        var ready = false;
        var hlsInstance = null;

        function prepareVideo() {
            if (!video || !stream || ready) {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }

            ready = true;
        }

        function beginPlay() {
            prepareVideo();
            if (startButton) {
                startButton.classList.add("is-hidden");
            }
            var playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {});
            }
        }

        if (startButton && video) {
            startButton.addEventListener("click", beginPlay);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    beginPlay();
                }
            });
            video.addEventListener("play", function () {
                if (startButton) {
                    startButton.classList.add("is-hidden");
                }
            });
        }

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
