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
    username VARCHAR(50) NOT NULL,
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
INSERT INTO users (username, email, first_name, last_name, password) values ('reda', 'reda.razza@colorado.edu', 'Reda', 'Razza', '$2b$10$8GAQwIFOXeoiyNTrF.7BLuBwX7fX65w7Y0TwlrCYWgxDBGmzlvT5C');
INSERT INTO things (username, user_posted_id, title, description, year, month, day, image_url, upvotes, downvotes, total_votes, category) values 
    ('reda', 1, 'Black Chair', 'A refined take of the classic chair, with a modern black look.', 2022, 11, 11, 'https://www.ikea.com/us/en/images/products/stefan-chair-brown-black__0727320_pe735593_s5.jpg?f=s', 1, 0, 1, 'objects'), 
    ('reda', 1, 'Red Chair', 'An abnormal red chair, probably for children', 2022, 11, 11, 'https://www.ikea.com/us/en/images/products/mammut-childrens-chair-indoor-outdoor-red__0727924_pe735940_s5.jpg?f=s', 0, 1, 1, 'objects'), 
    ('reda', 1, 'Cool Face', 'Such a cool looking face', 2022, 11, 20, 'https://i.pinimg.com/originals/e2/5f/f2/e25ff237663f4c0e1a03faa1e7bfc2c2.jpg', 0, 0, 0, 'meme'), 
    ('reda', 1, 'Paris', 'The land of the Eiffel Tower, and baguettes.', 2022, 11, 21, 'https://i.natgeofe.com/n/41db9fb7-93e6-4d40-8838-71db6d0b057f/02_Europe_square.jpg', 0, 0, 0, 'location'), 
    ('reda', 1, 'Mega Rayquaza', 'The coolest looking Pokemon', 2022, 11, 21, 'https://img.pokemondb.net/artwork/large/rayquaza-mega.jpg', 1, 0, 1, 'animal'), 
    ('reda', 1, 'The Future', 'Tomorrow is coming', 2022, 11, 25, 'https://miro.medium.com/max/1400/1*IPB1WB5fFubOwSiMO3jfrg.jpeg', 0, 0, 0, 'ideas'), 
    ('reda', 1, 'Hot Dog', 'The classic Glizzy', 2022, 11, 25, 'https://deliverlogic-common-assets.s3.amazonaws.com/editable/images/chowcall/menuitems/3424.png', 0, 0, 0, 'Food'), 
    ('reda', 1, '????', 'Whatever this is', 2022, 11, 30, 'https://static.designboom.com/wp-content/dbsub/410172/2022-10-18/banff-extraterrestrial-park-5-634e266d0dc5a.jpg', 0, 0, 0, 'something else'), 
    ('reda', 1, 'Ice Cream', 'Sometimes known as Bing Chilling', 2022, 11, 30, 'https://joyfoodsunshine.com/wp-content/uploads/2020/06/homemade-chocolate-ice-cream-recipe-7.jpg', 0, 0, 0, 'Food'),
    ('reda', 1, 'Bunny Rabbit', 'Just a cute bunny hehe', 2022, 12, 1, 'https://www.rd.com/wp-content/uploads/2020/04/GettyImages-694542042-e1586274805503.jpg', 0, 0, 0, 'animal');

INSERT INTO reviews(user_posted_id, thing_reviewed_id, year, month, day, val, review) values
    (1,1, 2022, 11, 12, 1, 'I LOVE this chair!'),
    (1,2, 2022, 11, 13, 0, 'I HATE THIS CHAIR!!!!'),
    (1, 5, 2022, 11, 21, 1, 'Good!');