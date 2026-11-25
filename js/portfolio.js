/* ==========================================================================
   JG INFO — portfolio.js
   Portfólio interativo: renderiza previews de sites por nicho dentro do frame.
   Cada nicho tem seu próprio HTML/CSS inline — tudo em uma única página.
   ========================================================================== */

(function () {
  'use strict';

  // =========================================================================
  // TEMPLATES DE PREVIEW POR NICHO
  // Para adicionar um novo nicho: adicionar uma entrada no objeto NICHES.
  // =========================================================================
  const NICHES = {

    // -----------------------------------------------------------------------
    // BARBEARIA — Estilo Urbano
    // -----------------------------------------------------------------------
    barbershop: {
      url: 'barbearia.jginfo.com.br',
      html: `
        <div style="font-family:'Inter',sans-serif;background:#0E0E0E;color:#F9FAFB;min-height:100%">

          <!-- Navbar da barbearia -->
          <nav style="display:flex;justify-content:space-between;align-items:center;padding:16px 32px;background:#111;border-bottom:1px solid #222;position:sticky;top:0;z-index:10">
            <div style="font-weight:900;font-size:1.2rem;letter-spacing:0.08em;color:#C8A96E">✂ BARBER<span style="color:#fff">KING</span></div>
            <div style="display:flex;gap:24px;font-size:0.85rem;color:#aaa">
              <span style="cursor:pointer">Serviços</span>
              <span style="cursor:pointer">Equipe</span>
              <span style="cursor:pointer">Galeria</span>
              <button onclick="showBooking()" style="background:#C8A96E;color:#0E0E0E;border:none;padding:8px 20px;border-radius:30px;font-weight:700;cursor:pointer;font-size:0.85rem">Agendar</button>
            </div>
          </nav>

          <!-- Hero da barbearia -->
          <div style="padding:48px 32px;background:linear-gradient(135deg,#111 0%,#1a1203 100%);border-bottom:1px solid #222">
            <div style="max-width:600px">
              <div style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#C8A96E;margin-bottom:12px">📍 Rio de Janeiro, RJ</div>
              <h1 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;line-height:1.1;margin:0 0 16px">Sua <span style="color:#C8A96E">Barbearia</span><br/>de Confiança.</h1>
              <p style="color:#888;margin-bottom:24px;line-height:1.6">Cortes modernos, acabamento perfeito e uma experiência premium. Reserve agora e transforme seu visual.</p>
              <div style="display:flex;gap:12px;flex-wrap:wrap">
                <button onclick="showBooking()" style="background:#C8A96E;color:#0E0E0E;border:none;padding:12px 28px;border-radius:30px;font-weight:700;cursor:pointer;font-size:0.95rem">Agendar Horário</button>
                <button style="background:transparent;color:#C8A96E;border:1px solid #C8A96E;padding:12px 28px;border-radius:30px;font-weight:600;cursor:pointer;font-size:0.95rem">Ver Serviços</button>
              </div>
            </div>
          </div>

          <!-- Galeria mockup -->
          <div style="padding:32px;background:#0E0E0E">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:32px">
              ${['#1a1203','#0D1200','#1a0d00'].map((bg, i) => `
                <div style="background:${bg};border-radius:8px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;border:1px solid #2a2200;font-size:2rem">
                  ${['✂️','💈','🪒'][i]}
                </div>
              `).join('')}
            </div>

            <!-- Serviços -->
            <h2 style="font-size:1.2rem;font-weight:800;margin:0 0 16px;color:#C8A96E">Nossos Serviços</h2>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px">
              ${[
                {name:'Corte Masculino', price:'R$ 35'},
                {name:'Barba Completa', price:'R$ 30'},
                {name:'Corte + Barba', price:'R$ 60'},
                {name:'Pézinho/Degradê', price:'R$ 25'},
                {name:'Luzes/Descoloração', price:'R$ 80'},
                {name:'Hidratação Capilar', price:'R$ 45'},
              ].map(s => `
                <div style="background:#111;border:1px solid #222;border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:0.88rem;font-weight:600">${s.name}</span>
                  <span style="color:#C8A96E;font-weight:700;font-size:0.88rem">${s.price}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sistema de Agendamento -->
          <div id="booking-panel" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999;align-items:center;justify-content:center">
            <div style="background:#111;border:1px solid #333;border-radius:16px;width:90%;max-width:480px;padding:28px;position:relative">
              <button onclick="hideBooking()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#888;font-size:1.3rem;cursor:pointer">✕</button>
              <h3 style="font-size:1.2rem;font-weight:800;color:#C8A96E;margin:0 0 24px">Agendar Horário</h3>

              <!-- Passo 1: Serviço -->
              <div style="margin-bottom:20px">
                <label style="font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:8px">1. Escolha o Serviço</label>
                <select id="bk-service" style="width:100%;background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:12px;border-radius:8px;font-size:0.9rem;outline:none">
                  <option>Corte Masculino — R$ 35</option>
                  <option>Barba Completa — R$ 30</option>
                  <option>Corte + Barba — R$ 60</option>
                  <option>Pézinho/Degradê — R$ 25</option>
                  <option>Luzes/Descoloração — R$ 80</option>
                </select>
              </div>

              <!-- Passo 2: Profissional -->
              <div style="margin-bottom:20px">
                <label style="font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:8px">2. Escolha o Profissional</label>
                <div style="display:flex;gap:8px">
                  ${['Marcos','Felipe','Diego'].map((n,i) => `
                    <label style="flex:1;cursor:pointer">
                      <input type="radio" name="barber" value="${n}" ${i===0?'checked':''} style="display:none">
                      <div class="barber-btn" onclick="selectBarber(this)" style="background:#1a1a1a;border:1px solid ${i===0?'#C8A96E':'#333'};border-radius:8px;padding:12px;text-align:center;transition:all 0.2s">
                        <div style="font-size:1.5rem;margin-bottom:4px">${['👨‍💈','✂️','💈'][i]}</div>
                        <div style="font-size:0.8rem;font-weight:600">${n}</div>
                      </div>
                    </label>
                  `).join('')}
                </div>
              </div>

              <!-- Passo 3: Data -->
              <div style="margin-bottom:20px">
                <label style="font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:8px">3. Escolha a Data</label>
                <input type="date" id="bk-date" style="width:100%;background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:12px;border-radius:8px;font-size:0.9rem;outline:none">
              </div>

              <!-- Passo 4: Horário -->
              <div style="margin-bottom:24px">
                <label style="font-size:0.8rem;color:#888;text-transform:uppercase;letter-spacing:0.08em;display:block;margin-bottom:8px">4. Escolha o Horário</label>
                <div style="display:flex;flex-wrap:wrap;gap:8px" id="time-slots">
                  ${['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'].map((t,i) => `
                    <button onclick="selectTime(this,'${t}')" style="background:${i===0?'#C8A96E':'#1a1a1a'};color:${i===0?'#000':'#F9FAFB'};border:1px solid ${i===0?'#C8A96E':'#333'};border-radius:6px;padding:8px 12px;font-size:0.82rem;cursor:pointer;transition:all 0.2s" ${i===4?'disabled style="opacity:0.3;cursor:not-allowed;"':''}>
                      ${t}${i===4?' (Ocupado)':''}
                    </button>
                  `).join('')}
                </div>
              </div>

              <button onclick="confirmBooking()" style="width:100%;background:#C8A96E;color:#0E0E0E;border:none;padding:14px;border-radius:10px;font-weight:800;font-size:1rem;cursor:pointer">
                ✅ Confirmar Agendamento
              </button>

              <div id="booking-success" style="display:none;text-align:center;margin-top:16px;padding:16px;background:rgba(34,197,94,0.1);border:1px solid #22C55E;border-radius:8px;color:#22C55E;font-weight:600">
                🎉 Agendamento confirmado! Você receberá uma confirmação no WhatsApp.
              </div>
            </div>
          </div>
        </div>
      `,
      scripts: `
        function showBooking() {
          var p = document.getElementById('booking-panel');
          if(p) { p.style.display='flex'; document.getElementById('bk-date').valueAsDate = new Date(); }
        }
        function hideBooking() {
          var p = document.getElementById('booking-panel');
          if(p) { p.style.display='none'; document.getElementById('booking-success').style.display='none'; }
        }
        function selectBarber(el) {
          document.querySelectorAll('.barber-btn').forEach(b => b.style.borderColor='#333');
          el.style.borderColor='#C8A96E';
        }
        function selectTime(btn, time) {
          document.querySelectorAll('#time-slots button:not([disabled])').forEach(b => {
            b.style.background='#1a1a1a'; b.style.color='#F9FAFB'; b.style.borderColor='#333';
          });
          btn.style.background='#C8A96E'; btn.style.color='#000'; btn.style.borderColor='#C8A96E';
        }
        function confirmBooking() {
          document.getElementById('booking-success').style.display='block';
          setTimeout(function(){ hideBooking(); }, 3000);
        }
      `
    },

    // -----------------------------------------------------------------------
    // PADARIA / RESTAURANTE
    // -----------------------------------------------------------------------
    bakery: {
      url: 'padaria.jginfo.com.br',
      html: `
        <div style="font-family:'Inter',sans-serif;background:#FDFAF5;color:#1a1200;min-height:100%">
          <!-- Navbar -->
          <nav style="display:flex;justify-content:space-between;align-items:center;padding:16px 32px;background:#fff;border-bottom:1px solid #f0e8d0;position:sticky;top:0;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
            <div style="font-weight:900;font-size:1.1rem;color:#8B4513">🍞 Padaria <span style="color:#D4870A">São João</span></div>
            <div style="display:flex;gap:16px;font-size:0.85rem;color:#666">
              <span style="cursor:pointer">Cardápio</span>
              <span style="cursor:pointer">Encomendas</span>
              <span style="cursor:pointer">Contato</span>
            </div>
          </nav>

          <!-- Hero -->
          <div style="padding:40px 32px;background:linear-gradient(135deg,#FFF8E7 0%,#FFF3D0 100%);border-bottom:1px solid #f0e8d0;text-align:center">
            <div style="font-size:3rem;margin-bottom:12px">🥐</div>
            <h1 style="font-size:2rem;font-weight:900;margin:0 0 12px;color:#1a1200">Feito com amor,<br/><span style="color:#D4870A">entregue fresquinho.</span></h1>
            <p style="color:#666;margin-bottom:20px">Pães artesanais, bolos e salgados todos os dias. Encomende pelo WhatsApp!</p>
            <a href="https://wa.me/5521980256650" style="background:#D4870A;color:#fff;padding:12px 28px;border-radius:30px;font-weight:700;text-decoration:none;display:inline-block">📞 Fazer Encomenda</a>
          </div>

          <!-- Cardápio -->
          <div style="padding:32px">
            <!-- Tabs -->
            <div style="display:flex;gap:8px;margin-bottom:24px;overflow-x:auto">
              ${['🥐 Pães','🎂 Bolos','🥙 Salgados','☕ Bebidas'].map((cat,i) => `
                <button style="background:${i===0?'#D4870A':'#f0e8d0'};color:${i===0?'#fff':'#666'};border:none;padding:8px 20px;border-radius:30px;font-weight:600;cursor:pointer;white-space:nowrap;font-size:0.85rem">${cat}</button>
              `).join('')}
            </div>

            <!-- Produtos -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px">
              ${[
                {emoji:'🥐',name:'Croissant Folhado', desc:'Manteiga francesa', price:'R$ 8'},
                {emoji:'🍞',name:'Pão de Forma',      desc:'Fatias 500g', price:'R$ 14'},
                {emoji:'🥖',name:'Baguete Artesanal', desc:'Crocante, recém saído', price:'R$ 10'},
                {emoji:'🧁',name:'Cupcake de Morango', desc:'Com cobertura cremosa', price:'R$ 9'},
                {emoji:'🥨',name:'Pão de Queijo',    desc:'Tamanho família', price:'R$ 22'},
                {emoji:'🫓',name:'Broa de Milho',    desc:'Receita tradicional', price:'R$ 12'},
              ].map(p => `
                <div style="background:#fff;border:1px solid #f0e8d0;border-radius:12px;padding:16px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
                  <div style="font-size:2.2rem;margin-bottom:8px">${p.emoji}</div>
                  <strong style="font-size:0.9rem;display:block;margin-bottom:4px">${p.name}</strong>
                  <span style="font-size:0.8rem;color:#888;display:block;margin-bottom:8px">${p.desc}</span>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-weight:800;color:#D4870A">${p.price}</span>
                    <button style="background:#D4870A;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:0.8rem;cursor:pointer;font-weight:600">+ Adicionar</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- CTA encomenda -->
            <div style="margin-top:28px;background:linear-gradient(135deg,#FFF8E7,#FFF3D0);border:1px solid #f0e8d0;border-radius:12px;padding:24px;text-align:center">
              <h3 style="font-size:1.1rem;font-weight:800;color:#1a1200;margin:0 0 8px">🎂 Encomende seu bolo especial!</h3>
              <p style="color:#666;font-size:0.88rem;margin-bottom:16px">Bolos personalizados para festas, aniversários e eventos. Consulte sabores e preços.</p>
              <a href="https://wa.me/5521980256650?text=Olá!%20Quero%20encomendar%20um%20bolo." style="background:#25D366;color:#fff;padding:10px 24px;border-radius:30px;font-weight:700;text-decoration:none;font-size:0.88rem">💬 Encomendar pelo WhatsApp</a>
            </div>
          </div>
        </div>
      `,
      scripts: ''
    },

    // -----------------------------------------------------------------------
    // ADVOCACIA
    // -----------------------------------------------------------------------
    law: {
      url: 'advocacia.jginfo.com.br',
      html: `
        <div style="font-family:'Inter',sans-serif;background:#0A0A14;color:#F9FAFB;min-height:100%">
          <!-- Navbar -->
          <nav style="display:flex;justify-content:space-between;align-items:center;padding:16px 32px;background:#0D0D1A;border-bottom:1px solid rgba(255,255,255,0.08);position:sticky;top:0;z-index:10">
            <div style="font-weight:900;font-size:1rem;letter-spacing:0.03em">⚖️ <span style="color:#C5A028">Dr. Almeida</span> & Associados</div>
            <div style="display:flex;gap:20px;font-size:0.85rem;color:#aaa">
              <span style="cursor:pointer">Áreas</span>
              <span style="cursor:pointer">Equipe</span>
              <button onclick="showLawBooking()" style="background:#C5A028;color:#0A0A14;border:none;padding:8px 18px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.82rem">Consulta Gratuita</button>
            </div>
          </nav>

          <!-- Hero -->
          <div style="padding:48px 32px;background:linear-gradient(160deg,#0A0A14 0%,#0D1020 100%)">
            <div style="max-width:600px">
              <div style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#C5A028;margin-bottom:12px">OAB/RJ 00.000 — Caxias, Rio de Janeiro</div>
              <h1 style="font-size:clamp(1.6rem,3.5vw,2.5rem);font-weight:900;line-height:1.1;margin:0 0 16px">Defendendo seus<br/><span style="color:#C5A028">direitos</span> com<br/>competência.</h1>
              <p style="color:#888;line-height:1.65;margin-bottom:24px">Mais de 15 anos de experiência em Direito Civil, Trabalhista e Previdenciário. Atendimento presencial e online.</p>
              <div style="display:flex;gap:12px;flex-wrap:wrap">
                <button onclick="showLawBooking()" style="background:#C5A028;color:#0A0A14;border:none;padding:12px 28px;border-radius:6px;font-weight:700;cursor:pointer">Agendar Consulta</button>
                <button style="background:transparent;color:#C5A028;border:1px solid #C5A028;padding:12px 28px;border-radius:6px;font-weight:600;cursor:pointer">Nossas Áreas</button>
              </div>
            </div>
          </div>

          <!-- Áreas de atuação -->
          <div style="padding:32px;background:#0D0D1A">
            <h2 style="font-size:1.1rem;font-weight:800;color:#C5A028;margin:0 0 20px">Áreas de Atuação</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
              ${[
                {icon:'👔',area:'Direito Trabalhista',  desc:'Demissões, horas extras, FGTS'},
                {icon:'🏠',area:'Direito Civil',         desc:'Contratos, cobranças, indenizações'},
                {icon:'📋',area:'Previdenciário',         desc:'Aposentadoria, benefícios INSS'},
                {icon:'👪',area:'Direito de Família',    desc:'Divórcio, pensão, guarda'},
                {icon:'🏢',area:'Direito Empresarial',  desc:'Constituição, contratos, litígios'},
                {icon:'🚗',area:'Acidentes de Trânsito', desc:'Indenizações, seguros'},
              ].map(a => `
                <div style="background:#111;border:1px solid rgba(197,160,40,0.15);border-radius:10px;padding:16px">
                  <div style="font-size:1.5rem;margin-bottom:8px">${a.icon}</div>
                  <strong style="font-size:0.88rem;display:block;margin-bottom:4px;color:#F9FAFB">${a.area}</strong>
                  <span style="font-size:0.8rem;color:#666">${a.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Modal de agendamento -->
          <div id="law-booking" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:999;align-items:center;justify-content:center">
            <div style="background:#111;border:1px solid rgba(197,160,40,0.3);border-radius:12px;width:90%;max-width:420px;padding:28px;position:relative">
              <button onclick="hideLawBooking()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#888;font-size:1.2rem;cursor:pointer">✕</button>
              <h3 style="font-size:1.1rem;font-weight:800;color:#C5A028;margin:0 0 20px">Consulta Gratuita</h3>
              <div style="display:flex;flex-direction:column;gap:14px">
                <input placeholder="Seu nome completo" style="background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:12px;border-radius:8px;font-size:0.9rem;outline:none;width:100%">
                <input placeholder="Seu WhatsApp" style="background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:12px;border-radius:8px;font-size:0.9rem;outline:none;width:100%">
                <select style="background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:12px;border-radius:8px;font-size:0.9rem;outline:none;width:100%">
                  <option>Área do problema...</option>
                  <option>Direito Trabalhista</option>
                  <option>Direito Civil</option>
                  <option>Previdenciário</option>
                  <option>Direito de Família</option>
                </select>
                <textarea placeholder="Descreva brevemente seu caso..." rows="3" style="background:#1a1a1a;border:1px solid #333;color:#F9FAFB;padding:12px;border-radius:8px;font-size:0.9rem;outline:none;width:100%;resize:none"></textarea>
                <button onclick="confirmLaw()" style="background:#C5A028;color:#0A0A14;border:none;padding:14px;border-radius:8px;font-weight:800;cursor:pointer;font-size:1rem">Solicitar Consulta Gratuita</button>
                <div id="law-success" style="display:none;text-align:center;padding:12px;background:rgba(34,197,94,0.1);border:1px solid #22C55E;border-radius:8px;color:#22C55E;font-weight:600;font-size:0.88rem">✅ Solicitação enviada! Entraremos em contato em breve.</div>
              </div>
            </div>
          </div>
        </div>
      `,
      scripts: `
        function showLawBooking() { document.getElementById('law-booking').style.display='flex'; }
        function hideLawBooking() { document.getElementById('law-booking').style.display='none'; document.getElementById('law-success').style.display='none'; }
        function confirmLaw() { document.getElementById('law-success').style.display='block'; setTimeout(hideLawBooking, 2500); }
      `
    },

    // -----------------------------------------------------------------------
    // CLÍNICA / ESTÉTICA
    // -----------------------------------------------------------------------
    clinic: {
      url: 'clinica.jginfo.com.br',
      html: `
        <div style="font-family:'Inter',sans-serif;background:#FAF7F5;color:#1a1200;min-height:100%">
          <!-- Navbar -->
          <nav style="display:flex;justify-content:space-between;align-items:center;padding:16px 32px;background:#fff;border-bottom:1px solid #f0e8e0;position:sticky;top:0;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
            <div style="font-weight:900;font-size:1rem;color:#9B4E8A">🌸 Studio <span style="color:#C97DB0">Belle</span></div>
            <div style="display:flex;gap:16px;font-size:0.85rem;color:#888">
              <span>Tratamentos</span>
              <span>Profissionais</span>
              <button onclick="showClinicBooking()" style="background:#9B4E8A;color:#fff;border:none;padding:8px 18px;border-radius:30px;font-weight:600;cursor:pointer;font-size:0.82rem">Agendar</button>
            </div>
          </nav>

          <!-- Hero -->
          <div style="padding:40px 32px;background:linear-gradient(135deg,#FFF0F8 0%,#FAF0FF 100%);text-align:center;border-bottom:1px solid #f0e8e0">
            <div style="font-size:2.5rem;margin-bottom:12px">✨</div>
            <h1 style="font-size:2rem;font-weight:900;margin:0 0 12px;color:#1a1200">Beleza que <span style="color:#9B4E8A">transforma.</span></h1>
            <p style="color:#888;margin-bottom:20px;max-width:400px;margin-inline:auto">Tratamentos estéticos personalizados para realçar sua beleza natural. Agende sua avaliação gratuita.</p>
            <button onclick="showClinicBooking()" style="background:#9B4E8A;color:#fff;border:none;padding:12px 28px;border-radius:30px;font-weight:700;cursor:pointer;font-size:0.95rem">Agendar Avaliação Gratuita</button>
          </div>

          <!-- Tratamentos -->
          <div style="padding:32px">
            <h2 style="font-size:1.1rem;font-weight:800;color:#9B4E8A;margin:0 0 20px">Nossos Tratamentos</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
              ${[
                {emoji:'💆',name:'Limpeza de Pele Profunda', price:'R$ 120', dur:'60 min'},
                {emoji:'💉',name:'Botox e Preenchimento',    price:'Consultar', dur:'45 min'},
                {emoji:'🌊',name:'Hidratação Facial',        price:'R$ 90',  dur:'50 min'},
                {emoji:'⚡',name:'Depilação a Laser',        price:'A partir de R$ 80', dur:'30 min'},
                {emoji:'💅',name:'Design de Sobrancelhas',   price:'R$ 45',  dur:'30 min'},
                {emoji:'🧴',name:'Microagulhamento',         price:'R$ 200', dur:'90 min'},
              ].map(t => `
                <div style="background:#fff;border:1px solid #f0e8e0;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
                  <div style="font-size:1.8rem;margin-bottom:8px">${t.emoji}</div>
                  <strong style="font-size:0.88rem;display:block;margin-bottom:4px;color:#1a1200">${t.name}</strong>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
                    <span style="font-weight:800;color:#9B4E8A;font-size:0.85rem">${t.price}</span>
                    <span style="font-size:0.75rem;color:#aaa;background:#f5f0f8;padding:3px 8px;border-radius:20px">⏱ ${t.dur}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Agendamento modal -->
          <div id="clinic-booking" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:999;align-items:center;justify-content:center">
            <div style="background:#fff;border-radius:16px;width:90%;max-width:400px;padding:28px;position:relative">
              <button onclick="hideClinicBooking()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:#999;font-size:1.2rem;cursor:pointer">✕</button>
              <h3 style="font-size:1.1rem;font-weight:800;color:#9B4E8A;margin:0 0 20px">Agendar Consulta</h3>
              <div style="display:flex;flex-direction:column;gap:12px">
                <input placeholder="Seu nome" style="background:#f8f4f8;border:1px solid #e0d0e0;color:#1a1200;padding:12px;border-radius:8px;font-size:0.9rem;outline:none;width:100%">
                <input placeholder="WhatsApp" style="background:#f8f4f8;border:1px solid #e0d0e0;color:#1a1200;padding:12px;border-radius:8px;font-size:0.9rem;outline:none;width:100%">
                <select style="background:#f8f4f8;border:1px solid #e0d0e0;color:#1a1200;padding:12px;border-radius:8px;font-size:0.9rem;outline:none;width:100%">
                  <option>Tratamento de interesse...</option>
                  <option>Limpeza de Pele</option>
                  <option>Hidratação Facial</option>
                  <option>Depilação a Laser</option>
                  <option>Design de Sobrancelhas</option>
                </select>
                <input type="date" style="background:#f8f4f8;border:1px solid #e0d0e0;color:#1a1200;padding:12px;border-radius:8px;font-size:0.9rem;outline:none;width:100%">
                <button onclick="confirmClinic()" style="background:#9B4E8A;color:#fff;border:none;padding:14px;border-radius:30px;font-weight:700;cursor:pointer;font-size:0.95rem">✨ Confirmar Agendamento</button>
                <div id="clinic-success" style="display:none;text-align:center;padding:12px;background:#f0fff4;border:1px solid #22C55E;border-radius:8px;color:#16a34a;font-weight:600;font-size:0.88rem">🎉 Agendado! Entraremos em contato para confirmar.</div>
              </div>
            </div>
          </div>
        </div>
      `,
      scripts: `
        function showClinicBooking() { document.getElementById('clinic-booking').style.display='flex'; }
        function hideClinicBooking() { document.getElementById('clinic-booking').style.display='none'; document.getElementById('clinic-success').style.display='none'; }
        function confirmClinic() { document.getElementById('clinic-success').style.display='block'; setTimeout(hideClinicBooking, 2500); }
      `
    },

    // -----------------------------------------------------------------------
    // LOJA / SHOPPING
    // -----------------------------------------------------------------------
    store: {
      url: 'loja.jginfo.com.br',
      html: `
        <div style="font-family:'Inter',sans-serif;background:#0A0A0A;color:#F9FAFB;min-height:100%">
          <!-- Navbar -->
          <nav style="display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:#111;border-bottom:1px solid #222;position:sticky;top:0;z-index:10">
            <div style="font-weight:900;font-size:1rem;letter-spacing:0.05em">🛍️ <span style="color:#0066FF">URBAN</span>STORE</div>
            <div style="display:flex;align-items:center;gap:16px">
              <div style="background:#1a1a1a;border:1px solid #333;border-radius:30px;padding:8px 16px;display:flex;align-items:center;gap:8px;font-size:0.82rem;color:#888">
                <span>🔍</span> <span>Buscar produtos...</span>
              </div>
              <button id="cart-btn" style="background:#0066FF;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;position:relative">
                🛒 <span id="cart-count">0</span>
              </button>
            </div>
          </nav>

          <!-- Banner -->
          <div style="padding:32px 24px;background:linear-gradient(135deg,#001233 0%,#002D99 100%);text-align:center">
            <div style="font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:8px">🔥 Oferta especial — somente hoje</div>
            <h1 style="font-size:clamp(1.5rem,3vw,2.2rem);font-weight:900;margin:0 0 8px">Até <span style="color:#FFD700">50% OFF</span> em produtos selecionados</h1>
            <p style="color:rgba(255,255,255,0.7);margin-bottom:16px;font-size:0.9rem">Frete grátis para Caxias - RJ em compras acima de R$ 150</p>
            <button style="background:#FFD700;color:#0A0A0A;border:none;padding:10px 24px;border-radius:8px;font-weight:800;cursor:pointer">Ver Ofertas</button>
          </div>

          <!-- Categorias -->
          <div style="padding:16px 24px;display:flex;gap:8px;overflow-x:auto;border-bottom:1px solid #1a1a1a">
            ${['Todos','Eletrônicos','Moda','Casa','Esportes','Beleza'].map((c,i) => `
              <button style="background:${i===0?'#0066FF':'#1a1a1a'};color:${i===0?'#fff':'#888'};border:1px solid ${i===0?'#0066FF':'#333'};padding:8px 18px;border-radius:30px;font-size:0.82rem;cursor:pointer;white-space:nowrap;font-weight:${i===0?700:400}">${c}</button>
            `).join('')}
          </div>

          <!-- Produtos -->
          <div style="padding:24px">
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px">
              ${[
                {emoji:'📱',name:'Smartphone X12', price:'R$ 899', old:'R$ 1.299', stars:'⭐⭐⭐⭐⭐', badge:'-31%'},
                {emoji:'🎧',name:'Fone Bluetooth', price:'R$ 149', old:'R$ 229',   stars:'⭐⭐⭐⭐',   badge:'-35%'},
                {emoji:'⌚',name:'Smartwatch Pro', price:'R$ 349', old:'R$ 599',   stars:'⭐⭐⭐⭐⭐', badge:'-42%'},
                {emoji:'💻',name:'Notebook Ultra', price:'R$ 2.499', old:'R$ 3.299', stars:'⭐⭐⭐⭐⭐', badge:'-24%'},
                {emoji:'🖱️',name:'Mouse Gamer RGB', price:'R$ 89', old:'R$ 149',  stars:'⭐⭐⭐⭐',   badge:'-40%'},
                {emoji:'⌨️',name:'Teclado Mecânico', price:'R$ 219', old:'R$ 349', stars:'⭐⭐⭐⭐⭐', badge:'-37%'},
              ].map((p,i) => `
                <div style="background:#111;border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;position:relative">
                  <div style="position:absolute;top:8px;left:8px;background:#FF3B30;color:#fff;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:4px">${p.badge}</div>
                  <div style="background:#1a1a1a;padding:24px;text-align:center;font-size:2.5rem">${p.emoji}</div>
                  <div style="padding:12px">
                    <div style="font-size:0.82rem;font-weight:600;margin-bottom:4px;line-height:1.3">${p.name}</div>
                    <div style="font-size:0.72rem;color:#666;text-decoration:line-through;margin-bottom:2px">${p.old}</div>
                    <div style="font-size:1rem;font-weight:800;color:#0066FF;margin-bottom:6px">${p.price}</div>
                    <div style="font-size:0.65rem;color:#888;margin-bottom:10px">${p.stars}</div>
                    <button onclick="addToCart(${i})" style="width:100%;background:#0066FF;color:#fff;border:none;border-radius:8px;padding:8px;font-size:0.8rem;font-weight:700;cursor:pointer">Adicionar</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `,
      scripts: `
        var cartTotal = 0;
        function addToCart(i) {
          cartTotal++;
          document.getElementById('cart-count').textContent = cartTotal;
          var btn = document.getElementById('cart-btn');
          btn.style.background = '#22C55E';
          setTimeout(function(){ btn.style.background='#0066FF'; }, 600);
        }
      `
    }
  };

  // =========================================================================
  // RENDERIZADOR DO PREVIEW
  // Injeta o HTML+JS do nicho selecionado dentro do #frame-content
  // =========================================================================
  function renderNiche(niche) {
    const frameContent = document.getElementById('frame-content');
    if (!frameContent) return;

    const data = NICHES[niche];
    if (!data) return;

    // Limpar scripts do nicho anterior
    document.querySelectorAll('[data-niche-script]').forEach(el => el.remove());

    // Injetar HTML
    frameContent.innerHTML = data.html;

    // Injetar scripts do nicho (isolados por função)
    if (data.scripts) {
      const script = document.createElement('script');
      script.setAttribute('data-niche-script', niche);
      script.textContent = data.scripts;
      document.body.appendChild(script);
    }

    // Atualizar URL na barra do browser
    if (typeof window.updateFrameUrl === 'function') {
      window.updateFrameUrl(niche);
    }

    // Rolar suavemente para o frame
    frameContent.closest('.portfolio__frame')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // =========================================================================
  // FILTROS — event listeners nos botões de nicho
  // =========================================================================
  function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.portfolio__filter');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Atualizar estado ativo
        filterBtns.forEach(b => {
          b.classList.remove('portfolio__filter--active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('portfolio__filter--active');
        btn.setAttribute('aria-selected', 'true');

        // Renderizar nicho
        const niche = btn.getAttribute('data-niche');
        renderNiche(niche);
      });
    });

    // Renderizar o nicho padrão (Barbearia) ao carregar
    renderNiche('barbershop');
  }

  // =========================================================================
  // INIT
  // =========================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioFilters);
  } else {
    initPortfolioFilters();
  }

})();
