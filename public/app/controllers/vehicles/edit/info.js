angular.module('app')
.controller('VehiclesEditInfoCtrl',function($scope,$http,$location,$routeParams){ 
 

$scope.setup = function(){
	console.log($routeParams)
	$http.get('/api/vehicle/'+$routeParams.deviceId)
	.then(function(response) {
	    $scope.model = response.data;
	    console.log($scope.model)

	  }, function(response) {
	    console.log(response)
	  });
	
}

$scope.setup();
 
 
 
})

 