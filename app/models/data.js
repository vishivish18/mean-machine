var db = require('./db')
var Data = db.model('Data', {
    username: {
        type: String,
        required: true
    },
    field1: {
        type: String,
        required: true
    },
    field2: {
        type: String,
        required: true
    },
    field3: {
        type: String,
        required: true
    },
    field4: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = Data
