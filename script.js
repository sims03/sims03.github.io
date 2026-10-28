// Small progressive enhancements: mobile menu, header state, scroll reveals, active nav link,
// and the two decorative playheads (hero timeline and the Experience timeline).
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function onMotionPrefChange(fn) {
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', fn);
    else if (reduceMotion.addListener) reduceMotion.addListener(fn);
  }

  // Mobile menu
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // Header border once the page scrolls
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Hero timeline: playhead sweeps a 20-second edit and the timecode follows (25 fps).
  // With reduced motion it stays on the static frame set in the HTML/CSS.
  var tracks = document.querySelector('[data-tracks]');
  var timecode = document.querySelector('[data-timecode]');
  if (tracks && timecode) {
    var DURATION = 20;
    var FPS = 25;
    var START = 12 + 8 / FPS; // matches the static frame 00:00:12:08
    var heroVisible = true;
    var rafId = 0;
    var t0 = 0;

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var renderFrame = function (seconds) {
      var frames = Math.floor(seconds * FPS);
      tracks.style.setProperty('--p', (seconds / DURATION).toFixed(4));
      timecode.textContent = '00:00:' + pad(Math.floor(frames / FPS)) + ':' + pad(frames % FPS);
    };
    var tick = function (now) {
      if (!t0) t0 = now - START * 1000;
      renderFrame(((now - t0) / 1000) % DURATION);
      rafId = window.requestAnimationFrame(tick);
    };
    var updateLoop = function () {
      var shouldRun = heroVisible && !document.hidden && !reduceMotion.matches;
      if (shouldRun && !rafId) {
        rafId = window.requestAnimationFrame(tick);
      } else if (!shouldRun && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
        t0 = 0;
        if (reduceMotion.matches) renderFrame(START);
      }
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        updateLoop();
      }).observe(tracks);
    }
    document.addEventListener('visibilitychange', updateLoop);
    onMotionPrefChange(updateLoop);
    updateLoop();
  }

  // Experience timeline: a playhead that follows scroll and lights up each keyframe it passes.
  var scrub = document.querySelector('[data-scrub]');
  if (scrub) {
    var items = scrub.querySelectorAll('.timeline__item');
    var ticking = false;

    var updateScrub = function () {
      ticking = false;
      var rect = scrub.getBoundingClientRect();
      var line = window.innerHeight * 0.55;
      var p = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      scrub.style.setProperty('--p', p.toFixed(4));
      items.forEach(function (item) {
        item.classList.toggle('is-played', item.getBoundingClientRect().top + 14 <= line);
      });
    };
    var requestScrub = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrub);
      }
    };
    var setScrubMode = function () {
      var live = !reduceMotion.matches;
      scrub.classList.toggle('is-live', live);
      if (live) {
        window.addEventListener('scroll', requestScrub, { passive: true });
        window.addEventListener('resize', requestScrub);
        updateScrub();
      } else {
        window.removeEventListener('scroll', requestScrub);
        window.removeEventListener('resize', requestScrub);
        scrub.style.removeProperty('--p');
      }
    };
    onMotionPrefChange(setScrubMode);
    setScrubMode();
  }

  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // Scroll reveals (CSS disables the effect for prefers-reduced-motion)
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach(function (el) { revealObserver.observe(el); });

  // Highlight the nav link of the section in view
  var links = {};
  document.querySelectorAll('.nav__menu a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = links[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        Object.keys(links).forEach(function (id) { links[id].removeAttribute('aria-current'); });
        link.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(links).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
})();
