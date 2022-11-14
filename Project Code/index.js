
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
    res.redirect('/login'); //this will call the /anotherRoute route in the API
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
            req.session.user = {
                api_key: process.env.API_KEY,
              };
              req.session.save();
              res.redirect("/discover");
        }

        })

        .catch(function (err) {
            res.send(err.message)
            res.redirect("/register")
          });

});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("pages/login");
});

<<<<<<< HEAD
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

//commented out for testing purposes 

// const auth = (req, res, next) => {
//     if (!req.session.user) {
//         req.session.message = "Please Register";
//         return res.redirect('/register');
//     }
//     next();
// };

// app.use(auth);

>>>>>>> aab6fd7b3da97dbf2b9255f2e51fb7c90ad8c7c4
app.listen(3000);
console.log('Server is listening on port 3000');