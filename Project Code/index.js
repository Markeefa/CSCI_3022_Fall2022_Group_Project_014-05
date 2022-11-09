const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');
const pgPromise = require('pg-promise');

const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

db.connect()
    .then(obj => {
        console.log('Database connection successful');
        obj.done();
    })
    .catch(error => {
        console.log('ERROR:', error.message || error)
    });

app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (req,res) => {
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.get('/posting', (req, res) => {
    res.render('pages/posting');
});

app.post('/register', async (req, res) => {
    if(req.body.password!=req.body.password_confirm){
        console.log("Passwords do not match!");
        res.redirect('register');
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'insert into users (first_name, last_name, email, username, password) values ($1, $2, $3, $4, $5);';
    db.any(query, [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.username,
        hash
    ])
    .then(function (data) {
        res.redirect('login');
    })
    .catch(function (err) {
        console.log(err);
        res.redirect('register');
    });
});

app.post('/posting', (req, res) => {
    req.session.user;
    const query = 'insert into things (user_posted_id, title, description, year, month, day, image_url, upvotes, downvotes, category)values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    db.any(query, [
        0,
        //req.session.user.user_id,
        req.body.title,
        req.body.description,
        0,
        0,
        0,
        req.body.image_url,
        0,
        0,
        req.body.category,
    ])
    .then(function (data) {
        res.redirect('register');
    })
    .catch(function (err) {
        console.log(err);
        res.redirect('posting');
    });
});

//commented out for testing purposes 

// const auth = (req, res, next) => {
//     if (!req.session.user) {
//         req.session.message = "Please Register";
//         return res.redirect('/register');
//     }
//     next();
// };

// app.use(auth);

app.listen(3000);
console.log('Server is listening on port 3000');