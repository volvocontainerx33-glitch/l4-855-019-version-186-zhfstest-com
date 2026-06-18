(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var navLinks = document.querySelector("[data-nav-links]");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", function () {
            navLinks.classList.toggle("is-open");
        });
    }

    var carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 6200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(index + 1);
                restart();
            });
        }

        restart();
    }

    var filterForm = document.querySelector("[data-filter-form]");

    if (filterForm) {
        var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-card"));
        var emptyState = document.querySelector("[data-empty-state]");

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilter() {
            var query = normalize(filterForm.q && filterForm.q.value);
            var year = normalize(filterForm.year && filterForm.year.value);
            var type = normalize(filterForm.type && filterForm.type.value);
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.genre,
                    card.dataset.year
                ].join(" "));
                var cardYear = normalize(card.dataset.year);
                var cardType = normalize(card.dataset.type);
                var matched = true;

                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }

                if (year && cardYear !== year) {
                    matched = false;
                }

                if (type && cardType !== type) {
                    matched = false;
                }

                card.classList.toggle("is-hidden", !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        }

        filterForm.addEventListener("input", applyFilter);
        filterForm.addEventListener("change", applyFilter);
        applyFilter();
    }
})();
