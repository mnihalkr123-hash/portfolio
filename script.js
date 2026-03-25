/* ============================================================
   MUHAMMED NIHAL K R — PORTFOLIO JS
   All interactions, animations, effects
   ============================================================ */

'use strict';

// ─── LOADER ───────────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
      triggerHeroAnimations();
    }, 2000);
  });
})();

// ─── CUSTOM CURSOR ────────────────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
})();

// ─── PARTICLE CANVAS ──────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.3;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192,192,192,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(192,192,192,${0.07 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ─── NAVBAR ───────────────────────────────────────────────
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current
        ? 'var(--white)' : '';
    });
  }, { passive: true });
})();

// ─── BACK TO TOP ──────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─── HERO ANIMATIONS ─────────────────────────────────────
function triggerHeroAnimations() {
  const els = document.querySelectorAll('#hero .reveal-up');
  els.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 200 + i * 180);
  });
}

// ─── TYPED EFFECT ─────────────────────────────────────────
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Digital Marketing Specialist',
    'SEO Strategist',
    'Meta Ads Expert',
    'Content Creator',
    'Brand Storyteller',
  ];

  let pIdx = 0, cIdx = 0, deleting = false, pause = false;

  function type() {
    if (pause) { setTimeout(type, 1800); pause = false; return; }

    const phrase = phrases[pIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; pause = true; }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }

    setTimeout(type, deleting ? 45 : 80);
  }

  // start after loader
  setTimeout(type, 2500);
})();

// ─── INTERSECTION OBSERVER / SCROLL REVEAL ────────────────
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // trigger skill bars if applicable
        const fills = entry.target.querySelectorAll('.skill-fill[data-width]');
        fills.forEach(fill => {
          fill.style.width = fill.dataset.width;
        });

        // if it's inside a skills grid item
        if (entry.target.classList.contains('skill-card')) {
          const fill = entry.target.querySelector('.skill-fill');
          if (fill && fill.dataset.width) {
            setTimeout(() => { fill.style.width = fill.dataset.width; }, 200);
          }
        }
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => obs.observe(el));
})();

// ─── PARALLAX HERO ────────────────────────────────────────
(function initParallax() {
  const hero = document.getElementById('hero');
  const glow = hero ? hero.querySelector('.hero-glow') : null;

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s < window.innerHeight) {
      if (glow) glow.style.transform = `translate(-50%, calc(-50% + ${s * 0.15}px))`;
    }
  }, { passive: true });
})();

// ─── CONTACT FORM ─────────────────────────────────────────
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<span>Sending…</span><i class="fas fa-circle-notch fa-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
      form.reset();
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 4000);
    }, 1600);
  });
})();

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── TILT ON SKILL CARDS ─────────────────────────────────
(function initCardTilt() {
  document.querySelectorAll('.skill-card, .edu-card, .timeline-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      card.style.transform = `translateY(-5px) rotateX(${-y * 0.015}deg) rotateY(${x * 0.015}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ─── GLINT EFFECT ON SILVER ELEMENTS ─────────────────────
(function initGlint() {
  const glintTargets = document.querySelectorAll('.hero-name .silver-text, .footer-logo, .nav-logo');

  glintTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.backgroundPosition = '200% center';
    });
    el.addEventListener('mouseleave', () => {
      el.style.backgroundPosition = '0% center';
    });
    el.style.backgroundSize = '200% auto';
    el.style.transition = 'background-position 0.8s ease';
  });
})();
