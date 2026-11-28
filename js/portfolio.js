/* ==========================================================================
   JG INFO — portfolio.js  v2.0
   Portfólio interativo: renderiza previews de sites por nicho dentro do frame.
   
   ┌─────────────────────────────────────────────────────────────────────────┐
   │  COMO FUNCIONA                                                          │
   │  1. O objeto NICHES contém um template por nicho (html + scripts).     │
   │  2. Ao clicar nos filtros, renderNiche() injeta o HTML no #frame-content│
   │  3. Os scripts do nicho são executados no escopo global da página.      │
   │  4. Modais usam position:ABSOLUTE (dentro do frame, não fixed no body) │
   │  5. lockFrameScroll() bloqueia o scroll enquanto modal está aberto.     │
   └─────────────────────────────────────────────────────────────────────────┘
   
   PARA ADICIONAR UM NOVO NICHO:
   ─────────────────────────────
   1. Adicione uma entrada no objeto NICHES (seguindo o padrão dos outros).
   2. No index.html, adicione um botão com data-niche="seuNiche":
      <button class="portfolio__filter" data-niche="seuNiche">🏷️ Nome</button>
   3. Pronto! O sistema de filtros pega o novo nicho automaticamente.
   ========================================================================== */

(function () {
  'use strict';

  /* =========================================================================
     UTILITÁRIOS DE SCROLL
     
     Por que são necessários?
     Quando um modal abre dentro do preview, o usuário ainda pode rolar a
     página principal por baixo — o que é confuso. Estas funções bloqueiam
     o scroll do #frame-content e do body enquanto o modal está aberto.
     ========================================================================= */

  /**
   * Bloqueia o scroll do frame de portfólio.
   * Chamado SEMPRE que um modal abre dentro de um preview.
   */
  function lockFrameScroll() {
    var fc = document.getElementById('frame-content');
    if (fc) fc.style.overflowY = 'hidden';
  }

  /**
   * Desbloqueia o scroll do frame de portfólio.
   * Chamado SEMPRE que um modal fecha dentro de um preview.
   */
  function unlockFrameScroll() {
    var fc = document.getElementById('frame-content');
    if (fc) fc.style.overflowY = 'auto';
  }

  /* =========================================================================
     TEMPLATES DE PREVIEW POR NICHO
     
     Cada entrada possui:
       url     — URL exibida na barra do browser fake
       html    — HTML completo da página simulada (injetado no #frame-content)
       scripts — Funções JS do nicho (injetadas via <script> tag no body)
     
     ⚠️ IMPORTANTE sobre os modais:
        Todos os modais usam position:ABSOLUTE dentro de um wrapper
        position:RELATIVE. Isso os mantém dentro do frame e evita o
        problema de position:FIXED vazando para o viewport real da página.
     ========================================================================= */
  var NICHES = {

    /* -----------------------------------------------------------------------
       BARBEARIA — Estilo Urbano Escuro
       Funcionalidades: agendamento 4 passos, seleção de serviço com preço
       dinâmico, seleção de profissional, horários com estado ocupado/livre.
       ----------------------------------------------------------------------- */
    barbershop: {
      url: 'barbearia.jginfo.com.br',
      html: `
        <!-- ===================================================
             WRAPPER PRINCIPAL — position:relative é obrigatório
             para que o modal overlay funcione como position:absolute
             e fique contido dentro do frame (não vaza para o body).
             =================================================== -->
        <div id="barber-wrapper" style="font-family:'Space Grotesk','Inter',sans-serif;background:#0E0E0E;color:#F9FAFB;position:relative;min-height:580px;">

          <!-- CONTEÚDO PRINCIPAL DA PÁGINA DA BARBEARIA -->
          <div id="barber-main">

            <!-- NAVBAR da barbearia (fictícia) -->
            <nav style="display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:#111;border-bottom:1px solid #222;position:sticky;top:0;z-index:10;gap:12px;">
              <div style="font-weight:900;font-size:1.1rem;letter-spacing:0.06em;color:#C8A96E;white-space:nowrap;display:flex;align-items:center;gap:8px;">
                <!-- Logo JG INFO versão escura (fundo escuro da barbearia) -->
                <img src="assets/logo.png" alt="JG INFO" style="height:28px;width:auto;" />
                ✂ BARBER<span style="color:#fff">KING</span>
              </div>
              <div style="display:flex;gap:10px;align-items:center;">
                <span style="font-size:0.8rem;color:#666;cursor:pointer;">Serviços</span>
                <span style="font-size:0.8rem;color:#666;cursor:pointer;">Equipe</span>
                <!-- Botão Agendar — chama barberShowBooking() definida nos scripts abaixo -->
                <button onclick="barberShowBooking()" style="background:#C8A96E;color:#0E0E0E;border:none;padding:7px 16px;border-radius:30px;font-weight:700;cursor:pointer;font-size:0.82rem;white-space:nowrap;">Agendar</button>
              </div>
            </nav>

            <!-- HERO da barbearia -->
            <div style="padding:36px 24px;background:linear-gradient(135deg,#111 0%,#1a1203 100%);">
              <div style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#C8A96E;margin-bottom:10px;">📍 Rio de Janeiro, RJ</div>
              <h1 style="font-size:clamp(1.5rem,3.5vw,2.2rem);font-weight:900;line-height:1.1;margin:0 0 12px;">Sua <span style="color:#C8A96E;">Barbearia</span> de Confiança.</h1>
              <p style="color:#777;margin-bottom:20px;font-size:0.9rem;line-height:1.6;max-width:400px;">Cortes modernos, acabamento perfeito e uma experiência premium. Reserve agora.</p>
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button onclick="barberShowBooking()" style="background:#C8A96E;color:#0E0E0E;border:none;padding:11px 24px;border-radius:30px;font-weight:700;cursor:pointer;font-size:0.9rem;">Agendar Horário</button>
                <button style="background:transparent;color:#C8A96E;border:1px solid #C8A96E;padding:11px 24px;border-radius:30px;font-weight:600;cursor:pointer;font-size:0.9rem;">Ver Serviços</button>
              </div>
            </div>

            <!-- GALERIA MOCKUP (emojis representando fotos) -->
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;">
              ${['✂️','💈','🪒'].map((e, i) => `
                <div style="background:${['#1a1203','#141004','#1a0d00'][i]};aspect-ratio:1.2;display:flex;align-items:center;justify-content:center;font-size:2.5rem;border:1px solid #222;cursor:pointer;transition:opacity 0.2s;"
                     onmouseover="this.style.opacity='0.75';" onmouseout="this.style.opacity='1';">${e}</div>
              `).join('')}
            </div>

            <!-- LISTA DE SERVIÇOS — clicar em um serviço pré-seleciona no modal -->
            <div style="padding:24px;">
              <h2 style="font-size:0.9rem;font-weight:800;margin:0 0 14px;color:#C8A96E;letter-spacing:0.06em;text-transform:uppercase;">Serviços & Preços</h2>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                ${[
                  {name:'Corte Masculino',    price:'R$ 35', dur:'30min', val:'35'},
                  {name:'Barba Completa',      price:'R$ 30', dur:'25min', val:'30'},
                  {name:'Corte + Barba',       price:'R$ 60', dur:'50min', val:'60'},
                  {name:'Pézinho/Degradê',     price:'R$ 25', dur:'20min', val:'25'},
                  {name:'Luzes/Descoloração',  price:'R$ 80', dur:'90min', val:'80'},
                  {name:'Hidratação Capilar',  price:'R$ 45', dur:'40min', val:'45'},
                ].map(s => `
                  <!-- Clicar no serviço abre o modal JÁ com esse serviço selecionado -->
                  <div onclick="barberSelectService('${s.name}','${s.price}','${s.val}')"
                       style="background:#111;border:1px solid #222;border-radius:10px;padding:12px;cursor:pointer;transition:all 0.2s;display:flex;justify-content:space-between;align-items:center;gap:8px;"
                       onmouseover="this.style.borderColor='#C8A96E';this.style.background='#1a1500';"
                       onmouseout="this.style.borderColor='#222';this.style.background='#111';">
                    <div>
                      <div style="font-size:0.85rem;font-weight:600;">${s.name}</div>
                      <div style="font-size:0.72rem;color:#555;margin-top:2px;">⏱ ${s.dur}</div>
                    </div>
                    <span style="color:#C8A96E;font-weight:800;font-size:0.88rem;white-space:nowrap;">${s.price}</span>
                  </div>
                `).join('')}
              </div>

              <!-- EQUIPE -->
              <h2 style="font-size:0.9rem;font-weight:800;margin:20px 0 14px;color:#C8A96E;letter-spacing:0.06em;text-transform:uppercase;">Nossa Equipe</h2>
              <div style="display:flex;gap:10px;">
                ${[{e:'👨‍💈',n:'Marcos',esp:'Especialista em Degradê'},{e:'✂️',n:'Felipe',esp:'Mestre da Barba'},{e:'💈',n:'Diego',esp:'Corte Clássico'}].map(b => `
                  <div style="flex:1;background:#111;border:1px solid #222;border-radius:10px;padding:12px;text-align:center;cursor:pointer;transition:all 0.2s;"
                       onmouseover="this.style.borderColor='#C8A96E';this.style.background='#1a1500';"
                       onmouseout="this.style.borderColor='#222';this.style.background='#111';">
                    <div style="font-size:1.6rem;margin-bottom:6px;">${b.e}</div>
                    <div style="font-weight:700;font-size:0.85rem;">${b.n}</div>
                    <div style="font-size:0.68rem;color:#555;margin-top:3px;">${b.esp}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div><!-- /barber-main -->

          <!-- =================================================================
               MODAL DE AGENDAMENTO
               
               ✅ CORREÇÕES APLICADAS:
               - position:ABSOLUTE (não fixed) → fica dentro do frame
               - Botão ✕ proeminente com hover e title para acessibilidade
               - lockFrameScroll() chamado ao abrir → impede scroll por baixo
               - Preço atualiza dinamicamente ao trocar o serviço
               ================================================================= -->
          <div id="barber-booking"
               style="display:none;position:absolute;inset:0;background:rgba(0,0,0,0.92);z-index:50;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;min-height:580px;">

            <div style="background:#111;border:1px solid #333;border-radius:16px;width:100%;max-width:460px;padding:24px;position:relative;margin:0 auto;">

              <!-- BOTÃO FECHAR (X) — sempre visível, estilo claro -->
              <button onclick="barberHideBooking()"
                      title="Fechar agendamento"
                      style="position:absolute;top:14px;right:14px;width:34px;height:34px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);border-radius:50%;color:#bbb;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:all 0.2s;"
                      onmouseover="this.style.background='rgba(255,100,100,0.25)';this.style.borderColor='rgba(255,100,100,0.5)';this.style.color='#fff';"
                      onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.borderColor='rgba(255,255,255,0.18)';this.style.color='#bbb';">✕</button>

              <h3 style="font-size:1.1rem;font-weight:800;color:#C8A96E;margin:0 0 4px;padding-right:44px;">Agendar Horário</h3>
              <!-- Exibe o serviço pré-selecionado (quando usuário clicou em um serviço) -->
              <p id="barber-selected-label" style="font-size:0.78rem;color:#555;margin:0 0 20px;min-height:1em;"></p>

              <!-- PASSO 1: Escolher serviço -->
              <div style="margin-bottom:16px;">
                <label style="font-size:0.7rem;color:#666;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px;font-weight:600;">1 · Serviço</label>
                <!-- onchange → atualiza o preço total em tempo real -->
                <select id="bk-service" onchange="barberUpdatePrice(this.value)" style="width:100%;background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;cursor:pointer;box-sizing:border-box;">
                  <option value="35">Corte Masculino — R$ 35</option>
                  <option value="30">Barba Completa — R$ 30</option>
                  <option value="60">Corte + Barba — R$ 60</option>
                  <option value="25">Pézinho/Degradê — R$ 25</option>
                  <option value="80">Luzes/Descoloração — R$ 80</option>
                  <option value="45">Hidratação Capilar — R$ 45</option>
                </select>
              </div>

              <!-- PASSO 2: Escolher profissional -->
              <div style="margin-bottom:16px;">
                <label style="font-size:0.7rem;color:#666;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px;font-weight:600;">2 · Profissional</label>
                <div style="display:flex;gap:8px;">
                  ${[{e:'👨‍💈',n:'Marcos'},{e:'✂️',n:'Felipe'},{e:'💈',n:'Diego'}].map((b,i) => `
                    <div class="barber-pro-btn"
                         onclick="barberSelectPro(this,'${b.n}')"
                         style="flex:1;background:${i===0?'#1a1500':'#1a1a1a'};border:1px solid ${i===0?'#C8A96E':'#333'};border-radius:8px;padding:10px 6px;text-align:center;cursor:pointer;transition:all 0.2s;">
                      <div style="font-size:1.3rem;margin-bottom:4px;">${b.e}</div>
                      <div style="font-size:0.78rem;font-weight:600;">${b.n}</div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- PASSO 3: Data -->
              <div style="margin-bottom:16px;">
                <label style="font-size:0.7rem;color:#666;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px;font-weight:600;">3 · Data</label>
                <input type="date" id="bk-date" style="width:100%;background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;box-sizing:border-box;cursor:pointer;">
              </div>

              <!-- PASSO 4: Horário -->
              <div style="margin-bottom:20px;">
                <label style="font-size:0.7rem;color:#666;text-transform:uppercase;letter-spacing:0.1em;display:block;margin-bottom:8px;font-weight:600;">4 · Horário</label>
                <div style="display:flex;flex-wrap:wrap;gap:7px;">
                  ${['09:00','09:30','10:00','10:30','11:00 (Ocupado)','11:30','14:00','14:30','15:00','15:30','16:00','16:30'].map((t, i) => {
                    const isOccupied = t.includes('Ocupado');
                    const time = t.replace(' (Ocupado)', '');
                    return isOccupied
                      ? `<button disabled title="Horário indisponível"
                              style="background:#1a1a1a;color:#333;border:1px solid #1a1a1a;border-radius:6px;padding:7px 10px;font-size:0.76rem;cursor:not-allowed;opacity:0.4;text-decoration:line-through;">${t}</button>`
                      : `<button onclick="barberSelectTime(this,'${time}')"
                              style="background:${i===0?'#C8A96E':'#1a1a1a'};color:${i===0?'#000':'#F9FAFB'};border:1px solid ${i===0?'#C8A96E':'#333'};border-radius:6px;padding:7px 10px;font-size:0.76rem;cursor:pointer;transition:all 0.2s;"
                              onmouseover="if(this.style.background!='rgb(200, 169, 110)'){this.style.background='#252525';}"
                              onmouseout="if(this.style.background!='rgb(200, 169, 110)'){this.style.background='#1a1a1a';}">${time}</button>`;
                  }).join('')}
                </div>
              </div>

              <!-- TOTAL dinâmico -->
              <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#0E0E0E;border-radius:8px;margin-bottom:14px;border:1px solid #222;">
                <span style="font-size:0.82rem;color:#666;">Total a pagar:</span>
                <span id="barber-total" style="font-size:1.1rem;font-weight:800;color:#C8A96E;">R$ 35</span>
              </div>

              <!-- BOTÃO CONFIRMAR -->
              <button onclick="barberConfirmBooking()"
                      style="width:100%;background:#C8A96E;color:#0E0E0E;border:none;padding:13px;border-radius:10px;font-weight:800;font-size:0.95rem;cursor:pointer;transition:all 0.2s;"
                      onmouseover="this.style.background='#D4B87E';"
                      onmouseout="this.style.background='#C8A96E';">
                ✅ Confirmar Agendamento
              </button>

              <!-- MENSAGEM DE SUCESSO (oculta por padrão) -->
              <div id="barber-success" style="display:none;text-align:center;margin-top:12px;padding:16px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.35);border-radius:10px;">
                <div style="font-size:1.5rem;margin-bottom:6px;">🎉</div>
                <div style="font-weight:700;color:#22C55E;">Agendamento confirmado!</div>
                <div style="font-size:0.78rem;color:#555;margin-top:4px;">Você receberá uma confirmação pelo WhatsApp em instantes.</div>
              </div>
            </div>
          </div><!-- /barber-booking modal -->

        </div><!-- /barber-wrapper -->
      `,

      /* Scripts da Barbearia
         São injetados no <body> via renderNiche() e ficam no escopo global.
         Prefixo "barber" em todas as funções evita conflito com outros nichos. */
      scripts: `
        /* ── BARBEARIA: Funções do protótipo ── */

        /** Abre o modal e bloqueia o scroll do frame */
        function barberShowBooking() {
          var panel = document.getElementById('barber-booking');
          if (!panel) return;
          panel.style.display = 'flex';
          document.getElementById('bk-date').valueAsDate = new Date();
          barberUpdatePrice(document.getElementById('bk-service').value);
          lockFrameScroll(); // Bloqueia scroll — definido em portfolio.js
        }

        /** Fecha o modal e desbloqueia o scroll */
        function barberHideBooking() {
          var panel = document.getElementById('barber-booking');
          var succ  = document.getElementById('barber-success');
          if (panel) panel.style.display = 'none';
          if (succ)  succ.style.display  = 'none';
          unlockFrameScroll(); // Reativa scroll — definido em portfolio.js
        }

        /** Atualiza o valor exibido no total baseado no select de serviço */
        function barberUpdatePrice(val) {
          var total = document.getElementById('barber-total');
          if (total && val) total.textContent = 'R$ ' + val;
        }

        /** Destaca o profissional clicado (altera borda/fundo dos cards) */
        function barberSelectPro(el) {
          document.querySelectorAll('.barber-pro-btn').forEach(function(b) {
            b.style.borderColor = '#333'; b.style.background = '#1a1a1a';
          });
          el.style.borderColor = '#C8A96E'; el.style.background = '#1a1500';
        }

        /** Destaca o horário selecionado */
        function barberSelectTime(btn) {
          document.querySelectorAll('#barber-booking button[onclick*="barberSelectTime"]').forEach(function(b) {
            b.style.background = '#1a1a1a'; b.style.color = '#F9FAFB'; b.style.borderColor = '#333';
          });
          btn.style.background = '#C8A96E'; btn.style.color = '#000'; btn.style.borderColor = '#C8A96E';
        }

        /** Abre o modal com um serviço pré-selecionado (quando usuário clica na lista da página) */
        function barberSelectService(name, price, val) {
          barberShowBooking();
          // Selecionar no <select> o serviço correspondente
          var sel = document.getElementById('bk-service');
          if (sel) {
            for (var i = 0; i < sel.options.length; i++) {
              if (sel.options[i].text.startsWith(name)) { sel.selectedIndex = i; break; }
            }
            barberUpdatePrice(val);
          }
          // Exibir label informativo dentro do modal
          var label = document.getElementById('barber-selected-label');
          if (label) label.textContent = 'Serviço pré-selecionado: ' + name + ' — ' + price;
        }

        /** Confirma agendamento e exibe mensagem de sucesso */
        function barberConfirmBooking() {
          var succ = document.getElementById('barber-success');
          if (succ) {
            succ.style.display = 'block';
            succ.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(barberHideBooking, 3200);
          }
        }
      `
    },

    /* -----------------------------------------------------------------------
       PADARIA / RESTAURANTE — Estilo Quente e Artesanal
       Funcionalidades: carrinho com counter, toast de confirmação,
       modal de carrinho com itens e total, categorias interativas.
       ----------------------------------------------------------------------- */
    bakery: {
      url: 'padaria.jginfo.com.br',
      html: `
        <div id="bakery-wrapper" style="font-family:'Space Grotesk','Inter',sans-serif;background:#FDFAF5;color:#1a1200;position:relative;min-height:580px;">
          <div id="bakery-main">

            <!-- NAVBAR da padaria -->
            <nav style="display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:#fff;border-bottom:1px solid #f0e8d0;position:sticky;top:0;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
              <div style="font-weight:900;font-size:1rem;color:#8B4513;display:flex;align-items:center;gap:8px;">
                <!-- Logo JG INFO versão clara (fundo claro da padaria) -->
                <img src="assets/logo-light.png" alt="JG INFO" style="height:30px;width:auto;" />
                🍞 Padaria <span style="color:#D4870A;">São João</span>
              </div>
              <!-- Botão do carrinho com badge de contador -->
              <button onclick="bakeryShowCart()"
                      style="background:#D4870A;color:#fff;border:none;padding:7px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;display:flex;align-items:center;gap:6px;transition:all 0.2s;"
                      onmouseover="this.style.background='#B56B00';" onmouseout="this.style.background='#D4870A';">
                🛒 Carrinho
                <!-- Badge: exibe a quantidade de itens adicionados -->
                <span id="bakery-cart-count" style="background:#fff;color:#D4870A;border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:900;min-width:20px;">0</span>
              </button>
            </nav>

            <!-- HERO da padaria -->
            <div style="padding:28px 24px;background:linear-gradient(135deg,#FFF8E7,#FFF0C0);border-bottom:1px solid #f0e8d0;text-align:center;">
              <div style="font-size:2.2rem;margin-bottom:8px;">🥐</div>
              <h1 style="font-size:clamp(1.3rem,3vw,1.7rem);font-weight:900;margin:0 0 8px;">Feito com amor, <span style="color:#D4870A;">entregue fresquinho.</span></h1>
              <p style="color:#777;margin-bottom:14px;font-size:0.88rem;">Pães artesanais, bolos e salgados todos os dias.</p>
              <a href="https://wa.me/5521980256650?text=Olá!%20Quero%20fazer%20um%20pedido%20na%20padaria."
                 style="background:#D4870A;color:#fff;padding:10px 24px;border-radius:30px;font-weight:700;text-decoration:none;display:inline-block;font-size:0.88rem;transition:all 0.2s;">
                💬 Encomendar pelo Zap
              </a>
            </div>

            <!-- TABS DE CATEGORIAS — interativas, alteram estilo ao clicar -->
            <div style="padding:14px 24px 0;display:flex;gap:8px;overflow-x:auto;border-bottom:1px solid #f0e8d0;">
              ${['🥐 Pães','🎂 Bolos','🥙 Salgados','☕ Bebidas'].map((cat, i) => `
                <button onclick="bakerySetCategory(this)"
                        class="bakery-cat-btn"
                        style="background:${i===0?'#D4870A':'#FFF3D0'};color:${i===0?'#fff':'#8B4513'};border:none;padding:8px 18px;border-radius:30px;font-weight:600;cursor:pointer;white-space:nowrap;font-size:0.82rem;transition:all 0.2s;margin-bottom:14px;"
                        onmouseover="if(this.style.background!='rgb(212, 135, 10)'){this.style.background='#FFE5A0';}"
                        onmouseout="if(this.style.background!='rgb(212, 135, 10)'){this.style.background='#FFF3D0';}">${cat}</button>
              `).join('')}
            </div>

            <!-- GRID DE PRODUTOS -->
            <div style="padding:16px 24px 24px;">
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;">
                ${[
                  {emoji:'🥐',name:'Croissant Folhado',  desc:'Manteiga francesa',    price:8},
                  {emoji:'🍞',name:'Pão de Forma',        desc:'Fatias 500g',          price:14},
                  {emoji:'🥖',name:'Baguete Artesanal',   desc:'Recém saída do forno', price:10},
                  {emoji:'🧁',name:'Cupcake de Morango',  desc:'Cobertura cremosa',    price:9},
                  {emoji:'🥨',name:'Pão de Queijo',       desc:'Dúzia — tamanho família', price:22},
                  {emoji:'🫓',name:'Broa de Milho',       desc:'Receita tradicional',  price:12},
                ].map(p => `
                  <!-- Cada produto tem hover e botão "+Adicionar" com função de carrinho -->
                  <div style="background:#fff;border:1px solid #f0e8d0;border-radius:12px;overflow:hidden;transition:all 0.2s;"
                       onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)';this.style.transform='translateY(-2px)';"
                       onmouseout="this.style.boxShadow='none';this.style.transform='translateY(0)';">
                    <div style="background:#FFF8E7;padding:20px;text-align:center;font-size:2.2rem;">${p.emoji}</div>
                    <div style="padding:10px 12px;">
                      <strong style="font-size:0.85rem;display:block;">${p.name}</strong>
                      <span style="font-size:0.75rem;color:#888;display:block;margin-bottom:8px;">${p.desc}</span>
                      <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-weight:800;color:#D4870A;font-size:0.95rem;">R$ ${p.price}</span>
                        <!-- Botão adiciona ao carrinho e mostra toast de confirmação -->
                        <button onclick="bakeryAddToCart('${p.name}', ${p.price}, this)"
                                style="background:#D4870A;color:#fff;border:none;border-radius:6px;padding:5px 12px;font-size:0.78rem;cursor:pointer;font-weight:600;transition:all 0.2s;"
                                onmouseover="this.style.background='#B56B00';"
                                onmouseout="if(!this.dataset.added){this.style.background='#D4870A';}">+ Add</button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- CTA de encomenda de bolo -->
              <div style="margin-top:20px;background:linear-gradient(135deg,#FFF8E7,#FFF0C0);border:1px solid #f0e8d0;border-radius:12px;padding:20px;text-align:center;">
                <div style="font-size:1.5rem;margin-bottom:8px;">🎂</div>
                <h3 style="font-size:1rem;font-weight:800;color:#1a1200;margin:0 0 6px;">Encomende seu bolo especial!</h3>
                <p style="color:#777;font-size:0.82rem;margin-bottom:12px;">Bolos personalizados para festas e aniversários. Consulte sabores e preços.</p>
                <a href="https://wa.me/5521980256650?text=Olá!%20Quero%20encomendar%20um%20bolo."
                   style="background:#25D366;color:#fff;padding:9px 22px;border-radius:30px;font-weight:700;text-decoration:none;font-size:0.85rem;display:inline-block;">💬 Encomendar pelo WhatsApp</a>
              </div>
            </div>
          </div><!-- /bakery-main -->

          <!-- MODAL DO CARRINHO (position:absolute → contido no frame) -->
          <div id="bakery-cart-modal"
               style="display:none;position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:50;align-items:flex-end;justify-content:center;min-height:580px;">
            <div style="background:#fff;border-radius:16px 16px 0 0;width:100%;max-width:500px;padding:20px;position:relative;max-height:65%;overflow-y:auto;border:1px solid #f0e8d0;border-bottom:none;">

              <!-- BOTÃO FECHAR (X) -->
              <button onclick="bakeryHideCart()"
                      title="Fechar carrinho"
                      style="position:absolute;top:14px;right:14px;width:32px;height:32px;background:#FFF3D0;border:1px solid #f0e8d0;border-radius:50%;color:#8B4513;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;"
                      onmouseover="this.style.background='#FFE5A0';"
                      onmouseout="this.style.background='#FFF3D0';">✕</button>

              <h3 style="font-size:1.1rem;font-weight:800;color:#1a1200;margin:0 0 16px;padding-right:40px;">🛒 Seu Carrinho</h3>
              <!-- Itens injetados dinamicamente por bakeryShowCart() -->
              <div id="bakery-cart-items" style="min-height:60px;"></div>

              <div style="border-top:1px solid #f0e8d0;padding-top:14px;margin-top:12px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;color:#1a1200;">Total:</span>
                <span id="bakery-total" style="font-size:1.2rem;font-weight:900;color:#D4870A;">R$ 0</span>
              </div>
              <a href="https://wa.me/5521980256650?text=Olá!%20Quero%20finalizar%20meu%20pedido."
                 style="display:block;text-align:center;background:#25D366;color:#fff;padding:12px;border-radius:30px;font-weight:700;text-decoration:none;margin-top:14px;font-size:0.88rem;">
                💬 Finalizar pedido pelo WhatsApp
              </a>
            </div>
          </div>

          <!-- TOAST de confirmação de item adicionado (aparece e some) -->
          <div id="bakery-toast"
               style="display:none;position:absolute;top:66px;right:12px;background:#1a1200;color:#fff;padding:9px 14px;border-radius:8px;font-size:0.8rem;font-weight:600;z-index:60;box-shadow:0 4px 16px rgba(0,0,0,0.3);max-width:220px;"></div>

        </div><!-- /bakery-wrapper -->
      `,
      scripts: `
        /* ── PADARIA: Variáveis e funções do protótipo ── */
        var bakeryItems = [];   // Array de itens no carrinho {name, price}
        var bakeryTotal = 0;    // Total acumulado em R$

        /** SEGURANÇA: escapa caracteres especiais de HTML antes de usar innerHTML.
            Hoje os nomes vêm de uma lista fixa, mas se um dia vierem de formulário
            ou API, isso impede que alguém injete código (XSS). */
        function bakeryEsc(s) {
          return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                          .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        /** Adiciona produto ao carrinho e exibe toast de confirmação */
        function bakeryAddToCart(name, price, btn) {
          bakeryItems.push({ name: name, price: price });
          bakeryTotal += price;

          // Atualiza o badge de quantidade no botão do nav
          var badge = document.getElementById('bakery-cart-count');
          if (badge) badge.textContent = bakeryItems.length;

          // Animação do botão "Add" → vira "✓ Adicionado"
          if (btn) {
            btn.textContent = '✓';
            btn.style.background = '#22C55E';
            btn.dataset.added = 'true';
            setTimeout(function () {
              btn.textContent = '+ Add';
              btn.style.background = '#D4870A';
              delete btn.dataset.added;
            }, 1500);
          }

          // Toast de confirmação (aparece por 2 segundos)
          var toast = document.getElementById('bakery-toast');
          if (toast) {
            toast.textContent = '✓ ' + name + ' adicionado!';
            toast.style.display = 'block';
            setTimeout(function () { toast.style.display = 'none'; }, 2000);
          }
        }

        /** Abre o modal do carrinho renderizando os itens em tempo real */
        function bakeryShowCart() {
          var modal = document.getElementById('bakery-cart-modal');
          var itemsEl = document.getElementById('bakery-cart-items');
          var totalEl = document.getElementById('bakery-total');
          if (!modal) return;

          // Renderizar lista de itens ou mensagem de carrinho vazio
          if (itemsEl) {
            if (bakeryItems.length === 0) {
              itemsEl.innerHTML = '<p style="color:#888;text-align:center;padding:20px 0;font-size:0.88rem;">Nenhum item adicionado ainda 🛒</p>';
            } else {
              itemsEl.innerHTML = bakeryItems.map(function (item) {
                return '<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #f0e8d0;">' +
                  '<span style="font-size:0.88rem;">' + bakeryEsc(item.name) + '</span>' +
                  '<span style="font-weight:700;color:#D4870A;">R$ ' + bakeryEsc(item.price) + '</span>' +
                  '</div>';
              }).join('');
            }
          }

          if (totalEl) totalEl.textContent = 'R$ ' + bakeryTotal;
          modal.style.display = 'flex';
          lockFrameScroll(); // Bloquear scroll ao abrir
        }

        /** Fecha o modal do carrinho */
        function bakeryHideCart() {
          var modal = document.getElementById('bakery-cart-modal');
          if (modal) modal.style.display = 'none';
          unlockFrameScroll(); // Reativar scroll ao fechar
        }

        /** Alterna a categoria ativa nos tabs de categoria */
        function bakerySetCategory(btn) {
          document.querySelectorAll('.bakery-cat-btn').forEach(function (b) {
            b.style.background = '#FFF3D0'; b.style.color = '#8B4513';
          });
          btn.style.background = '#D4870A'; btn.style.color = '#fff';
        }
      `
    },

    /* -----------------------------------------------------------------------
       ESCRITÓRIO DE ADVOCACIA — Estilo Sóbrio e Profissional
       Funcionalidades: formulário com validação dinâmica (botão desativado até
       preencher campos obrigatórios), seleção de área ao clicar no card.
       ----------------------------------------------------------------------- */
    law: {
      url: 'advocacia.jginfo.com.br',
      html: `
        <div id="law-wrapper" style="font-family:'Space Grotesk','Inter',sans-serif;background:#0A0A14;color:#F9FAFB;position:relative;min-height:580px;">
          <div id="law-main">

            <!-- NAVBAR da advocacia -->
            <nav style="display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:#0D0D1A;border-bottom:1px solid rgba(255,255,255,0.08);position:sticky;top:0;z-index:10;gap:12px;">
              <div style="font-weight:900;font-size:0.9rem;white-space:nowrap;display:flex;align-items:center;gap:8px;">
                <!-- Logo JG INFO versão escura (fundo escuro da advocacia) -->
                <img src="assets/logo.png" alt="JG INFO" style="height:24px;width:auto;" />
                ⚖️ <span style="color:#C5A028;">Dr. Almeida</span> & Associados
              </div>
              <button onclick="lawShowBooking()"
                      style="background:#C5A028;color:#0A0A14;border:none;padding:7px 16px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.8rem;white-space:nowrap;transition:all 0.2s;"
                      onmouseover="this.style.background='#D4B030';" onmouseout="this.style.background='#C5A028';">
                Consulta Gratuita
              </button>
            </nav>

            <!-- HERO da advocacia -->
            <div style="padding:36px 24px;background:linear-gradient(160deg,#0A0A14 0%,#0D1020 100%);">
              <div style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#C5A028;margin-bottom:10px;">OAB/RJ — Caxias, Rio de Janeiro</div>
              <h1 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:900;line-height:1.1;margin:0 0 12px;">Defendendo seus <span style="color:#C5A028;">direitos</span><br/>com competência.</h1>
              <p style="color:#777;line-height:1.6;margin-bottom:20px;font-size:0.88rem;max-width:400px;">+15 anos de experiência em Direito Civil, Trabalhista e Previdenciário.</p>
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button onclick="lawShowBooking()" style="background:#C5A028;color:#0A0A14;border:none;padding:11px 22px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.88rem;transition:all 0.2s;" onmouseover="this.style.background='#D4B030';" onmouseout="this.style.background='#C5A028';">Agendar Consulta</button>
                <a href="https://wa.me/5521980256650" style="background:transparent;color:#C5A028;border:1px solid #C5A028;padding:11px 22px;border-radius:6px;font-weight:600;font-size:0.88rem;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">💬 WhatsApp</a>
              </div>
            </div>

            <!-- ÁREAS DE ATUAÇÃO — clicar em uma área abre modal com ela pré-selecionada -->
            <div style="padding:24px;">
              <h2 style="font-size:0.85rem;font-weight:800;color:#C5A028;margin:0 0 14px;letter-spacing:0.08em;text-transform:uppercase;">Áreas de Atuação</h2>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;">
                ${[
                  {icon:'👔',area:'Direito Trabalhista',   desc:'Demissões, horas extras, FGTS'},
                  {icon:'🏠',area:'Direito Civil',          desc:'Contratos, cobranças, indenizações'},
                  {icon:'📋',area:'Previdenciário',          desc:'Aposentadoria e benefícios INSS'},
                  {icon:'👪',area:'Direito de Família',     desc:'Divórcio, pensão, guarda de filhos'},
                  {icon:'🏢',area:'Direito Empresarial',   desc:'Constituição, contratos, litígios'},
                  {icon:'🚗',area:'Acidentes de Trânsito',  desc:'Indenizações, seguros, sinistros'},
                ].map(a => `
                  <!-- Clicar na área abre o modal com esse campo pré-selecionado -->
                  <div onclick="lawShowBookingWithArea('${a.area}')"
                       style="background:#111;border:1px solid rgba(197,160,40,0.12);border-radius:10px;padding:14px;cursor:pointer;transition:all 0.2s;"
                       onmouseover="this.style.borderColor='rgba(197,160,40,0.45)';this.style.background='#15150A';"
                       onmouseout="this.style.borderColor='rgba(197,160,40,0.12)';this.style.background='#111';">
                    <div style="font-size:1.3rem;margin-bottom:6px;">${a.icon}</div>
                    <strong style="font-size:0.82rem;display:block;margin-bottom:3px;">${a.area}</strong>
                    <span style="font-size:0.75rem;color:#555;">${a.desc}</span>
                  </div>
                `).join('')}
              </div>

              <!-- DEPOIMENTOS -->
              <h2 style="font-size:0.85rem;font-weight:800;color:#C5A028;margin:20px 0 14px;letter-spacing:0.08em;text-transform:uppercase;">Clientes Satisfeitos</h2>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                ${[
                  {t:'"Consegui minha aposentadoria em tempo recorde. Profissionalismo exemplar!"',n:'Maria S.',s:'⭐⭐⭐⭐⭐'},
                  {t:'"Resolveu minha demissão indevida e recuperei meus direitos. Recomendo!"',n:'Carlos M.',s:'⭐⭐⭐⭐⭐'},
                ].map(d => `
                  <div style="background:#0D0D1A;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px;">
                    <p style="font-size:0.76rem;color:#777;line-height:1.5;margin:0 0 8px;font-style:italic;">${d.t}</p>
                    <div style="font-size:0.7rem;color:#444;">${d.s} — <strong style="color:#666;">${d.n}</strong></div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div><!-- /law-main -->

          <!-- MODAL DE CONSULTA com validação de formulário -->
          <div id="law-booking"
               style="display:none;position:absolute;inset:0;background:rgba(0,0,0,0.92);z-index:50;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;min-height:580px;">

            <div style="background:#111;border:1px solid rgba(197,160,40,0.3);border-radius:12px;width:100%;max-width:440px;padding:24px;position:relative;margin:0 auto;">

              <!-- BOTÃO FECHAR (X) -->
              <button onclick="lawHideBooking()"
                      title="Fechar"
                      style="position:absolute;top:14px;right:14px;width:32px;height:32px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:50%;color:#bbb;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;"
                      onmouseover="this.style.background='rgba(255,100,100,0.25)';this.style.color='#fff';"
                      onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.color='#bbb';">✕</button>

              <h3 style="font-size:1.1rem;font-weight:800;color:#C5A028;margin:0 0 4px;padding-right:44px;">Consulta Gratuita</h3>
              <p style="font-size:0.76rem;color:#555;margin:0 0 20px;">Sem compromisso. Avaliamos seu caso gratuitamente.</p>

              <div style="display:flex;flex-direction:column;gap:12px;">
                <!-- oninput → chama lawCheckForm() que habilita/desabilita o botão -->
                <input id="law-name" placeholder="Seu nome completo *" oninput="lawCheckForm()"
                       style="background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;width:100%;box-sizing:border-box;"
                       onfocus="this.style.borderColor='#C5A028';" onblur="this.style.borderColor='#333';">
                <input id="law-phone" placeholder="WhatsApp *" type="tel" oninput="lawCheckForm()"
                       style="background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;width:100%;box-sizing:border-box;"
                       onfocus="this.style.borderColor='#C5A028';" onblur="this.style.borderColor='#333';">
                <!-- Área pré-selecionada quando usuário clica em um card de área -->
                <select id="law-area" onchange="lawCheckForm()"
                        style="background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;width:100%;cursor:pointer;"
                        onfocus="this.style.borderColor='#C5A028';" onblur="this.style.borderColor='#333';">
                  <option value="">Área do problema... *</option>
                  <option>Direito Trabalhista</option>
                  <option>Direito Civil</option>
                  <option>Previdenciário</option>
                  <option>Direito de Família</option>
                  <option>Direito Empresarial</option>
                  <option>Acidentes de Trânsito</option>
                </select>
                <textarea id="law-desc" placeholder="Descreva brevemente seu caso..." rows="3"
                          style="background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;width:100%;resize:none;box-sizing:border-box;"
                          onfocus="this.style.borderColor='#C5A028';" onblur="this.style.borderColor='#333';"></textarea>
                <!-- Botão desabilitado até preencher campos obrigatórios (*) -->
                <button id="law-submit-btn" onclick="lawConfirm()" disabled
                        style="background:#222;color:#555;border:none;padding:13px;border-radius:8px;font-weight:700;cursor:not-allowed;font-size:0.95rem;transition:all 0.3s;">
                  Solicitar Consulta Gratuita
                </button>
                <div id="law-success" style="display:none;text-align:center;padding:14px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.35);border-radius:8px;">
                  <div style="font-size:1.2rem;margin-bottom:4px;">✅</div>
                  <div style="font-weight:700;color:#22C55E;font-size:0.9rem;">Solicitação enviada!</div>
                  <div style="font-size:0.76rem;color:#555;margin-top:4px;">Entraremos em contato em até 2 horas.</div>
                </div>
              </div>
            </div>
          </div><!-- /law-booking -->
        </div><!-- /law-wrapper -->
      `,
      scripts: `
        /* ── ADVOCACIA: Funções do protótipo ── */

        function lawShowBooking() {
          document.getElementById('law-booking').style.display = 'flex';
          lockFrameScroll();
        }

        /** Abre modal com a área de atuação já selecionada no <select> */
        function lawShowBookingWithArea(area) {
          lawShowBooking();
          var sel = document.getElementById('law-area');
          if (sel) {
            for (var i = 0; i < sel.options.length; i++) {
              if (sel.options[i].text === area) { sel.selectedIndex = i; break; }
            }
            lawCheckForm(); // Revalida o form após pré-selecionar a área
          }
        }

        function lawHideBooking() {
          document.getElementById('law-booking').style.display = 'none';
          document.getElementById('law-success').style.display = 'none';
          unlockFrameScroll();
        }

        /**
         * Habilita o botão de submit APENAS quando os 3 campos obrigatórios
         * estão preenchidos (nome > 2 chars, telefone > 7 chars, área selecionada).
         * Isso dá feedback visual em tempo real ao usuário.
         */
        function lawCheckForm() {
          var name  = (document.getElementById('law-name').value || '').trim();
          var phone = (document.getElementById('law-phone').value || '').trim();
          var area  = document.getElementById('law-area').value;
          var btn   = document.getElementById('law-submit-btn');
          var ok    = name.length > 2 && phone.length > 7 && area !== '';
          btn.disabled    = !ok;
          btn.style.background = ok ? '#C5A028' : '#222';
          btn.style.color      = ok ? '#0A0A14' : '#555';
          btn.style.cursor     = ok ? 'pointer'  : 'not-allowed';
        }

        function lawConfirm() {
          document.getElementById('law-success').style.display = 'block';
          setTimeout(lawHideBooking, 3000);
        }
      `
    },

    /* -----------------------------------------------------------------------
       CLÍNICA / ESTÉTICA — Estilo Elegante e Suave
       Funcionalidades: tratamento pré-selecionado ao clicar no card,
       agendamento com data, confirmação com feedback visual.
       ----------------------------------------------------------------------- */
    clinic: {
      url: 'clinica.jginfo.com.br',
      html: `
        <div id="clinic-wrapper" style="font-family:'Space Grotesk','Inter',sans-serif;background:#FAF7F5;color:#1a1200;position:relative;min-height:580px;">
          <div id="clinic-main">

            <!-- NAVBAR da clínica -->
            <nav style="display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:#fff;border-bottom:1px solid #f0e8e0;position:sticky;top:0;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
              <div style="font-weight:900;font-size:1rem;color:#9B4E8A;display:flex;align-items:center;gap:8px;">
                <!-- Logo JG INFO versão clara (fundo claro da clínica) -->
                <img src="assets/logo-light.png" alt="JG INFO" style="height:30px;width:auto;" />
                🌸 Studio <span style="color:#C97DB0;">Belle</span>
              </div>
              <button onclick="clinicShowBooking()"
                      style="background:#9B4E8A;color:#fff;border:none;padding:7px 16px;border-radius:30px;font-weight:600;cursor:pointer;font-size:0.82rem;transition:all 0.2s;"
                      onmouseover="this.style.background='#7A3A6E';" onmouseout="this.style.background='#9B4E8A';">
                ✨ Agendar
              </button>
            </nav>

            <!-- HERO da clínica -->
            <div style="padding:28px 24px;background:linear-gradient(135deg,#FFF0F8,#FAF0FF);border-bottom:1px solid #f0e8e0;text-align:center;">
              <div style="font-size:2rem;margin-bottom:8px;">✨</div>
              <h1 style="font-size:clamp(1.3rem,3vw,1.8rem);font-weight:900;margin:0 0 8px;">Beleza que <span style="color:#9B4E8A;">transforma.</span></h1>
              <p style="color:#888;margin-bottom:16px;font-size:0.88rem;max-width:360px;margin-inline:auto;">Avaliação gratuita. Tratamentos personalizados para você.</p>
              <button onclick="clinicShowBooking()" style="background:#9B4E8A;color:#fff;border:none;padding:11px 24px;border-radius:30px;font-weight:700;cursor:pointer;font-size:0.88rem;transition:all 0.2s;" onmouseover="this.style.background='#7A3A6E';" onmouseout="this.style.background='#9B4E8A';">
                Agendar Avaliação Gratuita
              </button>
            </div>

            <!-- GRID DE TRATAMENTOS — clicar pré-seleciona no modal -->
            <div style="padding:24px;">
              <h2 style="font-size:0.85rem;font-weight:800;color:#9B4E8A;margin:0 0 14px;letter-spacing:0.08em;text-transform:uppercase;">Nossos Tratamentos</h2>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:10px;">
                ${[
                  {emoji:'💆',name:'Limpeza de Pele',     price:'R$ 120', dur:'60 min', stars:'★★★★★'},
                  {emoji:'💉',name:'Botox/Preenchimento',  price:'Consultar', dur:'45 min', stars:'★★★★★'},
                  {emoji:'🌊',name:'Hidratação Facial',    price:'R$ 90',  dur:'50 min', stars:'★★★★'},
                  {emoji:'⚡',name:'Depilação a Laser',    price:'A partir R$ 80', dur:'30 min', stars:'★★★★★'},
                  {emoji:'💅',name:'Design Sobrancelha',   price:'R$ 45',  dur:'30 min', stars:'★★★★'},
                  {emoji:'🧴',name:'Microagulhamento',     price:'R$ 200', dur:'90 min', stars:'★★★★★'},
                ].map(t => `
                  <!-- Clique pré-seleciona tratamento → clinicShowBookingWith() -->
                  <div onclick="clinicShowBookingWith('${t.name}')"
                       style="background:#fff;border:1px solid #f0e8e0;border-radius:12px;padding:14px;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 4px rgba(0,0,0,0.04);"
                       onmouseover="this.style.borderColor='#C97DB0';this.style.boxShadow='0 4px 16px rgba(155,78,138,0.12)';this.style.transform='translateY(-2px)';"
                       onmouseout="this.style.borderColor='#f0e8e0';this.style.boxShadow='0 2px 4px rgba(0,0,0,0.04)';this.style.transform='translateY(0)';">
                    <div style="font-size:1.6rem;margin-bottom:6px;">${t.emoji}</div>
                    <strong style="font-size:0.82rem;display:block;margin-bottom:3px;">${t.name}</strong>
                    <div style="font-size:0.68rem;color:#ccc;margin-bottom:8px;">${t.stars} · ⏱ ${t.dur}</div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span style="font-weight:800;color:#9B4E8A;font-size:0.85rem;">${t.price}</span>
                      <span style="font-size:0.7rem;color:#C97DB0;font-weight:600;">Agendar →</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div><!-- /clinic-main -->

          <!-- MODAL DE AGENDAMENTO -->
          <div id="clinic-booking"
               style="display:none;position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:50;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;min-height:580px;">

            <div style="background:#fff;border-radius:16px;width:100%;max-width:400px;padding:24px;position:relative;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.2);">

              <!-- BOTÃO FECHAR (X) -->
              <button onclick="clinicHideBooking()"
                      title="Fechar"
                      style="position:absolute;top:14px;right:14px;width:32px;height:32px;background:#f8f4f8;border:1px solid #e0d0e0;border-radius:50%;color:#9B4E8A;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;"
                      onmouseover="this.style.background='#F0D8F0';"
                      onmouseout="this.style.background='#f8f4f8';">✕</button>

              <h3 style="font-size:1.1rem;font-weight:800;color:#9B4E8A;margin:0 0 4px;padding-right:44px;">Agendar Consulta</h3>
              <!-- Exibe o tratamento pré-selecionado -->
              <p id="clinic-selected-treatment" style="font-size:0.76rem;color:#C97DB0;margin:0 0 18px;min-height:1em;font-weight:600;"></p>

              <div style="display:flex;flex-direction:column;gap:12px;">
                <input placeholder="Seu nome" style="background:#f8f4f8;border:1px solid #e0d0e0;color:#1a1200;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;width:100%;box-sizing:border-box;" onfocus="this.style.borderColor='#9B4E8A';" onblur="this.style.borderColor='#e0d0e0';">
                <input placeholder="WhatsApp" type="tel" style="background:#f8f4f8;border:1px solid #e0d0e0;color:#1a1200;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;width:100%;box-sizing:border-box;" onfocus="this.style.borderColor='#9B4E8A';" onblur="this.style.borderColor='#e0d0e0';">
                <select id="clinic-treatment-sel" style="background:#f8f4f8;border:1px solid #e0d0e0;color:#1a1200;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;width:100%;cursor:pointer;" onfocus="this.style.borderColor='#9B4E8A';" onblur="this.style.borderColor='#e0d0e0';">
                  <option value="">Tratamento de interesse...</option>
                  <option>Limpeza de Pele</option>
                  <option>Botox/Preenchimento</option>
                  <option>Hidratação Facial</option>
                  <option>Depilação a Laser</option>
                  <option>Design de Sobrancelhas</option>
                  <option>Microagulhamento</option>
                </select>
                <input type="date" style="background:#f8f4f8;border:1px solid #e0d0e0;color:#1a1200;padding:11px;border-radius:8px;font-size:0.88rem;outline:none;width:100%;box-sizing:border-box;cursor:pointer;" onfocus="this.style.borderColor='#9B4E8A';" onblur="this.style.borderColor='#e0d0e0';">
                <button onclick="clinicConfirm()"
                        style="background:#9B4E8A;color:#fff;border:none;padding:13px;border-radius:30px;font-weight:700;cursor:pointer;font-size:0.9rem;transition:all 0.2s;"
                        onmouseover="this.style.background='#7A3A6E';" onmouseout="this.style.background='#9B4E8A';">
                  ✨ Confirmar Agendamento
                </button>
                <div id="clinic-success" style="display:none;text-align:center;padding:14px;background:#f0fff4;border:1px solid #22C55E;border-radius:8px;">
                  <div style="font-size:1.2rem;margin-bottom:4px;">🎉</div>
                  <div style="font-weight:700;color:#16a34a;font-size:0.88rem;">Agendado com sucesso!</div>
                  <div style="font-size:0.76rem;color:#888;margin-top:3px;">Confirmaremos pelo WhatsApp em breve.</div>
                </div>
              </div>
            </div>
          </div><!-- /clinic-booking -->
        </div><!-- /clinic-wrapper -->
      `,
      scripts: `
        /* ── CLÍNICA: Funções do protótipo ── */

        function clinicShowBooking() {
          document.getElementById('clinic-booking').style.display = 'flex';
          lockFrameScroll();
        }

        /** Abre modal com tratamento pré-selecionado (ao clicar no card) */
        function clinicShowBookingWith(treatment) {
          clinicShowBooking();
          // Exibe label do tratamento escolhido
          var info = document.getElementById('clinic-selected-treatment');
          if (info) info.textContent = '→ ' + treatment + ' selecionado';
          // Pré-seleciona no <select>
          var sel = document.getElementById('clinic-treatment-sel');
          if (sel) {
            for (var i = 0; i < sel.options.length; i++) {
              if (sel.options[i].text === treatment) { sel.selectedIndex = i; break; }
            }
          }
        }

        function clinicHideBooking() {
          document.getElementById('clinic-booking').style.display = 'none';
          document.getElementById('clinic-success').style.display = 'none';
          var info = document.getElementById('clinic-selected-treatment');
          if (info) info.textContent = '';
          unlockFrameScroll();
        }

        function clinicConfirm() {
          document.getElementById('clinic-success').style.display = 'block';
          setTimeout(clinicHideBooking, 2800);
        }
      `
    },

    /* -----------------------------------------------------------------------
       LOJA / SHOPPING — Estilo E-commerce Tech Escuro
       Funcionalidades: carrinho com total acumulado, timer de promoção
       regressivo em tempo real, animação "Adicionado" nos botões,
       toast de confirmação, categorias interativas.
       ----------------------------------------------------------------------- */
    store: {
      url: 'loja.jginfo.com.br',
      html: `
        <div id="store-wrapper" style="font-family:'Space Grotesk','Inter',sans-serif;background:#0A0A0A;color:#F9FAFB;position:relative;min-height:580px;">
          <div id="store-main">

            <!-- NAVBAR da loja -->
            <nav style="display:flex;justify-content:space-between;align-items:center;padding:12px 20px;background:#111;border-bottom:1px solid #1a1a1a;position:sticky;top:0;z-index:10;gap:10px;">
              <div style="font-weight:900;font-size:0.95rem;letter-spacing:0.04em;white-space:nowrap;display:flex;align-items:center;gap:8px;">
                <!-- Logo JG INFO versão escura (fundo escuro da loja) -->
                <img src="assets/logo.png" alt="JG INFO" style="height:24px;width:auto;" />
                🛍️ <span style="color:#0066FF;">URBAN</span>STORE
              </div>
              <div style="flex:1;max-width:180px;">
                <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:20px;padding:6px 12px;font-size:0.76rem;color:#555;display:flex;align-items:center;gap:5px;">
                  <span>🔍</span><span>Buscar...</span>
                </div>
              </div>
              <!-- Botão do carrinho com badge de quantidade -->
              <button onclick="storeShowCart()"
                      style="background:#0066FF;color:#fff;border:none;padding:7px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;gap:5px;transition:all 0.2s;"
                      onmouseover="this.style.background='#0052CC';" onmouseout="this.style.background='#0066FF';">
                🛒
                <span id="store-cart-badge" style="background:#FF3B30;color:#fff;border-radius:50%;width:17px;height:17px;display:inline-flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:900;min-width:17px;">0</span>
              </button>
            </nav>

            <!-- BANNER DE OFERTA COM TIMER REGRESSIVO -->
            <div style="padding:22px 20px;background:linear-gradient(135deg,#001233,#002D99);text-align:center;">
              <div style="font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:5px;">🔥 Oferta especial — somente hoje</div>
              <h1 style="font-size:clamp(1.2rem,3vw,1.6rem);font-weight:900;margin:0 0 5px;">Até <span style="color:#FFD700;">50% OFF</span></h1>
              <p style="color:rgba(255,255,255,0.6);font-size:0.8rem;margin-bottom:10px;">Frete grátis em Caxias - RJ para compras acima de R$ 150</p>
              <!-- Timer regressivo — atualizado pelo setInterval nos scripts -->
              <div id="store-promo-timer" style="font-size:0.9rem;font-weight:700;color:#FFD700;letter-spacing:0.04em;"></div>
            </div>

            <!-- TABS DE CATEGORIA -->
            <div style="padding:12px 20px;display:flex;gap:7px;overflow-x:auto;border-bottom:1px solid #1a1a1a;">
              ${['Todos','Eletrônicos','Moda','Casa','Esportes'].map((c, i) => `
                <button onclick="storeSetCategory(this)"
                        class="store-cat-btn"
                        style="background:${i===0?'#0066FF':'#1a1a1a'};color:${i===0?'#fff':'#777'};border:1px solid ${i===0?'#0066FF':'#333'};padding:6px 14px;border-radius:30px;font-size:0.76rem;cursor:pointer;white-space:nowrap;font-weight:${i===0?700:400};transition:all 0.2s;"
                        onmouseover="if(this.style.background!='rgb(0, 102, 255)'){this.style.background='#252525';}"
                        onmouseout="if(this.style.background!='rgb(0, 102, 255)'){this.style.background='#1a1a1a';}">${c}</button>
              `).join('')}
            </div>

            <!-- GRID DE PRODUTOS -->
            <div style="padding:14px 20px 20px;">
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:10px;">
                ${[
                  {emoji:'📱', name:'Smartphone X12',    price:899,  old:1299, stars:5, badge:31},
                  {emoji:'🎧', name:'Fone Bluetooth',    price:149,  old:229,  stars:4, badge:35},
                  {emoji:'⌚', name:'Smartwatch Pro',    price:349,  old:599,  stars:5, badge:42},
                  {emoji:'💻', name:'Notebook Ultra',    price:2499, old:3299, stars:5, badge:24},
                  {emoji:'🖱️', name:'Mouse Gamer RGB',   price:89,   old:149,  stars:4, badge:40},
                  {emoji:'⌨️', name:'Teclado Mecânico',  price:219,  old:349,  stars:5, badge:37},
                ].map((p, i) => `
                  <div style="background:#111;border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;transition:all 0.2s;"
                       onmouseover="this.style.borderColor='#0066FF';this.style.transform='translateY(-2px)';"
                       onmouseout="this.style.borderColor='#1a1a1a';this.style.transform='translateY(0)';">
                    <div style="position:relative;">
                      <div style="background:#1a1a1a;padding:18px;text-align:center;font-size:2rem;">${p.emoji}</div>
                      <span style="position:absolute;top:6px;left:6px;background:#FF3B30;color:#fff;font-size:0.6rem;font-weight:800;padding:2px 7px;border-radius:4px;">-${p.badge}%</span>
                    </div>
                    <div style="padding:10px;">
                      <div style="font-size:0.78rem;font-weight:600;margin-bottom:3px;line-height:1.3;">${p.name}</div>
                      <div style="font-size:0.65rem;color:#444;text-decoration:line-through;margin-bottom:1px;">R$ ${p.old.toLocaleString('pt-BR')}</div>
                      <div style="font-size:0.9rem;font-weight:800;color:#0066FF;margin-bottom:5px;">R$ ${p.price.toLocaleString('pt-BR')}</div>
                      <div style="font-size:0.6rem;color:#555;margin-bottom:8px;">${'⭐'.repeat(p.stars)}</div>
                      <!-- Botão com animação de feedback ao clicar -->
                      <button id="store-btn-${i}" onclick="storeAddToCart('${p.name}',${p.price},${i})"
                              style="width:100%;background:#0066FF;color:#fff;border:none;border-radius:7px;padding:7px;font-size:0.76rem;font-weight:700;cursor:pointer;transition:all 0.25s;">
                        + Adicionar
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div><!-- /store-main -->

          <!-- MODAL DO CARRINHO (slide de baixo para cima) -->
          <div id="store-cart-modal"
               style="display:none;position:absolute;inset:0;background:rgba(0,0,0,0.85);z-index:50;align-items:flex-end;justify-content:center;min-height:580px;">
            <div style="background:#111;border-radius:16px 16px 0 0;width:100%;max-width:500px;padding:20px;position:relative;max-height:65%;overflow-y:auto;border:1px solid #222;border-bottom:none;">

              <!-- BOTÃO FECHAR (X) -->
              <button onclick="storeHideCart()"
                      title="Fechar carrinho"
                      style="position:absolute;top:14px;right:14px;width:32px;height:32px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:50%;color:#bbb;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;"
                      onmouseover="this.style.background='rgba(255,100,100,0.25)';this.style.color='#fff';"
                      onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.color='#bbb';">✕</button>

              <h3 style="font-size:1.1rem;font-weight:800;margin:0 0 16px;padding-right:40px;">🛒 Carrinho</h3>
              <!-- Itens injetados por storeShowCart() -->
              <div id="store-cart-items" style="min-height:60px;"></div>

              <div style="border-top:1px solid #222;padding-top:12px;margin-top:10px;display:flex;justify-content:space-between;align-items:center;">
                <span style="color:#888;font-size:0.88rem;">Total:</span>
                <span id="store-total" style="font-size:1.2rem;font-weight:900;color:#0066FF;">R$ 0</span>
              </div>
              <a href="https://wa.me/5521980256650?text=Olá!%20Quero%20finalizar%20minha%20compra."
                 style="display:block;text-align:center;background:#25D366;color:#fff;padding:12px;border-radius:10px;font-weight:700;text-decoration:none;margin-top:12px;font-size:0.88rem;transition:all 0.2s;">
                💬 Finalizar pelo WhatsApp
              </a>
            </div>
          </div>

          <!-- TOAST de produto adicionado ao carrinho -->
          <div id="store-toast"
               style="display:none;position:absolute;top:62px;right:12px;background:#0066FF;color:#fff;padding:9px 14px;border-radius:8px;font-size:0.76rem;font-weight:700;z-index:60;box-shadow:0 4px 16px rgba(0,102,255,0.4);max-width:200px;"></div>

        </div><!-- /store-wrapper -->
      `,
      scripts: `
        /* ── LOJA: Variáveis e funções do protótipo ── */
        var storeItems = [];    // Array de itens {name, price}

        /** SEGURANÇA: escapa HTML antes de usar innerHTML (ver bakeryEsc). */
        function storeEsc(s) {
          return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                          .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }
        var storeTotal = 0;    // Total acumulado em R$

        /** Adiciona produto ao carrinho com animação e toast */
        function storeAddToCart(name, price, idx) {
          storeItems.push({ name: name, price: price });
          storeTotal += price;

          // Atualiza o badge de quantidade no nav
          var badge = document.getElementById('store-cart-badge');
          if (badge) badge.textContent = storeItems.length;

          // Animação do botão: muda para "✓ Adicionado!" por 1.5s
          var btn = document.getElementById('store-btn-' + idx);
          if (btn) {
            btn.textContent = '✓ Adicionado!';
            btn.style.background = '#22C55E';
            setTimeout(function () {
              btn.textContent = '+ Adicionar';
              btn.style.background = '#0066FF';
            }, 1500);
          }

          // Toast de confirmação
          var toast = document.getElementById('store-toast');
          if (toast) {
            toast.textContent = '✓ ' + name + ' no carrinho!';
            toast.style.display = 'block';
            setTimeout(function () { toast.style.display = 'none'; }, 2000);
          }
        }

        /** Abre o modal do carrinho com itens em tempo real */
        function storeShowCart() {
          var modal    = document.getElementById('store-cart-modal');
          var itemsEl  = document.getElementById('store-cart-items');
          var totalEl  = document.getElementById('store-total');
          if (!modal) return;

          // Renderizar itens ou mensagem de vazio
          if (itemsEl) {
            if (storeItems.length === 0) {
              itemsEl.innerHTML = '<p style="color:#555;text-align:center;padding:20px 0;font-size:0.88rem;">Nenhum produto adicionado. 🛒</p>';
            } else {
              itemsEl.innerHTML = storeItems.map(function (item) {
                return '<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #1a1a1a;">' +
                  '<span style="font-size:0.85rem;">' + storeEsc(item.name) + '</span>' +
                  '<span style="font-weight:700;color:#0066FF;">R$ ' + item.price.toLocaleString("pt-BR") + '</span>' +
                  '</div>';
              }).join('');
            }
          }

          if (totalEl) totalEl.textContent = 'R$ ' + storeTotal.toLocaleString('pt-BR');
          modal.style.display = 'flex';
          lockFrameScroll();
        }

        function storeHideCart() {
          var modal = document.getElementById('store-cart-modal');
          if (modal) modal.style.display = 'none';
          unlockFrameScroll();
        }

        /** Alterna a categoria ativa nos tabs */
        function storeSetCategory(btn) {
          document.querySelectorAll('.store-cat-btn').forEach(function (b) {
            b.style.background = '#1a1a1a'; b.style.color = '#777'; b.style.borderColor = '#333'; b.style.fontWeight = '400';
          });
          btn.style.background = '#0066FF'; btn.style.color = '#fff'; btn.style.borderColor = '#0066FF'; btn.style.fontWeight = '700';
        }

        /* Timer de promoção: conta regressiva de 23:47 em tempo real.
           Reinicia a cada vez que o nicho é carregado. */
        (function () {
          var minutes = 23, seconds = 47;
          var timerEl = document.getElementById('store-promo-timer');
          if (!timerEl) return;

          function tick() {
            if (seconds === 0) {
              if (minutes === 0) return; // Parar quando zerar
              minutes--; seconds = 59;
            } else { seconds--; }
            timerEl.textContent = '⏳ Oferta expira em: ' +
              String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
          }

          timerEl.textContent = '⏳ Oferta expira em: 23:47';
          setInterval(tick, 1000); // Atualiza a cada 1 segundo
        })();
      `
    }

  }; /* ── fim do objeto NICHES ── */

  /* =========================================================================
     UTILITÁRIOS: EXPOR lockFrameScroll E unlockFrameScroll GLOBALMENTE
     
     Os scripts dos nichos chamam essas funções como globals.
     Precisam estar em window.* para que os scripts injetados as encontrem.
     ========================================================================= */
  window.lockFrameScroll   = lockFrameScroll;
  window.unlockFrameScroll = unlockFrameScroll;

  /* =========================================================================
     RENDERIZADOR DO PREVIEW
     
     Responsável por:
     1. Desbloquear scroll do nicho anterior (caso modal estivesse aberto)
     2. Remover scripts antigos do nicho anterior (evita conflitos de função)
     3. Injetar o HTML do nicho no #frame-content
     4. Reexpor as funções globais de scroll (por segurança)
     5. Executar os scripts do nicho (via <script> tag dinâmica)
     6. Atualizar a URL na barra do browser fake
     ========================================================================= */

  /**
   * Renderiza o preview do nicho selecionado dentro do #frame-content.
   * @param {string} niche - Chave do nicho (ex: 'barbershop', 'bakery')
   */
  function renderNiche(niche) {
    var frameContent = document.getElementById('frame-content');
    if (!frameContent) return;

    var data = NICHES[niche];
    if (!data) {
      console.warn('[JG INFO Portfolio] Nicho não encontrado:', niche);
      return;
    }

    // 1. Garantir que scroll esteja desbloqueado ao trocar de nicho
    unlockFrameScroll();

    // 2. Remover <script> tags do nicho anterior para evitar redeclaração de funções
    document.querySelectorAll('[data-niche-script]').forEach(function (el) { el.remove(); });

    // 3. Injetar o HTML do nicho
    frameContent.innerHTML = data.html;

    // 4. Reexpor os utilitários (garantia extra, caso algum script rode antes)
    window.lockFrameScroll   = lockFrameScroll;
    window.unlockFrameScroll = unlockFrameScroll;

    // 5. Injetar os scripts do nicho no body (rodam no escopo global da página)
    if (data.scripts) {
      var script = document.createElement('script');
      script.setAttribute('data-niche-script', niche); // Tag para remoção posterior
      script.textContent = data.scripts;
      document.body.appendChild(script);
    }

    // 6. Atualizar a URL na barra do browser fake (definida em main.js)
    if (typeof window.updateFrameUrl === 'function') {
      window.updateFrameUrl(niche);
    }
  }

  /* =========================================================================
     INICIALIZAÇÃO DOS FILTROS DO PORTFÓLIO
     
     Adiciona event listeners em todos os botões .portfolio__filter.
     O nicho é lido do atributo data-niche do botão clicado.
     ========================================================================= */

  /**
   * Inicializa os botões de filtro e renderiza o nicho padrão (Barbearia).
   * Chamado quando o DOM estiver pronto.
   */
  function initPortfolioFilters() {
    var filterBtns = document.querySelectorAll('.portfolio__filter');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Remover estado ativo de todos os botões
        filterBtns.forEach(function (b) {
          b.classList.remove('portfolio__filter--active');
          b.setAttribute('aria-selected', 'false');
        });
        // Ativar o botão clicado
        btn.classList.add('portfolio__filter--active');
        btn.setAttribute('aria-selected', 'true');

        // Renderizar o nicho correspondente
        var niche = btn.getAttribute('data-niche');
        renderNiche(niche);
      });
    });

    // Renderizar o nicho padrão ao carregar a página
    renderNiche('barbershop');
  }

  /* Aguardar o DOM antes de inicializar */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioFilters);
  } else {
    initPortfolioFilters(); // DOM já está pronto
  }

})(); /* ── fim da IIFE (Immediately Invoked Function Expression) ──
          Envolve todo o código para não poluir o escopo global com variáveis internas. */
