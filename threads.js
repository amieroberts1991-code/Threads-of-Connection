/* ============================================ 
   Threads of Connection — Threads Page Logic
   File: threads.js (with auto geocoding)
   ============================================ */
(function() {
  'use strict';

  // ------------------------------------------
  // Constants
  // ------------------------------------------
  const STORAGE_KEY = 'toc_submissions';
  const GEOCODE_CACHE_KEY = 'toc_geocode_cache';
  const CONTACT_EMAIL = 'threadsofconnection25@gmail.com';

  // ------------------------------------------
  // Global State
  // ------------------------------------------
  const STATE = {
    allStories: [],
    displayedStories: [],
    storiesPerPage: 6,
    currentPage: 1,
    map: null,
    pinLayer: null
  };

  // ------------------------------------------
  // Bootstrap
  // ------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroAnimation();
    initSparklingStars();
    initMap();
    initStories();
    initSearch();
    initLoadMore();
    initShareForm();
  });

  // ------------------------------------------
  // Navigation
  // ------------------------------------------
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

  // ------------------------------------------
  // Hero Canvas Animation
  // ------------------------------------------
  function initHeroAnimation() {
    const canvas = document.getElementById('threads-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const N = 50;

    function size() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    size();
    window.addEventListener('resize', size);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fill();
      }
    }

    for (let i = 0; i < N; i++) particles.push(new Particle());

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => { p.update(); p.draw(); });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.2 * (1 - d / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(tick);
    }
    tick();
  }

  // ------------------------------------------
  // Sparkling Stars Animation
  // ------------------------------------------
  function initSparklingStars() {
    const heroStars = document.getElementById('hero-stars');
    if (heroStars) {
      createStars(heroStars, 20);
    }

    const footerStars = document.getElementById('footer-stars');
    if (footerStars) {
      createStars(footerStars, 15);
    }
  }

  function createStars(container, count) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
     
      const size = Math.random() * 15 + 10;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
     
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
     
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 2;
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;
     
      container.appendChild(star);
    }
  }

  // ------------------------------------------
  // Map Initialization
  // ------------------------------------------
  function initMap() {
    const el = document.getElementById('world-map');
    if (!el) return;
    if (!(window.L && typeof L.map === 'function')) return;

    try {
      STATE.map = L.map('world-map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 10
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(STATE.map);

      STATE.pinLayer = L.layerGroup().addTo(STATE.map);

      setTimeout(() => STATE.map.invalidateSize(), 150);
    } catch (e) {
      console.error('[Threads] Map initialization error:', e);
    }
  }

  // ------------------------------------------
  // Stories
  // ------------------------------------------
  function initStories() {
    const localSubs = readSubmissions();
    const samples = Array.isArray(window.sampleThreads) ? window.sampleThreads : [];

    const merged = [...localSubs, ...samples];

    merged.sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return db - da;
    });

    STATE.allStories = merged;

    const grid = document.getElementById('stories-grid');
    if (grid) {
      STATE.currentPage = 1;
      STATE.displayedStories = STATE.allStories.slice(0, STATE.storiesPerPage);
      renderStories();
    }

    updateMapMarkers();
  }

  function renderStories() {
    const grid = document.getElementById('stories-grid');
    if (!grid) return;

    grid.innerHTML = '';
    if (!STATE.displayedStories.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No stories found</h3>
          <p>Try adjusting your search.</p>
        </div>`;
      const loadMoreBtn = document.getElementById('load-more-btn');
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    STATE.displayedStories.forEach(story => {
      grid.appendChild(createStoryCard(story));
    });

    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        STATE.displayedStories.length < STATE.allStories.length ? 'inline-block' : 'none';
    }
  }

  function createStoryCard(story) {
    const card = document.createElement('div');
    card.className = 'story-card';

    card.innerHTML = `
      <div class="story-header">
        <div class="story-theme">${escapeHTML(story.theme || '')}</div>
        <h3 class="story-title">${escapeHTML(story.title || '')}</h3>
        <div class="story-meta">${escapeHTML(story.author || 'Anonymous')} • ${formatDate(story.date)}</div>
      </div>
      <div class="story-body">
        <p class="story-preview">${escapeHTML(story.preview || '').slice(0, 240)}${(story.preview || '').length > 240 ? '...' : ''}</p>
      </div>
      <div class="story-footer">
        <span class="story-location">📍 ${escapeHTML(story.location || '')}</span>
        <a href="#" class="read-more">Read More →</a>
      </div>
    `;

    card.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(story);
    });

    return card;
  }
/* ==== Mobile visibility + map height safety (Threads page) ==== */ 
.page-threads #map,
.page-threads .map,
.page-threads .map-container {
  width: 100%;
  height: 50vh !important; /* visible portion of the screen */
  min-height: 320px !important; /* ensure enough height on phones */
  display: block !important;
}

/* Make sure parent wrappers don't hide the map on small screens */
@media (max-width: 900px) {
  .page-threads .map-section,
  .page-threads .map-wrapper,
  .page-threads .threads-section {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
}

/* Safety: don't let page CSS wreck the nav on Threads */
@media (max-width: 900px) {
  .page-threads .content ul { list-style: disc; padding-left: 1.25rem; }
  .page-threads .content a { display: inline !important; }
}


  // ------------------------------------------
  // Map Pins
  // ------------------------------------------
  function updateMapMarkers() {
    if (!STATE.map || !STATE.pinLayer) return;
    STATE.pinLayer.clearLayers();

    STATE.allStories.forEach(story => {
      if (Array.isArray(story.coordinates) && story.coordinates.length === 2) {
        const marker = L.marker(story.coordinates).addTo(STATE.pinLayer);
        marker.bindPopup(`
          <div style="min-width:220px;">
            <h4 style="margin:0 0 6px 0; font-family:'Playfair Display',serif;">${escapeHTML(story.title || '')}</h4>
            <p style="margin:0 0 6px 0; font-size:0.9rem; color:#555;">
              ${escapeHTML(story.preview || '').slice(0, 100)}${(story.preview || '').length>100?'...':''}
            </p>
            <p style="margin:0; font-size:0.85rem; color:#777;">
              <strong>${escapeHTML(story.author || 'Anonymous')}</strong> • ${escapeHTML(story.location || '')}
            </p>
          </div>
        `);
        marker.on('click', () => openModal(story));
      }
    });

    fitMapToPins();
  }

  function fitMapToPins() {
    if (!STATE.map || !STATE.pinLayer) return;
    const layers = STATE.pinLayer.getLayers();
    if (!layers.length) return;
    const group = L.featureGroup(layers);
    STATE.map.fitBounds(group.getBounds(), { padding: [30, 30] });
  }

  // ------------------------------------------
  // Search
  // ------------------------------------------
  function initSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('input', debounce((e) => {
      const query = (e.target.value || '').toLowerCase().trim();
      STATE.currentPage = 1;

      if (!query) {
        STATE.displayedStories = STATE.allStories.slice(0, STATE.storiesPerPage);
      } else {
        const filtered = STATE.allStories.filter(s =>
          (s.title || '').toLowerCase().includes(query) ||
          (s.preview || '').toLowerCase().includes(query) ||
          (s.author || '').toLowerCase().includes(query) ||
          (s.location || '').toLowerCase().includes(query)
        );
        STATE.displayedStories = filtered.slice(0, STATE.storiesPerPage * STATE.currentPage);
      }

      renderStories();
    }, 250));
  }

  // ------------------------------------------
  // Load More
  // ------------------------------------------
  function initLoadMore() {
    const btn = document.getElementById('load-more-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      STATE.currentPage++;
      STATE.displayedStories = STATE.allStories.slice(0, STATE.storiesPerPage * STATE.currentPage);
      renderStories();

      setTimeout(() => {
        const cards = document.querySelectorAll('.story-card');
        const idx = (STATE.storiesPerPage * (STATE.currentPage - 1)) - 1;
        const target = cards[Math.max(idx, 0)];
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  // ------------------------------------------
  // Modal
  // ------------------------------------------
  function openModal(story) {
    const modal = document.getElementById('story-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <button class="modal-close" aria-label="Close">&times;</button>
          <h2 class="modal-title">${escapeHTML(story.title || '')}</h2>
          <div class="modal-meta">
            ${escapeHTML(story.author || 'Anonymous')} • ${escapeHTML(story.location || '')} • ${formatDate(story.date)}
          </div>
        </div>
        <div class="modal-body">
          <div class="modal-text">
            ${toParagraphs(story.content || story.preview || '')}
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', escCloseOnce);
  }

  function closeModal() {
    const modal = document.getElementById('story-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escCloseOnce);
  }

  function escCloseOnce(e) {
    if (e.key === 'Escape') closeModal();
  }

  // ------------------------------------------
  // Share Story Modal with AUTO GEOCODING
  // ------------------------------------------
  function initShareForm() {
    const openBtn = document.getElementById('open-share-form');
    const modal = document.getElementById('share-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancel-share');
    const form = document.getElementById('share-form');
    const contentEl = document.getElementById('share-content');
    const countEl = document.getElementById('share-count');

    if (!openBtn || !modal || !form) return;

    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    const close = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    closeBtn?.addEventListener('click', close);
    cancelBtn?.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });

    contentEl?.addEventListener('input', () => {
      const len = contentEl.value.length;
      countEl.textContent = Math.min(len, 2000);
      if (len > 2000) contentEl.value = contentEl.value.slice(0, 2000);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = (document.getElementById('share-title').value || '').trim();
      const theme = (document.getElementById('share-theme').value || '').trim();
      const author = (document.getElementById('share-author').value || '').trim();
      const location = (document.getElementById('share-location').value || '').trim();
      const latStr = (document.getElementById('share-lat').value || '').trim();
      const lngStr = (document.getElementById('share-lng').value || '').trim();
      const content = (document.getElementById('share-content').value || '').trim();

      const errors = [];
      if (!title || title.length < 5) errors.push('Title must be at least 5 characters.');
      if (!theme) errors.push('Please choose a theme.');
      if (!author || author.length < 2) errors.push('Please enter your name.');
      if (!content || content.length < 50) errors.push('Story must be at least 50 characters.');

      if (errors.length) {
        alert(errors.join('\n'));
        return;
      }

      let coords = null;
      const submitBtn = form.querySelector('button[type="submit"]');

      if (latStr && lngStr) {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          alert('Latitude/Longitude must be valid numbers.');
          return;
        }
        coords = [lat, lng];
      } else if (location) {
        setBusy(submitBtn, true, 'Looking up location…');
        try {
          coords = await geocodeLocation(location);
        } catch (err) {
          console.warn('[Threads] Geocode failed:', err);
        } finally {
          setBusy(submitBtn, false, 'Submit Story');
        }
      }

      const story = {
        id: Date.now(),
        title,
        theme,
        author,
        location,
        date: new Date().toISOString().slice(0, 10),
        coordinates: coords || undefined,
        preview: content.slice(0, 240),
        content
      };

      saveSubmission(story);

      STATE.allStories.unshift(story);
      STATE.displayedStories = STATE.allStories.slice(0, STATE.storiesPerPage);

      renderStories();
      updateMapMarkers();

      if (coords && STATE.map) {
        STATE.map.setView(coords, Math.max(STATE.map.getZoom(), 4), { animate: true });
      }

      form.reset();
      if (countEl) countEl.textContent = '0';
      close();

      alert('Thank you! Your story has been added to the map and feed.');
    });
  }

  // ------------------------------------------
  // AUTO-GEOCODING
  // ------------------------------------------
  async function geocodeLocation(query) {
    const cache = readGeoCache();
    const key = query.toLowerCase();
    if (cache[key]) return cache[key];

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=1&addressdetails=0&email=${encodeURIComponent(CONTACT_EMAIL)}`;

    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;

    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      writeGeoCacheEntry(key, coords);
      return coords;
    }
    return null;
  }

  function readGeoCache() {
    try {
      const raw = localStorage.getItem(GEOCODE_CACHE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function writeGeoCacheEntry(key, coords) {
    try {
      const cache = readGeoCache();
      cache[key] = coords;
      localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
    } catch {}
  }

  // ------------------------------------------
  // Local Storage
  // ------------------------------------------
  function readSubmissions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveSubmission(story) {
    try {
      const list = readSubmissions();
      const clean = {
        id: story.id,
        title: String(story.title || ''),
        theme: String(story.theme || ''),
        author: String(story.author || 'Anonymous'),
        email: '',
        location: String(story.location || ''),
        date: String(story.date || ''),
        coordinates: Array.isArray(story.coordinates)
          ? [Number(story.coordinates[0]), Number(story.coordinates[1])]
          : undefined,
        preview: String(story.preview || '').slice(0, 240),
        content: String(story.content || ''),
        consent: true
      };
      list.unshift(clean);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error('[Threads] Error saving submission:', e);
      return false;
    }
  }

  // ------------------------------------------
  // Utilities
  // ------------------------------------------
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function formatDate(dateString) {
    if (!dateString) return '';

    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    const now = new Date();
    const diff = Math.abs(now - d);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); 
  }

  function toParagraphs(text) {
  return escapeHTML(text)
    .split(/\n{2,}|\r\n\r\n/)
    .map(p => `<p>${p.replace(/\n|\r\n/g, '<br>')}</p>`)
    .join('');
}

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setBusy(btn, busy, text) {
    if (!btn) return;
    btn.disabled = !!busy;
    if (text) btn.textContent = text;
  }

  window.ThreadsDebug = { STATE, updateMapMarkers };
})();
