/* ============================================
   animations.js — Scroll reveal, counters, typewriter, cursor
   Pure vanilla JS — no external libraries
   ============================================ */

(function () {
  'use strict';

  /* ---------- 1. INTERSECTION OBSERVER — Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- 2. SKILL BARS — animate width on view ---------- */
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  if ('IntersectionObserver' in window && skillFills.length) {
    const sIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const pct = el.dataset.pct || 0;
          // small delay so it feels alive
          setTimeout(() => { el.style.width = pct + '%'; }, 150);
          sIO.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach(f => sIO.observe(f));
  } else {
    skillFills.forEach(f => f.style.width = (f.dataset.pct || 0) + '%');
  }

  /* ---------- 3. COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = decimals > 0
        ? val.toFixed(decimals)
        : Math.floor(val) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = decimals > 0
        ? target.toFixed(decimals)
        : target + (el.dataset.suffix || '');
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cIO.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.dataset.count + (c.dataset.suffix || ''); });
  }

  /* ---------- 4. TYPEWRITER (cycling words) ---------- */
  const tw = document.querySelector('.typewrap');
  if (tw) {
    const words = (tw.dataset.words || 'Designer,Developer,Brand Strategist,Problem Solver').split(',');
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        tw.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 90);
      } else {
        tw.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 50);
      }
    };
    // add caret
    tw.classList.add('type-caret');
    setTimeout(tick, 800);
  }

  /* ---------- 5. CUSTOM CURSOR (desktop only) ---------- */
  const isFinePointer = window.matchMedia('(pointer:fine)').matches;
  if (isFinePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    document.body.appendChild(dot);
    document.body.classList.add('no-cursor');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let tx = mx, ty = my;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    const loop = () => {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
      requestAnimationFrame(loop);
    };
    loop();

    // Hover state
    document.querySelectorAll('a, button, .filter-tab, .tool-icon, .orbit-badge-inner, .social-icons a, .footer-socials a')
      .forEach(el => {
        el.addEventListener('mouseenter', () => {
          dot.classList.add('hover');
          trail.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
          dot.classList.remove('hover');
          trail.classList.remove('hover');
        });
      });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = 0;
      trail.style.opacity = 0;
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = 1;
      trail.style.opacity = 0.7;
    });
  }

  /* ---------- 6. Subtle parallax on hero mascot ---------- */
  const mascot = document.querySelector('.mascot-wrap');
  if (mascot && window.matchMedia('(pointer:fine)').matches) {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mascot.style.transform = `translate(${x * 14}px, ${y * 14}px)`;
      });
      hero.addEventListener('mouseleave', () => {
        mascot.style.transform = 'translate(0, 0)';
      });
    }
  }

})();
