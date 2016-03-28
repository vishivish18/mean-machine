var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mean_machine',function(){
	console.log('mongodb connected');
})

module.exports = mongoose;


