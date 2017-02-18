// # API routes
var express = require('express'),
    api = require('../controllers'),
    apiRoutes;
var path = require('path')

apiRoutes = function(router) {
    router = express.Router();

    // ## User Auth
    router.post('users/signup', api.users.signup);
    router.post('users/session', api.users.session);
    router.get('users/signin', api.users.signin);
    router.get('users/signout', api.users.signout);

    // ## Data
    router.post('data/create', api.data.create);
    //router.get('data/update', api.data.update);
    router.get('data/list', api.data.index);
    //router.delete('data/delete', api.data.delete);
    
    return router;
};

module.exports = apiRoutes;
