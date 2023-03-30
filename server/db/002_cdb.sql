CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)  NOT NULL,
  email VARCHAR(255) NOT NULL
);

ALTER TABLE tweets ADD user_id INT REFERENCES users (id);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255),
  user_id INT REFERENCES users (id),
  tweet_id INT REFERENCES tweets (id)
);

CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users (id),
  tweet_id INT REFERENCES tweets (id)
);
