angular.module('app')
.controller('VehiclesEditMapCtrl',function($scope,$http,$location,$routeParams){ 
 
	$scope.markOnMap = function(lat,long){

	 	var myCenter=new google.maps.LatLng(lat,long);

			function initialize()
			{
			var mapProp = {
			  center:myCenter,
			  zoom:10,
			  mapTypeId:google.maps.MapTypeId.ROADMAP
			  };

			var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);


			var marker=new google.maps.Marker({
			  position:myCenter
			  });

			marker.setMap(map);
			}

			google.maps.event.addDomListener(window, 'load', initialize);

	 }


 
	 $scope.setup = function(){	 		 	
	 	$http.get('/api/vehicle/location/'+$routeParams.deviceId)
	 	.then(function(response) {
	   		console.log(response.data)
	   		$scope.markOnMap(response.data.longitude,response.data.latitude);
	   		

		  }, function(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });

	 }

	 $scope.setup();
 
	 

 
})

 