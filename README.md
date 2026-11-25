# JG INFO — Site Institucional

Site profissional, minimalista e de alta conversão da **JG INFO** — especialista em:
- 🌐 Criação de Sites para Negócios
- 🖥️ Suporte de PC Completo
- 📲 Soluções Digitais NFC

📍 Caxias — Rio de Janeiro, RJ  
📱 [WhatsApp: (21) 98025-6650](https://wa.me/5521980256650)  
📸 Instagram: [@jginfo.sites](https://instagram.com/jginfo.sites)

---

## 📁 Estrutura do Projeto

```
JGinfo/
├── index.html              # Página principal (SPA — Single Page Application)
├── css/
│   ├── styles.css          # Variáveis de design, reset, utilitários globais
│   └── components.css      # Estilos por componente (Header, Hero, Pilares, NFC, Portfólio, Footer)
├── js/
│   ├── main.js             # Header scroll, menu mobile, smooth scroll, animações
│   └── portfolio.js        # Portfólio interativo — previews por nicho (5 nichos)
└── assets/
    └── logo.svg            # Logo JG INFO em SVG vetorial
```

---

## 🎨 Identidade Visual

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#0066FF` | Azul JG INFO — links, botões, destaques |
| `--color-accent`  | `#FF6B00` | Laranja — CTAs de urgência |
| `--color-bg`      | `#090D16` | Fundo principal tech |
| `--color-text`    | `#F9FAFB` | Texto principal |

> Para alterar a identidade visual, edite apenas as variáveis no topo de `css/styles.css`.

---

## 🧩 Seções

| Seção | Descrição |
|-------|-----------|
| **Header** | Fixo, transparente → sólido no scroll, dropdown Serviços, botão WhatsApp |
| **Hero** | Headline, subtítulo, 2 CTAs, estatísticas |
| **Nossos Pilares** | 3 cartões: Sites, Suporte PC, NFC |
| **Soluções NFC** | Destaque NFC com card animado |
| **Portfólio** | 5 nichos com preview interativo no browser frame |
| **Contato** | Cards de contato: WhatsApp, E-mail, Localização, Instagram |
| **Footer** | Logo, links rápidos, serviços, contato, copyright |

---

## 🗂️ Portfólio Interativo — Nichos

| Nicho | Preview inclui |
|-------|---------------|
| ✂️ **Barbearia** | Hero, galeria, serviços com preços, **agendamento completo** (serviço + profissional + data + horário) |
| 🍞 **Padaria/Restaurante** | Cardápio por categorias, produtos com preço, CTA encomenda |
| ⚖️ **Advocacia** | Áreas de atuação, **formulário de consulta gratuita** |
| 💆 **Clínica/Estética** | Tratamentos com preço e duração, **agendamento** |
| 🛍️ **Loja/Shopping** | Grade de produtos, badge de desconto, **carrinho funcional** |

---

## ⚡ Como Personalizar

### Alterar informações de contato
Busque por `5521980256650` e `jginfo.sites` no `index.html` e substitua pelos dados reais.

### Adicionar um novo nicho ao portfólio
No arquivo `js/portfolio.js`, adicione uma nova entrada ao objeto `NICHES`:

```javascript
novoNicho: {
  url: 'novo.jginfo.com.br',
  html: `<div>... seu HTML aqui ...</div>`,
  scripts: `function minhaFuncao() { ... }`
}
```

E no `index.html`, adicione um botão de filtro:
```html
<button class="portfolio__filter" data-niche="novoNicho">🏷️ Novo Nicho</button>
```

### Alterar cores
Edite as variáveis CSS em `css/styles.css`:
```css
:root {
  --color-primary: #0066FF; /* ← Mude aqui */
  --color-accent:  #FF6B00; /* ← E aqui */
}
```

---

## 🚀 Deploy

O site é **100% estático** — apenas HTML, CSS e JavaScript puro.  
Pode ser hospedado em qualquer serviço:
- GitHub Pages (gratuito)
- Netlify (gratuito, com drag & drop)
- Vercel (gratuito)
- Hostinger / HostGator

---

© 2024 JG INFO — Todos os direitos reservados.
