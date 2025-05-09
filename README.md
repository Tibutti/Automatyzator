# Automatyzator.com

![Automatyzator.com](./generated-icon.png)

## Opis projektu

Automatyzator.com to kompleksowa platforma B2B dostarczająca inteligentne, wielojęzyczne rozwiązania do automatyzacji procesów biznesowych. Platforma oferuje gotowe szablony automatyzacji, usługi dostosowywane do potrzeb klientów, szkolenia oraz edukacyjne treści blogowe.

## Technologie

### Frontend
- React z TypeScript
- Vite jako narzędzie do budowania
- TanStack Query (React Query) do zarządzania stanem
- Wouter do routingu
- Tailwind CSS z komponentami shadcn/ui
- React Hook Form z walidacją Zod
- Wielojęzyczność (i18next)
- Interaktywne animacje oparte na Canvas

### Backend
- Node.js
- Express.js z TypeScript
- Drizzle ORM
- PostgreSQL (via Neon Serverless)
- Uwierzytelnianie bazujące na sesjach z express-session
- Integracja z OpenAI dla funkcjonalności czatu

## Funkcje

### Publiczna strona internetowa
- Nowoczesny, responsywny design z interaktywnym bohaterem (hero section)
- Wielojęzyczność (PL, EN, DE, KR)
- System blogowy z kategoriami i wyróżnionymi artykułami
- Sklep szablonów automatyzacji
- Sekcja studiów przypadku (portfolio)
- Oferta szkoleniowa
- Formularze kontaktowe i zapisy do newslettera
- Widżet czatu AI zasilany OpenAI

### Panel administracyjny
- System uwierzytelniania i zarządzania kontami administracyjnymi
- Zarządzanie treścią (CRUD) dla blogów, szablonów, studiów przypadku
- Konfiguracja widoczności i kolejności sekcji
- Ustawianie opcji sekcji bohaterskich dla każdej podstrony
- Zarządzanie ustawieniami strony

## Zabezpieczenia

Platforma została zaimplementowana z uwzględnieniem najlepszych praktyk bezpieczeństwa:

- Bezpieczne uwierzytelnianie z blokadą konta po wielu nieudanych próbach logowania
- Kompleksowa walidacja danych wejściowych przy użyciu Zod
- Ochrona przed atakami XSS dzięki sanityzacji danych
- Ochrona przed CSRF z wykorzystaniem tokenów
- Odpowiednio skonfigurowane nagłówki bezpieczeństwa HTTP
- Rate limiting dla endpointów API z osobną konfiguracją dla wrażliwych tras
- Bezpieczne zarządzanie sesjami
- Funkcjonalność resetowania hasła

## Struktura projektu

```
├── client/              # Kod frontendu
│   ├── src/
│   │   ├── components/   # Komponenty React
│   │   ├── contexts/     # Konteksty React
│   │   ├── hooks/        # Niestandardowe hooki
│   │   ├── lib/          # Narzędzia i konfiguracje
│   │   ├── locales/      # Pliki tłumaczeń
│   │   └── pages/        # Strony aplikacji
├── server/              # Kod backendu
│   ├── middlewares/     # Middleware Expressa
│   └── ...              # Pozostałe moduły serwera
└── shared/              # Kod współdzielony między frontend i backend
    └── schema.ts        # Schemat bazy danych i walidacji
```

## Środowisko deweloperskie

### Wymagania
- Node.js 20+
- PostgreSQL lub konto Neon Database

### Konfiguracja
1. Sklonuj repozytorium
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj zmienne środowiskowe w pliku `.env`:
   ```
   DATABASE_URL=...
   OPENAI_API_KEY=...
   ```
4. Uruchom migrację bazy danych: `npm run db:push`
5. Uruchom aplikację w trybie deweloperskim: `npm run dev`

### Dostępne skrypty

- `npm run dev` - Uruchamia serwer deweloperski (frontend + backend)
- `npm run build` - Buduje aplikację do produkcji
- `npm run start` - Uruchamia zbudowaną aplikację
- `npm run db:push` - Aktualizuje strukturę bazy danych na podstawie schematu

## Wdrażanie

### Przygotowanie do produkcji
1. Zbuduj aplikację: `npm run build`
2. Ustaw zmienne środowiskowe w środowisku produkcyjnym
3. Uruchom aplikację: `npm run start`

### Środowisko produkcyjne
W środowisku produkcyjnym aktywowane są dodatkowe zabezpieczenia:
- Rate limiting dla endpointów API
- Nagłówki bezpieczeństwa HTTP
- Optymalizacje wydajności

## Licencja

Własnościowe oprogramowanie - wszystkie prawa zastrzeżone.

## Kontakt

Automatyzator.com - kontakt@automatyzator.com