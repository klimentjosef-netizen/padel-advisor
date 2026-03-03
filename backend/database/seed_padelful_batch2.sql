-- Padelful.com scrape – batch 2, 5 rackets (March 2026)
-- Prices: GBP x30 = CZK, EUR x25 = CZK; where unavailable, estimated from comparable models

-- 1. Babolat Viper Soft 3.0 2026 Juan Lebron – softer diamond, aggressive but forgiving
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Babolat', 'Viper Soft 3.0 2026', 7800, 365, 'head_heavy', 'diamond', 'medium',
  85, 96, 87, 'advanced', 'universal', 'offensive',
  'Soft Carbon', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/babolat-viper-soft-3-0-2026-juan-lebron.png',
  'Mekci varianta legendarne Viper s podpisem Juana Lebrona. Soft Carbon povrch nabizi komfortnejsi dopad nez klasicky tvrdy Viper, ale zachovava utocny charakter diamantoveho tvaru.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 2. Babolat Veron 3.0 2026 Juan Lebron – explosive diamond, mid-premium
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Babolat', 'Veron 3.0 2026', 6300, 360, 'head_heavy', 'diamond', 'medium',
  87, 90, 85, 'advanced', 'universal', 'offensive',
  'Carbon Flex', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/babolat-veron-3-0-2026-juan-lebron.png',
  'Explozivni diamantova raketa Babolat pro utocne hrace s cistou technikou. Carbon Flex povrch kombinuje karbon a sklolaminat pro silu s citlivejsim odrazem.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 3. Wilson Bela LS V3 2025 – lighter diamond, forgiving offensive
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Wilson', 'Bela LS V3 2025', 4990, 355, 'head_heavy', 'diamond', 'medium',
  91, 75, 88, 'advanced', 'universal', 'offensive',
  'Comfort Flex', 'Carbon',
  2025, 'https://www.padelful.com/images/rackets/wilson-bela-ls-v3-2025.png',
  'Lehci verze Bela V3 s komfortnejsim pocitem. Diamantovy tvar s odpoustejici odezvou a velkym sweet spotem, vhodna pro delsi zapasy a hrace, kteri chteji utocit bez extremni tuhosti.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 4. StarVie Black Titan 2026 – hard teardrop, power & precision
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('StarVie', 'Black Titan 2026', 7990, 358, 'head_heavy', 'teardrop', 'hard',
  96, 94, 81, 'advanced', 'universal', 'offensive',
  '24K Carbon', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/star-vie-black-titan-2026.png',
  'Tvrda kapkovita raketa StarVie s 24K karbonovym povrchem pro pokrocile hrace. Anti-Vibe system a Spin Boost Tech zajistuji silu, presnost a rotaci pri utocne hre u site.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 5. StarVie Triton Power 2026 Plus – max power diamond
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('StarVie', 'Triton Power 2026 Plus', 8490, 358, 'head_heavy', 'diamond', 'hard',
  95, 99, 80, 'advanced', 'universal', 'offensive',
  '18K Carbon', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/star-vie-triton-power-2026-plus.png',
  'Nejsilnejsi zbran v portfoliu StarVie. Diamantovy tvar s 18K karbonem a tvrdym H-EVA jadrem pro maximalni razanci. Prodlouzeny grip, idealni pro agresivni hrace s vybornou technikou.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;
