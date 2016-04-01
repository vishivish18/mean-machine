var router = require('express').Router()
var User = require('../../models/user')
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
var config = require('../../../config')


router.post('/', function(req, res, next) {


    User.findOne({
            username: req.body.username
        })
        .select('password')
        .exec(function(err, user) {
            //it gets a user instance which does not have a username property . Why ?
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.send(401)
            }

            bcrypt.compare(req.body.password, user.password, function(err, valid) {
                if (err) {
                    return next(err)
                }
                if (!valid) {
                    return res.send(401)
                }
                //var test = {username:user.username};
                //console.log(user.username);
                var token = jwt.encode({
                    username: req.body.username
                }, config.secret)
                console.log(token);
                res.json(token)

            })

        })
})



module.exports = router
