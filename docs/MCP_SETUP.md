# Supabase MCP Server - Instrukcja Instalacji i Konfiguracji

## ✅ Status: GOTOWE DO UŻYCIA

MCP Server dla Supabase jest już skonfigurowany w Twoim projekcie!

## 📋 Co zostało skonfigurowane:

### 1. Plik `.mcp.json` - Konfiguracja serwerów MCP

Utworzono dwa serwery MCP:

#### a) **Supabase MCP Server**
- **Pakiet**: `@modelcontextprotocol/server-supabase`
- **Funkcje**: 
  - 📊 Zarządzanie tabelami
  - 🔍 Wykonywanie zapytań SQL
  - ➕ Wstawianie danych
  - ✏️ Aktualizowanie rekordów
  - 🗑️ Usuwanie danych
  - 📈 Analityka i statystyki

#### b) **PostgreSQL MCP Server**  
- **Pakiet**: `@modelcontextprotocol/server-postgres`
- **Funkcje**:
  - 💻 Bezpośrednie zapytania SQL
  - 🏗️ DDL operations (CREATE, ALTER, DROP)
  - 🔐 Zaawansowane funkcje PostgreSQL

### 2. Plik `.vscode/settings.json` - Ustawienia VS Code

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.configFile": ".mcp.json"
}
```

## 🚀 Jak uruchomić MCP Server:

### Krok 1: Przeładuj VS Code
Naciśnij `Ctrl+Shift+P` i wpisz:
```
Developer: Reload Window
```

### Krok 2: Sprawdź status MCP
Po przeładowaniu:
1. Otwórz **GitHub Copilot Chat** (ikona czatu w pasku bocznym)
2. W prawym górnym rogu panelu czatu kliknij ikonę **MCP** (przypinaczka/clipper)
3. Powinieneś zobaczyć:
   - ✅ **supabase** - Discovered ~20 tools
   - ✅ **postgres** - Discovered ~10 tools

### Krok 3: Testuj połączenie
Spróbuj w Copilot Chat:

```
@workspace Pokaż mi wszystkie tabele w bazie danych Supabase
```

```
@workspace Jaki jest schemat tabeli reservations?
```

```
@workspace Ile rezerwacji mam w bazie?
```

## 🛠️ Dostępne narzędzia MCP

### Supabase MCP Tools (~20 narzędzi):

1. **Database Structure**
   - `list_tables` - Lista wszystkich tabel
   - `describe_table` - Szczegóły struktury tabeli
   - `list_columns` - Kolumny w tabeli

2. **Data Queries**
   - `select_data` - Pobierz dane z tabeli
   - `count_rows` - Policz rekordy
   - `search_data` - Wyszukaj dane

3. **Data Modification**
   - `insert_row` - Dodaj nowy rekord
   - `update_row` - Zaktualizuj rekord
   - `delete_row` - Usuń rekord
   - `upsert_row` - Wstaw lub zaktualizuj

4. **Advanced Operations**
   - `execute_rpc` - Wywołaj funkcję RPC
   - `get_storage_buckets` - Lista buckets storage
   - `list_functions` - Lista funkcji bazodanowych

### PostgreSQL MCP Tools (~10 narzędzi):

1. **SQL Execution**
   - `query` - Wykonaj SELECT zapytanie
   - `execute` - Wykonaj INSERT/UPDATE/DELETE
   - `execute_ddl` - Wykonaj CREATE/ALTER/DROP

2. **Schema Management**
   - `list_schemas` - Lista schematów
   - `describe_schema` - Szczegóły schematu
   - `get_table_info` - Informacje o tabeli

3. **Database Info**
   - `list_databases` - Lista baz danych
   - `get_version` - Wersja PostgreSQL

## 💡 Przykłady użycia w Copilot Chat

### Sprawdź strukturę bazy danych
```
@workspace Pokaż strukturę wszystkich tabel w mojej bazie danych
```

### Wykonaj zapytanie SQL
```
@workspace Pokaż wszystkie rezerwacje na dzisiaj z tabeli reservations
```

### Dodaj dane testowe
```
@workspace Dodaj testową rezerwację:
- Imię: Jan Kowalski
- Email: jan@test.pl
- Telefon: +31612345678
- Data: jutro
- Godzina: 19:00
- Liczba gości: 4
```

### Aktualizuj dane
```
@workspace Zmień status rezerwacji o ID xxx na 'confirmed'
```

### Sprawdź statystyki
```
@workspace Ile mam potwierdonych rezerwacji w tym tygodniu?
```

### Utwórz nową tabelę
```
@workspace Utwórz tabelę reviews z polami:
- id (UUID, primary key)
- customer_name (VARCHAR)
- rating (INTEGER 1-5)
- comment (TEXT)
- created_at (TIMESTAMP)
```

## 🔧 Rozwiązywanie problemów

### Problem: MCP Server nie uruchamia się

**Rozwiązanie 1: Sprawdź Node.js**
```powershell
node --version
```
Wymagane: Node.js 16+

**Rozwiązanie 2: Wyczyść cache npx**
```powershell
npx clear-npx-cache
```

**Rozwiązanie 3: Przeładuj VS Code**
```
Ctrl+Shift+P -> Developer: Reload Window
```

### Problem: Nie widzę narzędzi MCP w Copilot Chat

**Sprawdź:**
1. Czy GitHub Copilot jest aktywny (ikona w dolnym prawym rogu)
2. Czy plik `.mcp.json` istnieje w głównym katalogu projektu
3. Czy `.vscode/settings.json` ma `"github.copilot.chat.mcp.enabled": true`

**Rozwiązanie:**
```
Ctrl+Shift+P -> GitHub Copilot: Restart Extension
```

### Problem: Connection timeout / Database error

**Sprawdź:**
1. Czy Supabase URL jest poprawny: `https://wlbwstlaxdtcdafhudny.supabase.co`
2. Czy service role key jest aktualny
3. Czy masz połączenie z internetem

**Test połączenia:**
```powershell
curl https://wlbwstlaxdtcdafhudny.supabase.co/rest/v1/
```

### Problem: MCP działa, ale nie mogę wykonać DDL (CREATE TABLE)

**Powód:** Supabase MCP Server ma ograniczone uprawnienia dla bezpieczeństwa.

**Rozwiązanie:** Użyj SQL Editor w Supabase Dashboard dla DDL operations.

## 📊 Sprawdź logi MCP

1. Otwórz **Output** panel (Ctrl+Shift+U)
2. W dropdown wybierz: **MCP: supabase** lub **MCP: postgres**
3. Sprawdź logi połączenia i wykonanych operacji

## 🔐 Bezpieczeństwo

### Ważne pliki w .gitignore:
- ✅ `.mcp.json` - zawiera wrażliwe klucze (DODANE do .gitignore)
- ✅ `.env` - zmienne środowiskowe (DODANE do .gitignore)

### Szablon dla innych developerów:
- `.mcp.json.example` - bezpieczny szablon bez kluczy

### Nigdy nie commituj:
- ❌ Service role key
- ❌ Database passwords
- ❌ API keys

## 📚 Dokumentacja

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Supabase MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/supabase)
- [PostgreSQL MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)
- [Supabase Docs](https://supabase.com/docs)

## ✅ Checklist konfiguracji

- [x] Plik `.mcp.json` utworzony
- [x] Plik `.vscode/settings.json` skonfigurowany
- [x] Klucze Supabase dodane
- [x] PostgreSQL connection string skonfigurowany
- [x] `.mcp.json` dodany do `.gitignore`
- [x] `.mcp.json.example` utworzony jako szablon
- [ ] VS Code przeładowany (musisz zrobić ręcznie)
- [ ] MCP Server widoczny w Copilot Chat (sprawdź po przeładowaniu)

## 🎯 Następne kroki

1. **Przeładuj VS Code** (Ctrl+Shift+P -> "Developer: Reload Window")
2. **Sprawdź MCP** w Copilot Chat (ikona w prawym górnym rogu)
3. **Wykonaj schemat** bazy danych (database/schema.sql)
4. **Testuj zapytania** przez MCP tools w Copilot Chat

## 📞 Wsparcie

Jeśli masz problemy:
1. Sprawdź logi MCP w Output panel
2. Przeczytaj dokumentację: `database/README.md`
3. Zresetuj konfigurację i spróbuj ponownie

---

**Status:** ✅ Skonfigurowane i gotowe do użycia po przeładowaniu VS Code
**Data:** 2025-12-30
**Projekt:** Greek Irini Restaurant
