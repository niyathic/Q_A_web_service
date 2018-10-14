var express = require('express')
var router = express.Router();
var User = require('./models/users.js');
//var path = require('path');

// Signup
router.get('/signup', function (req, res, next) {
    res.render('signup'); 
})

router.post('/signup', function (req, res, next) {
const username = req.body.username;
const password = req.body.password;
const user = new User({ username: username, password: password });
user.save(function (err, result) {
    if (!err) {
    res.redirect('/');
    } else {
    res.send(err.message);
    }
})
})

// Login
router.get('/login', function (req, res, next) {
res.render('login');
})
router.post('/login', function (req, res, next) {
const username = req.body.username;
const password = req.body.password;
console.log(req.body);
User.findOne({ username: username, password: password }, function (err, result) {
    if (err || !result) { 
    req.session.user = result.username;
    res.send('incorrect credentials SON');
    return;
    }
    if (result.password === password) {
    req.session.user = result.username;
    res.send('hiiiiiiiiiiii u r logged in');
    return;
    }       
})
})

// Logout
router.get('/logout', isAuthenticated, function (req, res, next) {
req.session.user = '';
res.redirect('/');
})

module.exports = router;
