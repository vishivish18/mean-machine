var db = require('../db')
var vehicle = db.Schema({
	device_id : {type : String, required:true},
	vehicle_number : {type : String, required:true},	
	date : {type : Date, required:true, default: Date.now}
})

module.exports = db.model('Vehicle',vehicle)