const express = require('express');
const app = express();
const userController = require('./controllers/UserController');

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', userController.doGetLogin);

app.get('/register', userController.doGetRegister);

app.listen(3000);