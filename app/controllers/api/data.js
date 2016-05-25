var router = require('express').Router()
var Data = require('../../models/data')


//Save details for new data (CREATE)
router.post('/', function(req, res, next) {

    console.log(req.auth.username)
    var data = new Data({
        username: req.auth.username,
        field1: req.body.field1,
        field2: req.body.field2,
        field3: req.body.field3,
        field4: req.body.field4
        
    })

    data.save(function(err, data) {
        if (err) {
            return res.status(500).send(err);
        }
        // res.send(201)
        res.json(data);

    })
})

router.get('/', function(req, res, next) {

    Data.find({
        username: req.auth.username
    }, function(err, data) {
        if (err) {
            return next(err)
        } else {            
            res.json(data)
        }

    })


})


module.exports = router
