(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var open = mobilePanel.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
            mobilePanel.setAttribute('aria-hidden', open ? 'false' : 'true');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var slideIndex = 0;

    function setSlide(next) {
        if (!slides.length) {
            return;
        }
        slideIndex = (next + slides.length) % slides.length;
        slides.forEach(function (slide, index) {
            slide.classList.toggle('active', index === slideIndex);
        });
        dots.forEach(function (dot, index) {
            dot.classList.toggle('active', index === slideIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            setSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            setSlide(slideIndex + 1);
        }, 5200);
    }

    function getParam(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || '';
    }

    var filterInput = document.querySelector('.js-filter-input');
    var filterYear = document.querySelector('.js-filter-year');
    var filterRegion = document.querySelector('.js-filter-region');
    var filterType = document.querySelector('.js-filter-type');
    var filterCategory = document.querySelector('.js-filter-category');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var emptyState = document.querySelector('.empty-state');

    function applyFilters() {
        if (!cards.length) {
            return;
        }
        var keyword = (filterInput && filterInput.value || '').trim().toLowerCase();
        var year = filterYear && filterYear.value || '';
        var region = filterRegion && filterRegion.value || '';
        var type = filterType && filterType.value || '';
        var category = filterCategory && filterCategory.value || '';
        var visible = 0;

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var ok = true;
            if (keyword && text.indexOf(keyword) === -1) {
                ok = false;
            }
            if (year && card.getAttribute('data-year') !== year) {
                ok = false;
            }
            if (region && card.getAttribute('data-region') !== region) {
                ok = false;
            }
            if (type && card.getAttribute('data-type') !== type) {
                ok = false;
            }
            if (category && card.getAttribute('data-category') !== category) {
                ok = false;
            }
            card.classList.toggle('hidden-by-filter', !ok);
            if (ok) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('show', visible === 0);
        }
    }

    if (filterInput) {
        var query = getParam('q');
        if (query) {
            filterInput.value = query;
        }
    }
    if (filterYear) {
        var yearParam = getParam('year');
        if (yearParam) {
            filterYear.value = yearParam;
        }
    }

    [filterInput, filterYear, filterRegion, filterType, filterCategory].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });
    applyFilters();

    var player = document.querySelector('.js-player');
    if (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('.play-button');
        var overlay = player.querySelector('.play-overlay');
        var message = player.querySelector('.player-message');
        var stream = player.getAttribute('data-stream');
        var ready = false;
        var started = false;

        function showMessage(text) {
            if (message) {
                message.textContent = text;
                message.classList.add('show');
            }
        }

        function prepare() {
            if (!video || ready || !stream) {
                return;
            }
            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage('暂时无法播放，请稍后再试');
                    }
                });
            } else {
                showMessage('暂时无法播放，请稍后再试');
            }
        }

        function startPlayback() {
            prepare();
            if (!video) {
                return;
            }
            var playPromise = video.play();
            started = true;
            if (overlay) {
                overlay.classList.add('hidden');
            }
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', startPlayback);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (!started || video.paused) {
                    startPlayback();
                } else {
                    video.pause();
                }
            });
            video.addEventListener('play', function () {
                if (overlay) {
                    overlay.classList.add('hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (overlay && !video.ended) {
                    overlay.classList.remove('hidden');
                }
            });
        }
    }
})();
