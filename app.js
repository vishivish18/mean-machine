var express = require('express');
var router = express.Router();              // get an instance of the express Router


var Post = require('./models/post')
var isAuthenticated = require('./test')
var bodyParser = require('body-parser');
var app = express();



/*app.post('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  console.log(res)
  res.send('User Info');

});*/

/*app.use(function (req, res, next) {
    res.set('Location', '/#' + req.originalUrl)
       .status(301)
       .send();
});*/

// handler for /user/:id which prints the user id
/*app.post('/user/:id', function (req, res, next) {
  res.end(req.params.id);
});


app.get('/hello', isAuthenticated,  function(req, res) {
        
});
*/
//This can be used to identify anytype of request with URL 
/*
app.use('/user/:id', function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
}, function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});*/


app.use('/api/route', router);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(require('./auth'))
app.use('/api/posts',require('./controllers/api/posts'))
app.use('/api/users',require('./controllers/api/users'))
app.use('/api/sessions',require('./controllers/api/sessions'))
app.use('/api/vehicle',require('./controllers/api/vehicle'))
app.use('/',require('./controllers/static'))

var port = process.env.PORT || 3000
var server = app.listen(port, function () {
  console.log('App listening at the ',port);
});

require('./websockets').connect(server)