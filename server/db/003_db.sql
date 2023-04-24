INSERT INTO users (name, email) VALUES ('Mesi', 'Mesi@email.com');

UPDATE users
SET name = 'Dang Hoang Ha', email = 'ha.dh290702@gmail.com'
WHERE name = 'Mesi' AND email = 'Mesi@email.com';

UPDATE users
SET name_tag = 'hha.2907'
WHERE name = 'Dang Hoang Ha';
