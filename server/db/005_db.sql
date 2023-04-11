ALTER TABLE tweets ADD timestamp timestamp;

ALTER TABLE users ADD name_tag VARCHAR(255);

CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  address VARCHAR(255),
  name VARCHAR(255),
  tweet_id INT REFERENCES tweets(id),
  user_id INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255),
  timestamp timestamp,
  user_id INT REFERENCES users(id),
  tweet_id INT REFERENCES tweets(id)
);

CREATE TABLE IF NOT EXISTS retweets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  tweet_id INT REFERENCES tweets(id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  tweet_id INT REFERENCES tweets(id)
);