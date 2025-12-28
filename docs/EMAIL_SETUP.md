# Konfiguracja EmailJS dla Greek Irini

## 📧 System wysyłania emaili z potwierdzeniem zamówienia

Aplikacja używa **EmailJS** do wysyłania emaili z potwierdzeniem zamówienia bezpośrednio z przeglądarki (bez backendu).

---

## 🚀 Jak skonfigurować EmailJS

### 1. Utwórz konto na EmailJS
1. Wejdź na [https://www.emailjs.com/](https://www.emailjs.com/)
2. Zarejestruj się za darmo (200 emaili/miesiąc gratis)

### 2. Skonfiguruj Email Service
1. Przejdź do **Email Services** → **Add New Service**
2. Wybierz swojego providera (Gmail, Outlook, SMTP, itp.)
3. Połącz swoje konto email
4. Zapisz **Service ID** (np. `service_abc123`)

### 3. Utwórz Email Template
1. Przejdź do **Email Templates** → **Create New Template**
2. Użyj poniższego szablonu:

```html
Subject: {{subject}}

<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #1a1a1a; color: #ffffff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #D4AF37; }
    .logo { font-size: 28px; font-weight: bold; color: #D4AF37; }
    .content { padding: 30px 0; }
    .order-id { background: #262626; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; }
    .order-id span { font-size: 24px; font-family: monospace; color: #D4AF37; }
    .items { background: #262626; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .item { padding: 10px 0; border-bottom: 1px solid #333; }
    .summary { background: #262626; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .total { font-size: 24px; color: #D4AF37; font-weight: bold; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #333; color: #888; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .label { color: #888; }
    .value { color: #fff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏛️ Greek Irini</div>
      <p style="color: #888;">{{greeting}}</p>
    </div>
    
    <div class="content">
      <div class="order-id">
        <p style="margin: 0; color: #888; font-size: 12px;">NUMER ZAMÓWIENIA</p>
        <span>{{order_id}}</span>
      </div>
      
      <div class="items">
        <h3 style="margin-top: 0; color: #D4AF37;">Twoje zamówienie:</h3>
        <pre style="white-space: pre-wrap; font-family: Arial;">{{order_items}}</pre>
      </div>
      
      <div class="summary">
        <div class="info-row">
          <span class="label">Suma częściowa:</span>
          <span class="value">{{subtotal}}</span>
        </div>
        <div class="info-row">
          <span class="label">Dostawa:</span>
          <span class="value">{{delivery_fee}}</span>
        </div>
        <div class="info-row" style="border-top: 1px solid #333; padding-top: 15px; margin-top: 10px;">
          <span class="label">Razem:</span>
          <span class="total">{{total}}</span>
        </div>
      </div>
      
      <div class="summary">
        <h3 style="margin-top: 0; color: #D4AF37;">Szczegóły:</h3>
        <div class="info-row">
          <span class="label">{{delivery_label}}:</span>
          <span class="value">{{delivery_type}}</span>
        </div>
        <div class="info-row">
          <span class="label">{{address_label}}:</span>
          <span class="value">{{address}}</span>
        </div>
        <div class="info-row">
          <span class="label">{{payment_label}}:</span>
          <span class="value">{{payment_method}}</span>
        </div>
        <div class="info-row">
          <span class="label">{{estimated_label}}:</span>
          <span class="value">{{estimated_time}}</span>
        </div>
        <div class="info-row">
          <span class="label">{{notes_label}}:</span>
          <span class="value">{{notes}}</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>{{restaurant_name}}</strong></p>
      <p>{{restaurant_address}}</p>
      <p>📞 {{restaurant_phone}}</p>
      <p style="margin-top: 20px; font-size: 12px;">{{footer_text}}</p>
    </div>
  </div>
</body>
</html>
```

3. Zapisz **Template ID** (np. `template_xyz789`)

### 4. Pobierz Public Key
1. Przejdź do **Account** → **General**
2. Skopiuj **Public Key** (np. `user_abc123xyz`)

### 5. Zaktualizuj konfigurację w kodzie

Otwórz plik `services/emailService.ts` i zaktualizuj:

```typescript
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',    // ← Wklej swój Service ID
  templateId: 'YOUR_TEMPLATE_ID',  // ← Wklej swój Template ID
  publicKey: 'YOUR_PUBLIC_KEY',    // ← Wklej swój Public Key
};
```

---

## ✅ Testowanie

1. Złóż testowe zamówienie w aplikacji
2. Opłać (symulacja) lub wybierz płatność gotówką
3. Sprawdź email - powinieneś otrzymać potwierdzenie

---

## 🔒 Bezpieczeństwo

- EmailJS Public Key jest bezpieczny do użycia w frontendzie
- Ustaw limity wysyłki w panelu EmailJS
- Rozważ dodanie reCAPTCHA dla ochrony przed spamem

---

## 📊 Limity (darmowy plan)

- 200 emaili / miesiąc
- 2 szablony
- Emailjs branding w stopce

Dla większego ruchu rozważ płatny plan lub własny backend.

---

## 🛠️ Troubleshooting

**Email nie wysyła się?**
1. Sprawdź konsolę przeglądarki (F12)
2. Upewnij się, że wszystkie 3 klucze są poprawne
3. Sprawdź czy email service jest aktywny w panelu EmailJS

**Tryb demo:**
Dopóki nie skonfigurujesz EmailJS, aplikacja działa w trybie demo - logi są wyświetlane w konsoli, ale email nie jest wysyłany.
