CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL UNIQUE,
  logo_url TEXT
);

CREATE TABLE IF NOT EXISTS rackets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand VARCHAR(120) NOT NULL,
  model VARCHAR(120) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  weight INTEGER NOT NULL,
  balance VARCHAR(30) NOT NULL,
  shape VARCHAR(40) NOT NULL,
  hardness VARCHAR(30) NOT NULL,
  control_rating INTEGER NOT NULL,
  power_rating INTEGER NOT NULL,
  sweet_spot_size INTEGER NOT NULL,
  player_level VARCHAR(20) NOT NULL,
  player_position VARCHAR(20) NOT NULL,
  play_style VARCHAR(20) NOT NULL,
  material_face VARCHAR(120) NOT NULL,
  material_frame VARCHAR(120) NOT NULL,
  year INTEGER NOT NULL,
  image_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_rackets_brand_model_year ON rackets(brand, model, year);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  preferred_price_min NUMERIC(10,2),
  preferred_price_max NUMERIC(10,2),
  preferred_weight INTEGER,
  preferred_balance VARCHAR(30),
  preferred_hardness VARCHAR(30),
  player_level VARCHAR(20),
  play_style VARCHAR(20),
  player_position VARCHAR(20),
  control_vs_power INTEGER,
  preferred_brands TEXT[],
  preferred_shape VARCHAR(20),
  sweet_spot_preference VARCHAR(20),
  preferred_material VARCHAR(20),
  year_preference VARCHAR(20) DEFAULT 'any',
  experience_months INTEGER,
  play_tempo VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS recommendation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  racket_id UUID NOT NULL REFERENCES rackets(id),
  score INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rackets_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  racket_id UUID NOT NULL REFERENCES rackets(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL,
  model_localized VARCHAR(120),
  description_localized TEXT,
  UNIQUE (racket_id, locale)
);

CREATE TABLE IF NOT EXISTS racket_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_name VARCHAR(80) NOT NULL,
  source_slug VARCHAR(200) NOT NULL,
  source_url TEXT NOT NULL,
  racket_id UUID REFERENCES rackets(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  scraped_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (source_name, source_slug)
);

CREATE TABLE IF NOT EXISTS racket_metrics (
  racket_id UUID NOT NULL REFERENCES rackets(id) ON DELETE CASCADE,
  source_name VARCHAR(80) NOT NULL,
  source_slug VARCHAR(200),
  source_rating NUMERIC(5,2),
  control_rating NUMERIC(5,2),
  power_rating NUMERIC(5,2),
  rebound_rating NUMERIC(5,2),
  maneuverability_rating NUMERIC(5,2),
  sweet_spot_rating NUMERIC(5,2),
  source_count INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (racket_id, source_name)
);

CREATE TABLE IF NOT EXISTS racket_aliases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  racket_id UUID NOT NULL REFERENCES rackets(id) ON DELETE CASCADE,
  source_name VARCHAR(80) NOT NULL,
  source_slug VARCHAR(200) NOT NULL,
  source_url TEXT,
  source_brand VARCHAR(160),
  source_model VARCHAR(200),
  normalized_key VARCHAR(260) NOT NULL,
  match_confidence NUMERIC(5,2) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (source_name, source_slug)
);

CREATE INDEX IF NOT EXISTS idx_rackets_brand ON rackets(brand);
CREATE INDEX IF NOT EXISTS idx_rackets_level_style ON rackets(player_level, play_style);
CREATE INDEX IF NOT EXISTS idx_results_session ON recommendation_results(session_id);
CREATE INDEX IF NOT EXISTS idx_racket_sources_racket_id ON racket_sources(racket_id);
CREATE INDEX IF NOT EXISTS idx_racket_aliases_key ON racket_aliases(normalized_key);
