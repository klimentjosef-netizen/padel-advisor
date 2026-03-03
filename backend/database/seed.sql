INSERT INTO brands (name, logo_url)
VALUES
  ('Bullpadel', 'https://example.com/bullpadel.png'),
  ('Babolat', 'https://example.com/babolat.png'),
  ('Head', 'https://example.com/head.png'),
  ('Nox', 'https://example.com/nox.png')
ON CONFLICT (name) DO NOTHING;
