# Automatyczne wykonanie schematu bazy danych
# Ten skrypt używa Supabase Management API do wykonania SQL

$supabaseUrl = "https://wlbwstlaxdtcdafhudny.supabase.co"
$serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsYndzdGxheGR0Y2RhZmh1ZG55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzEyMjIxNywiZXhwIjoyMDgyNjk4MjE3fQ.CCrcqoy_Tl66JuFy9NqF1tKXIa5dqWatSSHCf3j5TZU"

Write-Host "`n🚀 GREEK IRINI - Automatyczna konfiguracja bazy danych`n" -ForegroundColor Cyan

# Read schema file
$schemaPath = Join-Path $PSScriptRoot "schema.sql"
if (-not (Test-Path $schemaPath)) {
    Write-Host "❌ Nie znaleziono pliku schema.sql" -ForegroundColor Red
    exit 1
}

$schema = Get-Content $schemaPath -Raw
Write-Host "✅ Załadowano schemat ($(([System.Text.Encoding]::UTF8.GetBytes($schema)).Length) bajtów)`n" -ForegroundColor Green

# Headers for Supabase API
$headers = @{
    "apikey" = $serviceRoleKey
    "Authorization" = "Bearer $serviceRoleKey"
    "Content-Type" = "application/json"
}

Write-Host "📡 Próba połączenia z Supabase...`n" -ForegroundColor Yellow

# Test connection
try {
    $testUrl = "$supabaseUrl/rest/v1/"
    $response = Invoke-RestMethod -Uri $testUrl -Headers $headers -Method Get -ErrorAction Stop
    Write-Host "✅ Połączenie z Supabase OK`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Błąd połączenia: $_" -ForegroundColor Red
    Write-Host "`n💡 ROZWIĄZANIE: Wykonaj schemat ręcznie:" -ForegroundColor Yellow
    Write-Host "   1. Otwórz: https://wlbwstlaxdtcdafhudny.supabase.co" -ForegroundColor White
    Write-Host "   2. Przejdź do SQL Editor" -ForegroundColor White
    Write-Host "   3. Skopiuj zawartość: database\schema.sql" -ForegroundColor White
    Write-Host "   4. Wklej i kliknij Run`n" -ForegroundColor White
    exit 1
}

Write-Host "⚠️  UWAGA: Supabase REST API nie obsługuje bezpośredniego wykonywania DDL SQL." -ForegroundColor Yellow
Write-Host "          Musisz użyć SQL Editor w Supabase Dashboard.`n" -ForegroundColor Yellow

Write-Host "📋 INSTRUKCJE KROK PO KROKU:" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Otwórz w przeglądarce:" -ForegroundColor Green
Write-Host "    https://wlbwstlaxdtcdafhudny.supabase.co" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Zaloguj się do swojego konta Supabase" -ForegroundColor Green
Write-Host ""
Write-Host "3️⃣  W lewym menu kliknij: SQL Editor" -ForegroundColor Green
Write-Host ""
Write-Host "4️⃣  Kliknij 'New query' lub '+'" -ForegroundColor Green
Write-Host ""
Write-Host "5️⃣  Skopiuj cały plik:" -ForegroundColor Green
Write-Host "    database\schema.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "6️⃣  Wklej w SQL Editor (Ctrl+V)" -ForegroundColor Green
Write-Host ""
Write-Host "7️⃣  Kliknij 'Run' lub naciśnij Ctrl+Enter" -ForegroundColor Green
Write-Host ""
Write-Host "8️⃣  Poczekaj na wykonanie (~10-15 sekund)" -ForegroundColor Green
Write-Host ""
Write-Host "9️⃣  Sprawdź w Table Editor czy tabele zostały utworzone:" -ForegroundColor Green
Write-Host "    - reservations" -ForegroundColor White
Write-Host "    - menu_items" -ForegroundColor White
Write-Host "    - orders" -ForegroundColor White
Write-Host "    - order_items" -ForegroundColor White
Write-Host "    - drivers" -ForegroundColor White
Write-Host "    - staff_notes" -ForegroundColor White
Write-Host "    - restaurant_settings" -ForegroundColor White
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

Write-Host "💡 ALTERNATYWNIE: Możesz otworzyć plik schema.sql i skopiować go samodzielnie" -ForegroundColor Yellow
Write-Host "   Lokalizacja: $schemaPath`n" -ForegroundColor White

# Offer to open browser
$openBrowser = Read-Host "Czy chcesz otworzyć Supabase Dashboard teraz? (T/N)"
if ($openBrowser -eq "T" -or $openBrowser -eq "t" -or $openBrowser -eq "Y" -or $openBrowser -eq "y") {
    Start-Process "https://wlbwstlaxdtcdafhudny.supabase.co/project/wlbwstlaxdtcdafhudny/editor"
    Write-Host "✅ Otwieram przeglądarkę...`n" -ForegroundColor Green
}

Write-Host "📞 Jeśli masz problemy, sprawdź dokumentację:" -ForegroundColor Cyan
Write-Host "   database\README.md`n" -ForegroundColor White
