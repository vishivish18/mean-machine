var router = require('express').Router()
var Vehicle = require('../../models/vehicle')
var Location = require('../../models/location')
var config = require ('../../config')



//router.use here will fire with all the /api/vehicle calls,
//this will act like a middleware for all routes specific to this.
//This method can be used to secure routes

//need to use auth.js , here check request header is blocking data which is good.
//need to understand how to use auth.js throughout as standard


router.use(function timeLog(req, res, next) {    
  if(req.headers['x-auth'])
    console.log(req.auth.username)
  next();
});

router.post('/',function(req,res,next){

  var vehicle = new Vehicle ({device_id: req.body.dev_id, user_id: req.auth.username, vehicle_number:req.body.v_number,
  	driver_name:req.body.driver_name, sos_number:req.body.sos_number})
  
    vehicle.save(function(err,vehicle){
      if(err){ 
        return res.status(500).send(err);        
      }      
        // res.send(201)
        res.json(vehicle);

    })
  })


router.post('/location/:vehicle_id', function (req, res, next) {
  //res.end(req.params.vehicle_id);

  var location = new Location ({device_id: req.params.vehicle_id, latitude: req.body.latitude, longitude:req.body.longitude,
    speed:req.body.speed})
  
    location.save(function(err,location){
      if(err){ 
        return res.status(500).send(err);        
      }      
        // res.send(201)
        res.json(location);

    })
 
});

router.get('/location/:vehicle_id', function (req, res, next) {
  //res.end(req.params.vehicle_id);
  Location.findOne({device_id:req.params.vehicle_id},function(err,location){
      if(err){return next(err)}
      console.log("this is the location of the vehicle: "+location)              
      res.json(location)      
    })
});





router.get('/',function(req,res,next){

      Vehicle.find({user_id:req.auth.username},function(err,vehicle){
      if(err){return next(err)}
      console.log("this is the user list of vehicles from Vehicle GET: "+vehicle)        
      //console.log(vehicle)
      res.json(vehicle)      
    })

    
})


router.get('/:vehicle_id',function(req,res,next){

      Vehicle.findOne({device_id:req.params.vehicle_id},function(err,vehicle){
      if(err){return next(err)}            
      res.json(vehicle)      
    })

    
})



module.exports = router