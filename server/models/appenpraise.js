const mongoose = require('mongoose')

const AppenPraiseScheme = mongoose.Schema({
    praise: String
})

module.exports = mongoose.model('AppenPraise', AppenPraiseScheme)