/* ═══════════════════════════════════════════════
   MATEO FLORSHEIM — main.js
   ═══════════════════════════════════════════════ */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ── Typewriter ── */
const phrases = [
  'Quantitative Trader',
  'Finance & Data Science Student',
  'Student Pilot (PPL in Progress)',
  'ML Researcher',
  'Northeastern University \'29',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');
function type() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      setTimeout(() => { deleting = true; type(); }, 2200);
      return;
    }
  } else {
    typeEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 80);
}
type();

/* ── Hero image fallback ── */
function setupImageFallback(imgId, placeholderId) {
  const img = document.getElementById(imgId);
  const placeholder = document.getElementById(placeholderId);
  if (!img) return;
  img.addEventListener('load', () => {
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  });
  img.addEventListener('error', () => {
    img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'flex';
  });
  // Check if already loaded or broken
  if (img.complete) {
    if (img.naturalWidth === 0) {
      img.style.display = 'none';
      if (placeholder) placeholder.style.display = 'flex';
    } else {
      img.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    }
  }
}
setupImageFallback('heroPhoto', 'heroPlaceholder');
setupImageFallback('ccPhoto', 'ccPlaceholder');

/* ── Reveal on scroll ── */
const revealEls = document.querySelectorAll('.reveal, .fade-in-up');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ── Animated counters ── */
const counters = document.querySelectorAll('.stat-num[data-count]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '+';
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 40);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach(c => counterObserver.observe(c));

/* ── Skill bar animations ── */
const skillFills = document.querySelectorAll('.skill-bar-fill[data-width]');
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        barObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.4 }
);
skillFills.forEach(bar => barObserver.observe(bar));

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}, { passive: true });

/* ── Footer year ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Particle canvas ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.3;
      this.speed = Math.random() * 0.4 + 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? `rgba(212,168,67,${this.alpha})`
        : `rgba(79,142,247,${this.alpha})`;
    }
    update() {
      this.y -= this.speed;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
