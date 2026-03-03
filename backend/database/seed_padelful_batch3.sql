-- Padelful.com scrape – batch 3: Siux, Black Crown, Enebe (March 2026)
-- Prices converted to CZK: 1 EUR ~ 25 CZK, 1 GBP ~ 30 CZK
-- Black Crown & Enebe prices estimated (not listed on Padelful)

-- New brands
INSERT INTO brands (name) VALUES ('Black Crown') ON CONFLICT (name) DO NOTHING;
INSERT INTO brands (name) VALUES ('Enebe') ON CONFLICT (name) DO NOTHING;

-- 1. Siux Pegasus Pro Storm Grey 2026 – hard teardrop, pro-level power
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Siux', 'Pegasus Pro Storm Grey 2026', 8250, 365, 'head_heavy', 'teardrop', 'hard',
  96, 97, 84, 'advanced', 'universal', 'offensive',
  'Carbon 12K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/siux-pegasus-pro-storm-grey-2026.png',
  'Silna kapkova raketa pro agresivni pokrocile hrace. Tvrdy dotek s 12K karbonem a EVA PRO jadrem pro explozivni udery a maximalni presnost u site.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 2. Siux Valkiria Pro 2026 – versatile teardrop, Sofia Araujo signature
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Siux', 'Valkiria Pro 2026', 7875, 350, 'balanced', 'teardrop', 'medium',
  83, 80, 92, 'advanced', 'universal', 'offensive',
  'Carbon 24K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/siux-valkiria-pro-2026.png',
  'Vsestranna kapkova raketa s podpisem Sofie Araujo. Kombinace sily a kontroly s velkym sweet spotem, 24K karbonem a mekkou EVA pro pohodlnou a presnou hru.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 3. Siux Fenix Elite 6 2026 – diamond power, aggressive play
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Siux', 'Fenix Elite 6 2026', 6750, 365, 'head_heavy', 'diamond', 'medium',
  86, 90, 84, 'advanced', 'universal', 'offensive',
  'Carbon 3K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/siux-fenix-elite-6-2026.png',
  'Diamantova raketa pro utocne pokrocile hrace. Explozivni sila a presnost pro dominanci u site. Idealni pro zakoncovani bodu smashem a viborou.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 4. Black Crown Special Max 2026 – offensive teardrop, power + control
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Black Crown', 'Special Max 2026', 5750, 362, 'head_heavy', 'teardrop', 'medium',
  86, 90, 86, 'advanced', 'universal', 'offensive',
  'Carbon 18K Aluminum', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/black-crown-special-max-2026.png',
  'Jasne utocna kapkova raketa s 18K hlinikovym karbonem. Explozivni sila pro dominanci u site pri zachovani solidni kontroly a stability v kazdem vymenovani.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 5. Enebe Mustang Silver 3K 2026 – diamond attacker, intermediate+
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Enebe', 'Mustang Silver 3K 2026', 4250, 362, 'head_heavy', 'diamond', 'medium',
  82, 89, 81, 'intermediate', 'universal', 'offensive',
  'Carbon 3K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/enebe-mustang-silver-3k-2026.png',
  'Utocna diamantova raketa s prekvapive dobrou ovladatelnosti. Explozivni sila a tlak na soupere ve formatu diamond, vhodna pro stredne pokrocile az pokrocile hrace.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;
