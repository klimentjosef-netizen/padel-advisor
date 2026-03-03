-- Padelful.com scrape – Head 2026 collection, 5 rackets (March 2026)
-- Prices: DKK x3.36 ≈ CZK, EUR x25 = CZK; where unavailable, estimated from comparable models

-- 1. Head Extreme Pro 2026 – diamond power machine, advanced offensive
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Head', 'Extreme Pro 2026', 4990, 370, 'head_heavy', 'diamond', 'hard',
  94, 100, 78, 'advanced', 'universal', 'offensive',
  'Fiberglass + Carbon', '100% Carbon',
  2026, 'https://www.padelful.com/images/rackets/head-extreme-pro-2026.png',
  'Diamantova raketa Head pro pokrocile hrace hledajici maximalni silu a preciznost. Extreme Spin 3D povrch pro lepsi rotaci a Soft Cap+ pro tlumeni vibraci pri agresivni hre u site.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 2. Head Radical Pro 2026 – teardrop control, advanced tactical
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Head', 'Radical Pro 2026', 5400, 370, 'head_light', 'teardrop', 'hard',
  95, 79, 89, 'advanced', 'universal', 'defensive',
  '3K Carbon', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/head-radical-pro-2026.png',
  'Kontrolni kapkovita raketa Head pro pokrocile takticke hrace. Auxetic 2.0 pro lepsi pocit mimo stred a Smart Bridge pro stabilitu. Presnost, komfort a totalni kontrola bodu.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 3. Head Radical Motion 2026 – teardrop, control-oriented with offensive capabilities
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Head', 'Radical Motion 2026', 4500, 355, 'head_heavy', 'teardrop', 'hard',
  89, 75, 88, 'intermediate', 'universal', 'universal',
  '3K Carbon', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/head-radical-motion-2026.png',
  'Lehci kapkovita raketa z rady Radical pro stredne pokrocile az pokrocile hrace. Pevny a ostry kontakt s presnym smerovanim mice. Vynika u site pri volejich a smasich.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 4. Head Extreme Motion 2026 – diamond, offensive intermediate-to-advanced
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Head', 'Extreme Motion 2026', 4500, 360, 'head_heavy', 'diamond', 'medium',
  93, 86, 81, 'intermediate', 'universal', 'offensive',
  'Fiberglass + Carbon', '100% Carbon',
  2026, 'https://www.padelful.com/images/rackets/head-extreme-motion-2026.png',
  'Diamantova raketa Head pro stredne pokrocile az pokrocile hrace hledajici explozivni silu. Vynika u site a pri silovych uderech, ale vyzaduje techniku pro obrannou hru.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 5. Head Extreme Team 2026 – diamond, balanced power & comfort
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Head', 'Extreme Team 2026', 3790, 365, 'balanced', 'diamond', 'medium',
  93, 84, 82, 'intermediate', 'universal', 'offensive',
  'Fiberglass', '100% Carbon',
  2026, 'https://www.padelful.com/images/rackets/head-extreme-team-2026.png',
  'Pristupna diamantova raketa Head s harmonickou kombinaci sily a komfortu. Auxetic 2.0 technologie a Antishock Skin povrch. Vhodna pro utocne i vsestranné hrace stredni urovne.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;
