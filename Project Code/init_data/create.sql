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
    user_posted_id INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(300),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    image_url VARCHAR(200) NOT NULL,
    upvotes INTEGER,
    downvotes INTEGER,
    total_votes INT NOT NULL,
    category VARCHAR(50) NOT NULL
);
CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    user_posted_id INT NOT NULL,
    thing_reviewed_id INT NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    -- 1 if upvote, 0 if downvote
    val INTEGER NOT NULL,
    review VARCHAR(500) NOT NULL
);
INSERT INTO users (username, email, first_name, last_name, password) values ('nick', 'e@e.e', 'nick', 'nick', '$2b$10$EYo7O4RazrfhoQN54nmMhuvT4iDXDme66RTKlCdlaFQLGtnuZ5p1O');
INSERT INTO things (user_posted_id, title, description, year, month, day, image_url, upvotes, downvotes, total_votes, category) values (1, 'chair', 'epic', 2022, 11, 11, 'https://www.ikea.com/us/en/images/products/stefan-chair-brown-black__0727320_pe735593_s5.jpg?f=s', 10, 10, 20, 'items'), (1, 'chair2', 'epic', 2022, 11, 11, 'https://www.ikea.com/us/en/images/products/mammut-childrens-chair-indoor-outdoor-red__0727924_pe735940_s5.jpg?f=s', 10, 10, 20, 'items'), (1, 'chair3', 'epic', 2022, 11, 11, 'example.com', 10, 10, 20, 'items'), (1, 'chair4', 'epic', 2022, 11, 11, 'example.com', 10, 10, 20, 'items'), (1, 'chair5', 'epic', 2022, 11, 11, 'example.com', 10, 11, 21, 'items'), (1, 'chair6', 'epic', 2022, 11, 11, 'example.com', 10, 10, 20, 'items'), (1, 'chair7', 'epic', 2022, 11, 11, 'example.com', 10, 10, 20, 'items'), (1, 'chair8', 'epic', 2022, 11, 11, 'example.com', 10, 10, 20, 'items'), (1, 'chair9', 'epic', 2022, 11, 11, 'example.com', 10, 10, 20, 'items'), (1, 'chair10', 'epic', 2022, 11, 11, 'example.com', 10, 10, 20, 'items');
INSERT INTO reviews (user_posted_id, thing_reviewed_id, year, month, day, review, val) values (1, 1, 2022, 11, 13, 'I like chair', 1), (1, 2, 2022, 11, 12, 'I do not like chair', 0);
