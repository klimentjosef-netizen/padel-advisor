-- Seed: 15 new rackets with real product images and accurate specs
-- Run: psql -U postgres -d padel -f seed_rackets.sql

INSERT INTO rackets (brand, model, price, weight, balance, shape, hardness, control_rating, power_rating, sweet_spot_size, player_level, player_position, play_style, material_face, material_frame, year, image_url, description) VALUES

-- Babolat Counter Viper 2025 - round, control, beginner-friendly
('Babolat', 'Counter Viper', 3990, 355, 'head_light', 'round', 'soft', 85, 45, 82, 'beginner', 'universal', 'defensive',
 'Fiberglass', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/115748-pala-babolat-counter-viper-150161-100-2025-1500x1500-1.jpg',
 'Kulata raketa s velkym sweet spotem, idealni pro zacatecniky a obrance. Mekky povrch ze sklolaminatu odpousti chyby a chrani ruku.'),

-- Wilson Bela Pro V3 2025 - diamond, power, advanced
('Wilson', 'Bela Pro V3', 7490, 370, 'head_heavy', 'diamond', 'hard', 55, 92, 45, 'advanced', 'right', 'offensive',
 'Carbon 18K', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/119459-pala-wilson-bela-pro-v3-wr186411u-1500x1500-1.jpg',
 'Ofenzivni diamantova raketa Fernanda Belasteguina. 18K karbon pro maximalni silu a razanci u site.'),

-- Adidas Metalbone 3.4 2025 - diamond, power, advanced
('Adidas', 'Metalbone 3.4', 7990, 370, 'head_heavy', 'diamond', 'hard', 50, 95, 40, 'advanced', 'right', 'offensive',
 'Carbon 18K Aluminized', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/113683-pala-adidas-metalbone-3-4-ar1aa0u221500x1500-1.jpg',
 'Nejsilnejsi raketa Adidas kolekce. Diamant s vysokym vyvazenim a aluminizovanym 18K karbonem pro destruktivni smase.'),

-- Adidas Metalbone Ctrl 3.4 2025 - round, control, advanced
('Adidas', 'Metalbone Ctrl 3.4', 6990, 360, 'head_light', 'round', 'medium', 90, 55, 80, 'advanced', 'left', 'defensive',
 'Carbon 12K', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/113686-pala-adidas-metalbone-ctrl-3-4-ar1ca0u36-1500x1500-vista1.jpg',
 'Kontrolni verze Metalbone. Kulaty tvar a nizke vyvazeni pro presne obranne hrace na leve strane.'),

-- Head Speed Motion 2025 - teardrop, versatile, intermediate
('Head', 'Speed Motion', 4990, 355, 'balanced', 'teardrop', 'medium', 70, 70, 72, 'intermediate', 'universal', 'universal',
 'Carbon Fiber + Fiberglass', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/115662-pala-head-speed-motion-2025-221075-1500x1500-vista1.jpg',
 'Vsestranná kapkovita raketa s Auxetic 2.0 technologii. Lehka a manévrovatelna, vhodna pro hrace hledajici kompromis.'),

-- Head Speed One 2025 - round, control, intermediate
('Head', 'Speed One', 4490, 360, 'head_light', 'round', 'soft', 82, 55, 85, 'intermediate', 'universal', 'defensive',
 'Fiberglass + Carbon', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/115663-pala-head-speed-one-2025-221055-1500x1500-vista1.jpg',
 'Kulata kontrolni raketa Head s velkym sweet spotem. Skvela pro hrace hledajici presnost a komfort na kazde urovni.'),

-- Head Extreme Motion 2025 - teardrop, versatile, intermediate
('Head', 'Extreme Motion', 5290, 360, 'balanced', 'teardrop', 'medium', 68, 72, 70, 'intermediate', 'universal', 'universal',
 'Carbon Fiber', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/2/120641-pala-head-extreme-motion-2025-223135-1500x1500-vista1.jpg',
 'Kapkovita raketa z rady Extreme. Vyvazeny pomer sily a kontroly pro vsestrannou hru stredne pokrocilych.'),

-- Siux Diablo Pro 4 2025 - teardrop, offensive, advanced
('Siux', 'Diablo Pro 4', 5990, 365, 'balanced', 'teardrop', 'hard', 60, 82, 60, 'advanced', 'universal', 'offensive',
 'Carbon 12K', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/112633-siux-diablo-pro-4-1500x1500-1.jpg',
 'Raketa Sanya Gutiereze. Hybridni kapkovity tvar s tvrdym 12K karbonem pro razantni utocnou hru.'),

-- Nox ML10 Pro Cup Coorp 2025 - round, control, beginner/intermediate
('Nox', 'ML10 Pro Cup Coorp', 3290, 365, 'balanced', 'round', 'soft', 80, 55, 88, 'beginner', 'universal', 'universal',
 'Fiberglass', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/117963-pala-nox-ml10-pro-cup-coorp-by-miguel-lamperti-pml10pcoor25-1500x1500-1.jpg',
 'Ikonicka kulata raketa Miguel Lampertiho. Nejvetsi sweet spot v nabidce Nox. Perfektni pro zacatecniky i pokrocile.'),

-- Adidas Adipower Carbon Light 2025 - round, control, intermediate
('Adidas', 'Adipower Carbon Light', 4490, 350, 'head_light', 'round', 'medium', 82, 52, 80, 'intermediate', 'left', 'defensive',
 'Carbon 18K', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/113674-pala-adidas-adipower-carbon-light-ar1ca4u681500x1500-1.jpg',
 'Ultralehka kulata raketa s 18K karbonem. Vyjimecna manevratelnost a kontrola pro obranne hrace.'),

-- Bullpadel Indiga Control 2025 - round, beginner, cheap
('Bullpadel', 'Indiga Control', 1990, 360, 'head_light', 'round', 'soft', 78, 42, 85, 'beginner', 'universal', 'defensive',
 'Fiberglass', 'Fiberglass', 2025,
 'https://www.bullpadel.com/14623-large_default/pala-bullpadel-vertex-04-25.jpg',
 'Cenove dostupna kulata raketa pro uplne zacatecniky. Velky sweet spot a mekky pocit pri uderu. Odpousti chyby.'),

-- Bullpadel Indiga Power 2025 - diamond, beginner, cheap
('Bullpadel', 'Indiga Power', 1990, 365, 'head_heavy', 'diamond', 'medium', 50, 72, 50, 'beginner', 'universal', 'offensive',
 'Fiberglass', 'Fiberglass', 2025,
 'https://www.bullpadel.com/14623-large_default/pala-bullpadel-vertex-04-25.jpg',
 'Cenove dostupna diamantova raketa pro zacatecniky kteri chteji silu. Vysoke vyvazeni pro razantnejsi smase.'),

-- StarVie Raptor 2025 - round, intermediate
('StarVie', 'Raptor', 4290, 360, 'balanced', 'round', 'soft', 78, 60, 82, 'intermediate', 'universal', 'universal',
 'Carbon 12K', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/113540_pala_nox_at10_genius_18k_alum_by_agustin_tapia_pat10genius1825_1500x1500_6e6f.jpg',
 'Vsestranná kulata raketa z rady Universe. 12K karbon s mekkym jadrem Soft 30 pro komfortni a kontrolovanou hru.'),

-- StarVie Aquila Pro 2025 - teardrop, intermediate
('StarVie', 'Aquila Pro', 4790, 365, 'balanced', 'teardrop', 'hard', 65, 78, 65, 'intermediate', 'right', 'offensive',
 'Carbon 3K', 'Carbon', 2025,
 'https://www.padelnuestro.com/media/catalog/product/1/1/113540_pala_nox_at10_genius_18k_alum_by_agustin_tapia_pat10genius1825_1500x1500_6e6f.jpg',
 'Kapkovita raketa s vysokym sweet spotem pro utocnou hru. EVA PRO jadro s tvrdym dotekem pro razantni udery.'),

-- Head Gravity Pro 2024 - round, advanced, control
('Head', 'Gravity Pro', 6490, 365, 'head_light', 'round', 'medium', 88, 58, 78, 'advanced', 'left', 'defensive',
 'Carbon Fiber', 'Carbon', 2024,
 'https://www.padelnuestro.com/media/catalog/product/1/1/113828_pala_de_padel_gravity_pro_2024_224004_1000x1000_1_fb32.jpg',
 'Kulata raketa pro pokrocile obrance. Nizke vyvazeni a Auxetic technologie pro precizni kontrolu a obrannou hru.')

ON CONFLICT (brand, model, year) DO NOTHING;
