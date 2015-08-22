var express = require('express');
var bodyParser = require('body-parser');
var User = require('./models/user')
var app = express();
var jwt = require('jwt-simple')
var _ = require('lodash')
var bcrypt =require('bcrypt')


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var secretkey = "supersecretkey"


app.post('/session', function(req,res,next){
	console.log(req.body.username);
	
	User.findOne({username: req.body.username})
	.select('password')
	.exec(function(err,user){
		//it gets a user instance which does not have a username property . Why ?
		if(err) {return next(err)}
		if(!user) { return res.send(401) }
		
		bcrypt.compare(req.body.password,user.password, function(err,valid){
			if(err){ return next(err)}
			if(!valid){return res.send(401)}
			//var test = {username:user.username};
			//console.log(user.username);
			var token = jwt.encode({username:req.body.username},secretkey)
			res.json(token)

		})

	})
})


app.get('/user', function(req,res,next){
var token = req.headers['x-auth']
console.log(token)
var auth = jwt.decode(token,secretkey)
//console.log(auth)
User.findOne({username:auth.username},function(err,user){
	res.json(user)
})
})


app.post('/user',function(req,res){
	var user = new User({username:req.body.username})
	bcrypt.hash(req.body.password,10,function(err,hash){
		user.password = hash
		user.save(function(err,user){
			if(err){throw next(err)}
				// res.send(201)
				res.json(user);
		})
	})

})



app.listen(3000)

