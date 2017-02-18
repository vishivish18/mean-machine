var api         = require('./api')  
var config = require('../../config/config.js')
module.exports = {
    apiBaseUri: config.apiBaseUri,
    api: api    
};