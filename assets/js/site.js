document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var menu = document.querySelector(".menu-toggle");
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var active = 0;

  function setHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 18) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === active);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === active);
    });
  }

  function filterCards(root, query) {
    var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card"));
    var text = String(query || "").trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var haystack = String(card.getAttribute("data-search") || card.textContent || "").toLowerCase();
      var matched = !text || haystack.indexOf(text) !== -1;
      card.style.display = matched ? "" : "none";
      if (matched) {
        shown += 1;
      }
    });
    var empty = root.querySelector(".empty-result");
    if (empty) {
      empty.style.display = shown ? "none" : "block";
    }
  }

  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  if (menu) {
    menu.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  }

  if (slides.length) {
    showSlide(0);
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });
    window.setInterval(function () {
      showSlide(active + 1);
    }, 5600);
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-local-filter]")).forEach(function (form) {
    var scope = document.querySelector(form.getAttribute("data-local-filter")) || document;
    var input = form.querySelector("input");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      filterCards(scope, input ? input.value : "");
    });
    if (input) {
      input.addEventListener("input", function () {
        filterCards(scope, input.value);
      });
    }
  });

  if (document.body.classList.contains("search-page")) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    var searchInput = document.querySelector(".search-main-input");
    if (searchInput) {
      searchInput.value = q;
      filterCards(document, q);
      searchInput.addEventListener("input", function () {
        filterCards(document, searchInput.value);
      });
    }
  }
});
