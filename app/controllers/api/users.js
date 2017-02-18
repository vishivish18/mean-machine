var router = require('express').Router()
var User = require('../../models/user')
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
var config = require('../../../config/config.js')
var users;


users = {
    signup: function(req, res, next) {
        var user = new User({
            name: req.body.name,
            username: req.body.username
        })
        bcrypt.hash(req.body.password, 10, function(err, hash) {
            user.password = hash
            user.save(function(err, user) {
                if (err) {
                    console.error(err)
                } /*throw next(err)   next is coming undefined, even why ? /*/
                // res.send(201)
                res.json(user);

            })
        })


    },
    session: function(req, res, next) {
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
                    var token = jwt.encode({
                        username: req.body.username
                    }, config.secret)
                    console.log(token);
                    res.json(token)

                })

            })
    },
    signin: function(req, res, next) {
        if (!req.headers['x-auth']) {
            return res.send(401, "You must send a valid header")
        }
        var auth = jwt.decode(req.headers['x-auth'], config.secret)
        User.findOne({
            username: auth.username
        }, function(err, user) {
            if (err) {
                return next(err)
            }
            res.json(user)
        })
    },
    signout: function(req, res, next) {
        // WIP, currently logout functionality is handeled on front end
        // Should add a route on the backend too.
        res.send('WIP: This feature is not built yet')
    }
}


module.exports = users
