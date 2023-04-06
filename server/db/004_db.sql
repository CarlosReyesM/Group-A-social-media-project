CREATE TABLE IF NOT EXISTS passwords (
    id SERIAL PRIMARY KEY,
    pssword VARCHAR(255) NOT NULL,
    user_id INT REFERENCES users (id)
);
