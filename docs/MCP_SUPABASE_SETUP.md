# MCP Server Supabase - Instrukcje

## Co to jest MCP Server?

MCP (Model Context Protocol) Server to narzędzie, które pozwala GitHub Copilot na bezpośrednią interakcję z Twoją bazą danych Supabase. Dzięki temu możesz:

- 📊 Przeglądać tabele i schemat bazy danych
- 🔍 Wykonywać zapytania SQL
- ✏️ Tworzyć i modyfikować tabele
- 📝 Wstawiać i aktualizować dane
- 🤖 Korzystać z AI do generowania zapytań SQL

## Konfiguracja

### Krok 1: Włącz MCP w VS Code

1. Otwórz VS Code
2. Naciśnij `Ctrl+Shift+P` (lub `Cmd+Shift+P` na Mac)
3. Wpisz: "Developer: Reload Window"
4. Po przeładowaniu, MCP Server powinien się uruchomić automatycznie

### Krok 2: Sprawdź status MCP

1. Otwórz panel GitHub Copilot Chat
2. W prawym górnym rogu panelu powinieneś zobaczyć ikonę MCP
3. Kliknij ikonę, aby zobaczyć dostępne serwery MCP
4. Powinieneś zobaczyć "supabase" na liście z ~20 narzędziami

### Krok 3: Utwórz tabele w Supabase

Przejdź do SQL Editor w Supabase i wykonaj następujące zapytania:

#### Tabela rezerwacji:
```sql
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

CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reservations" ON reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read all" ON reservations
  FOR SELECT USING (auth.role() = 'service_role');
```

#### Tabela menu:
```sql
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

CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(available);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read available items" ON menu_items
  FOR SELECT USING (available = true OR auth.role() = 'service_role');
```

## Użycie z GitHub Copilot

### Przykładowe komendy w Copilot Chat:

1. **Pokaż wszystkie tabele:**
   ```
   @workspace Pokaż mi wszystkie tabele w bazie danych
   ```

2. **Wyświetl schemat tabeli:**
   ```
   @workspace Pokaż schemat tabeli reservations
   ```

3. **Dodaj dane testowe:**
   ```
   @workspace Dodaj przykładową rezerwację do bazy danych
   ```

4. **Wykonaj zapytanie:**
   ```
   @workspace Pokaż wszystkie rezerwacje na dzisiaj
   ```

5. **Utwórz nową tabelę:**
   ```
   @workspace Utwórz tabelę dla opinii klientów z polami: id, name, email, rating, comment
   ```

## Dostępne narzędzia MCP (20 tools)

MCP Server Supabase udostępnia około 20 narzędzi, w tym:

- `list_tables` - Lista wszystkich tabel
- `get_table_schema` - Schemat konkretnej tabeli
- `execute_query` - Wykonaj zapytanie SQL
- `insert_data` - Wstaw dane
- `update_data` - Aktualizuj dane
- `delete_data` - Usuń dane
- `create_table` - Utwórz tabelę
- `alter_table` - Zmień strukturę tabeli
- i wiele więcej...

## Rozwiązywanie problemów

### MCP Server się nie uruchamia?

1. Sprawdź, czy plik `.mcp.json` istnieje
2. Sprawdź, czy klucze w `.mcp.json` są poprawne
3. Przeładuj okno VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
4. Sprawdź logi w Output → "MCP: zzp-werkplaats-supabase"

### Nie widzę narzędzi MCP?

1. Sprawdź, czy GitHub Copilot jest aktywny
2. Upewnij się, że masz najnowszą wersję rozszerzenia GitHub Copilot
3. Sprawdź ustawienia w `.vscode/settings.json`

### Connection timeout?

1. Sprawdź połączenie internetowe
2. Zweryfikuj URL Supabase: https://wlbwstlaxdtcdafhudny.supabase.co
3. Sprawdź, czy service role key jest poprawny

## Bezpieczeństwo

⚠️ **WAŻNE:**
- Plik `.mcp.json` zawiera wrażliwe dane (service role key)
- Ten plik jest dodany do `.gitignore` i nie będzie commitowany
- Nigdy nie udostępniaj service role key publicznie
- Używaj `.mcp.json.example` jako szablon dla innych developerów

## Pliki konfiguracyjne

- `.mcp.json` - Konfiguracja MCP z kluczami (w .gitignore)
- `.mcp.json.example` - Szablon bez kluczy (bezpieczny do commitu)
- `.vscode/settings.json` - Ustawienia VS Code dla MCP

## Dodatkowe zasoby

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Supabase MCP Server](https://github.com/modelcontextprotocol/servers)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
