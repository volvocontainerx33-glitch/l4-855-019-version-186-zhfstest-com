(function () {
  var state = {
    keyword: "",
    region: "",
    type: "",
    year: "",
    visibleLimit: 60
  };

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function optionList(values) {
    return values.map(function (value) {
      return '<option value="' + escapeHtml(value) + '">' + escapeHtml(value) + '</option>';
    }).join("");
  }

  function uniqueSorted(items, key, reverse) {
    var seen = Object.create(null);
    var values = [];
    items.forEach(function (item) {
      var value = item[key];
      if (value && !seen[value]) {
        seen[value] = true;
        values.push(value);
      }
    });
    values.sort();
    if (reverse) {
      values.reverse();
    }
    return values;
  }

  function movieCard(movie) {
    var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, (movie.tags || []).join(" ")].join(" ");
    return '' +
      '<a class="movie-card compact" href="' + escapeHtml(movie.url) + '" data-search="' + escapeHtml(text.toLowerCase()) + '">' +
      '  <figure class="poster-frame">' +
      '    <span class="poster-fallback">' + escapeHtml(movie.title) + '</span>' +
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '    <span class="type-badge">' + escapeHtml(movie.type) + '</span>' +
      '    <span class="play-badge" aria-hidden="true">▶</span>' +
      '  </figure>' +
      '  <div class="card-body">' +
      '    <h3>' + escapeHtml(movie.title) + '</h3>' +
      '    <p class="card-meta">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.genre) + '</p>' +
      '    <p class="card-summary">' + escapeHtml(movie.oneLine) + '</p>' +
      '  </div>' +
      '</a>';
  }

  function getFiltered(items) {
    var keyword = normalize(state.keyword);
    return items.filter(function (movie) {
      var text = normalize([movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, (movie.tags || []).join(" ")].join(" "));
      if (keyword && text.indexOf(keyword) === -1) {
        return false;
      }
      if (state.region && movie.region !== state.region) {
        return false;
      }
      if (state.type && movie.type !== state.type) {
        return false;
      }
      if (state.year && movie.year !== state.year) {
        return false;
      }
      return true;
    });
  }

  function render(items, results, count, loadMore) {
    var filtered = getFiltered(items);
    var visible = filtered.slice(0, state.visibleLimit);
    results.innerHTML = visible.map(movieCard).join("");
    count.textContent = String(filtered.length);
    loadMore.style.display = filtered.length > state.visibleLimit ? "inline-flex" : "none";

    results.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.classList.add("is-missing");
      });
    });
  }

  onReady(function () {
    var items = window.MOVIE_INDEX || [];
    var input = document.querySelector("[data-search-input]");
    var region = document.querySelector("[data-search-region]");
    var type = document.querySelector("[data-search-type]");
    var year = document.querySelector("[data-search-year]");
    var results = document.querySelector("[data-search-results]");
    var count = document.querySelector("[data-search-count]");
    var loadMore = document.querySelector("[data-load-more]");

    if (!results || !count || !loadMore) {
      return;
    }

    region.insertAdjacentHTML("beforeend", optionList(uniqueSorted(items, "region")));
    type.insertAdjacentHTML("beforeend", optionList(uniqueSorted(items, "type")));
    year.insertAdjacentHTML("beforeend", optionList(uniqueSorted(items, "year", true)));

    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
      state.keyword = params.get("q");
      input.value = state.keyword;
    }

    function update() {
      state.keyword = input.value;
      state.region = region.value;
      state.type = type.value;
      state.year = year.value;
      state.visibleLimit = 60;
      render(items, results, count, loadMore);
    }

    [input, region, type, year].forEach(function (control) {
      control.addEventListener("input", update);
      control.addEventListener("change", update);
    });

    loadMore.addEventListener("click", function () {
      state.visibleLimit += 60;
      render(items, results, count, loadMore);
    });

    render(items, results, count, loadMore);
  });
})();
