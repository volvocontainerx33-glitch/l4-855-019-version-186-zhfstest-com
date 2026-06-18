(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  onReady(function () {
    var header = document.querySelector("[data-site-header]");
    var toggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    function updateHeader() {
      if (!header) {
        return;
      }
      header.classList.toggle("is-scrolled", window.scrollY > 48);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (toggle && mobileNav && header) {
      toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
        header.classList.toggle("is-open", mobileNav.classList.contains("is-open"));
      });
    }

    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.classList.add("is-missing");
      });
    });

    setupCardFilter();
  });

  function setupCardFilter() {
    var input = document.querySelector("[data-card-filter]");
    var region = document.querySelector("[data-card-region]");
    var type = document.querySelector("[data-card-type]");
    var year = document.querySelector("[data-card-year]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-card]"));
    var count = document.querySelector("[data-visible-count]");

    if (!cards.length) {
      return;
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilter() {
      var keyword = normalize(input && input.value);
      var regionValue = region ? region.value : "";
      var typeValue = type ? type.value : "";
      var yearValue = year ? year.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var ok = true;

        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }
        if (regionValue && card.getAttribute("data-region") !== regionValue) {
          ok = false;
        }
        if (typeValue && card.getAttribute("data-type") !== typeValue) {
          ok = false;
        }
        if (yearValue && card.getAttribute("data-year") !== yearValue) {
          ok = false;
        }

        card.classList.toggle("is-hidden-card", !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    [input, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  }
})();
