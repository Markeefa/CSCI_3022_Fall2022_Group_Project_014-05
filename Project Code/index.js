app.get('/register', (req, res) => {
    res.render('pages/register');
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
  