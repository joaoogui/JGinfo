# Guia de Segurança — JG INFO

Este guia explica o que foi feito no site, por quê, e como você mesmo pode repetir em outros projetos.

## 1. O que encontrei na auditoria

| Item verificado | Resultado |
|---|---|
| Senhas, tokens, chaves de API no código | **Nenhum** |
| Formulários que enviam dados | **Nenhum** (o formulário da advocacia/clínica no portfólio é só demonstração, não envia nada) |
| `fetch`, `XMLHttpRequest`, `localStorage` | **Nenhum** (o site não guarda nem envia dados) |
| Links com `target="_blank"` | Todos já tinham `rel="noopener noreferrer"` ✅ |
| E-mail do commit no Git | Usa o `noreply` do GitHub (seu e-mail pessoal não vaza) ✅ |
| Origens externas | Só Google Fonts, `wa.me` e Instagram |
| `innerHTML` com dados dinâmicos | 2 lugares (carrinhos do portfólio). Dados fixos hoje, mas era um padrão arriscado → **corrigido** |
| Proteção do navegador (CSP) | **Não existia** → **adicionada** |
| Cabeçalhos HTTP de segurança | **Não existiam** → **criados** (precisam de hospedagem que os aplique) |

Ou seja: o site já estava em bom estado, porque é estático. O risco real aparece **quando você adicionar formulário, banco de dados ou painel**. As proteções abaixo deixam você preparado.

## 2. O que foi alterado/criado

### `index.html` — CSP + Referrer (meta tags)
**CSP (Content-Security-Policy)** é uma lista de permissões que o navegador obedece. Exemplo: "scripts só do meu próprio site; fontes só do Google Fonts; nada de enviar dados para fora". Se um invasor conseguir injetar um `<script src="site-malicioso">`, o navegador **bloqueia**.

A política usada:

```
default-src 'none'                       → por padrão, nada é permitido
script-src 'self' 'unsafe-inline'        → scripts do próprio site (ver aviso abaixo)
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src https://fonts.gstatic.com
img-src 'self' data:
connect-src 'none'                       → o site não pode enviar dados para nenhum servidor
form-action 'none'                       → nenhum formulário pode ser enviado
base-uri 'none'                          → impede troca da base de links
object-src 'none'                        → sem Flash/plugins
```

⚠️ **Limitação honesta:** o `'unsafe-inline'` enfraquece a CSP. Ele existe porque o portfólio demo usa ~100 atributos inline (`onclick="..."`, `onmouseover="..."`) e injeta `<script>` na página. Para uma CSP realmente estrita, o próximo passo é refatorar `portfolio.js` para usar `addEventListener` e classes CSS em vez de atributos inline, e então remover o `'unsafe-inline'` de `script-src`. Não fiz isso agora porque é uma reescrita grande (~1200 linhas) e eu não tenho como testar visualmente num navegador aqui — o risco de quebrar o portfólio era maior que o ganho, já que o site não recebe entrada de usuário.

**Referrer-Policy:** ao clicar num link externo, o outro site recebe só o domínio, não o caminho completo.

### `js/portfolio.js` — função de escape (XSS)
**XSS** = invasor consegue colocar código dele dentro da sua página. Acontece quando texto de fora é jogado dentro de `innerHTML` sem tratamento. Adicionei `bakeryEsc()` e `storeEsc()`, que transformam `<` em `&lt;`, `"` em `&quot;` etc., nos dois carrinhos.

**Regra para guardar:** dado de fora → `textContent` (seguro) ou `innerHTML` **com escape**. Nunca `innerHTML` cru.

### `_headers` — cabeçalhos HTTP (Netlify / Cloudflare Pages)
Cabeçalhos são "regras" que o servidor manda junto com a página. Os principais:

| Cabeçalho | Para que serve |
|---|---|
| `Strict-Transport-Security` (HSTS) | Obriga HTTPS, impede downgrade para HTTP |
| `X-Content-Type-Options: nosniff` | Navegador não "adivinha" tipo de arquivo (bloqueia truques com upload) |
| `X-Frame-Options: DENY` + `frame-ancestors 'none'` | Ninguém consegue embutir seu site num iframe (anti-clickjacking) |
| `Permissions-Policy` | Desliga câmera, microfone, GPS etc. |
| `Cross-Origin-Opener-Policy/Resource-Policy` | Isola seu site de outras abas/origens |
| `Content-Security-Policy` | Igual à meta tag, porém **com** `frame-ancestors` (que a meta tag não suporta) |

### `.htaccess` — o mesmo, para Apache (Hostinger, HostGator)
Além dos cabeçalhos: força HTTPS, desliga listagem de pastas e devolve 404 para qualquer arquivo/pasta oculto (`.git`, `.env`), exceto `.well-known`. **Não consegui testar Apache aqui**; depois de subir, confira (seção 4).

### `.gitignore`
Impede você de commitar por acidente `.env`, chaves (`.pem`, `.key`), dumps de banco, planilhas `.csv/.xlsx` (que costumam ter dados de clientes) e backups. **Atenção:** `.gitignore` só vale para arquivos *ainda não* commitados. Se um segredo já foi commitado, apagar o arquivo não basta — ele fica no histórico. Troque (revogue) a senha/chave.

### `.nojekyll` e `.well-known/security.txt`
`security.txt` (padrão RFC 9116) diz a pesquisadores de segurança como te avisar de uma falha. O `.nojekyll` é necessário porque o GitHub Pages ignora pastas que começam com ponto, o que esconderia o `.well-known`.

## 3. O que NÃO dá para fazer só no código (configure no GitHub)

Estas são as proteções que mais importam contra "hackers" de verdade, e só você pode ativar:

1. **2FA no GitHub, de preferência com passkey ou app autenticador** (Settings → Password and authentication). Conta invadida = site invadido. É o item #1.
2. **Secret scanning + Push protection** (repo → Settings → Code security). O GitHub bloqueia o push se você tentar subir uma chave/token.
3. **Proteção da branch `main`** (Settings → Branches): exigir pull request, impedir force-push.
4. **Enforce HTTPS** (Settings → Pages). Deixe marcado.
5. **Verificar seu domínio** (Settings → Pages → Add a domain) *antes* de apontar `jginfo.com.br` para o GitHub Pages. Sem isso, existe risco de *subdomain takeover* (outra pessoa reivindica seu domínio).
6. **Conta do registrador do domínio** (Registro.br etc.): ative 2FA e trave a transferência. Ative **DNSSEC** se o painel oferecer.
7. **Repositório público = código público.** Qualquer pessoa lê seu HTML/CSS/JS. Isso é normal para site front-end: o "código" de um site estático não é segredo. O que **nunca** pode ficar nele: senhas, chaves, dados de clientes.

## 4. Como testar (faça você mesmo)

1. **CSP funcionando:** abra o site → F12 → aba *Console*. Navegue, clique no portfólio, abra os modais. Se aparecer erro "Refused to load..." / "violates the following Content Security Policy", me mande a mensagem.
2. **Cabeçalhos (depois de hospedar):** `https://securityheaders.com` — cole a URL. Objetivo: nota A ou A+.
3. **HTTPS/TLS:** `https://www.ssllabs.com/ssltest/`
4. **Arquivos expostos:** tente abrir `seudominio/.git/config` e `seudominio/.env`. Deve dar 404.
5. **Histórico de segredos no Git:** rode `git log -p | grep -iE "password|secret|token|key"` ou use a ferramenta `gitleaks`.

## 5. Atenção sobre onde hospedar

- **GitHub Pages** (onde está hoje): ignora `_headers` e `.htaccess`, então só a meta CSP e o referrer valem. Para ter os cabeçalhos completos com o seu domínio, coloque o **Cloudflare (plano grátis)** na frente, ou hospede no **Netlify / Cloudflare Pages** (leem `_headers`).
- **Hostinger/HostGator (Apache):** usam `.htaccess`.
- **Vercel:** usa `vercel.json` com a chave `headers` (mesmos valores).

## 6. Quando você adicionar formulários ou banco de dados

Aí o risco muda de patamar. Checklist mínimo:

- Valide **no servidor**, nunca só no navegador (o `lawCheckForm` atual é só visual).
- Use consultas parametrizadas (nunca monte SQL concatenando texto do usuário) → evita SQL Injection.
- Guarde senhas com hash forte (bcrypt/argon2), nunca em texto puro.
- Chaves de API ficam no **servidor** (variáveis de ambiente), nunca no JavaScript do navegador.
- Limite tentativas (rate limit) e use CAPTCHA em formulários públicos.
- **LGPD:** colete só o necessário, tenha política de privacidade, diga para que usa os dados e permita exclusão. Dados de clientes seus são responsabilidade sua.
- Atualize `connect-src` e `form-action` da CSP para permitir só o endereço do seu backend.

## 7. Melhorias futuras (ordem de prioridade)

1. Refatorar `portfolio.js` sem handlers inline → remover `'unsafe-inline'` da CSP.
2. Hospedar as fontes no próprio site (em vez do Google Fonts): melhora privacidade (LGPD — o Google recebe o IP do visitante) e permite remover domínios externos da CSP. Não consegui baixar as fontes aqui (sem acesso de rede).
3. Colocar Cloudflare na frente para ter os cabeçalhos completos + proteção contra DDoS/bots.
4. Adicionar uma página de Política de Privacidade quando houver coleta de dados.
