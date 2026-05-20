/* =========================================
   CUE MARKETING SOLUTIONS — JAVASCRIPT
   ========================================= */

'use strict';

// ===== NAVBAR: scroll effect & mobile menu =====
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== INTERSECTION OBSERVER: fade-in & service cards =====
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe service cards with staggered delay
document.querySelectorAll('.service-card').forEach((card, i) => {
  const delay = (i % 3) * 100; // 0, 100, 200 ms based on column
  card.style.transitionDelay = delay + 'ms';
  fadeObserver.observe(card);
});

// Observe generic fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
  fadeObserver.observe(el);
});

// Add fade-in to section headings and other blocks automatically
document.querySelectorAll(
  '.section-header, .about-text, .about-visual, .contact-info, .contact-form-wrap, .why-card'
).forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// ===== TESTIMONIALS SLIDER =====
const track    = document.getElementById('testimonialsTrack');
const dotsWrap = document.getElementById('tDots');
const prevBtn  = document.getElementById('tPrev');
const nextBtn  = document.getElementById('tNext');

if (track) {
  const cards = Array.from(track.children);
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    // Slides are 100% wide; each card takes full width in the grid
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 1.5}rem))`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => { resetAuto(); goTo(current - 1); });
  nextBtn.addEventListener('click', () => { resetAuto(); goTo(current + 1); });

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();
}

// ===== CONTACT FORM =====
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic client-side validation
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
      if (field.type === 'email' && field.value.trim()) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(field.value.trim())) {
          field.classList.add('error');
          valid = false;
        }
      }
    });

    if (!valid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate submission (replace with actual form handler / API call)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      formSuccess.style.display = 'flex';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1000);
  });

  // Remove error state on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });
}

// ===== ACTIVE NAV LINK on scroll =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.fontWeight = a.getAttribute('href') === '#' + entry.target.id ? '700' : '';
        a.style.color = (a.getAttribute('href') === '#' + entry.target.id && navbar.classList.contains('scrolled'))
          ? 'var(--blue)' : '';
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));
