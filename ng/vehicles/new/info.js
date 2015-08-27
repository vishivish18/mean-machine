angular.module('app')
.controller('VehiclesCtrl',function($scope,$http){ 
 

$scope.saveVehicleDetails = function(){
	console.log("in controller 2")
	console.log($scope.dev_id + $scope.v_number)
	 

	$http.post('/api/vehicle',{
		dev_id: $scope.dev_id,
        v_number: $scope.v_number                        
	})
	.then(function(response) {
	    console.log(response)
	  }, function(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });
	
}
 
 
 
})

 