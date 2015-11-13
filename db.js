var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_krgxbkw9:onlinemongo_2015@ds053954.mongolab.com:53954/heroku_krgxbkw9',function(){
	console.log('mongodb connected');
})

module.exports = mongoose;

