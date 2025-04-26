# Automatyzator.com - Platforma Automatyzacji Biznesu

Automatyzator.com to nowoczesna platforma B2B oferująca usługi automatyzacji, gotowe szablony oraz treści edukacyjne, zbudowana z wykorzystaniem React.js i Express.js.

![Automatyzator.com Logo](https://example.com/logo.png)

## O Projekcie

Automatyzator.com to kompleksowa platforma B2B zaprojektowana, aby pomóc firmom automatyzować procesy, integrować systemy oraz skalować działalność. Platforma oferuje:

- **Usługi automatyzacji biznesowej**: Profesjonalne usługi konsultingowe i wdrożeniowe
- **Gotowe szablony automatyzacji**: Biblioteka gotowych do użycia szablonów i rozwiązań
- **Case studies i blog**: Treści edukacyjne pokazujące wartość automatyzacji
- **Panel administracyjny**: Rozbudowany system zarządzania treścią

## Technologie

### Frontend
- **React**: Biblioteka JavaScript do budowania interfejsów użytkownika
- **TypeScript**: Typowany superset JavaScript zapewniający bezpieczeństwo typów
- **Tailwind CSS**: Framework CSS oparty na klasach utility
- **Shadcn/ui**: Zestaw komponentów UI zbudowanych na Radix UI 
- **Vite**: Nowoczesne narzędzie do budowania aplikacji
- **React Hook Form**: Biblioteka do zarządzania formularzami
- **Zod**: Walidacja schematów i typowanie danych
- **TanStack Query (React Query)**: Zarządzanie stanem asynchronicznym i cachowaniem danych
- **Wouter**: Lekki router dla aplikacji React
- **Lucide React**: Ikony
- **date-fns**: Biblioteka do manipulacji datami

### Backend
- **Node.js**: Środowisko uruchomieniowe JavaScript
- **Express**: Framework webowy dla Node.js
- **TypeScript**: Typowany JavaScript dla backendu
- **Drizzle ORM**: Typesafe ORM dla baz danych SQL
- **PostgreSQL**: Relacyjna baza danych
- **@neondatabase/serverless**: Biblioteka do pracy z Neon Database
- **Passport.js**: Middleware do autentykacji
- **express-session**: Middleware do zarządzania sesjami
- **drizzle-zod**: Integracja Drizzle ORM z Zod dla walidacji

## Struktura Projektu

Projekt jest zorganizowany w następujący sposób:

```
automatyzator/
├── client/                  # Kod frontendu
│   ├── src/                 # Kod źródłowy React
│   │   ├── components/      # Komponenty wielokrotnego użytku
│   │   ├── hooks/           # Customowe hooki React
│   │   ├── lib/             # Narzędzia i funkcje pomocnicze
│   │   ├── pages/           # Komponenty stron
│   │   └── ...
│   └── ...
├── server/                  # Kod backendu
│   ├── index.ts             # Punkt wejścia aplikacji Express
│   ├── routes.ts            # Definicje tras API
│   ├── storage.ts           # Interfejs przechowywania danych
│   └── ...
├── shared/                  # Kod współdzielony między frontendem i backendem
│   └── schema.ts            # Schematy i typy Drizzle ORM
└── ...
```

## Funkcje

### Publiczna strona
- Strona główna z informacjami o usługach
- Blog z artykułami edukacyjnymi
- Sklep z gotowymi szablonami automatyzacji
- Strona z portfolio i case studies
- Formularz kontaktowy
- Wielojęzyczność (polski i angielski)
- Wbudowany chatbot obsługiwany przez OpenAI
  
### Panel Administracyjny
- Zabezpieczony system logowania
- Zarządzanie treściami blogowymi
- Zarządzanie szablonami
- Zarządzanie case studies
- Monitorowanie wiadomości kontaktowych
- Zarządzanie subskrybentami newslettera
- Rozbudowane ustawienia platformy:
  - Konfiguracja konta
  - Ustawienia strony
  - Integracje API (OpenAI, Stripe)
  - Zarządzanie językami
  - Analityka
  - Kopie zapasowe
  - Personalizacja interfejsu

## Uruchamianie projektu

### Wymagania
- Node.js 18+
- PostgreSQL 14+

### Instalacja i uruchomienie

1. Klonowanie repozytorium:
```bash
git clone https://github.com/twoja-organizacja/automatyzator.git
cd automatyzator
```

2. Instalacja zależności:
```bash
npm install
```

3. Ustawienie zmiennych środowiskowych:
Stwórz plik `.env` w głównym katalogu projektu na podstawie `.env.example`.

4. Uruchomienie projektu w trybie deweloperskim:
```bash
npm run dev
```

5. Migracja bazy danych:
```bash
npm run db:push
```

## Licencja

[MIT](LICENSE)

---

Stworzone przez [Twoja Firma](https://twojafirma.com) © 2025