var db = require('./db')
var user = db.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    verified: {
        type: Boolean,
        default: false

    }

})

module.exports = db.model('User', user)
