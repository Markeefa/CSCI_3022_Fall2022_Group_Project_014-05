const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

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

app.get('/profile', (req, res) => {
    res.render('pages/profile', {
        username: req.session.user.username,
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        email: req.session.user.email
      });
});

app.listen(3000);
console.log('Server is listening on port 3000');