# 🗄️ Database Schema - Greek Irini Restaurant

## 📋 Przegląd

Kompletny schemat bazy danych dla aplikacji restauracji Greek Irini, zaprojektowany dla PostgreSQL/Supabase.

## 🏗️ Struktura Tabel

### 1. **reservations** - Rezerwacje stolików
```sql
- id (UUID, Primary Key)
- customer_name (VARCHAR)
- customer_email (VARCHAR)
- customer_phone (VARCHAR)
- date (DATE)
- time (TIME)
- number_of_guests (INTEGER, 1-20)
- special_requests (TEXT)
- status (VARCHAR: pending/confirmed/rejected/cancelled)
- admin_notes (TEXT)
- confirmation_sent_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)
```

**Indeksy:** date, status, email, date+time

### 2. **menu_items** - Pozycje menu
```sql
- id (UUID, Primary Key)
- name_nl, name_el, name_tr, name_ar, name_bg, name_pl (VARCHAR)
- description_nl, description_el, description_tr, description_ar, description_bg, description_pl (TEXT)
- price (DECIMAL)
- category (VARCHAR: mains/starters_cold/starters_warm/salads/desserts/drinks/sides)
- image_url (TEXT)
- is_available, is_popular, is_new (BOOLEAN)
- is_vegetarian, is_vegan, is_gluten_free (BOOLEAN)
- spicy_level (INTEGER: 0-3)
- allergens (TEXT[])
- preparation_time, calories (INTEGER)
- created_at, updated_at (TIMESTAMP)
```

**Indeksy:** category, is_available, is_popular

### 3. **orders** - Zamówienia
```sql
- id (UUID, Primary Key)
- customer_name, customer_email, customer_phone (VARCHAR)
- customer_address, customer_postal_code, customer_city (VARCHAR)
- customer_notes (TEXT)
- subtotal, delivery_fee, total (DECIMAL)
- status (VARCHAR: pending/preparing/ready/delivery/completed/cancelled)
- payment_method (VARCHAR: ideal/card/bancontact/cash)
- payment_status (VARCHAR: unpaid/pending/paid/failed/refunded)
- payment_transaction_id (VARCHAR)
- paid_at (TIMESTAMP)
- delivery_type (VARCHAR: delivery/pickup)
- estimated_ready_time (TIMESTAMP)
- assigned_driver_id (UUID, Foreign Key)
- created_at, updated_at (TIMESTAMP)
```

**Indeksy:** status, payment_status, created_at, customer_email, driver

### 4. **order_items** - Pozycje w zamówieniach
```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key -> orders)
- menu_item_id (UUID, Foreign Key -> menu_items)
- item_name (VARCHAR) - snapshot nazwy
- item_price (DECIMAL) - snapshot ceny
- quantity (INTEGER)
- subtotal (DECIMAL)
- special_instructions (TEXT)
- created_at (TIMESTAMP)
```

**Indeksy:** order_id, menu_item_id

### 5. **drivers** - Kierowcy
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- phone (VARCHAR)
- status (VARCHAR: available/busy/offline)
- active_deliveries (INTEGER)
- created_at, updated_at (TIMESTAMP)
```

**Indeksy:** status

### 6. **staff_notes** - Notatki personelu
```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key -> orders)
- text (TEXT)
- author (VARCHAR)
- created_at (TIMESTAMP)
```

**Indeksy:** order_id

### 7. **restaurant_settings** - Ustawienia restauracji
```sql
- id (UUID, Primary Key)
- setting_key (VARCHAR, Unique)
- setting_value (JSONB)
- created_at, updated_at (TIMESTAMP)
```

## 🔒 Row Level Security (RLS)

Wszystkie tabele mają włączone RLS:

### Publiczne operacje (bez logowania):
- ✅ **CREATE** rezerwacje
- ✅ **CREATE** zamówienia i order_items
- ✅ **READ** dostępne menu_items
- ✅ **READ** restaurant_settings

### Operacje wymagające uwierzytelnienia:
- ✅ **READ/UPDATE** wszystkie rezerwacje i zamówienia
- ✅ **ALL** na menu_items, drivers, staff_notes
- ✅ **UPDATE** restaurant_settings

## 📊 Widoki (Views)

### active_orders_with_items
Aktywne zamówienia ze wszystkimi pozycjami w formacie JSON

### todays_reservations
Dzisiejsze rezerwacje posortowane według godziny

### pending_reservations
Oczekujące rezerwacje od dzisiaj w przyszłość

## 🔄 Triggery

**update_updated_at_column** - automatyczna aktualizacja `updated_at` przy każdej modyfikacji dla:
- reservations
- menu_items
- orders
- drivers
- restaurant_settings

## 📦 Przykładowe dane

Schemat zawiera przykładowe dane:
- 8 pozycji menu (popularne greckie dania)
- 1 przykładowa rezerwacja
- 1 kierowca
- Podstawowe ustawienia restauracji

## 🚀 Instalacja

### Krok 1: Przejdź do Supabase SQL Editor
1. Otwórz https://wlbwstlaxdtcdafhudny.supabase.co
2. Zaloguj się
3. Przejdź do **SQL Editor**

### Krok 2: Wykonaj schemat
1. Skopiuj cały plik `schema.sql`
2. Wklej do SQL Editor
3. Kliknij **Run** lub naciśnij `Ctrl+Enter`

### Krok 3: Weryfikacja
Sprawdź w **Table Editor**:
- ✅ 7 tabel utworzonych
- ✅ RLS włączone
- ✅ Przykładowe dane wstawione

## 🔧 Konfiguracja aplikacji

Po utworzeniu tabel, zaktualizuj `services/supabaseClient.ts`:

```typescript
import { supabase } from './supabaseClient';

// Pobierz rezerwacje
const { data: reservations } = await supabase
  .from('reservations')
  .select('*')
  .order('date', { ascending: true });

// Utwórz zamówienie
const { data: order } = await supabase
  .from('orders')
  .insert([{
    customer_name: 'Jan Kowalski',
    customer_email: 'jan@example.com',
    // ...
  }])
  .select()
  .single();

// Dodaj pozycje do zamówienia
const { data: orderItems } = await supabase
  .from('order_items')
  .insert([
    { order_id: order.id, item_name: 'Moussaka', quantity: 2, item_price: 15.90 },
    // ...
  ]);
```

## 📈 Przyszłe rozszerzenia

Możliwe usprawnienia:
- [ ] Customer accounts (user authentication)
- [ ] Reviews and ratings table
- [ ] Loyalty program table
- [ ] Inventory management
- [ ] Analytics and reporting tables
- [ ] Promotional campaigns table

## 🔍 Diagnostyka

### Sprawdź tabele
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Sprawdź RLS policies
```sql
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Sprawdź liczbę rekordów
```sql
SELECT 
  'reservations' as table, COUNT(*) as count FROM reservations
UNION ALL
SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'orders', COUNT(*) FROM orders;
```

## 📞 Kontakt

Jeśli masz pytania dotyczące schematu bazy danych:
- Email: irini070dh@gmail.com
- Phone: 0615869325

---

**Ostatnia aktualizacja:** 2025-12-30
**Wersja:** 1.0.0
**Status:** ✅ Gotowe do użycia
