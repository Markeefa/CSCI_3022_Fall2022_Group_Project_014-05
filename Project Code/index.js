
const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { request } = require('express');

const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

// User setup
const userConst = {
    user_id: undefined,
    username: undefined,
    first_name: undefined,
    last_name: undefined,
    email: undefined,
};
  
// test your database
db.connect()
    .then(obj => {
      console.log('Database connection successful'); // you can view this message in the docker compose logs
      obj.done(); // success, release the connection;
    })
    .catch(error => {
      console.log('ERROR:', error.message || error);
});

// Set the view engine to EJS
app.set('view engine', 'ejs');
    
//Specify the usage of JSON fro parsing request body
app.use(bodyParser.json());

//Initialize session variables
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

//Redirect to the login page
app.get('/', (req, res) =>{
    res.redirect('/login'); 
  });

//login page
app.get('/login', (req, res) => {
    //the logic goes here
    res.render("pages/login")
  });

// POST /login
app.post('/login', async (req, res) => {
    //the logic goes here
  //  const decrypt_passwd = await bcrypt.hash(req.body.password, 10);

    //const query = "SELECT * from users where users.email = $1 and users.password = $2", 

    db.one("SELECT * from users where users.username = $1;",[req.body.username])
        .then(async user => {
        const match = await bcrypt.compare(req.body.password, user.password);
        
        if (!match){
            throw Error("Incorrect username or password");
        }
        else{
            userConst.user_id = user.user_id;
            userConst.username = user.username;
            userConst.first_name = user.first_name;
            userConst.last_name = user.last_name;
            userConst.email = user.email;

            req.session.user = userConst;
            req.session.save();
            res.redirect("/profile");
        }

        })

        .catch(function (err) {
            //res.send(err.message)
            console.log(err.message);
            res.redirect("/login");
          });

});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("pages/login");
});

// GET /Items
app.get('/items', (req, res) => {
  const query = "SELECT title, image_url,category, description,upvotes from things;"
   db.any(query)
      .then(function (data) {
          //console.log(data);
          res.render('pages/Items', {
              title: req.title,
              image_url: req.title,
              category: req.category,
              description: req.category,
              upvotes: req.upvotes,
              reviews: data
          });
      })
      .catch(function (err) {
          console.log(err);
          res.redirect('/');
      })
});

//POST Items
app.post('/items', (req, res) => {
  const query = ""

  db.any(query)
  .then
})

//Make sure server is listening for client requests on port 3000
=======
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
    }else{
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
        console.log("successfully registered");
        res.redirect('/');
    })
    .catch(function (err) {
        console.log(err);
        res.redirect('/register');
    });
}});

app.post('/posting', (req, res) => {
    req.session.user;
    let day=new Date().getDate()
    let month=new Date().getMonth()+1
    let year=new Date().getFullYear()
    const query = 'insert into things (user_posted_id, title, description, year, month, day, image_url, upvotes, downvotes, category)values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    db.any(query, [
        0,
        //req.session.user.user_id,
        req.body.title,
        req.body.description,
        year,
        month,
        day,
        0,
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

app.get('/profile', (req, res) => {
    const query = 'DROP VIEW IF EXISTS myReviews; CREATE VIEW myReviews AS SELECT reviews.review_id, reviews.user_posted_id, reviews.review, reviews.val, reviews.year, reviews.month, reviews.day, things.thing_id, things.title, things.image_url FROM reviews INNER JOIN things ON reviews.thing_reviewed_id = things.thing_id; SELECT * FROM myReviews WHERE user_posted_id = (SELECT user_id FROM users WHERE username = $1);';
    db.any(query, req.session.user.username)
        .then(function (data) {
            //console.log(data);
            res.render('pages/profile', {
                username: req.session.user.username,
                first_name: req.session.user.first_name,
                last_name: req.session.user.last_name,
                email: req.session.user.email,
                isSelf: true,
                reviews: data
            });
        })
        .catch(function (err) {
            console.log(err);
            res.redirect('/');
        })
});

app.post('/profile', async (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        throw new Error(`Passwords not the same!`);
    }
    
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'UPDATE users SET first_name = $1, last_name = $2, password = $3 WHERE username=$4';
    db.any(query, [req.body.first_name, req.body.last_name, hash, req.session.user.username])
        .then(function (data) {
            console.log("Data successfully updated");
            userConst.first_name = req.body.first_name;
            userConst.last_name = req.body.last_name;

            req.session.user = userConst;
            req.session.save();
            res.redirect('/profile');
        })
        .catch(function (err) {
            console.log(err);
            res.redirect('/profile');
        });

})

app.post('/editReview', (req, res) => {
    const query = 'UPDATE reviews SET review = $1, val = $2 WHERE review_id = $3';
    db.any(query, [req.body.reviewInput, req.body.vote, req.body.SubmitID])
        .then(function (data) {
            console.log("Successfully updated");
            res.redirect('/profile');
        })
        .catch (function (err) {
            console.log(err);
            res.redirect('/');
        })
});

app.get('/home', (req, res) => {
    const query = 'select * from things order by thing_id desc limit 10';
    db.any(query).then(data => {
        res.render('pages/home', {data:data});
    });
});

app.listen(3000);
console.log('Server is listening on port 3000');