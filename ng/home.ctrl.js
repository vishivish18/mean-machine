angular.module('app')
.controller('HomeCtrl',function($scope,$http){ 
  	

	$scope.setup = function(){
	 
	$http.get('/api/vehicle')
	.then(function(response) {
	   	$scope.model = response.data;

	  }, function(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });
	
	 }

	 $scope.setup();


	 $scope.markOnMap = function(value){
	 	console.log(value.device_id);
	 	$http.get('/api/vehicle/location/'+value.device_id)
	 	.then(function(response) {
	   		console.log(response)

		  }, function(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });

	 }


 
})

 