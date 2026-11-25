/* ==========================================================================
   JG INFO — main.js  v2.0
   Comportamentos globais da página principal:
   
   ┌──────────────────────────────────────────────────────────────────────┐
   │  1. HEADER SCROLL — transição transparente → sólido                 │
   │  2. MENU MOBILE — toggle do menu hambúrguer                         │
   │  3. DROPDOWN DESKTOP — abre/fecha ao clicar no "Serviços"           │
   │  4. SMOOTH SCROLL — rolagem suave para seções internas              │
   │  5. SCROLL REVEAL — animação de entrada dos elementos               │
   │  6. PORTFOLIO FRAME URL — atualiza a barra do browser fake          │
   │  7. ANO NO FOOTER — atualizado automaticamente                      │
   └──────────────────────────────────────────────────────────────────────┘
   
   COMO EDITAR:
   ─────────────
   • Para mudar o ponto de scroll onde o header muda de cor:
     Altere o valor 50 na função handleHeaderScroll().
   
   • Para adicionar um novo elemento com animação de entrada:
     Adicione seu seletor CSS ao array revealTargets abaixo.
   
   • Para desativar o smooth scroll em algum link específico:
     Adicione o atributo data-no-smooth ao <a>.
   ========================================================================== */

(function () {
  'use strict';

  /* =========================================================================
     1. HEADER — TRANSIÇÃO NO SCROLL
     
     Comportamento:
     - Estado inicial (topo da página): header transparente, fundo do hero visível.
     - Após rolar 50px: adiciona .header--scrolled que aplica backdrop-blur + sombra.
     
     Referência CSS: .header--scrolled em components.css
     ========================================================================= */
  var header = document.getElementById('site-header');

  /**
   * Adiciona ou remove a classe .header--scrolled baseado na posição do scroll.
   * Chamada a cada evento de scroll e também uma vez ao carregar (caso página
   * já comece em meio ao scroll — ex: ao recarregar com âncora #secao).
   */
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');    // Aplica fundo escuro + blur
    } else {
      header.classList.remove('header--scrolled'); // Volta ao transparente
    }
  }

  /* { passive: true } melhora a performance do scroll — diz ao browser que
     não vamos chamar preventDefault() dentro do handler. */
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Verificar estado inicial ao carregar a página


  /* =========================================================================
     2. MENU MOBILE — TOGGLE DO HAMBÚRGUER
     
     Ao clicar no botão #menu-toggle:
     - Adiciona .is-open ao menu e ao botão (ativa animação X no burguer)
     - Atualiza aria-expanded para acessibilidade
     - Bloqueia scroll do body enquanto menu está aberto
     ========================================================================= */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileNav  = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {

    menuToggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);

      /* Acessibilidade: comunica o estado atual para leitores de tela */
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);

      /* Bloquear/desbloquear scroll do body enquanto menu está aberto */
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Fechar o menu ao clicar em qualquer link do menu mobile */
    mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }


  /* =========================================================================
     3. DROPDOWN DESKTOP — TOGGLE ACESSÍVEL
     
     Ao clicar no botão "Serviços ▾":
     - Alterna o aria-expanded entre true/false
     - O CSS usa [aria-expanded="true"] para mostrar/ocultar o dropdown
     - Clicar fora fecha todos os dropdowns
     ========================================================================= */
  var dropdownToggles = document.querySelectorAll('.nav__dropdown-toggle');

  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation(); // Impede que o clique chegue ao document e feche imediatamente

      var isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      /* Fechar todos os dropdowns abertos antes de abrir o atual */
      dropdownToggles.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });

      /* Alternar o estado do dropdown clicado */
      toggle.setAttribute('aria-expanded', !isExpanded);
    });
  });

  /* Fechar dropdown ao clicar em qualquer lugar fora dele */
  document.addEventListener('click', function () {
    dropdownToggles.forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
    });
  });

  /* Fechar dropdown ao pressionar Escape (acessibilidade via teclado) */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdownToggles.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
    }
  });


  /* =========================================================================
     4. SMOOTH SCROLL — ROLAGEM SUAVE PARA SEÇÕES INTERNAS
     
     Intercepta cliques em links internos (href="#secao") e aplica
     rolagem suave descontando a altura do header fixo.
     
     Para desabilitar em um link específico, adicione data-no-smooth:
       <a href="#secao" data-no-smooth>Link</a>
     ========================================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      /* Respeitar o atributo data-no-smooth para casos específicos */
      if (anchor.hasAttribute('data-no-smooth')) return;

      var targetId = anchor.getAttribute('href');
      var target   = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      /* Calcular a posição descontando a altura do header fixo */
      var headerHeight = header ? header.offsetHeight : 70;
      var targetY      = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });


  /* =========================================================================
     5. SCROLL REVEAL — ANIMAÇÃO DE ENTRADA DOS ELEMENTOS
     
     Usa IntersectionObserver para detectar quando elementos entram no
     viewport e aplica a classe .revealed (que remove opacity:0 e translateY).
     
     Os estilos de animação estão em styles.css nos seletores [data-reveal].
     
     Para adicionar animação a novos elementos:
     Adicione o seletor CSS ao array revealTargets abaixo.
     ========================================================================= */

  /* Lista de seletores que receberão a animação de entrada */
  var revealTargets = [
    '.pilar-card',        // Cards dos 3 pilares de serviço
    '.nfc-item',          // Itens da seção NFC
    '.contato-card',      // Cards de contato
    '.hero__badge',       // Badge de localização no hero
    '.hero__title',       // Headline principal
    '.hero__subtitle',    // Subtítulo do hero
    '.hero__actions',     // Botões do hero
    '.hero__stats',       // Estatísticas do hero
    '.section__header',   // Cabeçalhos de seção (título + subtítulo)
    '.nfc-section__content',  // Conteúdo textual da seção NFC
    '.nfc-section__visual',   // Card NFC animado
  ];

  /* Configuração do observer:
     threshold: 0.12 → dispara quando 12% do elemento estiver visível
     rootMargin: "-40px" → antecipa um pouco antes de chegar ao viewport */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        /* Parar de observar após animar (a animação só ocorre uma vez) */
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  /* Aplicar data-reveal e delay escalonado em cada elemento alvo */
  revealTargets.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.setAttribute('data-reveal', '');

      /* Para cartões em grade, aplicar delays escalonados (0.1s, 0.2s, 0.3s)
         para que apareçam em sequência em vez de todos de uma vez */
      var isCard = el.classList.contains('pilar-card') ||
                   el.classList.contains('nfc-item')   ||
                   el.classList.contains('contato-card');

      if (isCard) {
        el.setAttribute('data-reveal-delay', (i % 3) + 1); // 1, 2 ou 3
      }

      revealObserver.observe(el);
    });
  });


  /* =========================================================================
     6. URL DO PORTFOLIO — BARRA DO BROWSER FAKE
     
     Exposta como window.updateFrameUrl para ser chamada por portfolio.js
     sempre que o usuário troca de nicho no portfólio.
     
     Mapeia a chave do nicho para uma URL fictícia exibida na barra.
     Para adicionar um novo nicho, adicione uma entrada no objeto urls.
     ========================================================================= */

  /**
   * Atualiza o texto da barra de URL no frame do portfólio.
   * @param {string} niche - Chave do nicho (deve corresponder ao data-niche do botão)
   */
  window.updateFrameUrl = function (niche) {
    var urlBar = document.querySelector('.frame-url');
    if (!urlBar) return;

    /* Mapeamento nicho → URL de demonstração */
    var urls = {
      barbershop: 'barbearia.jginfo.com.br',
      bakery:     'padaria.jginfo.com.br',
      law:        'advocacia.jginfo.com.br',
      clinic:     'clinica.jginfo.com.br',
      store:      'loja.jginfo.com.br',
      /* Adicione novos nichos aqui: novoNiche: 'novo.jginfo.com.br' */
    };

    urlBar.textContent = urls[niche] || 'preview.jginfo.com.br';
  };


  /* =========================================================================
     7. ANO NO FOOTER — ATUALIZADO AUTOMATICAMENTE
     
     Atualiza o elemento #year com o ano atual para que nunca precise
     ser atualizado manualmente no HTML.
     ========================================================================= */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* =========================================================================
     FIM DO MAIN.JS
     Todos os comportamentos acima são inicializados quando o script carrega,
     que acontece ao final do <body> (após o HTML estar parseado).
     ========================================================================= */

})(); /* IIFE — Immediately Invoked Function Expression.
         Envolve todo o código para evitar poluição do escopo global. */
