/* ============================================ 
   THREADS OF CONNECTION - MAIN JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // ============================================
    // MOBILE NAVIGATION
    // ============================================

    class MobileNavigation {
        constructor() {
            this.toggle = document.querySelector('.mobile-menu-toggle');
            this.navLinks = document.querySelector('.nav-links');
            this.links = document.querySelectorAll('.nav-links a');
           
            if (this.toggle && this.navLinks) {
                this.init();
            }
        }

        init() {
            this.toggle.addEventListener('click', () => this.toggleMenu());

            this.links.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            document.addEventListener('click', (e) => {
		if (!this.toggle) return;
                if (!e.target.closest('.main-nav')) {
                    this.closeMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMenu();
                }
            });
        }

        toggleMenu() {
            this.toggle.classList.toggle('active');
            this.navLinks.classList.toggle('active');
           
            const isExpanded = this.navLinks.classList.contains('active');
            this.toggle.setAttribute('aria-expanded', String(isExpanded));
           
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        }

     closeMenu() {
  if (this.toggle) this.toggle.classList.remove('active');
  if (this.navLinks) this.navLinks.classList.remove('active');
  if (this.toggle) this.toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
}
   

    // ============================================
    // ANIMATED THREADS CANVAS (HERO)
    // ============================================

    class ThreadsCanvas {
        constructor() {
            this.canvas = document.getElementById('threads-canvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.threads = [];
            this.particles = [];
            this.colors = [
                '#9CAF88', // sage
                '#D4AF37', // gold
                '#B8A4C9', // purple
                '#D4A5A5', // rose
                '#B8C9A8' // sage light
            ];
           
            this.init();
        }

        init() {
            this.resize();
            this.createThreads();
            this.createParticles();
            this.animate();

            window.addEventListener('resize', debounce(() => this.resize(), 250));
        }

       resize() {
  const ratio = window.devicePixelRatio || 1;
  const w = this.canvas.clientWidth || this.canvas.offsetWidth;
  const h = this.canvas.clientHeight || this.canvas.offsetHeight;

  // set canvas backing size for sharpness
  this.canvas.width = Math.round(w * ratio);
  this.canvas.height = Math.round(h * ratio);
  this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  // clear existing arrays before recreating to avoid duplicates
  this.threads = [];
  this.particles = [];

  // create based on logical pixel size (adjust counts for small screens if desired)
  this.createThreads();
  this.createParticles();
});
            }
        }

        createParticles() {
            const numParticles = 30;
           
            for (let i = 0; i < numParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: 1 + Math.random() * 3,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    opacity: 0.3 + Math.random() * 0.7
                });
            }
        }

        drawThread(thread, time) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = thread.color;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.6;

            const points = 100;
            for (let i = 0; i <= points; i++) {
                const x = (this.canvas.width / points) * i;
                const y = thread.y +
                    Math.sin(x * thread.frequency + time * 0.001 + thread.phase) * thread.amplitude;
               
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }

        drawParticle(particle) {
            this.ctx.beginPath();
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;

            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
           
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = particle.opacity * 0.5;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }

        updateParticles() {
            this.particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;

                particle.opacity = 0.3 + Math.sin(Date.now() * 0.001 + particle.x) * 0.4;
            });
        }

        animate() {
            const time = Date.now();
           
            this.ctx.fillStyle = 'rgba(245, 241, 232, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.threads.forEach(thread => this.drawThread(thread, time));

            this.updateParticles();
            this.particles.forEach(particle => this.drawParticle(particle));

            requestAnimationFrame(() => this.animate());
        }
    }

 
    // ============================================ 
    // FOOTER CANVAS (SAME FLOWING THREADS)
    // ============================================

    class FooterCanvas {
        constructor() {
            this.canvas = document.getElementById('footer-canvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.threads = [];
            this.particles = [];
            this.colors = [
                '#9CAF88', // sage
                '#D4AF37', // gold
                '#B8A4C9', // purple
                '#D4A5A5', // rose
                '#B8C9A8' // sage light
            ];
           
            this.init();
        }

        init() {
            this.resize();
            this.createThreads();
            this.createParticles();
            this.animate();

            window.addEventListener('resize', debounce(() => this.resize(), 250));
        }

        resize() {
  const ratio = window.devicePixelRatio || 1;
  const w = this.canvas.clientWidth || this.canvas.offsetWidth;
  const h = this.canvas.clientHeight || this.canvas.offsetHeight;

  // set canvas backing size for sharpness
  this.canvas.width = Math.round(w * ratio);
  this.canvas.height = Math.round(h * ratio);
  this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  // clear existing arrays before recreating to avoid duplicates
  this.threads = [];
  this.particles = [];

  // create based on logical pixel size (adjust counts for small screens if desired)
  this.createThreads();
  this.createParticles();
});
            }
        }

        createParticles() {
            const numParticles = 30;
           
            for (let i = 0; i < numParticles; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: 1 + Math.random() * 3,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    opacity: 0.3 + Math.random() * 0.7
                });
            }
        }

        drawThread(thread, time) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = thread.color;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = 0.6;

            const points = 100;
            for (let i = 0; i <= points; i++) {
                const x = (this.canvas.width / points) * i;
                const y = thread.y +
                    Math.sin(x * thread.frequency + time * 0.001 + thread.phase) * thread.amplitude;
               
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }

        drawParticle(particle) {
            this.ctx.beginPath();
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;

            // Add glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
           
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = particle.opacity * 0.5;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }

        updateParticles() {
            this.particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;

                // Pulse opacity
                particle.opacity = 0.3 + Math.sin(Date.now() * 0.001 + particle.x) * 0.4;
            });
        }

        animate() {
            const time = Date.now();
           
            // Clear canvas with slight fade for trail effect
            this.ctx.fillStyle = 'rgba(245, 241, 232, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw threads
            this.threads.forEach(thread => this.drawThread(thread, time));

            // Update and draw particles
            this.updateParticles();
            this.particles.forEach(particle => this.drawParticle(particle));

            requestAnimationFrame(() => this.animate());
        }
    }


    // ============================================
    // SCROLL ANIMATIONS
    // ============================================

    class ScrollAnimations {
        constructor() {
            this.elements = document.querySelectorAll('.manifesto-content, .mission-content, .vision-content, .pillar, .vision-card');
            this.init();
        }

        init() {
            this.elements.forEach(el => {
                el.classList.add('fade-in');
            });

            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -100px 0px'
                }
            );

            this.elements.forEach(el => this.observer.observe(el));
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }
    }

    // ============================================
    // FOOTER REVEAL ANIMATION
    // ============================================

    class FooterReveal {
        constructor() {
            this.targets = document.querySelectorAll('.main-footer .footer-section, .main-footer .footer-bottom');
            if (this.targets.length === 0) return;

            if (!('IntersectionObserver' in window)) {
                this.targets.forEach(el => el.classList.add('in-view'));
                return;
            }

            this.init();
        }

        init() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            this.targets.forEach(el => this.observer.observe(el));
        }
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================

    class SmoothScroll {
        constructor() {
                        this.links = document.querySelectorAll('a[href^="#"]');
            this.init();
        }

        init() {
            this.links.forEach(link => {
                link.addEventListener('click', (e) => this.handleClick(e));
            });
        }

        handleClick(e) {
            const href = e.currentTarget.getAttribute('href');
           
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            history.pushState(null, null, href);
        }
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================

    class NavbarScroll {
        constructor() {
            this.nav = document.querySelector('.main-nav');
            if (!this.nav) return;
           
            this.lastScroll = 0;
            this.init();
        }

        init() {
            window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
        }

        handleScroll() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                this.nav.style.boxShadow = '0 4px 6px rgba(44, 62, 44, 0.1)';
            } else {
                this.nav.style.boxShadow = '0 1px 2px rgba(44, 62, 44, 0.05)';
            }

            this.lastScroll = currentScroll;
        }
    }

    // ============================================
    // GLITTER EFFECT
    // ============================================

    class GlitterEffect {
        constructor() {
            this.containers = document.querySelectorAll('.hero-title, .section-title');
            this.init();
        }

        init() {
            this.containers.forEach(container => {
                this.addGlitter(container);
            });
        }

        addGlitter(container) {
            setInterval(() => {
                const glitter = document.createElement('span');
                glitter.textContent = '✨';
                glitter.style.position = 'absolute';
                glitter.style.left = Math.random() * 100 + '%';
                glitter.style.top = Math.random() * 100 + '%';
                glitter.style.fontSize = (Math.random() * 10 + 10) + 'px';
                glitter.style.opacity = '0';
                glitter.style.pointerEvents = 'none';
                glitter.style.transition = 'all 1s ease-out';
                glitter.style.zIndex = '10';

                container.style.position = 'relative';
                container.appendChild(glitter);

                setTimeout(() => {
                    glitter.style.opacity = '1';
                    glitter.style.transform = 'translateY(-20px)';
                }, 10);

                setTimeout(() => {
                    glitter.style.opacity = '0';
                    setTimeout(() => glitter.remove(), 1000);
                }, 2000);
            }, 3000);
        }
    }

    // ============================================
    // ACTIVE NAV LINK
    // ============================================

    class ActiveNavLink {
        constructor() {
            this.sections = document.querySelectorAll('section[id]');
            this.navLinks = document.querySelectorAll('.nav-links a');
            this.init();
        }

        init() {
            window.addEventListener('scroll', throttle(() => this.updateActiveLink(), 100));
            this.updateActiveLink();
        }

        updateActiveLink() {
            const scrollPosition = window.pageYOffset + 150;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            if (window.pageYOffset < 100) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === 'index.html' ||
                        link.getAttribute('href') === '#' ||
                        link.textContent.trim() === 'Home') {
                        link.classList.add('active');
                    }
                });
            }
        }
    }

    // ============================================
    // PARALLAX EFFECT
    // ============================================

    class ParallaxEffect {
        constructor() {
            this.hero = document.querySelector('.hero');
            if (!this.hero) return;
            this.init();
        }

        init() {
            window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));
        }

        handleScroll() {
            const scrolled = window.pageYOffset;
            const heroContent = this.hero.querySelector('.hero-content');
           
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        }
    }

    // ============================================
    // TYPING EFFECT FOR HERO
    // ============================================

    class TypingEffect {
        constructor() {
            this.element = document.querySelector('.hero-subtitle');
            if (!this.element) return;
           
            this.text = this.element.textContent;
            this.element.textContent = '';
            this.index = 0;
            this.speed = 50;
           
            setTimeout(() => this.init(), 2000);
        }

        init() {
            this.type();
        }

        type() {
            if (this.index < this.text.length) {
                this.element.textContent += this.text.charAt(this.index);
                this.index++;
                setTimeout(() => this.type(), this.speed);
            }
        }
    }

    // ============================================
    // FORM VALIDATION (for future contact form)
    // ============================================

    class FormValidation {
        constructor() {
            this.forms = document.querySelectorAll('form');
            if (this.forms.length === 0) return;
            this.init();
        }

        init() {
            this.forms.forEach(form => {
                form.addEventListener('submit', (e) => this.handleSubmit(e));
               
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => this.validateField(input));
                });
            });
        }

        handleSubmit(e) {
            e.preventDefault();
            const form = e.target;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                console.log('Form is valid, submitting...');
            }
        }

        validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            let isValid = true;
            let errorMessage = '';

            if (field.hasAttribute('required') && value === '') {
                isValid = false;
                errorMessage = 'This field is required';
            }

            if (type === 'email' && value !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            this.showError(field, isValid, errorMessage);
            return isValid;
        }

        showError(field, isValid, message) {
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            field.classList.remove('error');

            if (!isValid) {
                field.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                errorDiv.style.color = '#D4A5A5';
                errorDiv.style.fontSize = '0.875rem';
                errorDiv.style.marginTop = '0.25rem';
                field.parentElement.appendChild(errorDiv);
            }
        }
    }

    // ============================================
    // INITIALIZE ALL COMPONENTS
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        new MobileNavigation();
        new ThreadsCanvas();
        new ScrollAnimations();
        new FooterReveal();
        new SmoothScroll();
        new NavbarScroll();
        new GlitterEffect();
        new ActiveNavLink();
        new ParallaxEffect();
        new TypingEffect();
        new FormValidation();

        console.log('🧵 Threads of Connection initialized');
    }

})();
