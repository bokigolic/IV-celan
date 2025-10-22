// ===== IV Clean - unified script (all pages) =====
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ===== Navbar: shrink + transparency on scroll (rAF, passive) =====
  const nav = $('.navbar');
  if (nav) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ===== Mobile drawer / hamburger =====
  const burger = $('.hamburger');
  const links = $('.nav-links');
  if (burger && links) {
    const closeMenu = () => {
      burger.classList.remove('active');
      links.classList.remove('active');
    };
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      links.classList.toggle('active');
    });
    // close on link click
    $$('.nav-links a', links).forEach(a => a.addEventListener('click', closeMenu));
    // close on ESC
    document.addEventListener('keyup', (e) => { if (e.key === 'Escape') closeMenu(); });
    // click outside
    document.addEventListener('click', (e) => {
      if (!links.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
  }

  // ===== Fade-in on scroll (sections + .animate + .service-card) =====
  const toObserve = $$('section, .animate, .service-card');
  if (toObserve.length) {
    toObserve.forEach(el => el.classList.add('fade-in'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target); // posmatraj samo jednom
        }
      });
    }, { threshold: 0.12 });
    toObserve.forEach(el => io.observe(el));
  }

  // ===== Ripple efekt na .btn (stabilan položaj pomoću getBoundingClientRect) =====
  $$('.btn').forEach(btn => {
    btn.style.position = getComputedStyle(btn).position === 'static' ? 'relative' : getComputedStyle(btn).position;
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', (e) => {
      const circle = document.createElement('span');
      circle.className = 'ripple';
      btn.appendChild(circle);

      const rect = btn.getBoundingClientRect();
      const d = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${d}px`;
      circle.style.left = `${e.clientX - rect.left - d / 2}px`;
      circle.style.top = `${e.clientY - rect.top - d / 2}px`;

      setTimeout(() => circle.remove(), 600);
    });
  });

  // ===== Flip-card (tap na touch uređajima) =====
  $$('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });

  // ===== Jednostavan slider (gallery/home); radi i ako ne postoji =====
  const slider = $('.slider');
  const slides = $$('.slide');
  const prev = $('.prev');
  const next = $('.next');
  if (slider && slides.length) {
    let index = 0;
    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      slider.style.transform = `translateX(-${index * 100}%)`;
    };
    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    goTo(0);
  }
});
