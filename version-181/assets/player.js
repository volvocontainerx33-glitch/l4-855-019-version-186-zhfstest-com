(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function loadHlsLibrary() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    return new Promise(function (resolve) {
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.async = true;
      script.onload = function () {
        resolve(window.Hls || null);
      };
      script.onerror = function () {
        if (window.location.protocol !== "file:" && "noModule" in HTMLScriptElement.prototype) {
          import("./hls-vendor-dru42stk.js")
            .then(function (module) {
              resolve(module.H || null);
            })
            .catch(function () {
              resolve(null);
            });
        } else {
          resolve(null);
        }
      };
      document.head.appendChild(script);
    });
  }

  function setHidden(element, hidden) {
    if (element) {
      element.classList.toggle("is-hidden", hidden);
      if (hidden) {
        element.setAttribute("hidden", "hidden");
      } else {
        element.removeAttribute("hidden");
      }
    }
  }

  function showError(shell, message) {
    var loading = shell.querySelector("[data-player-loading]");
    var error = shell.querySelector("[data-player-error]");
    setHidden(loading, true);
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  function initializePlayer(shell, Hls) {
    var video = shell.querySelector("video[data-video-url]");
    var loading = shell.querySelector("[data-player-loading]");
    var start = shell.querySelector("[data-player-start]");

    if (!video) {
      return;
    }

    var source = video.getAttribute("data-video-url");
    if (!source) {
      showError(shell, "未找到播放源。");
      return;
    }

    function ready() {
      setHidden(loading, true);
    }

    if (Hls && Hls.isSupported && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, ready);
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showError(shell, "视频加载失败，请稍后重试。");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.addEventListener("loadedmetadata", ready, { once: true });
      video.addEventListener("error", function () {
        showError(shell, "视频加载失败，请稍后重试。");
      });
    } else {
      showError(shell, "当前浏览器不支持 HLS 播放，请使用 Chrome、Edge、Safari 或 Firefox 访问。");
    }

    if (start) {
      start.addEventListener("click", function () {
        video.play().then(function () {
          setHidden(start, true);
        }).catch(function () {
          showError(shell, "浏览器阻止了自动播放，请再次点击播放器控件。");
        });
      });
    }
  }

  onReady(function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll("[data-player-shell]"));
    if (!shells.length) {
      return;
    }
    loadHlsLibrary().then(function (Hls) {
      shells.forEach(function (shell) {
        initializePlayer(shell, Hls);
      });
    });
  });
})();
