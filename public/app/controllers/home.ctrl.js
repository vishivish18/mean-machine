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


 
})

 