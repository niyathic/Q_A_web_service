// TODO: Import various things...
// - express
// - path
// - body-parser
// - cookie-session
// - mongoose
// - various other file imports
var express = require('express');
var bodyParser = require('body-parser');
var Question = require('./models/question');
var User = require('./models/users.js');
//var path = require('path');
var cookieSession = require('cookie-session');
var router = express.Router();

// instantiate express app...TODO: make sure that you have required express
var app = express();
// instantiate a mongoose connect call
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw5-new')

// set the express view engine to take care of ejs within html files
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(bodyParser.urlencoded({ extended: false }))

var questionsArray = [];

// TODO: set up cookie session ... hint hint: https://github.com/cis197/lecture-examples/blob/master/server-example/server.js#L21


app.get('/', function (req, res, next) {
  // TODO: render out an index.html page with questions (queried from db)
  //       also pass to ejs template a user object so we can conditionally
  //       render the submit box
  console.log(req.session.user);
  var questionDb = Question.find({}, function (err, results) {
    if (!err) {
        res.render('index', { questions: results, user: req.session.user })
    } else {
        res.send(err.message)
    }
})
});

// TODO: set up post route that will 
//       a) check to see if a user is authenticated
//       b) add a new question to the db
//       c) redirect the user back to the home page when done
app.post('/', function (req, res, next) {
  var q = req.body.question;
  var dbQ = new Question({questionText: q});
  dbQ.save(function (err, res) {
    if (!err) {
      res.redirect('/');
    } else {
      res.send("lol u done goofed... " + err.message);
    }
  })
});


// TODO: Set up account routes under the '/account' route prefix. 
// (i.e. login should be /account/login, signup = /account/signup, 
//       logout = /account/logout)


// don't put any routes below here!
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})

// Signup
app.get('/signup', function (req, res) {
  res.render('signup'); 
})
app.post('/signup', function (req, res) {
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
app.get('/login', function (req, res) {
  res.render('login');
})
app.post('/login', function (req, res) {
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
app.get('/logout', function (req, res, next) {
  req.session.user = '';
  res.redirect('/');
})