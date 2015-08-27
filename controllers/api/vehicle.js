var router = require('express').Router()
var Vehicle = require('../../models/vehicle')
var config = require ('../../config')


router.post('/',function(req,res,next){

  var vehicle = new Vehicle ({device_id: req.body.dev_id, vehicle_number:req.body.v_number})
  
    vehicle.save(function(err,user){
      if(err){ console.error(err)}      
        // res.send(201)
        res.json(vehicle);

    })
  })



module.exports = router