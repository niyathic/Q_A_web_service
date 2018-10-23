var mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    questionText: String,
    author: String,
    answer: String
})

module.exports = mongoose.model('Question', questionSchema);
