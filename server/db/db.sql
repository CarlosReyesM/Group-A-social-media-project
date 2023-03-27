CREATE TABLE IF NOT EXISTS tweets (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255) NOT NULL
);

INSERT INTO tweets (content) VALUES ('fist tweet');
INSERT INTO tweets (content) VALUES ('second tweet');
