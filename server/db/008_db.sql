DROP TABLE IF EXISTS comments;

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255),
  timestamp timestamp,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  tweet_id INT REFERENCES tweets(id) ON DELETE CASCADE
);