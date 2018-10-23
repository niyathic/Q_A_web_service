var express = require('express')
var router = express.Router();
var Question = require('../models/question')

router.get('/getQuestions', function (req, res, next) {
    console.log(req.session.user);
    var questionDb = Question.find({}, function (err, results) {
        if (err) next(err);
        res.json(results);
    })
})

router.post('/addQuestion', function (req, res, next) {
    var { questionText } = req.body; // ES6 shorthand
    var author = req.session.user;
    var dbQ = new Question({ questionText, author }) // ES6 shorthand
    dbQ.save(function (err, result) {
        if (err) next(err);
        res.json({ status: 'OK' })
    })
})

router.post('/answerQuestion', function (req, res, next) {
    /**
     *   Our API route takes the following paramter json object:
     *   { answer:  "some string of  an answer here",
     *   qid: "the _id of the question that's being answered"
     *   }
     *   We will be able to access both of these properties on the req.body object as was the case with /api/addQuestion.
     */
    Question.findById(req.body.qid, function (err, question) {
        question.answer = req.body.answer;
        question.save(function (saveErr, result) {
            if(err) next(err);
            res.json({status: 'OK' })
        })
    })
})

module.exports = router;