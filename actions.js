// ============================================ 
// THREADS OF CONNECTION — ACTIONS PAGE LOGIC
// File: actions.js
// ============================================

// ============================================
// HELPER FUNCTIONS
// ============================================

// Read JSON from localStorage
function readJSON(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading JSON from localStorage:', e);
    return null;
  }
}

// Write JSON to localStorage
function writeJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error writing JSON to localStorage:', e);
    return false;
  }
}

// Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show form message
function showMessage(messageEl, text, type) {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = 'form-message show ' + type;
  messageEl.style.display = 'block';
}

// Clear form message
function clearMessage(messageEl) {
  if (!messageEl) return;
  messageEl.textContent = '';
  messageEl.className = 'form-message';
  messageEl.style.display = 'none';
}

// ============================================
// FLOATING ORBS ANIMATION (Hero + Footer)
// ============================================
function createOrbs(containerId, count = 8) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const orb = document.createElement('div');
    orb.className = 'orb';

    // Random size (40px–120px)
    const size = Math.random() * 80 + 40;
    orb.style.width = size + 'px';
    orb.style.height = size + 'px';

    // Random start position
    orb.style.left = Math.random() * 100 + '%';
    orb.style.top = Math.random() * 100 + '%';

    // Random animation delay & duration
    orb.style.animationDelay = Math.random() * 4 + 's';
    orb.style.animationDuration = (Math.random() * 6 + 10) + 's';

    container.appendChild(orb);
  }
}

// ============================================
// HERO CANVAS ANIMATION (optional soft background)
// ============================================
function initHeroCanvas() {
  const canvas = document.getElementById('actions-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  // Particles
  const particles = [];
  const particleCount = 40;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });
}

// ============================================
// MODAL SYSTEM
// ============================================
function initModals() {
  const modals = document.querySelectorAll('.modal');
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const modalClosers = document.querySelectorAll('.modal-close, [data-close-modal]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (modalId === 'rsvp-modal') {
          const eventName = trigger.getAttribute('data-event');
          const eventNameEl = document.getElementById('rsvp-event-name');
          if (eventNameEl && eventName) eventNameEl.textContent = eventName;
        }
      }
    });
  });

  modalClosers.forEach(closer => {
    closer.addEventListener('click', () => {
      const modal = closer.closest('.modal');
      if (modal) closeModal(modal);
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) closeModal(modal);
      });
    }
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const formMessage = modal.querySelector('.form-message');
    if (formMessage) clearMessage(formMessage);
  }
}

// ============================================
// VOLUNTEER FORM
// ============================================
function initVolunteerForm() {
  const volunteerForm = document.getElementById('volunteer-form');
  const volunteerMessage = document.getElementById('volunteer-message');
  if (!volunteerForm) return;

  volunteerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessage(volunteerMessage);

    const name = document.getElementById('vol-name').value.trim();
    const email = document.getElementById('vol-email').value.trim();
    const interests = document.getElementById('vol-interests').value;
    const notes = document.getElementById('vol-notes').value.trim();

    if (!name) { showMessage(volunteerMessage, 'Please enter your name.', 'error'); return; }
    if (!email || !isValidEmail(email)) {
      showMessage(volunteerMessage, 'Please enter a valid email address.', 'error'); return;
    }

    const volunteer = {
      id: Date.now(), name, email, interests, notes, timestamp: new Date().toISOString()
    };

    let volunteers = readJSON('volunteers') || [];
    volunteers.push(volunteer);
    writeJSON('volunteers', volunteers);

    showMessage(volunteerMessage, 'Thank you for signing up! We\'ll be in touch soon.', 'success');
    volunteerForm.reset();

    setTimeout(() => {
      const modal = document.getElementById('volunteer-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        clearMessage(volunteerMessage);
      }
    }, 2000);
  });
}

// ============================================
// RSVP FORM
// ============================================
function initRsvpForm() {
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpMessage = document.getElementById('rsvp-message');
  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessage(rsvpMessage);

    const name = document.getElementById('rsvp-name').value.trim();
    const email = document.getElementById('rsvp-email').value.trim();
    const eventName = document.getElementById('rsvp-event-name').textContent;

    if (!name) { showMessage(rsvpMessage, 'Please enter your name.', 'error'); return; }
    if (!email || !isValidEmail(email)) {
      showMessage(rsvpMessage, 'Please enter a valid email address.', 'error'); return;
    }

    const rsvp = {
      id: Date.now(), name, email, eventName, timestamp: new Date().toISOString()
    };

    let rsvps = readJSON('rsvps') || [];
    rsvps.push(rsvp);
    writeJSON('rsvps', rsvps);

    showMessage(rsvpMessage, 'RSVP confirmed! Check your email for details.', 'success');
    rsvpForm.reset();

    setTimeout(() => {
      const modal = document.getElementById('rsvp-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        clearMessage(rsvpMessage);
      }
    }, 2000);
  });
}

// ============================================
// NEWSLETTER FORM
// ============================================
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterMessage = document.getElementById('newsletter-message');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('newsletter-email').value.trim();
    if (!email || !isValidEmail(email)) {
      newsletterMessage.textContent = 'Please enter a valid email address.';
      newsletterMessage.style.color = '#e74c3c';
      return;
    }

    const subscriber = { id: Date.now(), email, timestamp: new Date().toISOString() };

    let subscribers = readJSON('newsletter_subscribers') || [];
    if (subscribers.some(sub => sub.email === email)) {
      newsletterMessage.textContent = 'You\'re already subscribed!';
      newsletterMessage.style.color = '#f39c12';
      return;
    }

    subscribers.push(subscriber);
    writeJSON('newsletter_subscribers', subscribers);

    newsletterMessage.textContent = 'Thanks for subscribing!';
    newsletterMessage.style.color = '#2ecc71';
    newsletterForm.reset();
  });
}

// ============================================
// COPY SHARE LINK
// ============================================
function initShareLink() {
  const copyShareBtn = document.getElementById('copy-share-link');
  if (!copyShareBtn) return;

  copyShareBtn.addEventListener('click', () => {
    const linkEl = document.getElementById('share-link');
    if (linkEl) {
      navigator.clipboard.writeText(linkEl.textContent).then(() => {
        const originalText = copyShareBtn.textContent;
        copyShareBtn.textContent = 'Copied!';
        copyShareBtn.style.background = '#2ecc71';
        setTimeout(() => {
          copyShareBtn.textContent = originalText;
          copyShareBtn.style.background = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  });
}

// ============================================
// IMPACT STATS COUNTER ANIMATION
// ============================================
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

function initImpactStats() {
  const volunteers = readJSON('volunteers') || [];
  const rsvps = readJSON('rsvps') || [];
  const stories = readJSON('stories') || [];

  const statsData = {
    stories: stories.length || 47,
    volunteers: volunteers.length || 12,
    events: rsvps.length || 8
  };

  const statElements = document.querySelectorAll('.impact-number');
  statElements.forEach(el => {
    const target = el.getAttribute('data-target');
    if (statsData[target] !== undefined) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(el, statsData[target]);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    }
  });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}

// ============================================
// INITIALIZE ALL ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  createOrbs('hero-orbs', 6);
  createOrbs('footer-orbs', 6);
  initHeroCanvas();

  initModals();
  initMobileMenu();

  initVolunteerForm();
  initRsvpForm();
  initNewsletterForm();
  initShareLink();

  initImpactStats();

  console.log('Actions page initialized successfully!');
});
