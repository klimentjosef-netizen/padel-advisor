# Padel Racket Calculator

Monorepo obsahuje backend API, frontend aplikaci a databazove schema.

## Struktura

- `src/` - backend (TypeScript + Express + PostgreSQL)
- `frontend/` - Next.js frontend (pages router + lokalizovane routy)
- `database/` - PostgreSQL schema a seed
- `docs/` - architektura a roadmap

## Backend endpointy

- `GET /api/rackets`
- `GET /api/rackets/:id`
- `POST /api/rackets/compare`
- `POST /api/recommendations`
- `GET /api/brands`
- `GET /api/sessions`
- `POST /api/admin/rackets`
- `PUT /api/admin/rackets/:id`
- `DELETE /api/admin/rackets/:id`

## Lokalni spusteni

### 1) PostgreSQL

Nejsnazsi varianta je Docker:

```bash
docker compose up -d
```

Pak nastav `DATABASE_URL`.

Priklad v `.env.example`:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/padel
PORT=4000
```

Backend pri startu automaticky:

- aplikuje `database/schema.sql`
- doplni zakladni seed data, pokud jsou tabulky prazdne

Zastaveni DB:

```bash
docker compose down
```

### 2) Backend

```bash
npm install
npm run dev
```

Server bezi na `http://localhost:4000`.

### 3) Frontend

```bash
cd frontend
npm install
set NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev
```

Frontend bezi na `http://localhost:3000`.

## Poznamky

- Recommendation engine je v `src/modules/recommendation/scoring.engine.ts`.
- Doporuceni i session logy se trvale ukladaji do PostgreSQL (`user_sessions`, `recommendation_results`).

## Import z Padelful

Skript `src/scripts/scrape-padelful.ts` nacte verejne detailni stranky raket z `https://www.padelful.com/en/rackets`, vytahne metriky a ulozi:

- canonical data do `rackets`
- raw zdrojove payloady do `racket_sources`
- vypoctene metriky do `racket_metrics`
- mapovani zdroj->racket do `racket_aliases`

Spusteni:

```bash
npm run scrape:padelful -- --max-pages=10 --concurrency=6
```

Pro PadelReference:

```bash
npm run scrape:padelreference -- --max-products=200 --concurrency=5
```

Pro PadelNuestro:

```bash
npm run scrape:padelnuestro -- --max-pages=20 --max-products=400 --concurrency=6
```

Vsechny zdroje najednou:

```bash
npm run scrape:all
```

Poznamky:

- bez `--max-pages` se projdou vsechny nalezene stranky
- opakovane spusteni dela upsert (aktualizace existujicich modelu)
- deduplikace mezi zdroji probiha pres `racket_aliases` + normalizaci `brand/model/year`
