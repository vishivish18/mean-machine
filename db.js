var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds053954.mongolab.com:53954/heroku_krgxbkw9',function(){
	console.log('mongodb connected');
})
mongoose.connection.on('open', function (ref) {
  console.log('Connected to Mongo server...');
});

module.exports = mongoose;

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/trail_tracker',function(){
	console.log('mongodb connected');
})

module.exports = mongoose;

*/