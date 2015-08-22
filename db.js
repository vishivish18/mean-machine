var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/trail_tracker',function(){
	console.log('mongodb connected');
})

module.exports = mongoose;

