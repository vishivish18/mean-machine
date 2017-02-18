// # API routes
var express = require('express'),
    api = require('../controllers'),
    apiRoutes;
var path = require('path')

apiRoutes = function(router) {
    router = express.Router();

    // ## User Auth
    router.post('/users/signup', api.users.signup);
    router.post('/users/session', api.users.session);
    router.get('/users/signin', api.users.signin);
    router.get('/users/signout', api.users.signout);

    
    return router;
};

module.exports = apiRoutes;
