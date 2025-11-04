/* ============================================ 
   Threads of Connection — Get Involved Page
   File: get-involved.js (with EmailJS integration)
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // EmailJS Configuration
  // ==========================================
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'wwSOs_R3XFca4lll2', // Replace with your public key
    SERVICE_ID: 'service_5o3ok1q', // Replace with your service ID
    CONTACT_TEMPLATE: 'template_ljgfj5b', // Contact form template
    NEWSLETTER_TEMPLATE: 'template_477kzjj' // Newsletter template
  };

  // Storage keys
  const STORAGE = {
    NEWSLETTER: 'toc_newsletter',
    CONTACTS: 'toc_contacts'
  };

  // Boot
  document.addEventListener('DOMContentLoaded', () => {
    initEmailJS();
    initNavigation();
    initHeroAnimation();
    initHandsAnimation();
    initNewsletterForm();
    initContactForm();
    initDonateButtons();
  });

  // ------------------------------------------
  // Initialize EmailJS
  // ------------------------------------------
  function initEmailJS() {
    // Load EmailJS SDK
    if (typeof emailjs === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = () => {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized');
      };
      script.onerror = () => {
        console.error('❌ Failed to load EmailJS');
      };
      document.head.appendChild(script);
    } else {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }

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
  // Hero Animation — Teal/Aqua particles + threads
  // ------------------------------------------
  function initHeroAnimation() {
    const canvas = document.getElementById('involved-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, DPR = 1;

    const PARTICLE_COLOR = 'rgba(175, 238, 238, 0.9)';
    const THREAD_RGB = { r: 0, g: 139, b: 139 };

    const COUNT = 55;
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
      constructor() { this.reset(true); }
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
      for (let i = 0; i < COUNT; i++) particles.push(new Particle());
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
            const alpha = 0.3 * (1 - d / MAX_DIST);
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

  // ------------------------------------------
  // HANDS HOLDING HANDS ANIMATION
  // ------------------------------------------
  function initHandsAnimation() {
    const container = document.getElementById('hands-container');
    if (!container) return;

    const hands = [
      '🤝', '🤝🏻', '🤝🏼', '🤝🏽', '🤝🏾', '🤝🏿',
      '👫', '👬', '👭', '🫱🏽‍🫲🏻'
    ];

    function createHand() {
      const hand = document.createElement('div');
      hand.className = 'hand';
      hand.textContent = hands[Math.floor(Math.random() * hands.length)];
      
      const isHero = Math.random() > 0.5;
      if (isHero) {
        hand.style.top = Math.random() * 50 + 'vh';
      } else {
        hand.style.top = (70 + Math.random() * 30) + 'vh';
      }
      
      const duration = Math.random() * 6 + 12;
      hand.style.animationDuration = duration + 's';
      hand.style.animationDelay = Math.random() * 5 + 's';
      
      container.appendChild(hand);

      setTimeout(() => {
        if (hand.parentNode) {
          hand.remove();
        }
      }, (duration + 5) * 1000);
    }

    for (let i = 0; i < 8; i++) {
      setTimeout(() => createHand(), i * 800);
    }

    setInterval(() => {
      createHand();
    }, 2000);
  }

  // ------------------------------------------
  // Newsletter Form (with EmailJS)
  // ------------------------------------------
  function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const feedback = document.getElementById('nl-feedback');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form || !feedback) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage(feedback);

      const name = document.getElementById('nl-name')?.value.trim() || '';
      const email = document.getElementById('nl-email')?.value.trim() || '';
      const interests = Array.from(
        document.getElementById('nl-interests')?.selectedOptions || []
      ).map(opt => opt.value);
      const consent = document.getElementById('nl-consent')?.checked || false;

      // Validation
      const errors = [];
      if (!name) errors.push('Please enter your name.');
      if (!isValidEmail(email)) errors.push('Please enter a valid email.');
      if (!consent) errors.push('Please agree to receive newsletters.');

      if (errors.length) {
        showMessage(feedback, errors.join(' '), 'error');
        return;
      }

      // Disable button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Save to localStorage
      const entry = {
        id: Date.now(),
        name,
        email,
        interests,
        consent,
        date: new Date().toISOString()
      };

      const subscribers = readJSON(STORAGE.NEWSLETTER, []);
      subscribers.unshift(entry);
      writeJSON(STORAGE.NEWSLETTER, subscribers);

      // Send via EmailJS
      try {
        const templateParams = {
          from_name: name,
          from_email: email,
          interests: interests.length ? interests.join(', ') : 'None selected',
          signup_date: new Date().toLocaleString(),
          consent: consent ? 'Yes' : 'No'
        };

        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.NEWSLETTER_TEMPLATE,
          templateParams
        );

        showMessage(feedback, '🎉 Welcome! You\'re subscribed. Check your email for confirmation.', 'success');
        form.reset();
      } catch (error) {
        console.error('EmailJS error:', error);
        // Add more specific logging for EmailJS errors
        if (error && typeof error === 'object') {
          if (error.status && error.text) {
            console.error('EmailJS detailed error:', error.status, error.text);
          } else if (error.message) {
            console.error('EmailJS detailed error message:', error.message);
          } else {
            console.error('EmailJS unknown error object:', JSON.stringify(error));
          }
        } else {
          console.error('EmailJS error (non-object):', error);
        }
        showMessage(feedback, '⚠️ Subscription saved locally, but email notification failed. We\'ll follow up soon!', 'error');
      } finally {
        // Re-enable button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Join Newsletter';
        }
      }
    });

    form.addEventListener('reset', () => clearMessage(feedback));
  }

  // ------------------------------------------
  // Contact Form (with EmailJS)
  // ------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contact-form-main');
    const feedback = document.getElementById('cf-feedback');
    const msgArea = document.getElementById('cf-message');
    const charCount = document.getElementById('cf-count');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form || !feedback) return;

    // Character counter
    if (msgArea && charCount) {
      msgArea.addEventListener('input', () => {
        charCount.textContent = msgArea.value.length;
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage(feedback);

      const name = document.getElementById('cf-name')?.value.trim() || '';
      const email = document.getElementById('cf-email')?.value.trim() || '';
      const topic = document.getElementById('cf-topic')?.value || '';
      const subject = document.getElementById('cf-subject')?.value.trim() || '';
      const message = msgArea?.value.trim() || '';
      const consent = document.getElementById('cf-consent')?.checked || false;

      // Validation
      const errors = [];
      if (!name) errors.push('Please enter your name.');
      if (!isValidEmail(email)) errors.push('Please enter a valid email.');
      if (!topic) errors.push('Please select a topic.');
      if (!subject) errors.push('Please enter a subject.');
      if (!message) errors.push('Please enter a message.');
      if (!consent) errors.push('Please agree to be contacted.');

      if (errors.length) {
        showMessage(feedback, errors.join(' '), 'error');
        return;
      }

      // Disable button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Save to localStorage
      const entry = {
        id: Date.now(),
        name,
        email,
        topic,
        subject,
        message,
        consent,
        date: new Date().toISOString()
      };

      const contacts = readJSON(STORAGE.CONTACTS, []);
      contacts.unshift(entry);
      writeJSON(STORAGE.CONTACTS, contacts);

      // Send via EmailJS
      try {
        const templateParams = {
          from_name: name,
          from_email: email,
          topic: topic,
          subject: subject,
          message: message,
          sent_date: new Date().toLocaleString(),
          consent: consent ? 'Yes' : 'No'
        };

        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.CONTACT_TEMPLATE,
          templateParams
        );

        showMessage(feedback, '✅ Message sent! We\'ll respond within 3-5 days.', 'success');
        form.reset();
        if (charCount) charCount.textContent = '0';
      } catch (error) {
        console.error('EmailJS error:', error);
        showMessage(feedback, '⚠️ Message saved locally, but email failed. We\'ll still receive it!', 'error');
      } finally {
        // Re-enable button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });

    form.addEventListener('reset', () => {
      clearMessage(feedback);
      if (charCount) charCount.textContent = '0';
    });
  }

  // ------------------------------------------
  // Donate Buttons Interactive
  // ------------------------------------------
  function initDonateButtons() {
    const donateButtons = document.querySelectorAll('.donate-options .btn');
    const paypalLink = document.getElementById('paypal-donate-link');
    const customContainer = document.getElementById('custom-amount-container');
    const customInput = document.getElementById('custom-amount-input');

    if (!donateButtons.length) return;

    donateButtons.forEach(button => {
      button.addEventListener('click', function() {
        const amount = this.getAttribute('data-amount');
        
        if (amount === 'custom') {
          if (customContainer) customContainer.style.display = 'block';
          if (customInput) customInput.focus();
        } else {
          if (customContainer) customContainer.style.display = 'none';
          updatePayPalLink(amount);
        }
        
        // Highlight selected button
        donateButtons.forEach(btn => btn.classList.remove('btn-primary'));
        donateButtons.forEach(btn => btn.classList.add('btn-outline'));
        this.classList.remove('btn-outline');
        this.classList.add('btn-primary');
      });
    });

    // Handle custom amount
    if (customInput) {
      customInput.addEventListener('input', function() {
        if (this.value) {
          updatePayPalLink(this.value);
        }
      });
    }

    function updatePayPalLink(amount) {
      // This depends on your PayPal link format
      // If your link doesn't support amount parameter, this won't work
      console.log('Selected amount: $' + amount);
      // You can update the PayPal link here if it supports amount parameters
      // Example: if (paypalLink) paypalLink.href = `https://paypal.me/yourhandle/${amount}`;
    }
  }

  // ------------------------------------------
  // Utility Functions
  // ------------------------------------------

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    return re.test(email);
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : fallback;
    } catch (err) {
      console.error(`Error reading localStorage (${key}):`, err);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error writing to localStorage (${key}):`, err);
      return false;
    }
  }

  function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-message show ${type === 'success' ? 'success' : 'error'}`;
  }

  function clearMessage(el) {
    if (!el) return;
    el.className = 'form-message';
    el.textContent = '';
  }

})();
