var express = require('express')
var router = express.Router();
var User = require('../models/user');
var isAuthenticated = require('../middlewares/isAuthenticated')

// Account routes under the '/account' route prefix. 
// (i.e. login should be /account/login, signup = /account/signup, 
// logout = /account/logout)

// Signup
router.get('/signup', function (req, res, next) {
    // debug check for all signed up users...
    User.find({}, function (err, results) {
        console.log(results);
    })
    res.render('signup');
})

router.post('/signup', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var user = new User({ username: username, password: password });
    user.save(function (err, results) {
        if (!err) {
            res.redirect('/'); //redirect back to home page
            return;
        } else {
            res.send(err.message);
            return;
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
        if (err) { 
            res.send('incorrect SON! ' + err.message);
            return;
        } if (!result) {
            req.session.isAuthenticated = false;
            res.send('incorrect credentials SON');
            return;
        } if (result.password === password) {
            req.session.user = result.username;
            req.session.isAuthenticated = true;
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
