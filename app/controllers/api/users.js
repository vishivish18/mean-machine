var router = require('express').Router()
var User = require('../../models/user')
var bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
var User = require('../../models/user')
var config = require('../../../config')
var sendgrid = require('sendgrid')("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");


router.get('/', function(req, res, next) {
    /*if (!req.headers('x-auth')){
      return res.send(401)
    }
    #-ERROR-# ==>Property 'headers' of object #<IncomingMessage> is not a function  # Why ?
    */

    var auth = jwt.decode(req.headers['x-auth'], config.secret)
    User.findOne({
        username: auth.username
    }, function(err, user) {
        if (err) {
            return next(err)
        }
        console.log("this is the user from USER GET: " + user)        
        res.json(user)


    })
})

router.get('/validate/:id', function(req, res, next) {

    User.findOne({
        _id: req.params.id
    }, function(err, user) {
        if (err) {
            return next(err)
        }
        console.log("this is the user from USER GET: " + user)
        user.update({ verified: true }, function(err, res) {
            console.log(res);
        })
        res.json(user)


    })
})




router.post('/', function(req, res, next) {
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

            //prepare content for verification email to send to the user on registration

            var verification = "localhost:3000/signup/validate/" + user._id;

            var payload = {
                to: 'vishivish18@gmail.com',
                from: 'bot@meanmachine.com',
                subject: 'Welcome to Mean-Machine ! Confirm your account',
                html: "<a href=\"http:\/\/" + verification + "\">Click Here<\/a> to verify your email address and activate your account "
            }

            sendgrid.send(payload, function(err, json) {
                if (err) { console.error(err); }
                console.log(json);
            });


            res.json(user);

        })
    })

})


module.exports = router
