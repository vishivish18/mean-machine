var router = require('express').Router()
var Vehicle = require('../../models/vehicle')
var config = require ('../../config')



//router.use here will fire with all the /api/vehicle calls

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/',function(req,res,next){

  var vehicle = new Vehicle ({device_id: req.body.dev_id, vehicle_number:req.body.v_number,
  	driver_name:req.body.driver_name, sos_number:req.body.sos_number})
  
    vehicle.save(function(err,user){
      if(err){ 
        return res.status(500).send(err);        
      }      
        // res.send(201)
        res.json(vehicle);

    })
  })


router.get('/',function(req,res,next){
  Vehicle.find()
	  .sort('-date')
	  .exec(function (err, vehicle) {
	    if (err) { return next(err) }
	    res.json(vehicle)
  	})

    
  })




module.exports = router