var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Question = require('./models/question');
var cookieSession = require('cookie-session');
var accountRoutes = require('./routes/account');
var apiRoutes = require('./routes/api');
var isAuthenticated = require('./middlewares/isAuthenticated');
var mongoose = require('mongoose');

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
app.use(bodyParser.json()); // to accept post data from ajax requests

app.use('/static', express.static(path.join(__dirname, 'static')));

// set up account and api routes
app.use('/account', accountRoutes);
app.use('/api', apiRoutes);

app.get('/', function (req, res, next) {
  // Render out an index.html page with questions (queried from db)
  // also pass to ejs template a user object so we can conditionally
  // render the submit box
  console.log(req.session.user);
  var questionDb = Question.find({}, function (err, results) {
    if (!err) {
        res.render('index', { questions: results, user: req.session.user });
        return;
    } else {
        next(err) // pass in error from db call
        return;
    }
  })
});

// Post route that will 
//       a) check to see if a user is authenticated
//       b) add a new question to the db
//       c) redirect the user back to the home page when done
app.post('/', isAuthenticated, function (req, res, next) {
  var { questionText } = req.body; // ES6 shorthand
  var author = req.session.user;
  var dbQ = new Question({ questionText, author }) // ES6 shorthand
  dbQ.save(function (err, results) {
    if (!err) {
      res.redirect('/');
      return;
    } else {
      res.send("lol u done goofed... " + err.message);
      return;
    }
  })
});


// don't put any routes below here!
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})