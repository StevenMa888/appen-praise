const mongoose = require('mongoose')

const AppenPraiseScheme = mongoose.Schema({
    user_name: String,
    text: String,
    nominee: String
})

module.exports = mongoose.model('AppenPraise', AppenPraiseScheme)