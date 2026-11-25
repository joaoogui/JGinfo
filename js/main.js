/* ==========================================================================
   JG INFO — main.js
   Header scroll, menu mobile, smooth scroll, animações de entrada
   ========================================================================== */

(function () {
  'use strict';

  // =========================================================================
  // 1. HEADER — transição no scroll
  // =========================================================================
  const header = document.getElementById('site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Checar no carregamento

  // =========================================================================
  // 2. MENU MOBILE — toggle
  // =========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav  = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      // Bloquear scroll quando menu está aberto
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fechar ao clicar em um link
    mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // =========================================================================
  // 3. DROPDOWN DESKTOP — toggle acessível
  // =========================================================================
  const dropdownToggles = document.querySelectorAll('.nav__dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      // Fechar todos os outros dropdowns
      dropdownToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
      toggle.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // Fechar dropdown clicando fora
  document.addEventListener('click', () => {
    dropdownToggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
  });

  // =========================================================================
  // 4. SMOOTH SCROLL — links internos
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 70;
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  // =========================================================================
  // 5. SCROLL REVEAL — animação de entrada
  // =========================================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Adicionar data-reveal nos elementos que devem animar
  const revealTargets = [
    '.pilar-card',
    '.nfc-item',
    '.contato-card',
    '.hero__badge',
    '.hero__title',
    '.hero__subtitle',
    '.hero__actions',
    '.hero__stats',
    '.section__header',
    '.nfc-section__content',
    '.nfc-section__visual',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      // Delay escalonado para cartões
      if (el.classList.contains('pilar-card') ||
          el.classList.contains('nfc-item') ||
          el.classList.contains('contato-card')) {
        el.setAttribute('data-reveal-delay', (i % 3) + 1);
      }
      revealObserver.observe(el);
    });
  });

  // =========================================================================
  // 6. ANO NO FOOTER
  // =========================================================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =========================================================================
  // 7. URL DA BARRA DO BROWSER NO PORTFÓLIO
  //    Atualizada via portfolio.js — exposta como função global
  // =========================================================================
  window.updateFrameUrl = function (niche) {
    const urlBar = document.querySelector('.frame-url');
    const urls = {
      barbershop: 'barbearia.jginfo.com.br',
      bakery:     'padaria.jginfo.com.br',
      law:        'advocacia.jginfo.com.br',
      clinic:     'clinica.jginfo.com.br',
      store:      'loja.jginfo.com.br',
    };
    if (urlBar) urlBar.textContent = urls[niche] || 'preview.jginfo.com.br';
  };

})();
