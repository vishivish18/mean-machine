var db = require('../db')
var location = db.Schema({
	device_id : {type : String, required:true},
	latitude : {type : String, required:true},
	longitude : {type : String, required:true},
	speed : {type : String, required:true},		
	date : {type : Date, required:true, default: Date.now}
})

module.exports = db.model('location',location)