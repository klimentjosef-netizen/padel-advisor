# Architektura softwaru - Kalkulacka padelovych raket

## 1. Prehled

Aplikace sbira preference uzivatele, vyhodnoti je recommendation enginem a vrati TOP rakety s duvody doporuceni.

## 2. Logicky diagram

```text
[Frontend Next.js]
   |
   v
[REST API Express]
   |
   |--- Recommendation Engine (scoring)
   |
   v
[PostgreSQL]
```

## 3. Vrstvy

### Frontend

- Route prefix: `/{locale}` (`cs`, `en`, `es`, `de`)
- Moduly:
  - Dotaznik
  - Vysledky doporuceni
  - Detail rakety
  - Porovnani raket

### Backend

- Modularni struktura:
  - `rackets`
  - `recommendation`
  - `sessions`
  - `brands`
  - `admin`
- API validace pomoci `zod`
- Trvale ukladani dat pres `pg` a SQL dotazy

### Databaze

- Tabulky:
  - `rackets`
  - `brands`
  - `user_sessions`
  - `recommendation_results`
  - `rackets_translations`
  - `racket_sources` (raw data z externich zdroju)
  - `racket_metrics` (normalizovane metriky pro scoring)
  - `racket_aliases` (deduplikace stejnych raket mezi ruznymi zdroji)

### Recommendation Engine

Skore je soucet vahovanych faktoru:

- herni styl
- balance
- vaha
- tvrdost
- uroven
- pozice
- cena
- znacka
- control vs power alignment

## 4. MVP roadmap

1. DB + API + scoring
2. Frontend dotaznik + vysledky
3. Porovnani
4. Admin API
5. Pokrocile AI doporucovani

## 5. Deploy

- Frontend: Vercel
- Backend + DB: Railway / Supabase
