var router = require('express').Router()
var users = require('./api/users')
var data = require('./api/data')

module.exports = {
    // Extras
    // init: init,
    // http: http,
    // API Endpoints   
    users: users,
    data: data
};
