/* ============================================
   main.js — Navbar, mobile menu, form, work filter
   Pure vanilla JS — no libraries
   ============================================ */

(function () {
  'use strict';

  /* ---------- 0. THEME TOGGLE (dark / light) ---------- */
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const setTheme = (t) => {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
    // Sync aria-label on change
    const updateLabel = () => {
      const current = root.getAttribute('data-theme') || 'dark';
      themeBtn.setAttribute('aria-label',
        current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    };
    updateLabel();
    // MutationObserver so the label stays in sync if theme changes elsewhere
    new MutationObserver(updateLabel).observe(root, {
      attributes: true, attributeFilter: ['data-theme']
    });
  }

  /* ---------- 1. NAVBAR scroll shrink ---------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 80) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. ACTIVE nav link based on filename ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- 3. MOBILE hamburger menu ---------- */
  const ham = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  if (ham && drawer) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      drawer.classList.toggle('open');
    });
    // Close drawer when a link is clicked
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        drawer.classList.remove('open');
      });
    });
  }

  /* ---------- 4. WORK PAGE — filter tabs ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        projectCards.forEach(card => {
          const cat = card.dataset.category;
          if (filter === 'all' || cat === filter) {
            card.classList.remove('hidden');
            // re-trigger reveal animation
            card.classList.remove('visible');
            requestAnimationFrame(() => card.classList.add('visible'));
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---------- 5. CONTACT FORM ---------- */
  const form = document.querySelector('#contact-form');
  const successBox = document.querySelector('.form-success');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Sending...';
      btn.disabled = true;

      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (successBox) {
            successBox.textContent = '✓ Thanks! Your message has been sent. I will reply soon.';
            successBox.classList.add('show');
          }
          form.reset();
        } else {
          if (successBox) {
            successBox.textContent = '✗ Oops! Something went wrong. Please try emailing me directly.';
            successBox.style.background = 'rgba(239, 68, 68, 0.1)';
            successBox.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            successBox.style.color = '#f87171';
            successBox.classList.add('show');
          }
        }
      } catch (err) {
        if (successBox) {
          successBox.textContent = '✗ Network error. Please try again later.';
          successBox.classList.add('show');
        }
      } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        setTimeout(() => {
          if (successBox) successBox.classList.remove('show');
        }, 6000);
      }
    });
  }

  /* ---------- 6. SMOOTH internal anchor scroll (offset for fixed nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

})();
