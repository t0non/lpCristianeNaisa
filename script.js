/* =============================================
   SCRIPT — Dra. Cristiane Naisa Landing Page
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. HEADER SCROLL EFFECT ─────────────── */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. INTERSECTION OBSERVER ANIMATIONS ─── */
  const animEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // stagger children within grids
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animEls.forEach((el, i) => {
    // Add stagger delay based on siblings
    const parent = el.parentElement;
    const siblings = [...parent.children].filter(c => c.hasAttribute('data-animate'));
    const idx = siblings.indexOf(el);
    el.dataset.delay = idx * 100;
    observer.observe(el);
  });

  /* ── 3. FAQ ACCORDION ────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach((other) => {
        if (other !== item) {
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').classList.remove('open');
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.classList.toggle('open', !isOpen);
    });
  });

  /* ── 4. SMOOTH ANCHOR SCROLL ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 5. WHATSAPP FLOAT SHOW/HIDE ─────────── */
  const waFloat = document.getElementById('whatsapp-float');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > 300) {
      waFloat.style.opacity = '1';
      waFloat.style.pointerEvents = 'auto';
    } else {
      waFloat.style.opacity = '0.85';
    }
    lastY = currentY;
  }, { passive: true });

  /* ── 6. TREATMENT CARDS STAGGER ─────────── */
  const treatCards = document.querySelectorAll('.treatment-card');
  treatCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });

  /* ── 7. TESTIMONIAL CARDS STAGGER ───────── */
  const testCards = document.querySelectorAll('.testimonial-card');
  testCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });

  /* ── 8. HERO PARALLAX (subtle) ───────────── */
  const heroBg = document.querySelector('.hero-bg-overlay');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${y}px)`;
    }, { passive: true });
  }

  /* ── 9. NUMBER COUNTER ANIMATION ─────────── */
  const counters = document.querySelectorAll('.stat-num');
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  function animateCounter(el) {
    const text    = el.textContent.trim();
    const prefix  = text.match(/^[^0-9]*/)?.[0] || '';
    const suffix  = text.match(/[^0-9]*$/)?.[0] || '';
    const num     = parseInt(text.replace(/\D/g, ''), 10);

    if (isNaN(num)) return;

    const duration = 1600;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  counters.forEach((c) => countObserver.observe(c));

  /* ── 10. ACTIVE NAV HIGHLIGHT ─────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ── 11. MICRO RIPPLE ON CTA BUTTONS ─────── */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        top: ${e.clientY - rect.top - size / 2}px;
        left: ${e.clientX - rect.left - size / 2}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  console.log('✨ Dra. Cristiane Naisa LP — Initialized');
});
