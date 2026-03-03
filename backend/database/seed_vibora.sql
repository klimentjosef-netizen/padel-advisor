-- Vibora 2026 collection – 5 rackets from padelful.com (March 2026)
-- Prices estimated in CZK (no retail price listed on source)

-- Brand
INSERT INTO brands (name) VALUES ('Vibora') ON CONFLICT (name) DO NOTHING;

-- 1. Vibora Black Mamba Radical 12K 3.0 2026 – advanced teardrop, control & versatility
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Vibora', 'Black Mamba Radical 12K 3.0 2026', 7490, 367, 'balanced', 'teardrop', 'medium',
  86, 81, 92, 'advanced', 'universal', 'universal',
  '12K Carbon', 'Carbon fiber',
  2026, 'https://www.padelful.com/images/rackets/vibora-black-mamba-radical-12k-3-0-2026.png',
  'Premia kapkova raketa pro pokrocile hrace hledajici kontrolu a vsestrannost. Dynamicka rovnovaha mezi silou a presnosti s odpoustejicim sweet spotem diky 12K karbonu.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 2. Vibora Yarara Pro White 2.0 2026 – advanced teardrop, balanced all-rounder
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Vibora', 'Yarara Pro White 2.0 2026', 6490, 367, 'balanced', 'teardrop', 'medium',
  85, 85, 91, 'advanced', 'universal', 'universal',
  '3K Carbon', 'Carbon fiber',
  2026, 'https://www.padelful.com/images/rackets/vibora-yarara-pro-white-2-0-2026.png',
  'Vsestranna kapkova raketa s vyvazenym pomerem sily a presnosti. Skvela manovrovatelnost a prijemny pocit pri utoku i obrane na zakladni care.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 3. Vibora Titan Black 3K 2026 – advanced diamond, offensive powerhouse
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Vibora', 'Titan Black 3K 2026', 6990, 367, 'head_heavy', 'diamond', 'hard',
  89, 93, 86, 'advanced', 'universal', 'offensive',
  '3K Carbon', 'Carbon fiber',
  2026, 'https://www.padelful.com/images/rackets/vibora-titan-black-3k-2026.png',
  'Agresivni diamantova raketa pro utocne pokrocile hrace. Vysoka rovnovaha prinasi vynikajici silu pri smasich a volejich u site. EVA PRO jadro pro spolehlivou kontrolu.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 4. Vibora Titan Black 15K Twill 2026 – advanced diamond, max power
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Vibora', 'Titan Black 15K Twill 2026', 7990, 367, 'head_heavy', 'diamond', 'medium',
  86, 96, 83, 'advanced', 'universal', 'offensive',
  '15K Twill Carbon', 'Carbon fiber',
  2026, 'https://www.padelful.com/images/rackets/vibora-titan-black-15k-twill-2026.png',
  'Diamantova raketa s pokrocilou 15K Twill karbonovou technologii pro maximalni razanci. Vysoka rovnovaha a utocna orientace pro hrace dominujici u site.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 5. Vibora Black Mamba Pro 2.0 2026 – advanced teardrop, well-rounded
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Vibora', 'Black Mamba Pro 2.0 2026', 6490, 367, 'balanced', 'teardrop', 'medium',
  84, 78, 90, 'advanced', 'universal', 'universal',
  '12K Carbon', 'Carbon fiber',
  2026, 'https://www.padelful.com/images/rackets/vibora-black-mamba-pro-2-0-2026.png',
  'Vsestranna kapkova raketa pro pokrocile hrace hledajici silu pri utoku a stabilitu v obrane. Prijemny odraz s minimem vibraci diky EVA PRO jadru a 12K karbonu.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;
