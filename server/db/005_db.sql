ALTER TABLE tweets ADD timestamp timestamp;

ALTER TABLE users ADD name_tag VARCHAR(255);

ALTER TABLE passwords DROP COLUMN user_id;
ALTER TABLE passwords ADD user_id INT REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  address VARCHAR(255),
  name VARCHAR(255),
  tweet_id INT REFERENCES tweets(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255),
  timestamp timestamp,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  tweet_id INT REFERENCES tweets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS retweets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  tweet_id INT REFERENCES tweets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  tweet_id INT REFERENCES tweets(id) ON DELETE CASCADE
);