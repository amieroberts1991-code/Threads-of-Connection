/* ============================================ 
   Threads of Connection — Submit Page Logic
   File: submit.js (with auto geocoding)
   ============================================ */
(function () {
  'use strict';

  // Redirect back to Threads after successful submit
  const AUTO_REDIRECT = true;
  const REDIRECT_DELAY_MS = 1500;

  // Storage keys
  const STORAGE_KEY = 'toc_submissions';
  const GEOCODE_CACHE_KEY = 'toc_geocode_cache';

  // Contact email for Nominatim etiquette
  const CONTACT_EMAIL = 'threadsofconnection25@gmail.com';

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initForm();
  });

  // Navigation
  function initNavigation() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;
    toggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.main-nav')) navLinks.classList.remove('active');
    });
  }

  // Form
  function initForm() {
    const form = document.getElementById('full-submit-form');
    if (!form) return;

    const title = document.getElementById('fs-title');
    const titleCount = document.getElementById('fs-title-count');
    const content = document.getElementById('fs-content');
    const contentCount = document.getElementById('fs-content-count');
    const submitBtn = document.getElementById('fs-submit-btn');
    const message = document.getElementById('fs-message');

    // Live counters
    title?.addEventListener('input', () => {
      titleCount.textContent = String(title.value.length).slice(0, 3);
    });
    content?.addEventListener('input', () => {
      contentCount.textContent = Math.min(content.value.length, 2000);
      if (content.value.length > 2000) content.value = content.value.slice(0, 2000);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage(message);

      const data = getFormData();
      const errors = validate(data);
      if (errors.length) {
        showMessage(message, errors.join('\n'), 'error');
        return;
      }

      try {
        // If no lat/lng but we have a location string, geocode it
        if (!data.coordinates && data.location) {
          setBusy(submitBtn, true, 'Looking up location…');
          const coords = await geocodeLocation(data.location);
          if (coords) data.coordinates = coords;
        }

        const saved = saveSubmission(data);
        if (!saved) {
          showMessage(message, 'Could not save your story. Please try again.', 'error');
          setBusy(submitBtn, false, 'Submit Story');
          return;
        }

        showMessage(
          message,
          'Thank you! Your story has been submitted. It will now appear on the Threads page.',
          'success'
        );

        form.reset();
        if (titleCount) titleCount.textContent = '0';
        if (contentCount) contentCount.textContent = '0';

        if (AUTO_REDIRECT) {
          setTimeout(() => { window.location.href = 'threads.html'; }, REDIRECT_DELAY_MS);
        }
      } catch (err) {
        console.error('[Submit] Error during submit:', err);
        showMessage(message, 'Something went wrong. Please try again.', 'error');
      } finally {
        setBusy(submitBtn, false, 'Submit Story');
      }
    });
  }

  function getFormData() {
    const title = (document.getElementById('fs-title')?.value || '').trim();
    const theme = (document.getElementById('fs-theme')?.value || '').trim();
    const author = (document.getElementById('fs-author')?.value || '').trim();
    const email = (document.getElementById('fs-email')?.value || '').trim();
    const location = (document.getElementById('fs-location')?.value || '').trim();
    const latStr = (document.getElementById('fs-lat')?.value || '').trim();
    const lngStr = (document.getElementById('fs-lng')?.value || '').trim();
    const content = (document.getElementById('fs-content')?.value || '').trim();
    const consent = document.getElementById('fs-consent')?.checked || false;

    let coordinates = undefined;
    if (latStr && lngStr) {
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        coordinates = [lat, lng];
      }
    }

    return {
      id: Date.now(),
      title,
      theme,
      author,
      email,
      location,
      coordinates, // optional
      date: new Date().toISOString().slice(0, 10),
      preview: content.slice(0, 240),
      content,
      consent
    };
  }

  function validate(data) {
    const errs = [];
    if (!data.title || data.title.length < 5) errs.push('Title must be at least 5 characters.');
    if (!data.theme) errs.push('Please choose a theme.');
    if (!data.author || data.author.length < 2) errs.push('Please enter your name.');
    if (!isValidEmail(data.email)) errs.push('Please enter a valid email address.');
    if (!data.content || data.content.length < 50) errs.push('Your story must be at least 50 characters.');
    if (!data.consent) errs.push('Please agree to the permission statement.');
    if (data.coordinates) {
      const [lat, lng] = data.coordinates;
      if (!isFinite(lat) || !isFinite(lng)) errs.push('Latitude/Longitude must be valid numbers.');
    }
    return errs;
  }

  // Geocoding + cache
  async function geocodeLocation(query) {
    const cache = readCache();
    const key = query.toLowerCase();
    if (cache[key]) return cache[key];

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=0&email=${encodeURIComponent(CONTACT_EMAIL)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      writeCacheEntry(key, coords);
      return coords;
    }
    return null;
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(GEOCODE_CACHE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  function writeCacheEntry(key, coords) {
    try {
      const cache = readCache();
      cache[key] = coords;
      localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
    } catch {}
  }

  // Storage + helpers
  function saveSubmission(data) {
    try {
      const existing = readSubmissions();
      existing.unshift(sanitizeSubmission(data));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return true;
    } catch (e) {
      console.error('[Submit] Save error:', e);
      return false;
    }
  }
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
  function sanitizeSubmission(s) {
    return {
      id: s.id,
      title: String(s.title || ''),
      theme: String(s.theme || ''),
      author: String(s.author || 'Anonymous'),
      email: String(s.email || ''),
      location: String(s.location || ''),
      date: String(s.date || ''),
      coordinates: Array.isArray(s.coordinates) ? [Number(s.coordinates[0]), Number(s.coordinates[1])] : undefined,
      preview: String(s.preview || '').slice(0, 240),
      content: String(s.content || ''),
      consent: !!s.consent
    };
  }

  function setBusy(btn, busy, text) {
    if (!btn) return;
    btn.disabled = !!busy;
    if (text) btn.textContent = text;
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    return re.test(email);
  }

  function clearMessage(el) {
    if (!el) return;
    el.className = 'form-message';
    el.textContent = '';
  }
  function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-message show ${type === 'success' ? 'success' : 'error'}`;
  }
})();
