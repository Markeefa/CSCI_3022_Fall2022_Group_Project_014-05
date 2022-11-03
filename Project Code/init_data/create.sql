CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    password char(60) NOT NUll
);
CREATE TABLE things(
    thing_id SERIAL PRIMARY KEY,
    user_posted_id VARCHAR(50) NOT NULL,
    Title VARCHAR(50) PRIMARY KEY,
    description VARCHAR(200),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    image_url VARCHAR(200) NOT NULL
    upvotes INTEGER,
    downvotes INTEGER
);
CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    user_posted_id VARCHAR(50) NOT NULL,
    thing_reviewed_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    review VARCHAR(500) NOT NULL,
    upvotes INTEGER,
    downvotes INTEGER
);
