# Security & Operations — Papelime

This document captures the security posture of `papelime.com` and the
DNS / external-service actions that must be performed outside the
repository to complete the hardening.

## Already implemented in code

| Layer | Mechanism |
|---|---|
| Transport | HTTPS forced + HSTS 1 year, preload-ready (`.htaccess`) |
| Content-Security-Policy | Per-page `<meta>` with **hash-based** `script-src` (no `'unsafe-inline'` on scripts), `font-src 'self'`, `default-src 'self'` |
| Self-hosted fonts | All Google Fonts moved to `/assets/fonts/*.woff2`; zero third-party CDN dependency |
| Clickjacking | `X-Frame-Options: SAMEORIGIN` + CSP `frame-ancestors 'none'` |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Cross-origin isolation | `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless` |
| Referrer | `Referrer-Policy: strict-origin-when-cross-origin` |
| Permissions | Geo, mic, cam, payment, USB, sensors disabled; FLoC / browsing-topics blocked |
| Server fingerprint | `X-Powered-By` and `Server` headers removed |
| Backend exposure | None — site is fully static, contact form opens `wa.me` directly |
| SQL injection | Impossible — no database, no server-side processing |
| XSS via form input | Impossible — input is URL-encoded into wa.me URL, never rendered into DOM |
| Email/phone scraping | `data-mailto`/`data-tel` obfuscation, real value built only after JS runs |
| Dotfile exposure | `.htaccess` denies `^\.` patterns |
| HTTPS-only links | All internal links and CSP enforce HTTPS |

## DNS actions to complete (registrar / Cloudflare panel)

These cannot be done from the repository — they live in DNS records
on whoever manages the `papelime.com` zone.

### 1. SPF — prevent email spoofing

If `contacto@papelime.com` is set up with cPanel mail, add a TXT
record at the root (`@`):

```
Name: @
Type: TXT
Value: v=spf1 +mx +a -all
```

If sending via Google Workspace, Microsoft 365, SendGrid, etc., add
their `include:` directive instead. Example for Google Workspace:

```
v=spf1 include:_spf.google.com ~all
```

### 2. DMARC — anti-spoofing policy

Add another TXT record:

```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:contacto@papelime.com; ruf=mailto:contacto@papelime.com; fo=1; aspf=s; adkim=s
```

`p=quarantine` tells receiving servers to put spoofed mail in spam.
Once stable for a month, upgrade to `p=reject` for full enforcement.

### 3. DKIM — cryptographic email signature

cPanel offers a one-click DKIM enable under **Email → Email
Deliverability** for the domain. Click enable, then the panel will
generate a TXT record (long string) that you add at:

```
Name: default._domainkey
Type: TXT
Value: (string the panel gives you)
```

### 4. Cloudflare — WAF, DDoS, CDN, rate limiting

Strongly recommended:

1. Sign up at https://dash.cloudflare.com (free plan is enough)
2. Add site `papelime.com`
3. Cloudflare gives you 2 nameservers (e.g. `nina.ns.cloudflare.com`,
   `walt.ns.cloudflare.com`) — replace the current NS at the
   registrar (Namecheap, GoDaddy, etc.)
4. Inside Cloudflare:
   - **SSL/TLS** → set to **Full (strict)**
   - **Always Use HTTPS** → On
   - **Automatic HTTPS Rewrites** → On
   - **HTTP/3** → On
   - **Brotli** → On
   - **Speed → Optimization → Auto Minify** → CSS, HTML, JS
   - **Security → WAF → Managed Rules** → enable "Cloudflare Managed Ruleset"
   - **Security → Bots → Bot Fight Mode** → On
   - **Security → DDoS** → On (default)
   - **Caching → Configuration → Always Online** → On

After this, `papelime.com` has WAF + DDoS protection + global CDN for
free, and the LiteSpeed origin only receives traffic Cloudflare passes
through.

## Operational notes for the shared-hosting environment

`papelime.com` lives on the same cPanel user (`twistpro`) as
`twistpro.net` and its subdomains. Filesystem isolation between
domains is at the *directory* level, not the user level — a
compromise of any PHP application in `~/public_html/` could
reach `~/public_html/papelime.com/`.

Mitigations:

- Keep Laravel and any other PHP dependencies in `twistpro.net`
  updated via Composer.
- Audit `~/public_html/.htaccess` and the per-subdir `.htaccess`
  files for any `RewriteRule` that could be abused to read files
  outside their intended scope.
- Consider, in the medium term, moving `papelime.com` to its own
  GitHub Pages (free, custom domain), Cloudflare Pages (free), or
  Vercel (free for static) deployment. Since this site is fully
  static, any of those gives you stronger isolation from twistpro
  for zero cost.

## Verifying after deploy

After `git pull` on the server:

```bash
# Headers
curl -sI https://papelime.com/ | grep -iE "strict-transport|x-frame|content-security|x-content|referrer|permissions|cross-origin|x-xss"

# CSP doesn't break the page
curl -s https://papelime.com/ | grep "Content-Security-Policy"

# Fonts load from same origin
curl -sI https://papelime.com/assets/fonts/dm-sans-400.woff2 | head -3

# Sitemap and robots
curl -sI https://papelime.com/sitemap.xml | head -3
curl -sI https://papelime.com/robots.txt | head -3
curl -sI https://papelime.com/llms.txt | head -3
```

External validation:

- **https://securityheaders.com/?q=https://papelime.com** — target A+
- **https://observatory.mozilla.org/analyze/papelime.com** — target A+
- **https://search.google.com/test/rich-results?url=https://papelime.com** — verify JSON-LD parses
- **https://www.ssllabs.com/ssltest/analyze.html?d=papelime.com** — target A+
- **https://www.mail-tester.com** — test SPF/DMARC/DKIM if you have email
