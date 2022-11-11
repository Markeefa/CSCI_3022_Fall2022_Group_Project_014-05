CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password char(60) NOT NUll
);
CREATE TABLE things(
    thing_id SERIAL PRIMARY KEY,
    user_posted_id VARCHAR(50) NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    image_url VARCHAR(200) NOT NULL,
    upvotes INTEGER,
    downvotes INTEGER,
    category VARCHAR(50) NOT NULL
);
CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    user_posted_id VARCHAR(50) NOT NULL,
    thing_reviewed_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    review VARCHAR(500) NOT NULL
);
