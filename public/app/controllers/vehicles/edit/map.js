angular.module('app')
.controller('VehiclesEditMapCtrl',function($scope,$http,$location,$stateParams){ 
 
	$scope.markOnMap = function(lat,long){
		console.log(long)	 	
		$scope.myCenter = new google.maps.LatLng(lat, long);
	 	$scope.mapOptions = {
	 		center:new google.maps.LatLng(lat, long),
			  zoom:10,
			  mapTypeId:google.maps.MapTypeId.ROADMAP
    		  
		}

		$scope.map = new google.maps.Map(document.getElementById('googleMap'), $scope.mapOptions);


			$scope,marker=new google.maps.Marker({
			  position:$scope.myCenter
			  });

			marker.setMap($scope.map);
			}

			

 
	 $scope.setup = function(){	 		 	
	 	console.log($stateParams.id);
	 	$http.get('/api/vehicle/location/'+$stateParams.id)
	 	.then(function(response) {
	   		console.log(response.data)
	   		$scope.model = response.data
	   		$scope.markOnMap(response.data.latitude,response.data.longitude);
	   		

		  }, function(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });

	 }

	 $scope.setup();
 
	 

 
})

 