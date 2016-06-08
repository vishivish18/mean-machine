//create auth.js from this
var jwt = require('jwt-simple')
var config = require('./config')

module.exports = {
    'googleAuth' : {
        'clientID'      : 'Google_Client_ID',
        'clientSecret'  : 'Google_Secret',
        'callbackURL'   : 'Google_Callback_URL'
    }
}
