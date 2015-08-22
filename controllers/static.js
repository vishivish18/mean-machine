var express = require('express')
var router = require('express').Router()
var path = require('path')


router.use(express.static(path.resolve('assets')))
/*router.use(express.static(path.resolve('templates')))*/
router.use(express.static(__dirname + '/../templates'))
router.get('/', function (req,res){


	res.sendFile(path.resolve('layouts/app.html'));

})

/*router.get('/', function (req,res){


	res.sendFile(path.resolve('layouts/login.html'));

})*/

/*router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    res.sendFile(path.resolve('layouts/posts.html'));
    console.log(req.body);
    console.log("post received: %s %s", email, password);
});*/



module.exports = router;