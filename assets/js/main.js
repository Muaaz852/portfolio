/* Portfolio interactions — progressive enhancement.
   Without JS: content is fully visible and thumbnails link to full images. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal with stagger ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      // stagger items that share a parent
      var groupCounter = new Map();
      revealEls.forEach(function (el) {
        var parent = el.parentNode;
        var n = groupCounter.get(parent) || 0;
        groupCounter.set(parent, n + 1);
        el.style.transitionDelay = Math.min(n * 80, 320) + "ms";
      });
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Count-up stats ---------- */
  var nums = Array.prototype.slice.call(document.querySelectorAll(".stat__num[data-count]"));
  if (nums.length) {
    var runCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduceMotion) { el.textContent = String(target) + suffix; return; }
      var dur = 1300, start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = String(Math.round(eased * target)) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = String(target) + suffix;
      };
      el.textContent = "0" + suffix;
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) {
      nums.forEach(runCount);
    } else {
      var io2 = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCount(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      nums.forEach(function (el) { io2.observe(el); });
    }
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var links = Array.prototype.slice.call(document.querySelectorAll(".shot__link"));
  if (lb && links.length) {
    var imgEl   = document.getElementById("lightbox-img");
    var capEl   = document.getElementById("lightbox-cap");
    var countEl = document.getElementById("lightbox-count");
    var prevBtn = lb.querySelector("[data-prev]");
    var nextBtn = lb.querySelector("[data-next]");
    var closeEls = lb.querySelectorAll("[data-close]");

    var items = links.map(function (a) {
      var img = a.querySelector("img");
      return {
        src: a.getAttribute("href"),
        caption: a.getAttribute("data-caption") || "",
        alt: (img && img.getAttribute("alt")) || ""
      };
    });

    var current = 0, lastFocused = null;

    function render(i) {
      current = (i + items.length) % items.length;
      var it = items[current];
      imgEl.setAttribute("src", it.src);
      imgEl.setAttribute("alt", it.alt);
      capEl.textContent = it.caption;
      countEl.textContent = (current + 1) + " / " + items.length;
    }
    function open(i, trigger) {
      lastFocused = trigger || document.activeElement;
      render(i);
      lb.hidden = false;
      lb.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      (items.length > 1 ? nextBtn : closeEls[closeEls.length - 1]).focus();
      document.addEventListener("keydown", onKey);
    }
    function close() {
      lb.hidden = true;
      lb.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      imgEl.setAttribute("src", "");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }
    function next() { render(current + 1); }
    function prev() { render(current - 1); }
    function onKey(e) {
      switch (e.key) {
        case "Escape":     e.preventDefault(); close(); break;
        case "ArrowRight": if (items.length > 1) { e.preventDefault(); next(); } break;
        case "ArrowLeft":  if (items.length > 1) { e.preventDefault(); prev(); } break;
        case "Tab":        trapFocus(e); break;
      }
    }
    function trapFocus(e) {
      var f = Array.prototype.slice.call(lb.querySelectorAll("button"))
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); open(i, a); });
    });
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);
    Array.prototype.forEach.call(closeEls, function (el) { el.addEventListener("click", close); });
    if (items.length < 2) {
      if (nextBtn) nextBtn.hidden = true;
      if (prevBtn) prevBtn.hidden = true;
    }
  }
})();
