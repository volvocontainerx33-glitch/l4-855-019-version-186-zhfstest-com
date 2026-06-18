document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
  }

  var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var heroIndex = 0;

  function showHero(index) {
    if (!heroSlides.length) {
      return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === heroIndex);
    });

    heroDots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === heroIndex);
    });
  }

  heroDots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showHero(dotIndex);
    });
  });

  if (heroSlides.length > 1) {
    window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  var filterRoots = Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]"));

  filterRoots.forEach(function (root) {
    var input = root.querySelector("[data-filter-input]");
    var yearSelect = root.querySelector("[data-filter-year]");
    var regionSelect = root.querySelector("[data-filter-region]");
    var clearButton = root.querySelector("[data-filter-clear]");
    var status = root.querySelector("[data-filter-status]");
    var scope = root.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .compact-link"));
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (input && query) {
      input.value = query;
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function cardText(card) {
      return normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.year,
        card.dataset.type,
        card.dataset.category,
        card.dataset.tags,
        card.textContent
      ].join(" "));
    }

    function applyFilter() {
      var keyword = input ? normalize(input.value) : "";
      var year = yearSelect ? normalize(yearSelect.value) : "";
      var region = regionSelect ? normalize(regionSelect.value) : "";
      var visible = 0;

      cards.forEach(function (card) {
        var matchedKeyword = !keyword || cardText(card).indexOf(keyword) !== -1;
        var matchedYear = !year || normalize(card.dataset.year) === year;
        var matchedRegion = !region || normalize(card.dataset.region) === region;
        var matched = matchedKeyword && matchedYear && matchedRegion;

        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (status) {
        status.textContent = visible ? "已显示 " + visible + " 部影片" : "没有匹配的影片";
      }
    }

    [input, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        if (yearSelect) {
          yearSelect.value = "";
        }
        if (regionSelect) {
          regionSelect.value = "";
        }
        applyFilter();
      });
    }

    applyFilter();
  });
});
