var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bot_supply_dashboard',function(){
	console.log('mongodb connected');
})

module.exports = mongoose;


