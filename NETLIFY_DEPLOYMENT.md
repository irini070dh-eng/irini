# =====================================================
# NETLIFY DEPLOYMENT GUIDE - GREEK IRINI STORE
# =====================================================

## 🚀 DEPLOYMENT INSTRUCTIONS

### 1. Przygotowanie przed wdrożeniem
- ✅ **CSS Errors**: Fixed all CSS errors
- ✅ **Database Security**: Run `database/fix-security.sql` in Supabase SQL Editor
- ⚠️ **EmailJS**: Configure or remove (see section below)
- ✅ **Environment Variables**: Set in Netlify dashboard

### 2. Netlify Configuration
Aplikacja jest już skonfigurowana w `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18
- Redirects: Wszystkie ścieżki prowadzą do `index.html` (SPA routing)

### 3. Environment Variables w Netlify
Idź do: **Site settings > Environment variables** i dodaj:

```
VITE_SUPABASE_URL=https://wlbwstlaxdtcdafhudny.supabase.co
VITE_SUPABASE_ANON_KEY=<twój_klucz_z_pliku_.env>
VITE_STRIPE_PUBLISHABLE_KEY=<twój_klucz_stripe>
VITE_EMAILJS_SERVICE_ID=<opcjonalne_jeśli_używasz>
VITE_EMAILJS_TEMPLATE_ID=<opcjonalne_jeśli_używasz>
VITE_EMAILJS_PUBLIC_KEY=<opcjonalne_jeśli_używasz>
```

### 4. Deployment Steps

#### Option A: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod
```

#### Option B: Deploy via Netlify Dashboard
1. Idź do https://app.netlify.com/
2. Kliknij "Add new site" > "Import an existing project"
3. Podłącz GitHub repo: `norbi07011/Irini`
4. Netlify automatycznie wykryje `netlify.toml`
5. Dodaj Environment Variables (krok 3)
6. Kliknij "Deploy site"

### 5. Dwa Linki do Strony

#### 🌐 Link Główny (Strona Klienta)
Po deployment Netlify da Ci URL:
```
https://greek-irini-store.netlify.app
```
**Funkcje:**
- Menu restauracji
- Koszyk zakupów
- Checkout i płatności
- Rezerwacje stolików
- Kontakt

#### 🔐 Link Admina (Panel Administracyjny)
```
https://greek-irini-store.netlify.app/admin
```
**Funkcje:**
- Logowanie admina
- Zarządzanie zamówieniami
- Analityka sprzedaży
- Edycja menu
- Zarządzanie rezerwacjami
- Ustawienia restauracji

**Dane logowania:**
- Email: `admin@greekeirini.nl` (lub zmień w AdminLogin.tsx line 23)
- Hasło: To, które ustawisz w Supabase Dashboard

### 6. Ustawienie Hasła Admina w Supabase

1. Idź do Supabase Dashboard: https://supabase.com/dashboard
2. Otwórz projekt: wlbwstlaxdtcdafhudny
3. Idź do: **Authentication > Users**
4. Kliknij "Add user" > "Create new user"
5. Email: `admin@greekeirini.nl`
6. Password: Ustaw silne hasło (zapisz je bezpiecznie!)
7. Confirm password
8. ✅ Auto confirm user: ON
9. Kliknij "Create user"

### 7. EmailJS Configuration (OPCJONALNE)

⚠️ **WAŻNE**: EmailJS nie jest skonfigurowane!

#### Option A: Skonfiguruj EmailJS
1. Zarejestruj się na https://www.emailjs.com/
2. Stwórz nowy serwis email
3. Stwórz template dla potwierdzenia zamówienia
4. Skopiuj:
   - Service ID
   - Template ID  
   - Public Key
5. Dodaj do Environment Variables w Netlify

#### Option B: Usuń funkcjonalność email
Jeśli nie chcesz wysyłać emaili:
1. Usuń z `CheckoutView.tsx` (line 119-127): wywołanie `sendOrderConfirmationEmail`
2. Usuń plik: `services/emailService.ts`
3. Usuń z `package.json`: `@emailjs/browser`

### 8. Weryfikacja Po Wdrożeniu

#### ✅ Checklist:
- [ ] Strona główna ładuje się poprawnie
- [ ] Menu wyświetla 32 produkty
- [ ] Koszyk dodaje produkty
- [ ] Checkout prowadzi do płatności Stripe
- [ ] Formularz rezerwacji działa
- [ ] Panel admina `/admin` jest dostępny
- [ ] Logowanie admina działa
- [ ] Zamówienia wyświetlają się w panelu
- [ ] Płatności testowe Stripe działają

#### 🧪 Test Payment (Stripe Test Mode):
```
Card Number: 4242 4242 4242 4242
Expiry: Dowolna przyszła data (np. 12/25)
CVC: Dowolne 3 cyfry (np. 123)
```

### 9. Custom Domain (OPCJONALNE)

Jeśli masz własną domenę (np. `greekeirini.nl`):

1. Idź do Netlify: **Domain settings**
2. Kliknij "Add custom domain"
3. Wpisz: `greekeirini.nl` i `www.greekeirini.nl`
4. Netlify da ci DNS settings
5. Dodaj je w swoim domain provider:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: greek-irini-store.netlify.app
   ```
6. Poczekaj 24h na propagację DNS

### 10. SSL Certificate
Netlify automatycznie dodaje darmowy SSL (HTTPS) z Let's Encrypt! ✅

### 11. Monitoring

#### Netlify Analytics:
- Idź do: **Site analytics** w Netlify dashboard
- Zobacz: Page views, unique visitors, bandwidth

#### Supabase Metrics:
- Idź do Supabase Dashboard > **Database** > **Metrics**
- Zobacz: API requests, database size, active connections

### 12. Troubleshooting

#### Problem: Strona nie ładuje się
✅ Sprawdź: Site settings > Environment variables (czy wszystkie są ustawione)

#### Problem: Błąd bazy danych
✅ Uruchom: `database/fix-security.sql` w Supabase SQL Editor

#### Problem: Płatności nie działają
✅ Sprawdź: Stripe Publishable Key w Environment Variables

#### Problem: Admin nie może się zalogować
✅ Sprawdź: Czy utworzyłeś użytkownika w Supabase Auth

### 13. Production Checklist

Przed uruchomieniem na produkcji:
- [ ] Uruchom `database/fix-security.sql` w Supabase
- [ ] Zmień Stripe z test mode na live mode
- [ ] Skonfiguruj EmailJS lub usuń funkcjonalność email
- [ ] Ustaw silne hasło admina
- [ ] Włącz Password Leak Detection w Supabase Auth
- [ ] Dodaj Custom Domain (opcjonalnie)
- [ ] Test całego flow: dodaj do koszyka → checkout → płatność
- [ ] Test panelu admina: logowanie → zarządzanie zamówieniami

## ✨ GOTOWE!

Twoje dwa linki:
1. **Strona główna**: https://your-site.netlify.app
2. **Panel admina**: https://your-site.netlify.app/admin

Powodzenia! 🎉
