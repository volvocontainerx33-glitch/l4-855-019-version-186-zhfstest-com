(function() {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function setupHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) {
      return;
    }
    function updateHeader() {
      if (window.scrollY > 18) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    var toggle = document.querySelector('[data-menu-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function() {
        header.classList.toggle('menu-open');
      });
    }
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function start() {
      timer = window.setInterval(function() {
        show(active + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var index = Number(dot.getAttribute('data-hero-dot')) || 0;
        show(index);
        restart();
      });
    });

    start();
  }

  function setupFilters() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-filter-section]'));
    sections.forEach(function(section) {
      var input = section.querySelector('.filter-input');
      var yearSelect = section.querySelector('.filter-year');
      var typeSelect = section.querySelector('.filter-type');
      var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-card'));

      if (yearSelect && yearSelect.options.length <= 1) {
        var years = [];
        cards.forEach(function(card) {
          var year = card.getAttribute('data-year');
          if (year && years.indexOf(year) === -1) {
            years.push(year);
          }
        });
        years.sort().reverse().forEach(function(year) {
          var option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
        });
      }

      if (typeSelect && typeSelect.options.length <= 1) {
        var types = [];
        cards.forEach(function(card) {
          var type = card.getAttribute('data-type');
          if (type && types.indexOf(type) === -1) {
            types.push(type);
          }
        });
        types.sort().forEach(function(type) {
          var option = document.createElement('option');
          option.value = type;
          option.textContent = type;
          typeSelect.appendChild(option);
        });
      }

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        cards.forEach(function(card) {
          var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-region'),
            card.getAttribute('data-year'),
            card.getAttribute('data-type')
          ].join(' ').toLowerCase();
          var matched = true;
          if (query && haystack.indexOf(query) === -1) {
            matched = false;
          }
          if (year && card.getAttribute('data-year') !== year) {
            matched = false;
          }
          if (type && card.getAttribute('data-type') !== type) {
            matched = false;
          }
          card.classList.toggle('is-filter-hidden', !matched);
        });
      }

      [input, yearSelect, typeSelect].forEach(function(control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  }

  function movieCard(movie) {
    var tags = [movie.type, movie.region, movie.year].concat(movie.tags.slice(0, 3));
    var chips = tags.map(function(tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '<a class="poster-frame" href="' + escapeHtml(movie.url) + '">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" decoding="async">',
      '<span class="poster-gradient"></span>',
      '<span class="play-badge">▶</span>',
      '</a>',
      '<div class="movie-info">',
      '<div class="movie-chips">' + chips + '</div>',
      '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupSearchPage() {
    var results = document.getElementById('searchResults');
    var input = document.getElementById('searchInput');
    var form = document.getElementById('searchForm');
    if (!results || !input || !window.SEARCH_MOVIES) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    input.value = initial;

    function render(query) {
      var normalized = query.trim().toLowerCase();
      var list = window.SEARCH_MOVIES;
      if (normalized) {
        list = list.filter(function(movie) {
          return movie.searchText.indexOf(normalized) !== -1;
        });
      } else {
        list = list.slice(0, 36);
      }
      results.innerHTML = list.map(movieCard).join('');
    }

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var query = input.value.trim();
      var url = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
      window.history.replaceState(null, '', url);
      render(query);
    });

    input.addEventListener('input', function() {
      render(input.value);
    });

    render(initial);
  }

  ready(function() {
    setupHeader();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
}());
