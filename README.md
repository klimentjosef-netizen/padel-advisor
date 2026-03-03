# Poradce Padel Raket

Webova aplikace, ktera pomaha hracum padelu najit idealni raketu na zaklade jejich preferenci a herniho stylu.

## Architektura

```
backend/          Express.js + TypeScript API server
  src/
    modules/      Modularni struktura (admin, brands, racket, rackets, recommendation, sessions)
    shared/       Zod schemas, normalize utility, admin-auth middleware
    scripts/      Web scrapery (padelful, padelreference, padelnuestro) + shared utils
  database/       PostgreSQL schema (8 tabulek)

frontend/         Next.js 14 App Router + Tailwind CSS
  src/
    app/          Stranky (questionnaire, results, racket/[id], compare)
    components/   UI komponenty (QuestionnaireForm, ResultsContent, RacketDetailContent, CompareContent, TopNav)
    services/     Typovany API klient
    types/        TypeScript rozhrani
```

## Databaze

PostgreSQL s tabulkami: `brands`, `rackets`, `user_sessions`, `recommendation_results`, `rackets_translations`, `racket_sources`, `racket_metrics`, `racket_aliases`.

Scrapery pouzivaji fuzzy matching (normalizovany klic + Jaccard token similarity) pro deduplikaci raket z ruznych zdroju.

## Setup

### Predpoklady
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
cp .env.example .env        # Upravit DATABASE_URL, ADMIN_API_KEY, CORS_ORIGINS
npm install
npm run dev                  # Spusti na http://localhost:4000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                        # Spusti na http://localhost:3000
```

### Databaze

```bash
psql -d <database> -f backend/database/schema.sql
```

## Scrapery

Stahuji data raket z webu a ukladaji je do DB s automatickym linkovanimduplicities.

```bash
cd backend
npm run scrape:padelful           # Padelful.com
npm run scrape:padelreference     # PadelReference.com
npm run scrape:padelnuestro       # PadelNuestro.com
npm run scrape:all                # Vse najednou
```

## Admin API

Chranene `X-API-Key` headerem (nastavit v `ADMIN_API_KEY` env).

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| GET | `/admin/rackets` | Seznam raket (strankovani) |
| POST | `/admin/rackets` | Vytvorit raketu |
| PUT | `/admin/rackets/:id` | Upravit raketu |
| DELETE | `/admin/rackets/:id` | Smazat raketu |

Priklad:
```bash
curl -H "X-API-Key: $ADMIN_API_KEY" http://localhost:4000/admin/rackets
```

## Verejne API

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| POST | `/api/recommendations` | Doporuceni raket podle preferenci |
| GET | `/api/rackets` | Seznam aktivnich raket |
| GET | `/api/rackets/:id` | Detail rakety |
| POST | `/api/rackets/compare` | Porovnani 2-5 raket |
| GET | `/api/brands` | Seznam znacek |

## Scoring Engine

Vicefaktorovy scoring system (max 135 bodu):

| Faktor | Body |
|--------|------|
| Herni styl | 30 |
| Vyvazeni | 25 |
| Vaha (tolerance +-6g) | 20 |
| Cena v rozpoctu | 15 |
| Tvrdost | 10 |
| Uroven hrace | 10 |
| Control/Power pomer | 10 |
| Preferovana znacka | 10 |
| Pozice na kurtu | 5 |

## Testy

```bash
cd backend
npm test              # Jednorazovy beh
npm run test:watch    # Watch mod
```

Testovany oblasti: scoring engine, Zod validacni schemas, normalize utility.
