# Deploy & Setup — Anna Grudzińska Landing

## 1. Supabase setup (~5 min)

1. Załóż konto na [supabase.com](https://supabase.com) (Free tier OK)
2. Create new project → wybierz region `Frankfurt (EU Central 1)` (najbliżej Polski)
3. Po utworzeniu, idź do **SQL Editor** → wklej zawartość `supabase/schema.sql` → **Run**
4. Idź do **Project Settings → API**:
   - Skopiuj `Project URL` → to będzie `SUPABASE_URL`
   - Skopiuj `service_role` key (sekret!) → to będzie `SUPABASE_SERVICE_ROLE_KEY`

## 2. Resend setup (~3 min) — powiadomienia o nowych leadach

1. Załóż konto na [resend.com](https://resend.com) (free 100 maili/dzień)
2. **API Keys** → "Create API Key" → skopiuj `re_...` → to będzie `RESEND_API_KEY`
3. **NOTIFY_EMAIL** = `dietetyk.grudzinska@gmail.com` (mail Anny)

## 3. Vercel deploy

```bash
cd grudzinska-landing-v2
pnpm install
vercel link
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add NOTIFY_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add VITE_META_PIXEL_ID  # zostaw puste na razie
vercel --prod
```

## 4. Custom domena z Hostingera

W Vercel → Project → Settings → Domains → Add `annagrudzinska.pl` (lub inna).
Vercel pokaże 2 rekordy DNS — wpisz je w Hostinger DNS panel:
- Apex (`annagrudzinska.pl`): `A 76.76.21.21`
- WWW: `CNAME cname.vercel-dns.com`

Propagacja zwykle <30 min. SSL Vercel generuje automatycznie.

## 5. Meta Pixel

1. [Meta Events Manager](https://www.facebook.com/events_manager2/list/pixel/) → Create Pixel → "Anna Grudzińska Landing"
2. Skopiuj Pixel ID (15-cyfrowy)
3. W Vercel: Settings → Environment Variables → edytuj `VITE_META_PIXEL_ID` → wstaw ID
4. **Także** edytuj `index.html` — zamień `PIXEL_ID_PLACEHOLDER` na prawdziwy ID (lub przepisz na inject z env w runtime)
5. Redeploy: `vercel --prod`

## 6. Meta Lead Ads webhook (gdy będziesz mieć kampanię)

1. [developers.facebook.com](https://developers.facebook.com/apps/) → Create App → Business
2. Add product **Webhooks** → topic `leadgen`
3. Callback URL: `https://annagrudzinska.pl/api/meta-webhook`
4. Verify Token: dowolny string 20+ znaków → wstaw jako `META_WEBHOOK_VERIFY_TOKEN` w Vercel
5. Subscribe Page: page `1778944652418627` (Dietetyk Anna Krawczyk- Grudzińska) → topic `leadgen`
6. Page Access Token: w **Graph API Explorer**, wybierz Page → wygeneruj long-lived token → wstaw jako `META_PAGE_ACCESS_TOKEN`

## 7. Panel admina

URL: `https://annagrudzinska.pl/panel`
Login: dowolne, hasło: wartość `ADMIN_PASSWORD`.

## Sprawdzenie

- `https://annagrudzinska.pl/` — landing (Pixel działa = w Network tab leci request do `connect.facebook.net`)
- `https://annagrudzinska.pl/privacy.html` — polityka prywatności
- `https://annagrudzinska.pl/panel` — Basic Auth → CRM
- Wypełnij formularz testowo → sprawdź mail Anny + panel.
