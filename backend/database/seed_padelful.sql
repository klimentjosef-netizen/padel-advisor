-- Padelful.com scrape – 20 rackets (March 2026)
-- Prices converted to CZK (Czech retail estimates)

-- New brand
INSERT INTO brands (name) VALUES ('Oxdog') ON CONFLICT (name) DO NOTHING;

-- 1. Bullpadel Vertex 05 2026 – pro diamond, Juan Tello signature
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Bullpadel', 'Vertex 05 2026', 8490, 370, 'head_heavy', 'diamond', 'medium',
  88, 86, 91, 'advanced', 'universal', 'offensive',
  'Xtend Carbon 12K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/bullpadel-vertex-05-2026-juan-tello.png',
  'Profesionalni diamantova raketa Juana Tella. Vynikajici sila i kontrola diky MultiEVA jadru a systemum Ease Vibe a Vibradrive pro tlumeni vibraci. Siroky sweet spot na diamond tvar.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 2. Adidas Metalbone 2026 Ale Galan – pro diamond, explosive power
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Adidas', 'Metalbone 2026', 9990, 352, 'head_heavy', 'diamond', 'medium',
  87, 91, 82, 'advanced', 'universal', 'offensive',
  'Carbon Aluminized 16K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/adidas-metalbone-2026-ale-galan.png',
  'Vlajkova lod Adidas pro utocne hrace. Podpis Alejandra Galana. Exploze sily diky 16K karbonu s hlinikovou upravou, nastavitelna vaha pomoci sroubku. Spin Blade povrch pro rotaci.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 3. Babolat Viper 3.0 2026 Juan Lebron – ultimate power diamond
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Babolat', 'Viper 3.0 2026', 9490, 370, 'head_heavy', 'diamond', 'hard',
  94, 98, 86, 'advanced', 'universal', 'offensive',
  'Carbon 3K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/babolat-viper-3-0-2026-juan-lebron.png',
  'Nejagresivnejsi raketa Babolat s podpisem Juana Lebrona. Tvrdy pocit, explozivni sila a struktura pro pokrocile a profesionalni hrace. Dominance u site a razantni zakonceni bodu.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 4. Nox AT10 Genius Attack 18K Alum 2026 – diamond power machine
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Nox', 'AT10 Genius Attack 18K 2026', 8690, 367, 'head_heavy', 'diamond', 'medium',
  90, 97, 79, 'advanced', 'universal', 'offensive',
  'Carbon 18K Aluminum', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/nox-at10-genius-attack-18k-alum-2026.png',
  'Utocny diamond s 18K karbonem a hlinikovou impregnaci. Exploze sily pri zachovani citu. Prodlouzeny grip pro obourucni bekhend, Pulse System pro tlumeni vibraci.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 5. Siux Diablo Pro Night Blue 2026 – aggressive teardrop
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Siux', 'Diablo Pro Night Blue 2026', 8490, 365, 'head_heavy', 'teardrop', 'medium',
  84, 87, 87, 'advanced', 'universal', 'offensive',
  'Carbon 24K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/siux-diablo-pro-night-blue-2026.png',
  'Hybridni zbran pro pokrocile hrace. Kapkovy tvar s 24K karbonem — explozivni pri utoku, stabilni a presny v obrane. Stredne tvrdy pocit s vybornym odrazem.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 6. Adidas Cross IT CTRL 2026 – pro round control
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Adidas', 'Cross IT CTRL 2026', 8990, 367, 'balanced', 'round', 'medium',
  92, 75, 90, 'advanced', 'universal', 'defensive',
  'Carbon Aluminized 15K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/adidas-cross-it-ctrl-2026.png',
  'Kontrolni raketa z top rady Adidas pro pokrocile a profesionalni hrace. Presnost bez ztraty razance u site. Dynamic Air Flow, Spin Blade povrch a prodlouzeny grip.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 7. Adidas Match Black Lime 2026 – beginner-friendly diamond
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Adidas', 'Match Black Lime 2026', 1990, 367, 'head_heavy', 'diamond', 'soft',
  64, 58, 49, 'beginner', 'universal', 'universal',
  'Fiberglass', 'Fiberglass',
  2026, 'https://www.padelful.com/images/rackets/adidas-match-black-lime-2026.png',
  'Cenove dostupny diamant pro zacatecniky. Sklolaminatovy povrch a mekke EVA jadro pro pohodli a snadnou silu. Odpoustejici raketa idealni pro prvni kroky na kurtu.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 8. Wilson Bela V3 2025 – accessible diamond, mid-price
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Wilson', 'Bela V3 2025', 5290, 370, 'head_heavy', 'diamond', 'medium',
  89, 82, 91, 'advanced', 'universal', 'offensive',
  'Carbon 3K', 'Carbon',
  2025, 'https://www.padelful.com/images/rackets/wilson-bela-v3-2025.png',
  'Pristupnejsi verze Bela Pro. Jasny utocny profil se stabilitou a velkym sweet spotem na diamond tvar. Skvely smash, vhodny i pro delsi zapasy.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 9. Siux Electra Elite 6 2026 – aggressive teardrop
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Siux', 'Electra Elite 6 2026', 6190, 365, 'head_heavy', 'teardrop', 'medium',
  86, 85, 74, 'advanced', 'universal', 'offensive',
  'Carbon 3K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/siux-electra-elite-6-2026.png',
  'Utocna kapka pro pokrocile hrace. Explozivni udery a iniciativa u site. Vyborne voleje, smase a bandeji. Vyzaduje dobrou techniku pro obrannou hru.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 10. StarVie Raptor 2026 Plus – round control, intermediate+
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('StarVie', 'Raptor 2026 Plus', 7490, 357, 'balanced', 'round', 'medium',
  90, 79, 92, 'intermediate', 'universal', 'universal',
  'Carbon 3D', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/star-vie-raptor-2026-plus.png',
  'Premia kulata raketa pro hrace, kteri vyzaduji kontrolu a presnost. Siroky sweet spot, Anti-Vibe konstrukce a nastavitelne vyvazeni Dynamic Star.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 11. Adidas RX Series 2026 – intermediate teardrop, affordable
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Adidas', 'RX Series 2026', 2990, 367, 'balanced', 'teardrop', 'soft',
  70, 68, 70, 'intermediate', 'universal', 'universal',
  'Fiberglass', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/adidas-rx-series-2026.png',
  'Vyvazena raketa pro stredne pokrocile hrace. Komfort a snadna sila bez agresivniho chovani. Odpoustejici od prvniho micku, zamerena na hratelnost a konzistenci.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 12. Adidas Arrow Hit CTRL 2026 – premium round control
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Adidas', 'Arrow Hit CTRL 2026', 9990, 367, 'balanced', 'round', 'medium',
  89, 75, 92, 'advanced', 'universal', 'defensive',
  'ASC Carbon', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/adidas-arrow-hit-ctrl-2026.png',
  'Premiova kontrolni raketa s nastavitelnym vyvazenim. Presnost, komfort a stedy sweet spot. Idealni pro takticky styl hry a trpelive budovani bodu.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 13. Oxdog Ultimate Pro+ 2026 – hard diamond, max power
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Oxdog', 'Ultimate Pro+ 2026', 8990, 370, 'head_heavy', 'diamond', 'hard',
  94, 98, 84, 'advanced', 'universal', 'offensive',
  'HES Carbon', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/oxdog-ultimate-pro-plus-2026.png',
  'Stvorena pro agresivni hrace, kteri zrychlují kazdy mic. Tvrdé EVA jadro a HES Carbon pro maximalni razanci. Vynikajici voleje a explozivni smase. Vyzaduje cistou techniku.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 14. Siux Trilogy Pro Ash Green 2026 – round control specialist
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Siux', 'Trilogy Pro Ash Green 2026', 8690, 365, 'balanced', 'round', 'medium',
  97, 75, 90, 'advanced', 'universal', 'defensive',
  'Carbon 24K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/siux-trilogy-pro-ash-green-2026.png',
  'Kontrolni specialista s nejvyssim ratingem kontroly (9.7/10). Presnost a stabilita pro pokrocile hrace, kteri stavi body trpelive. Setrna k ruce i pri delsich zapasech.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 15. Adidas Metalbone Carbon CTRL 2026 – control Metalbone
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Adidas', 'Metalbone Carbon CTRL 2026', 6490, 367, 'balanced', 'round', 'soft',
  86, 69, 84, 'advanced', 'universal', 'defensive',
  'Carbon 6K', 'Carbon',
  2026, 'https://www.padelful.com/images/rackets/adidas-metalbone-carbon-ctrl-2026.png',
  'Kontrolni verze ikonickeho Metalbone. Zivy odraz mice a odpoustejici pocit v premiovem baleni. Vynika v presnosti, komfortu a manévrovatelnosti misto hrube sily.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 16. Nox AT10 Luxury Genius 18K Alum 2026 – premium teardrop, Agustin Tapia signature
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Nox', 'AT10 Luxury Genius 18K Alum 2026', 9275, 367, 'balanced', 'teardrop', 'medium',
  83, 79, 88, 'advanced', 'universal', 'universal',
  '18K Aluminum Carbon Fiber', '100% Carbon Fiber',
  2026, 'https://www.padelful.com/images/rackets/nox-at10-luxury-genius-18k-alum-2026-agustin-tapia.png',
  'Premiova kapkova raketa Agustina Tapii s 18K karbonem a hlinikovou upravou. Vynikajici sweet spot, vicevrstve MLD Black EVA jadro a Pulse System pro tlumeni vibraci. Spolehlivy cit pro narocne hrace.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 17. Nox AT10 Luxury Genius 12K Alum Xtrem 2026 – offensive teardrop, Agustin Tapia
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Nox', 'AT10 Luxury Genius 12K Alum Xtrem 2026', 7250, 367, 'balanced', 'teardrop', 'medium',
  86, 89, 88, 'advanced', 'universal', 'offensive',
  '12K Alum Xtrem Carbon Fiber', 'Carbon Fiber',
  2026, 'https://www.padelful.com/images/rackets/nox-at10-luxury-genius-12k-alum-xtrem-2026-agustin-tapia.png',
  'Utocna kapkova raketa z rady Agustina Tapii s 12K karbonem a hlinikovou impregnaci. Nastavitelne vyvazeni, HR3 Black EVA jadro a Dual Spin povrch pro rotaci. Sila i kontrola v jednom.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 18. Nox VK10 Ventus Control 12K 2026 – round control, Aranzazu Osoro signature
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Nox', 'VK10 Ventus Control 12K 2026', 7500, 367, 'balanced', 'round', 'medium',
  89, 77, 85, 'advanced', 'universal', 'defensive',
  '12K Xtrem Carbon Fiber', '100% Carbon Fiber',
  2026, 'https://www.padelful.com/images/rackets/nox-vk10-ventus-control-12k-2026-aranzazu-osoro.png',
  'Kontrolni kulata raketa Aranzazu Osoro s 12K Xtrem karbonem. Maximalni presnost, MLD Black EVA jadro a Pulse System pro eliminaci vibraci. Idealni pro takticky a defenzivni styl hry.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 19. Nox Ventus Hybrid 12K Lite 2026 – lightweight round, versatile
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Nox', 'Ventus Hybrid 12K Lite 2026', 7050, 360, 'balanced', 'round', 'medium',
  86, 80, 85, 'advanced', 'universal', 'universal',
  '12K Xtrem Carbon Fiber', '100% Carbon Fiber',
  2026, 'https://www.padelful.com/images/rackets/nox-ventus-hybrid-12k-lite-2026.png',
  'Lehka a vsestrana kulata raketa s 12K Xtrem karbonem. Vynikajici manévrovatelnost, siroky sweet spot a MLD Black EVA jadro. Sofistikovana kombinace komfortu, kontroly a rychle manipulace.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;

-- 20. Nox AT10 Genius Attack 12K Alum Xtrem 2026 – diamond power, max attack
INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness,
  control_rating, power_rating, sweet_spot_size, player_level, player_position,
  play_style, material_face, material_frame, year, image_url, description, is_active)
VALUES ('Nox', 'AT10 Genius Attack 12K Alum Xtrem 2026', 8700, 367, 'head_heavy', 'diamond', 'medium',
  91, 100, 80, 'advanced', 'universal', 'offensive',
  '12K Alum Xtrem Carbon Fiber', 'Carbon Fiber',
  2026, 'https://www.padelful.com/images/rackets/nox-at10-genius-attack-12k-alum-xtrem-2026.png',
  'Maximalne utocny diamant s perfektnim hodnocenim sily 10/10. HR3 Black EVA jadro, Dual Spin povrch a fotochromicky lak. Stvorena pro agresivni zakonceni a dominanci u site.',
  true)
ON CONFLICT (brand, model, year) DO NOTHING;
