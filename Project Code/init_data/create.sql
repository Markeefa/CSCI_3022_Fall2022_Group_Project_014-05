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
    description VARCHAR(300),
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
-- #INSERT INTO users (username, email, first_name, last_name, password) values ('nick', 'e@e.e', 'nick', 'nick', '$2b$10$EYo7O4RazrfhoQN54nmMhuvT4iDXDme66RTKlCdlaFQLGtnuZ5p1O');
-- INSERT INTO things (user_posted_id, title, description, year, month, day, image_url, upvotes, downvotes, category) values (1, 'chair', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair2', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair3', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair4', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair5', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair6', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair7', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair8', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair9', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items'), (1, 'chair10', 'epic', 2022, 11, 11, 'example.com', 10, 10, 'items');