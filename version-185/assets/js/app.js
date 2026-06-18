(function () {
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-site-nav]');

  function syncHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
  forms.forEach(function (form) {
    var input = form.querySelector('[data-search-box]');
    var scope = document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = scope.querySelector('[data-empty-state]');

    function filterCards() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var shown = 0;
      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || card.textContent.toLowerCase();
        var matched = !keyword || text.indexOf(keyword) !== -1;
        card.hidden = !matched;
        if (matched) {
          shown += 1;
        }
      });
      if (empty) {
        empty.hidden = shown !== 0;
      }
    }

    if (input) {
      input.addEventListener('input', filterCards);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      filterCards();
    });
  });
})();
