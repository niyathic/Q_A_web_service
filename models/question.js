var mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    questionText: String 
})

module.exports = mongoose.model('Question', questionSchema);
