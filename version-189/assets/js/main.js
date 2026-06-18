(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var navPanel = document.querySelector(".nav-panel");

    if (menuButton && navPanel) {
        menuButton.addEventListener("click", function () {
            var open = navPanel.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    document.querySelectorAll(".site-search-form").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (!input) {
                return;
            }
            var value = input.value.trim();
            if (value) {
                event.preventDefault();
                window.location.href = "./search.html?q=" + encodeURIComponent(value);
            }
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));

    if (slides.length > 1) {
        var current = 0;
        var showSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        };

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });

        window.setInterval(function () {
            showSlide(current + 1);
        }, 5800);
    }

    var catalogCards = Array.prototype.slice.call(document.querySelectorAll(".catalog-grid .movie-card"));
    var catalogSearch = document.querySelector(".catalog-search");
    var catalogType = document.querySelector(".catalog-type");
    var catalogRegion = document.querySelector(".catalog-region");
    var catalogYear = document.querySelector(".catalog-year");

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (catalogSearch && query) {
        catalogSearch.value = query;
    }

    var normalize = function (value) {
        return String(value || "").toLowerCase();
    };

    var filterCatalog = function () {
        if (!catalogCards.length) {
            return;
        }

        var q = normalize(catalogSearch ? catalogSearch.value : "");
        var type = normalize(catalogType ? catalogType.value : "");
        var region = normalize(catalogRegion ? catalogRegion.value : "");
        var year = normalize(catalogYear ? catalogYear.value : "");

        catalogCards.forEach(function (card) {
            var text = normalize(card.textContent + " " + card.dataset.title + " " + card.dataset.genre + " " + card.dataset.region + " " + card.dataset.type + " " + card.dataset.year);
            var cardType = normalize(card.dataset.type);
            var cardRegion = normalize(card.dataset.region);
            var cardYear = normalize(card.dataset.year);
            var matched = true;

            if (q && text.indexOf(q) === -1) {
                matched = false;
            }
            if (type && cardType !== type) {
                matched = false;
            }
            if (region && cardRegion !== region) {
                matched = false;
            }
            if (year && cardYear.indexOf(year) !== 0) {
                matched = false;
            }

            card.classList.toggle("is-hidden", !matched);
        });
    };

    [catalogSearch, catalogType, catalogRegion, catalogYear].forEach(function (control) {
        if (control) {
            control.addEventListener("input", filterCatalog);
            control.addEventListener("change", filterCatalog);
        }
    });

    filterCatalog();

    document.querySelectorAll(".player-shell").forEach(function (shell) {
        var video = shell.querySelector("video");
        var overlay = shell.querySelector(".player-overlay");
        var stream = video ? video.getAttribute("data-stream") : "";
        var ready = false;
        var hlsInstance = null;

        var setError = function () {
            shell.classList.add("player-error");
        };

        var loadStream = function () {
            if (!video || ready || !stream) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setError();
                    }
                });
                ready = true;
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                ready = true;
                return;
            }

            setError();
        };

        var playVideo = function () {
            loadStream();
            if (!video || shell.classList.contains("player-error")) {
                return;
            }
            video.controls = true;
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                });
            }
        };

        if (overlay) {
            overlay.addEventListener("click", playVideo);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    playVideo();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        }
    });
})();
