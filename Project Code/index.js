
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
// /item

app.get('/item/:thing_id', (req, res) => {
  const thingId = parseInt(req.params.thing_id);
  const query = "DROP VIEW IF EXISTS myReviews; CREATE VIEW myReviews AS SELECT reviews.review_id, reviews.user_posted_id, reviews.review, reviews.val, reviews.year, reviews.month, reviews.day, things.thing_id, things.title, things.description, things.category, things.upvotes, things.downvotes, things.image_url FROM reviews INNER JOIN things ON reviews.thing_reviewed_id = things.thing_id; SELECT * FROM myReviews WHERE thing_id = $1;"
  var reviews = []; 
  db.any(query, [thingId])
      .then(function (data) {
          data.forEach(function (thing) {
            const reviewConst = {
              review_id: thing.review_id,
              user_posted_id: thing.user_posted_id,
              review: thing.review,
              val: thing.val,
              year: thing.year,
              month: thing.month,
              day: thing.day
            };
            reviews.push(reviewConst)
          })
          console.log(reviews);
          res.render('pages/Items', {
            thingData: data,
            reviews: reviews
          });
      })
      .catch(function (err) {
          console.log(err);
          res.redirect('/');
      })
});

app.post('/addReview', (req, res) => {
    const query = 'INSERT INTO reviews (description,review,val) values ($1, $2, $3);';
    db.any(query, [req.body.newreviewInput, req.body.vote, req.body.SubmitID])
        .then(function (data) {
            console.log("Successfully added review");
            res.redirect('/profile');
        })
        .catch (function (err) {
            console.log(err);
            res.redirect('/');
        })
});


//Make sure server is listening for client requests on port 3000
app.get('/register', (req, res) => {
    res.render('pages/register');
});


app.post('/register', async (req, res) => {
    const query0 = 'select * from users where username = $1';
    db.any(query0, [req.body.username]).then(async function(data) {
        if(data[0]!=undefined){
            console.log('Username is taken');
            res.redirect('register');
        }else{
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
        }
        }
    });
});


app.post('/posting', (req, res) => {
    req.session.user;
    let day=new Date().getDate()
    let month=new Date().getMonth()+1
    let year=new Date().getFullYear()
    const query = 'insert into things (user_posted_id, title, description, year, month, day, image_url, upvotes, downvotes, total_votes, category)values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
    db.any(query, [
        req.session.user.user_id,
        req.body.title,
        req.body.description,
        year,
        month,
        day,
        req.body.image_url,
        0,
        0,
        0,
        req.body.category
    ])
    .then(function (data) {
        res.redirect('home');
    })
    .catch(function (err) {
        console.log(err);
        res.redirect('posting');
    });
});

const auth = (req, res, next) => {
    if (!req.session.user) {
        req.session.message = "Please Register";
        return res.redirect('/register');
    }
    next();
};

app.use(auth);

const cloudName = "hzxyensd5"; // replace with your own cloud name
const uploadPreset = "aoh4fpwm"; // replace with your own upload preset

// Remove the comments from the code below to add
// additional functionality.
// Note that these are only a few examples, to see
// the full list of possible parameters that you
// can add see:
//   https://cloudinary.com/documentation/upload_widget_reference



app.get('/posting', (req, res) => {
    res.render('pages/posting');
});

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

app.get('/profile/:username/posts', (req, res) => {
    const query = 'SELECT thing_id, title, description, image_url, upvotes, total_votes, year, month, day FROM things WHERE user_posted_id = (SELECT user_id FROM users WHERE username = $1);';
    db.any(query, req.params.username)
        .then(function (data) {
            console.log(data);
            res.render('pages/posts', {
                username: req.params.username,
                reviews: data
            });
        })
        .catch(function (err) {
            console.log(err);
            res.redirect('/');
        })
});

app.get('/profile/:username', (req, res) => {
    const query = 'DROP VIEW IF EXISTS myReviews; CREATE VIEW myReviews AS SELECT reviews.review_id, reviews.user_posted_id, reviews.review, reviews.val, reviews.year, reviews.month, reviews.day, things.thing_id, things.title, things.image_url FROM reviews INNER JOIN things ON reviews.thing_reviewed_id = things.thing_id; SELECT * FROM myReviews WHERE user_posted_id = (SELECT user_id FROM users WHERE username = $1);';

    if (req.params.username == req.session.user.username) {
        res.redirect('/profile');
    } else {
        db.any(query, req.params.username)
        .then(function (data) {
            res.render('pages/profile', {
                username: req.params.username,
                isSelf: false,
                reviews: data
            });
        })
        .catch(function (err) {
            console.log(err);
            res.redirect('/');
        })
    }
    
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
    
    let day=new Date().getDate()
    let month=new Date().getMonth()+1
    let year=new Date().getFullYear()
    const query = 'UPDATE reviews SET review = $1, val = $2, day = $4, month = $5, year = $6 WHERE review_id = $3';
    db.any(query, [req.body.reviewInput, req.body.vote, req.body.SubmitID, day, month, year])
        .then(function (data) {
            console.log("Successfully updated");
            res.redirect('/profile');
        })
        .catch (function (err) {
            console.log(err);
            res.redirect('/');
        })
});
app.post('/search', (req, res) => {
    const query = 'SELECT * FROM things WHERE UPPER(TITLE) LIKE UPPER($1);';
    db.any(query, [req.body.searchThing]).then(data=>{
        res.render('pages/search', {data:data});
    });
});
app.get('/categories', (req, res) => {
    const query = 'select * from things order by thing_id desc';
    db.any(query).then(data => {
        res.render('pages/categories', {data:data});
    });
});
app.post('/categories', (req, res) => {
    const query = 'select * from things where category = $1 order by thing_id desc';
    db.any(query, [req.body.category]).then(data => {
        res.render('pages/categories', {data:data});
    });
});
app.get('/home', (req, res) => {
    const query = 'select * from things order by thing_id desc';
    db.any(query).then(data => {
        res.render('pages/home', {data:data});
    });
});
app.get('/trending', (req, res) => {
    // const query = 'select *,upvotes+downvotes as totvotes from things group by upvotes,downvotes';
    const query = 'select * from things order by total_votes desc';
    db.any(query).then(data => {
        res.render('pages/trending', {data:data});
    });
});

app.listen(3000);
console.log('Server is listening on port 3000');
