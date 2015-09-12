var express = require('express');
var router = express.Router();              // get an instance of the express Router


var Post = require('./models/post')
var isAuthenticated = require('./test')
var checkTwo = require('./test')
var bodyParser = require('body-parser');
var app = express();


app.get('/hello', isAuthenticated, checkTwo, function(req, res) {
        res.send('look at me!');
});

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