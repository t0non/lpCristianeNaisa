/* =============================================
   SCRIPT — Enf. Cristiane Naísa Landing Page
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

  animEls.forEach((el) => {
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

  /* ── 5. TREATMENT CARDS STAGGER ─────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });

  const diffCards = document.querySelectorAll('.diff-card');
  diffCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });

  /* ── 6. NUMBER COUNTER ANIMATION ─────────── */
  const counters = document.querySelectorAll('.cred-number');
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
    // Se não for um número puro (ex: "+200" ou "100%"), extrai
    const prefix  = text.match(/^[^0-9]*/)?.[0] || '';
    const suffix  = text.match(/[^0-9]*$/)?.[0] || '';
    const num     = parseInt(text.replace(/\D/g, ''), 10);

    if (isNaN(num)) return;

    const duration = 1600;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(eased * num);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  counters.forEach((c) => countObserver.observe(c));

  /* ── 7. MICRO RIPPLE ON CTA BUTTONS ─────── */
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


  /* =============================================
     ── 8. FLOATING WHATSAPP CHAT WIDGET ────────
     ============================================= */

  // Configurações do Widget
  const config = {
    whatsappNumber: '5531991856050',
    initialMessage: 'Olá! Gostaria de saber mais sobre o Cronograma de Gerenciamento de Pele.',
    bubbleDelay1: 1500, // delay para aparecer msg 1
    bubbleDelay2: 5500, // delay para aparecer msg 2 (a partir do início)
    pushNotificationDelay: 25000, // 25 segundos para push de topo
  };



  // Seletores do DOM
  const wppFloatingBtn = document.getElementById('wpp-floating-btn');
  const wppBtnAvatar = document.getElementById('wpp-btn-avatar');
  const wppBtnCloseIcon = document.getElementById('wpp-btn-close-icon');
  const wppPulseOnline = document.getElementById('wpp-pulse-online');
  const wppChatWindow = document.getElementById('wpp-chat-window');
  const wppChatClose = document.getElementById('wpp-chat-close');
  const wppChatBody = document.getElementById('wpp-chat-body');

  const wppPreviewBubbles = document.getElementById('wpp-preview-bubbles');
  const wppBubble1 = document.getElementById('wpp-bubble-1');
  const wppBubble2 = document.getElementById('wpp-bubble-2');
  const wppBubbleTyping = document.getElementById('wpp-bubble-typing');

  const wppTopTyping = document.getElementById('wpp-top-typing');
  const wppPushNotification = document.getElementById('wpp-push-notification');
  const wppPushClose = document.getElementById('wpp-push-close');

  const wppMsg1 = document.getElementById('wpp-msg-1');
  const wppMsg2 = document.getElementById('wpp-msg-2');
  const wppMsg3 = document.getElementById('wpp-msg-3');
  const wppMsg4 = document.getElementById('wpp-msg-4');
  const wppMsgTyping = document.getElementById('wpp-msg-typing');

  // Estados
  let chatIsOpen = false;
  let hasInteracted = false;
  let pushHasTriggered = false;
  let bubbleSequenceStarted = false;

  // Gerador de Som Sintetizado Ultra-Premium (Web Audio API)
  // Cria um som duplo cristalino idêntico a chimes de notificação
  function playNotificationSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Primeira nota (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.4);

      // Segunda nota (E5) com pequeno delay
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      }, 120);

    } catch (e) {
      console.log('AudioContext not allowed or not supported:', e);
    }
  }

  // --- ARRASTO / DESLIZE PARA FECHAR NOTIFICAÇÃO NO MOBILE ---
  let touchStartX = 0;
  let touchStartY = 0;
  let dragX = 0;
  let dragY = 0;
  let isDragging = false;

  wppPushNotification.addEventListener('touchstart', (e) => {
    if (e.targetTouches.length !== 1) return;
    touchStartX = e.targetTouches[0].clientX;
    touchStartY = e.targetTouches[0].clientY;
    isDragging = true;
    wppPushNotification.style.transition = 'none';
  }, { passive: true });

  wppPushNotification.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    dragX = currentX - touchStartX;
    dragY = currentY - touchStartY;

    // Apenas permitir arrastar para cima ou laterais
    const effectiveY = Math.min(0, dragY);
    wppPushNotification.style.transform = `translate(${dragX}px, ${effectiveY}px)`;

    const width = wppPushNotification.offsetWidth || 340;
    const height = wppPushNotification.offsetHeight || 100;
    const percentX = Math.abs(dragX) / width;
    const percentY = Math.abs(effectiveY) / height;
    const maxPercent = Math.max(percentX, percentY);
    wppPushNotification.style.opacity = Math.max(0.4, 1 - maxPercent);
  }, { passive: true });

  wppPushNotification.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    const width = wppPushNotification.offsetWidth || 340;
    const height = wppPushNotification.offsetHeight || 100;
    const percentX = Math.abs(dragX) / width;
    const percentY = Math.abs(dragY) / height;

    // Se arrastou mais de 35%, descarta
    if (percentX > 0.35 || percentY > 0.35) {
      wppPushNotification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      wppPushNotification.style.opacity = '0';
      if (percentX > percentY) {
        wppPushNotification.style.transform = `translateX(${Math.sign(dragX) * window.innerWidth}px)`;
      } else {
        wppPushNotification.style.transform = 'translateY(-200px)';
      }
      setTimeout(() => {
        wppPushNotification.classList.add('hidden');
      }, 300);
    } else {
      // Snap-back (retorno suave)
      wppPushNotification.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s';
      wppPushNotification.style.transform = 'translate(0, 0)';
      wppPushNotification.style.opacity = '1';
    }
    dragX = 0;
    dragY = 0;
  });

  // --- LÓGICA DE EXECUÇÃO DAS BOLHAS SEQUENCIAIS ---
  function startBubbleSequence() {
    if (bubbleSequenceStarted || chatIsOpen) return;
    bubbleSequenceStarted = true;

    // Mostrar Digitando Bubble
    setTimeout(() => {
      if (chatIsOpen) return;
      wppBubbleTyping.classList.remove('hidden');
    }, 500);

    // Mostrar Primeira Mensagem
    setTimeout(() => {
      if (chatIsOpen) return;
      wppBubbleTyping.classList.add('hidden');
      wppBubble1.classList.remove('remove', 'hidden');
      playNotificationSound();
    }, config.bubbleDelay1);

    // Mostrar Digitando Bubble 2
    setTimeout(() => {
      if (chatIsOpen) return;
      wppBubbleTyping.classList.remove('hidden');
    }, config.bubbleDelay2 - 1200);

    // Mostrar Segunda Mensagem
    setTimeout(() => {
      if (chatIsOpen) return;
      wppBubbleTyping.classList.add('hidden');
      wppBubble2.classList.remove('hidden');
      playNotificationSound();
    }, config.bubbleDelay2);
  }

  // --- LÓGICA DO PUSH DE TOPO (NOTIFICAÇÃO) ───
  function triggerPushNotification() {
    if (pushHasTriggered || chatIsOpen || hasInteracted) return;
    pushHasTriggered = true;

    // Mostra pill de "digitando..." no topo primeiro
    wppTopTyping.classList.remove('hidden');

    setTimeout(() => {
      wppTopTyping.classList.add('hidden');
      wppPushNotification.classList.remove('hidden');
      playNotificationSound();

      // Esconde automaticamente após 7 segundos se não interagir
      setTimeout(() => {
        if (!wppPushNotification.classList.contains('hidden') && !isDragging) {
          wppPushNotification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          wppPushNotification.style.opacity = '0';
          wppPushNotification.style.transform = 'translateY(-40px)';
          setTimeout(() => {
            wppPushNotification.classList.add('hidden');
          }, 300);
        }
      }, 7000);
    }, 2500);
  }

  // Ativadores do Push (tempo ou scroll)
  setTimeout(triggerPushNotification, config.pushNotificationDelay);

  // Inicia bolhas de preview 2.5s após carregar a página
  setTimeout(startBubbleSequence, 2000);

  // --- INTERAÇÕES / CLIQUES DO WIDGET ---

  // Abrir / Fechar Chat
  function toggleChat() {
    chatIsOpen = !chatIsOpen;
    hasInteracted = true;

    // Oculta notificações de topo e previews
    wppPushNotification.classList.add('hidden');
    wppPreviewBubbles.classList.add('hidden');

    if (chatIsOpen) {
      // Abre a janela
      wppChatWindow.classList.remove('hidden');
      wppBtnAvatar.classList.add('hidden');
      wppBtnCloseIcon.classList.remove('hidden');
      wppPulseOnline.classList.add('hidden');

      // Sequência de mensagens dentro da janela
      wppMsg1.classList.add('hidden');
      wppMsg2.classList.add('hidden');
      wppMsg3.classList.add('hidden');
      wppMsg4.classList.add('hidden');
      wppMsgTyping.classList.remove('hidden');

      setTimeout(() => {
        wppMsgTyping.classList.add('hidden');
        wppMsg1.classList.remove('hidden');
        wppChatBody.scrollTop = wppChatBody.scrollHeight;
      }, 1000);

      setTimeout(() => {
        wppMsgTyping.classList.remove('hidden');
        wppChatBody.scrollTop = wppChatBody.scrollHeight;
      }, 2200);

      setTimeout(() => {
        wppMsgTyping.classList.add('hidden');
        wppMsg2.classList.remove('hidden');
        wppChatBody.scrollTop = wppChatBody.scrollHeight;
      }, 3500);

      setTimeout(() => {
        wppMsgTyping.classList.remove('hidden');
        wppChatBody.scrollTop = wppChatBody.scrollHeight;
      }, 4700);

      setTimeout(() => {
        wppMsgTyping.classList.add('hidden');
        wppMsg3.classList.remove('hidden');
        wppChatBody.scrollTop = wppChatBody.scrollHeight;
      }, 6200);

      setTimeout(() => {
        wppMsgTyping.classList.remove('hidden');
        wppChatBody.scrollTop = wppChatBody.scrollHeight;
      }, 7500);

      setTimeout(() => {
        wppMsgTyping.classList.add('hidden');
        wppMsg4.classList.remove('hidden');
        wppChatBody.scrollTop = wppChatBody.scrollHeight;
      }, 9000);

    } else {
      // Fecha a janela
      wppChatWindow.classList.add('hidden');
      wppBtnAvatar.classList.remove('hidden');
      wppBtnCloseIcon.classList.add('hidden');
    }
  }

  wppFloatingBtn.addEventListener('click', toggleChat);
  wppChatClose.addEventListener('click', toggleChat);

  // Clicar nas bolhas de preview também abre o chat
  wppBubble1.addEventListener('click', toggleChat);
  wppBubble2.addEventListener('click', toggleChat);

  // Fechar notificação push de topo
  if (wppPushClose) {
    wppPushClose.addEventListener('click', (e) => {
      e.stopPropagation();
      wppPushNotification.classList.add('hidden');
    });
  }

  // Clique na notificação push de topo abre o WhatsApp diretamente
  wppPushNotification.addEventListener('click', (e) => {
    if (e.target.closest('#wpp-push-close')) return;
    if (Math.abs(dragX) > 10 || Math.abs(dragY) > 10) return; // evita clique falso ao arrastar
    window.open(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(config.initialMessage)}`, '_blank', 'noopener');
  });

  // Image Modal Logic
  const imageModal = document.getElementById("image-modal");
  const imageModalImg = document.getElementById("image-modal-img");
  const imageModalClose = document.getElementById("image-modal-close");
  const sliderImages = document.querySelectorAll(".slider-img");

  if (imageModal && imageModalImg && imageModalClose) {
    sliderImages.forEach(img => {
      img.addEventListener("click", function() {
        imageModal.classList.add("active");
        imageModalImg.src = this.src;
      });
    });

    imageModalClose.addEventListener("click", function() {
      imageModal.classList.remove("active");
    });

    imageModal.addEventListener("click", function(e) {
      if (e.target === imageModal) {
        imageModal.classList.remove("active");
      }
    });
  }

  console.log('✨ Dra. Cristiane Naisa LP — Floating WhatsApp initialized!');
});
