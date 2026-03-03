-- Padelful.com scrape – 5 Bullpadel rackets (March 2026)
-- Prices converted to CZK: 1 EUR ~ 25 CZK, 1 GBP ~ 30 CZK

-- 1. Bullpadel Neuron 02 2026 Fede Chingotto – control teardrop, Chingotto signature
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Bullpadel', 'Neuron 02 2026 Fede Chingotto', 7440, 370, 'balanced', 'teardrop', 'medium',
  96, 78, 91, 'advanced', 'universal', 'defensive',
  'Xtend Carbon 3K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/bullpadel-neuron-02-2026-fede-chingotto.png',
  'Signaturni raketa Fedeho Chingotta zamerena na maximalni kontrolu a taktickou dominanci. Kapkovy tvar s MultiEVA jadrem a systemem Ease Vibe pro tlumeni vibraci, idealni pro presne a trpelive hrace.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 2. Bullpadel Xplo 2026 Martin Di Nenno – power diamond, Di Nenno signature
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Bullpadel', 'Xplo 2026 Martin Di Nenno', 7225, 370, 'head_heavy', 'diamond', 'medium',
  92, 94, 84, 'advanced', 'universal', 'offensive',
  'Xtend Carbon 12K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/bullpadel-xplo-2026-martin-di-nenno.png',
  'Explozivni diamantova raketa Martina Di Nenna pro agresivni hrace. 12K karbon na povrchu prinasi razantni silu a kontrolu u site, navrzen pro dominanci a razantni zakoncovani bodu.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 3. Bullpadel Hack 04 Comfort 2026 – power diamond with comfort
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Bullpadel', 'Hack 04 Comfort 2026', 5625, 365, 'head_heavy', 'diamond', 'soft',
  80, 84, 80, 'advanced', 'universal', 'offensive',
  'Fibrix', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/bullpadel-hack-04-comfort-2026.png',
  'Utocny diamant s komfortnim pocitem diky Fibrix povrchu a mekcimu MultiEVA jadru. Vynika ve smasich a hre u site, nabizi rovnovahu mezi silou a citlivosti pro pokrocile hrace.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 4. Bullpadel Hack 04 Hybrid 2026 – versatile teardrop, balanced power & control
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Bullpadel', 'Hack 04 Hybrid 2026', 7200, 370, 'head_heavy', 'teardrop', 'medium',
  88, 86, 83, 'advanced', 'universal', 'universal',
  '18K Aluminized Carbon', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/bullpadel-hack-04-hybrid-2026.png',
  'Vsestranna kapka pro pokrocile hrace hledajici mix presnosti, sily a odezvy. 18K aluminizovany karbon s 3D povrchem pro rotaci, rychle voleje i kontrolovane udery ze zakladni cary.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 5. Bullpadel Xplo Comfort 2026 – accessible diamond with comfort touch
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Bullpadel', 'Xplo Comfort 2026', 5400, 365, 'head_heavy', 'diamond', 'soft',
  86, 82, 89, 'intermediate', 'universal', 'offensive',
  'Fibrix', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/bullpadel-xplo-comfort-2026.png',
  'Diamantova raketa s komfortnim dotykem pro stredne pokrocile az pokrocile hrace. Fibrix povrch a Vibradrive system tlumi vibrace, siroky sweet spot a nastavitelna vaha pro osobni preference.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;
