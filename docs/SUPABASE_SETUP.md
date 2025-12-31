# Supabase Database Schema

## Tabele do utworzenia w Supabase

### 1. Tabela `reservations`

```sql
-- Utwórz tabelę rezerwacji
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy dla lepszej wydajności
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_email ON reservations(customer_email);

-- Włącz Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Polityka: wszyscy mogą tworzyć rezerwacje
CREATE POLICY "Anyone can create reservations" ON reservations
  FOR INSERT
  WITH CHECK (true);

-- Polityka: tylko uwierzytelnieni użytkownicy mogą czytać/modyfikować
CREATE POLICY "Authenticated users can read reservations" ON reservations
  FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Authenticated users can update reservations" ON reservations
  FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
```

### 2. Tabela `menu_items`

```sql
-- Utwórz tabelę menu
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_nl VARCHAR(255) NOT NULL,
  name_el VARCHAR(255),
  name_tr VARCHAR(255),
  name_ar VARCHAR(255),
  name_bg VARCHAR(255),
  name_pl VARCHAR(255),
  description_nl TEXT,
  description_el TEXT,
  description_tr TEXT,
  description_ar TEXT,
  description_bg TEXT,
  description_pl TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksy
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(available);

-- Włącz RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Polityka: wszyscy mogą czytać dostępne pozycje menu
CREATE POLICY "Anyone can read available menu items" ON menu_items
  FOR SELECT
  USING (available = true OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Polityka: tylko uwierzytelnieni mogą modyfikować
CREATE POLICY "Authenticated users can modify menu items" ON menu_items
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
```

## Instrukcje konfiguracji

### Krok 1: Zaloguj się do Supabase
1. Przejdź do https://wlbwstlaxdtcdafhudny.supabase.co
2. Zaloguj się do swojego konta

### Krok 2: Utwórz tabele
1. W Supabase Dashboard, kliknij **SQL Editor** w menu bocznym
2. Skopiuj i wklej zapytania SQL powyżej (najpierw `reservations`, potem `menu_items`)
3. Kliknij **Run** dla każdego zapytania

### Krok 3: Sprawdź tabele
1. Przejdź do **Table Editor**
2. Powinny być widoczne tabele: `reservations` i `menu_items`

### Krok 4: Testowe dane (opcjonalnie)

```sql
-- Dodaj przykładowe pozycje menu
INSERT INTO menu_items (name_nl, name_pl, description_nl, description_pl, price, category, available) VALUES
('Griekse Salade', 'Grecka Sałatka', 'Verse groenten met feta', 'Świeże warzywa z fetą', 8.50, 'Voorgerechten', true),
('Moussaka', 'Musaka', 'Traditionele Griekse ovenschotel', 'Tradycyjna grecka zapiekanka', 15.90, 'Hoofdgerechten', true),
('Baklava', 'Baklawa', 'Zoet Grieks dessert met honing', 'Słodki grecki deser z miodem', 5.50, 'Desserts', true);

-- Dodaj przykładową rezerwację
INSERT INTO reservations (customer_name, customer_email, customer_phone, date, time, guests, status) VALUES
('Jan Kowalski', 'jan@example.com', '+31612345678', '2025-01-15', '19:00', 4, 'pending');
```

## Użycie w aplikacji

### Przykład: Dodawanie rezerwacji

```typescript
import { reservationService } from './services/supabaseClient';

// Utwórz nową rezerwację
const newReservation = await reservationService.create({
  customer_name: 'Jan Kowalski',
  customer_email: 'jan@example.com',
  customer_phone: '+31612345678',
  date: '2025-01-15',
  time: '19:00',
  guests: 4,
  status: 'pending'
});

// Pobierz wszystkie rezerwacje
const allReservations = await reservationService.getAll();

// Potwierdź rezerwację
await reservationService.updateStatus(reservationId, 'confirmed');
```

### Przykład: Pobieranie menu

```typescript
import { menuService } from './services/supabaseClient';

// Pobierz wszystkie dostępne pozycje menu
const menuItems = await menuService.getAvailable();

// Pobierz pozycje z kategorii
const starters = await menuService.getByCategory('Voorgerechten');
```

## Zmienne środowiskowe

Upewnij się, że plik `.env` zawiera:

```
VITE_SUPABASE_URL=https://wlbwstlaxdtcdafhudny.supabase.co
VITE_SUPABASE_ANON_KEY=twój_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=twój_service_role_key
```

**WAŻNE:** Nie commituj pliku `.env` do repozytorium! Jest już dodany do `.gitignore`.
