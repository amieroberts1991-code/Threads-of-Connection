/* ============================================ 
   Threads of Connection — Community Page Logic
   File: community.js (Complete version)
   ============================================ */
(function() {
  'use strict';

  // Storage keys
  const STORAGE = {
    CIRCLES: 'toc_circles',
    RSVPS: 'toc_rsvps',
    CONTACTS: 'toc_contacts',
    MEMBERS: 'toc_members'
  };

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroAnimation();
    initHearts();
    initModals();
    initCircleSearch();
    loadSavedCircles();
    initRsvpForm();
    initContactHostForm();
    initStartCircleForm();
    initJoinForm();
  });

  /* ============================================
     NAVIGATION
     ============================================ */
  function initNavigation() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;
    
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.main-nav')) {
        navLinks.classList.remove('active');
      }
    });
  }

  /* ============================================
     HERO ANIMATION (Lavender particles)
     ============================================ */
  function initHeroAnimation() {
    const canvas = document.getElementById('community-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, DPR = 1;

    // Colors (lavender)
    const PARTICLE_COLOR = 'rgba(210, 190, 255, 0.80)';
    const THREAD_RGB = { r: 126, g: 87, b: 194 };

    // Config
    const COUNT = 50;
    const MAX_DIST = 150;
    const SPEED = 0.5;

    const particles = [];

    function resize() {
      DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const cssW = canvas.clientWidth || canvas.offsetWidth || 0;
      const cssH = canvas.clientHeight || canvas.offsetHeight || 0;
      canvas.width = Math.max(1, Math.floor(cssW * DPR));
      canvas.height = Math.max(1, Math.floor(cssH * DPR));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
      W = cssW;
      H = cssH;
    }

    class Particle {
      constructor() { 
        this.reset(true); 
      }
      
      reset(initial) {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * SPEED;
        this.vy = (Math.random() - 0.5) * SPEED;
        this.r = Math.random() * 2 + 1;
        
        if (!initial) {
          if (Math.abs(this.vx) < 0.05) this.vx = (Math.random() - 0.5) * SPEED;
          if (Math.abs(this.vy) < 0.05) this.vy = (Math.random() - 0.5) * SPEED;
        }
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.fill();
      }
    }

    function seed() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawThreads() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p = particles[i];
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          
          if (d < MAX_DIST) {
            const alpha = 0.28 * (1 - d / MAX_DIST);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${THREAD_RGB.r}, ${THREAD_RGB.g}, ${THREAD_RGB.b}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawThreads();
      requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    seed();
    animate();
    
    window.addEventListener('resize', () => {
      const prevW = W;
      const prevH = H;
      resize();
      particles.forEach(p => {
        p.x = (p.x / prevW) * W;
        p.y = (p.y / prevH) * H;
      });
    });
  }

  /* ============================================
     PINK HEARTS ANIMATION (Full viewport like stars)
     ============================================ */
  function initHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    // Bright pink heart variations
    const hearts = ['💖', '💗', '💕', '💓', '💝'];

    function createHeart() {
      const heart = document.createElement('div');
      heart.className = 'heart';
      
      // Random bright pink heart
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      
      // Random horizontal position
      heart.style.left = Math.random() * 100 + '%';
      
      // Random animation duration (6-12 seconds)
      const duration = Math.random() * 6 + 6;
      heart.style.animationDuration = duration + 's';
      
      // Random delay
      heart.style.animationDelay = Math.random() * 2 + 's';
      
      // Random size (1.2rem to 2.5rem for visibility)
      const size = Math.random() * 1.3 + 1.2;
      heart.style.fontSize = size + 'rem';
      
      container.appendChild(heart);

      // Remove after animation completes
      setTimeout(() => {
        if (heart.parentNode) {
          heart.remove();
        }
      }, (duration + 2) * 1000);
    }

    // Create initial batch of hearts
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createHeart(), i * 300);
    }

    // Continuously create new hearts
    setInterval(() => {
      createHeart();
    }, 800);
  }

  /* ============================================
     MODALS
     ============================================ */
  function initModals() {
    // Use event delegation for better performance and to handle dynamic content
    document.body.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-open-modal]');
      if (openBtn) {
        e.preventDefault();
        const targetId = openBtn.getAttribute('data-open-modal');
        const modal = document.getElementById(targetId);
        if (!modal) return;

        // Set modal-specific data
        if (targetId === 'rsvp-modal' && openBtn.hasAttribute('data-event')) {
          const ev = openBtn.getAttribute('data-event') || 'Event';
          const label = modal.querySelector('#rsvp-event-name');
          if (label) label.textContent = ev;
        }
        
        if (targetId === 'contact-host-modal' && openBtn.hasAttribute('data-host')) {
          const host = openBtn.getAttribute('data-host') || 'Host';
          const label = modal.querySelector('#contact-host-name');
          if (label) label.textContent = host;
        }

        openModal(modal);
      }

      // Close modal handlers
      const closeBtn = e.target.closest('[data-close-modal], .modal-close');
      if (closeBtn) {
        const modal = closeBtn.closest('.modal');
        if (modal) closeModal(modal);
      }

      // Close on backdrop click
      if (e.target.classList.contains('modal')) {
        closeModal(e.target);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(closeModal);
      }
    });
  }

  function openModal(modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ============================================
     CIRCLE SEARCH
     ============================================ */
  function initCircleSearch() {
    const input = document.getElementById('circle-search');
    const clearBtn = document.getElementById('clear-circle-search');
    const grid = document.getElementById('circles-grid');
    if (!input || !grid) return;

    const filter = () => {
      const q = (input.value || '').toLowerCase().trim();
      grid.querySelectorAll('.circle-card').forEach(card => {
        const city = (card.getAttribute('data-city') || '').toLowerCase();
        const tags = (card.getAttribute('data-tags') || '').toLowerCase();
        const text = (card.textContent || '').toLowerCase();
        const match = !q || city.includes(q) || tags.includes(q) || text.includes(q);
        card.style.display = match ? '' : 'none';
      });
    };

    input.addEventListener('input', debounce(filter, 150));
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        filter();
        input.focus();
      });
    }
  }

  /* ============================================
     LOAD SAVED CIRCLES
     ============================================ */
  function loadSavedCircles() {
    const circles = readJSON(STORAGE.CIRCLES, []);
    const grid = document.getElementById('circles-grid');
    if (!grid || !circles.length) return;
    
    circles.forEach(circle => {
      const card = renderCircleCard(circle);
      if (card) grid.prepend(card);
    });
  }

  function renderCircleCard(circle) {
    const card = document.createElement('article');
    card.className = 'circle-card';
    card.setAttribute('data-city', circle.city || '');
    card.setAttribute('data-tags', (circle.tags || '').toLowerCase());

    const badgeText = circle.format || 'New';
    
    card.innerHTML = `
      <div class="circle-badge">${escapeHTML(badgeText)}</div>
      <h3 class="circle-title">${escapeHTML(circle.title || circle.name || 'New Community Circle')}</h3>
      <p class="circle-meta">${escapeHTML(circle.city || 'Location TBA')} • ${escapeHTML(circle.frequency || 'Schedule TBA')}</p>
      <p class="circle-desc">${escapeHTML(circle.desc || 'A community circle started by a member.')}</p>
      <div class="circle-actions">
        <button class="btn btn-outline" data-open-modal="rsvp-modal" data-event="${escapeHTML(circle.title || 'Community Circle')}">RSVP</button>
        <button class="btn btn-primary" data-open-modal="contact-host-modal" data-host="${escapeHTML(circle.host || 'Circle Host')}">Contact Host</button>
      </div>
    `;

    return card;
  }

  /* ============================================
     RSVP FORM
     ============================================ */
  function initRsvpForm() {
    const form = document.querySelector('#rsvp-modal #rsvp-form');
    const msg = document.getElementById('rsvp-message');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage(msg);

      const name = (document.getElementById('rsvp-name')?.value || '').trim();
      const email = (document.getElementById('rsvp-email')?.value || '').trim();
      const eventName = (document.getElementById('rsvp-event-name')?.textContent || 'Event').trim();

      const errs = [];
      if (!name) errs.push('Please enter your name.');
      if (!isValidEmail(email)) errs.push('Please enter a valid email address.');
      
      if (errs.length) {
        showMessage(msg, errs.join(' '), 'error');
        return;
      }

      const entry = {
        id: Date.now(),
        name,
        email,
        eventName,
        date: new Date().toISOString()
      };
      
      const all = readJSON(STORAGE.RSVPS, []);
      all.unshift(entry);
      writeJSON(STORAGE.RSVPS, all);

      showMessage(msg, `Thanks! You're RSVP'd for "${eventName}".`, 'success');
      form.reset();
      
      setTimeout(() => {
        const modal = document.getElementById('rsvp-modal');
        if (modal) closeModal(modal);
      }, 1200);
    });
  }

  /* ============================================
     CONTACT HOST FORM
     ============================================ */
  function initContactHostForm() {
    const form = document.querySelector('#contact-host-modal #contact-host-form');
    const msg = document.getElementById('contact-host-message');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage(msg);

      const name = (document.getElementById('ch-name')?.value || '').trim();
      const email = (document.getElementById('ch-email')?.value || '').trim();
      const host = (document.getElementById('contact-host-name')?.textContent || 'Host').trim();
      const message = (document.getElementById('ch-message')?.value || '').trim();

      const errs = [];
      if (!name) errs.push('Please enter your name.');
      if (!isValidEmail(email)) errs.push('Please enter a valid email address.');
      
      if (errs.length) {
        showMessage(msg, errs.join(' '), 'error');
        return;
      }

      const entry = {
        id: Date.now(),
        name,
        email,
        host,
        message,
        date: new Date().toISOString()
      };
      
      const all = readJSON(STORAGE.CONTACTS, []);
      all.unshift(entry);
      writeJSON(STORAGE.CONTACTS, all);

      showMessage(msg, `Your message to ${escapeHTML(host)} has been sent.`, 'success');
      form.reset();
      
      setTimeout(() => {
        const modal = document.getElementById('contact-host-modal');
        if (modal) closeModal(modal);
      }, 1200);
    });
  }

  /* ============================================
     START CIRCLE FORM
     ============================================ */
  function initStartCircleForm() {
    const form = document.querySelector('#start-circle-modal #start-circle-form');
    const msg = document.getElementById('start-circle-message');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessage(msg);

      const name = (document.getElementById('sc-name')?.value || '').trim();
      const email = (document.getElementById('sc-email')?.value || '').trim();
      const city = (document.getElementById('sc-city')?.value || '').trim();
      const format = (document.getElementById('sc-format')?.value || 'In-Person').trim();
      const notes = (document.getElementById('sc-notes')?.value || '').trim();

      const errs = [];
      if (!name) errs.push('Please enter your name.');
      if (!isValidEmail(email)) errs.push('Please enter a valid email address.');
      
      if (errs.length) {
        showMessage(msg, errs.join(' '), 'error');
        return;
      }

      const circle = {
        id: Date.now(),
        title: `${city ? city + ' • ' : ''}Community Circle`,
        host: name,
        email,
        city,
        format,
        frequency: 'To Be Announced',
        desc: notes || 'A new community circle.',
        tags: `${format} ${city}`
      };

      const circles = readJSON(STORAGE.CIRCLES, []);
      circles.unshift(circle);
      writeJSON(STORAGE.CIRCLES, circles);

      const card = renderCircleCard(circle);
      const grid = document.getElementById('circles-grid');
      if (card && grid) grid.prepend(card);

      showMessage(msg, 'Thanks! Your circle has been noted. We\'ll be in touch soon.', 'success');
      form.reset();
      
      setTimeout(() => {
        const modal = document.getElementById('start-circle-modal');
        if (modal) closeModal(modal);
      }, 1200);
    });
  }

  /* ============================================
     JOIN FORM
     ============================================ */
  function initJoinForm() {
    const form = document.getElementById('join-form');
    const msg = document.getElementById('join-message');
    if (!form || !msg) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('join-name')?.value || '').trim();
      const email = (document.getElementById('join-email')?.value || '').trim();
      const city = (document.getElementById('join-city')?.value || '').trim();

      if (!name || !isValidEmail(email)) {
        msg.textContent = 'Please enter your name and a valid email.';
        msg.style.color = '#a93226';
        return;
      }

      const entry = {
        id: Date.now(),
        name,
        email,
        city,
        date: new Date().toISOString()
      };
      
      const all = readJSON(STORAGE.MEMBERS, []);
      all.unshift(entry);
      writeJSON(STORAGE.MEMBERS, all);

      msg.textContent = 'Thanks for joining! We\'ll keep you posted.';
      msg.style.color = '#2e7d32';
      form.reset();
    });
  }

  /* ============================================
     UTILITY FUNCTIONS
     ============================================ */
  
  /**
   * Debounce function - limits the rate at which a function can fire
   */
  function debounce(fn, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        fn.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Validates email format
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    return re.test(email);
  }

  /**
   * Read and parse JSON from localStorage
   */
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : fallback;
    } catch (err) {
      console.error(`Error reading JSON from localStorage (${key}):`, err);
      return fallback;
    }
  }

  /**
   * Write JSON to localStorage   */
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error writing JSON to localStorage (${key}):`, err);
      return false;
    }
  }

  /**
   * Clear form message
   */
  function clearMessage(el) {
    if (!el) return;
    el.className = 'form-message';
    el.textContent = '';
  }

  /**
   * Show form message
   */
  function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-message show ${type === 'success' ? 'success' : 'error'}`;
  }

  /**
   * Escape HTML to prevent XSS attacks
   */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

})();
