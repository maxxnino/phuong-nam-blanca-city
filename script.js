/* ═══════════════════════════════════════════════
   BLANCA CITY – script.js
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. SCROLL REVEAL ─────────────────────────── */
  const revealEls = document.querySelectorAll('.animate-on-scroll');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Staggered delay for grid children
          const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
          let idx = Array.from(siblings).indexOf(entry.target);
          // Only stagger if parent is a grid (amenities / psych-points)
          const parent = entry.target.parentElement;
          if (parent.classList.contains('amenities-grid') ||
            parent.classList.contains('psych-points') ||
            parent.classList.contains('press-list')) {
            idx = Math.min(idx, 6);
            entry.target.style.transitionDelay = `${idx * 0.07}s`;
          }
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── 2. STICKY BOTTOM CTA ─────────────────────── */
  const stickyCta = document.getElementById('stickyCta');
  let stickyShown = false;

  const stickyObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting && !stickyShown) {
        stickyCta.classList.add('visible');
        stickyShown = true;
      }
    },
    { threshold: 0.5 }
  );
  const heroSection = document.getElementById('hero-waterpark');
  if (heroSection) stickyObserver.observe(heroSection);

  /* ── 3. PARALLAX (light, CSS-based via transform) */
  const heroVideos = document.querySelectorAll('.hero-video');

  function onScroll() {
    const scrollY = window.scrollY;
    heroVideos.forEach((vid, i) => {
      const section = vid.closest('.hero-section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!visible) return;
      const progress = (scrollY - section.offsetTop) / section.offsetHeight;
      const shift = progress * 40; // px
      vid.style.transform = `translateY(${shift}px) scale(1.05)`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 4. LAZY VIDEO AUTOPLAY ───────────────────── */
  // Pause background videos when out of viewport (battery saving)
  const bgVideos = document.querySelectorAll('.hero-video');

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          vid.play().catch(() => { });
        } else {
          vid.pause();
        }
      });
    },
    { threshold: 0.1 }
  );
  bgVideos.forEach((v) => videoObserver.observe(v));

  /* ── 5. SMOOTH SCROLL for anchor links ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 6. PRESS ITEMS stagger on load ────────────── */
  // Already handled by IntersectionObserver above

  /* ── 7. VIDEO placeholder fallback ─────────────── */
  // If placeholder videos fail to load, show a gradient background
  // bgVideos.forEach((vid) => {
  //   vid.addEventListener('error', () => {
  //     const wrap = vid.closest('.hero-video-wrap');
  //     if (wrap) {
  //       wrap.style.background = 'linear-gradient(135deg, #0a1520 0%, #0d2233 50%, #080b10 100%)';
  //       vid.style.display = 'none';
  //     }
  //   });
  // });
  function isZaloIOS() {
    const ua = navigator.userAgent || '';
    const isZalo = /ZaloApp|Zalo\/|zalo/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    return isZalo && isIOS;
  }

  const videos = [
    document.getElementById('videoWaterpark'),
    document.getElementById('videoFireworks')
  ]

  if (isZaloIOS()) {
    for (const video of videos) {
      const wrap = video.closest('.hero-video-wrap');
      wrap.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url(${video.poster})`
      wrap.style.backgroundSize = 'cover';
      wrap.style.backgroundPosition = 'center';
      video.style.display = 'none';
    }
  }
})();
