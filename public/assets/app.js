angular.module('app',[
'ngRoute'
])
angular.module('app')
.controller('ErrorCtrl',function($scope,$rootScope){ 
$scope.hello = "this is from the controller hello"
 	console.log($scope.hello)
 	
 	
   
})

 
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

 
angular.module('app')
.controller('LoginCtrl',function($scope,UserSvc,$location){
	$scope.login = function(username,password){
		UserSvc.login(username,password)
		.then(function(response){
			console.log("printing response")
			console.log(response.data)
			$scope.$emit('login',response.data)
			$location.path('/home')
			
		})
	}
})
angular.module('app')
    .controller('masterCtrl', function($scope) {
        console.log("hello");
    })

angular.module('app')
.controller('PostsCtrl',function($scope,PostsSvc){ 
  PostsSvc.fetch()
 	.success(function (posts){
 		$scope.posts = posts

 	})
	
 	 $scope.addPost = function () {
          if ($scope.postBody) {
            PostsSvc.create({
              /*username: 'vishalRanjan',*/
              body:     $scope.postBody              
            }).success(function (post) {
              //$scope.posts.unshift(post)
              $scope.postBody = null
            })
          }
        }

    $scope.$on('ws:new_post',function(_,post){
    $scope.$apply(function(){
      $scope.posts.unshift(post)
    })
  })
 
})

 
angular.module('app')
.service('PostsSvc', function($http){
   this.fetch = function () {   	
     return $http.get('/api/posts')
   }
   this.create = function (post){
   	
      return $http.post('/api/posts',post)
   }
 })
angular.module('app')
.controller('RegisterCtrl',function($scope,UserSvc ,$location){
	$scope.register = function(name,username,password){
		UserSvc.register(name,username,password)
		.then(function(response){			
			$scope.$emit('login',response.data)
			$location.path('/home')
		})
		.catch(function (err){
			console.log(err)
		})
	}

})

angular.module('app')
.config(function($routeProvider,$locationProvider) {
	$routeProvider
	.when('/',{controller:'LoginCtrl',templateUrl:'/login.html'})	
	.when('/posts',{controller:'PostsCtrl',templateUrl:'posts.html'})
	.when('/register',{controller:'RegisterCtrl',templateUrl:'register.html'})
	.when('/home',{controller:'HomeCtrl',templateUrl:'users/home.html'})	
	.when('/vehicles/new/info',{controller:'VehiclesNewInfoCtrl',templateUrl:'vehicles/new/info.html'})	
	.when('/vehicles/edit/:deviceId/info',{controller:'VehiclesEditInfoCtrl',templateUrl:'vehicles/edit/info.html'})	
	.when('/vehicles/edit/:deviceId/map',{controller:'VehiclesEditMapCtrl',templateUrl:'vehicles/edit/map.html'})	
	.when('/401',{controller:'ErrorCtrl',templateUrl:'errors/401.html'})	

	$locationProvider.html5Mode(true)
	
})
angular.module('app')
.service('UserSvc', function($http,$window,$location){
	var svc = this
	svc.getUser= function(){
		return $http.get('api/users')
	}

	svc.login = function(username,password){
	 return $http.post('api/sessions',{
			username : username, password : password
		}).then(function(val){			
			svc.token = val.data
			$window.sessionStorage["user_token"] = JSON.stringify(svc.token)
			$http.defaults.headers.common['x-auth'] = val.data
			return svc.getUser()
		}).catch(function(response) {
  			console.error('Gists error', response.status, response.data);
  			$location.path('/401')
		})
		.finally(function() {
		  console.log("finally finished gists");
		});	
	}


	svc.register = function (name,username,password){
		return $http.post('api/users',{
			name : name, username : username, password : password
		}).then(function(val){			
			//return val;			
			return svc.login(username,password) 

		})
	}

})
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

 
angular.module('app')
.controller('VehiclesEditMapCtrl',function($scope,$http,$location,$routeParams){ 
 
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

	 	$http.get('/api/vehicle/location/'+$routeParams.deviceId)
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

 
angular.module('app')
.controller('VehiclesNewInfoCtrl',function($scope,$http,$location){ 
 

$scope.saveVehicleDetails = function(){
	console.log("in controller 2")
	console.log($scope.dev_id + $scope.v_number)
	 

	$http.post('/api/vehicle',{
		dev_id: $scope.dev_id,
        v_number: $scope.v_number,
        driver_name : $scope.driver_name,
        sos_number : $scope.sos_number                       
	})
	.then(function(response) {
	    console.log(response)
	    $location.path('/home')

	  }, function(response) {
	    console.log(response)
	  });
	
}
 
 
 
})

 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImVycm9yLmN0cmwuanMiLCJob21lLmN0cmwuanMiLCJsb2dpbi5jdHJsLmpzIiwibWFzdGVyQ3RybC5qcyIsInBvc3RzLmN0cmwuanMiLCJwb3N0cy5zdmMuanMiLCJyZWdpc3Rlci5jdHJsLmpzIiwicm91dGVzLmpzIiwidXNlci5zdmMuanMiLCJ2ZWhpY2xlcy9lZGl0L2luZm8uanMiLCJ2ZWhpY2xlcy9lZGl0L21hcC5qcyIsInZlaGljbGVzL25ldy9pbmZvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdhcHAnLFtcbiduZ1JvdXRlJ1xuXSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdFcnJvckN0cmwnLGZ1bmN0aW9uKCRzY29wZSwkcm9vdFNjb3BlKXsgXG4kc2NvcGUuaGVsbG8gPSBcInRoaXMgaXMgZnJvbSB0aGUgY29udHJvbGxlciBoZWxsb1wiXG4gXHRjb25zb2xlLmxvZygkc2NvcGUuaGVsbG8pXG4gXHRcbiBcdFxuICAgXG59KVxuXG4gIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignSG9tZUN0cmwnLGZ1bmN0aW9uKCRzY29wZSwkaHR0cCl7IFxuICBcdFxuXG5cdCRzY29wZS5zZXR1cCA9IGZ1bmN0aW9uKCl7XG5cdCBcblx0JGh0dHAuZ2V0KCcvYXBpL3ZlaGljbGUnKVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHQgICBcdCRzY29wZS5tb2RlbCA9IHJlc3BvbnNlLmRhdGE7XG5cblx0ICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuXHQgICAgLy8gY2FsbGVkIGFzeW5jaHJvbm91c2x5IGlmIGFuIGVycm9yIG9jY3Vyc1xuXHQgICAgLy8gb3Igc2VydmVyIHJldHVybnMgcmVzcG9uc2Ugd2l0aCBhbiBlcnJvciBzdGF0dXMuXG5cdCAgfSk7XG5cdFxuXHQgfVxuXG5cdCAkc2NvcGUuc2V0dXAoKTtcblxuXG4gXG59KVxuXG4gIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignTG9naW5DdHJsJyxmdW5jdGlvbigkc2NvcGUsVXNlclN2YywkbG9jYXRpb24pe1xuXHQkc2NvcGUubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0VXNlclN2Yy5sb2dpbih1c2VybmFtZSxwYXNzd29yZClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRjb25zb2xlLmxvZyhcInByaW50aW5nIHJlc3BvbnNlXCIpXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKVxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicscmVzcG9uc2UuZGF0YSlcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvaG9tZScpXG5cdFx0XHRcblx0XHR9KVxuXHR9XG59KSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdtYXN0ZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaGVsbG9cIik7XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1Bvc3RzQ3RybCcsZnVuY3Rpb24oJHNjb3BlLFBvc3RzU3ZjKXsgXG4gIFBvc3RzU3ZjLmZldGNoKClcbiBcdC5zdWNjZXNzKGZ1bmN0aW9uIChwb3N0cyl7XG4gXHRcdCRzY29wZS5wb3N0cyA9IHBvc3RzXG5cbiBcdH0pXG5cdFxuIFx0ICRzY29wZS5hZGRQb3N0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICgkc2NvcGUucG9zdEJvZHkpIHtcbiAgICAgICAgICAgIFBvc3RzU3ZjLmNyZWF0ZSh7XG4gICAgICAgICAgICAgIC8qdXNlcm5hbWU6ICd2aXNoYWxSYW5qYW4nLCovXG4gICAgICAgICAgICAgIGJvZHk6ICAgICAkc2NvcGUucG9zdEJvZHkgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICAgICAgICAvLyRzY29wZS5wb3N0cy51bnNoaWZ0KHBvc3QpXG4gICAgICAgICAgICAgICRzY29wZS5wb3N0Qm9keSA9IG51bGxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAkc2NvcGUuJG9uKCd3czpuZXdfcG9zdCcsZnVuY3Rpb24oXyxwb3N0KXtcbiAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCl7XG4gICAgICAkc2NvcGUucG9zdHMudW5zaGlmdChwb3N0KVxuICAgIH0pXG4gIH0pXG4gXG59KVxuXG4gIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnUG9zdHNTdmMnLCBmdW5jdGlvbigkaHR0cCl7XG4gICB0aGlzLmZldGNoID0gZnVuY3Rpb24gKCkgeyAgIFx0XG4gICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcG9zdHMnKVxuICAgfVxuICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAocG9zdCl7XG4gICBcdFxuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvcG9zdHMnLHBvc3QpXG4gICB9XG4gfSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdSZWdpc3RlckN0cmwnLGZ1bmN0aW9uKCRzY29wZSxVc2VyU3ZjICwkbG9jYXRpb24pe1xuXHQkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbihuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKXtcblx0XHRVc2VyU3ZjLnJlZ2lzdGVyKG5hbWUsdXNlcm5hbWUscGFzc3dvcmQpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1x0XHRcdFxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2dpbicscmVzcG9uc2UuZGF0YSlcblx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvaG9tZScpXG5cdFx0fSlcblx0XHQuY2F0Y2goZnVuY3Rpb24gKGVycil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpXG5cdFx0fSlcblx0fVxuXG59KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdCRyb3V0ZVByb3ZpZGVyXG5cdC53aGVuKCcvJyx7Y29udHJvbGxlcjonTG9naW5DdHJsJyx0ZW1wbGF0ZVVybDonL2xvZ2luLmh0bWwnfSlcdFxuXHQud2hlbignL3Bvc3RzJyx7Y29udHJvbGxlcjonUG9zdHNDdHJsJyx0ZW1wbGF0ZVVybDoncG9zdHMuaHRtbCd9KVxuXHQud2hlbignL3JlZ2lzdGVyJyx7Y29udHJvbGxlcjonUmVnaXN0ZXJDdHJsJyx0ZW1wbGF0ZVVybDoncmVnaXN0ZXIuaHRtbCd9KVxuXHQud2hlbignL2hvbWUnLHtjb250cm9sbGVyOidIb21lQ3RybCcsdGVtcGxhdGVVcmw6J3VzZXJzL2hvbWUuaHRtbCd9KVx0XG5cdC53aGVuKCcvdmVoaWNsZXMvbmV3L2luZm8nLHtjb250cm9sbGVyOidWZWhpY2xlc05ld0luZm9DdHJsJyx0ZW1wbGF0ZVVybDondmVoaWNsZXMvbmV3L2luZm8uaHRtbCd9KVx0XG5cdC53aGVuKCcvdmVoaWNsZXMvZWRpdC86ZGV2aWNlSWQvaW5mbycse2NvbnRyb2xsZXI6J1ZlaGljbGVzRWRpdEluZm9DdHJsJyx0ZW1wbGF0ZVVybDondmVoaWNsZXMvZWRpdC9pbmZvLmh0bWwnfSlcdFxuXHQud2hlbignL3ZlaGljbGVzL2VkaXQvOmRldmljZUlkL21hcCcse2NvbnRyb2xsZXI6J1ZlaGljbGVzRWRpdE1hcEN0cmwnLHRlbXBsYXRlVXJsOid2ZWhpY2xlcy9lZGl0L21hcC5odG1sJ30pXHRcblx0LndoZW4oJy80MDEnLHtjb250cm9sbGVyOidFcnJvckN0cmwnLHRlbXBsYXRlVXJsOidlcnJvcnMvNDAxLmh0bWwnfSlcdFxuXG5cdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKVxuXHRcbn0pIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uc2VydmljZSgnVXNlclN2YycsIGZ1bmN0aW9uKCRodHRwLCR3aW5kb3csJGxvY2F0aW9uKXtcblx0dmFyIHN2YyA9IHRoaXNcblx0c3ZjLmdldFVzZXI9IGZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnYXBpL3VzZXJzJylcblx0fVxuXG5cdHN2Yy5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLHBhc3N3b3JkKXtcblx0IHJldHVybiAkaHR0cC5wb3N0KCdhcGkvc2Vzc2lvbnMnLHtcblx0XHRcdHVzZXJuYW1lIDogdXNlcm5hbWUsIHBhc3N3b3JkIDogcGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHZhbCl7XHRcdFx0XG5cdFx0XHRzdmMudG9rZW4gPSB2YWwuZGF0YVxuXHRcdFx0JHdpbmRvdy5zZXNzaW9uU3RvcmFnZVtcInVzZXJfdG9rZW5cIl0gPSBKU09OLnN0cmluZ2lmeShzdmMudG9rZW4pXG5cdFx0XHQkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSB2YWwuZGF0YVxuXHRcdFx0cmV0dXJuIHN2Yy5nZXRVc2VyKClcblx0XHR9KS5jYXRjaChmdW5jdGlvbihyZXNwb25zZSkge1xuICBcdFx0XHRjb25zb2xlLmVycm9yKCdHaXN0cyBlcnJvcicsIHJlc3BvbnNlLnN0YXR1cywgcmVzcG9uc2UuZGF0YSk7XG4gIFx0XHRcdCRsb2NhdGlvbi5wYXRoKCcvNDAxJylcblx0XHR9KVxuXHRcdC5maW5hbGx5KGZ1bmN0aW9uKCkge1xuXHRcdCAgY29uc29sZS5sb2coXCJmaW5hbGx5IGZpbmlzaGVkIGdpc3RzXCIpO1xuXHRcdH0pO1x0XG5cdH1cblxuXG5cdHN2Yy5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKXtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnYXBpL3VzZXJzJyx7XG5cdFx0XHRuYW1lIDogbmFtZSwgdXNlcm5hbWUgOiB1c2VybmFtZSwgcGFzc3dvcmQgOiBwYXNzd29yZFxuXHRcdH0pLnRoZW4oZnVuY3Rpb24odmFsKXtcdFx0XHRcblx0XHRcdC8vcmV0dXJuIHZhbDtcdFx0XHRcblx0XHRcdHJldHVybiBzdmMubG9naW4odXNlcm5hbWUscGFzc3dvcmQpIFxuXG5cdFx0fSlcblx0fVxuXG59KSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1ZlaGljbGVzRWRpdEluZm9DdHJsJyxmdW5jdGlvbigkc2NvcGUsJGh0dHAsJGxvY2F0aW9uLCRyb3V0ZVBhcmFtcyl7IFxuIFxuXG4kc2NvcGUuc2V0dXAgPSBmdW5jdGlvbigpe1xuXHRjb25zb2xlLmxvZygkcm91dGVQYXJhbXMpXG5cdCRodHRwLmdldCgnL2FwaS92ZWhpY2xlLycrJHJvdXRlUGFyYW1zLmRldmljZUlkKVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHQgICAgJHNjb3BlLm1vZGVsID0gcmVzcG9uc2UuZGF0YTtcblx0ICAgIGNvbnNvbGUubG9nKCRzY29wZS5tb2RlbClcblxuXHQgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdCAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcblx0ICB9KTtcblx0XG59XG5cbiRzY29wZS5zZXR1cCgpO1xuIFxuIFxuIFxufSlcblxuICIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1ZlaGljbGVzRWRpdE1hcEN0cmwnLGZ1bmN0aW9uKCRzY29wZSwkaHR0cCwkbG9jYXRpb24sJHJvdXRlUGFyYW1zKXsgXG4gXG5cdCRzY29wZS5tYXJrT25NYXAgPSBmdW5jdGlvbihsYXQsbG9uZyl7XG5cdFx0Y29uc29sZS5sb2cobG9uZylcdCBcdFxuXHRcdCRzY29wZS5teUNlbnRlciA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsb25nKTtcblx0IFx0JHNjb3BlLm1hcE9wdGlvbnMgPSB7XG5cdCBcdFx0Y2VudGVyOm5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsb25nKSxcblx0XHRcdCAgem9vbToxMCxcblx0XHRcdCAgbWFwVHlwZUlkOmdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQXG4gICAgXHRcdCAgXG5cdFx0fVxuXG5cdFx0JHNjb3BlLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dvb2dsZU1hcCcpLCAkc2NvcGUubWFwT3B0aW9ucyk7XG5cblxuXHRcdFx0JHNjb3BlLG1hcmtlcj1uZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdCAgcG9zaXRpb246JHNjb3BlLm15Q2VudGVyXG5cdFx0XHQgIH0pO1xuXG5cdFx0XHRtYXJrZXIuc2V0TWFwKCRzY29wZS5tYXApO1xuXHRcdFx0fVxuXG5cdFx0XHRcblxuIFxuXHQgJHNjb3BlLnNldHVwID0gZnVuY3Rpb24oKXtcdCBcdFx0IFx0XG5cblx0IFx0JGh0dHAuZ2V0KCcvYXBpL3ZlaGljbGUvbG9jYXRpb24vJyskcm91dGVQYXJhbXMuZGV2aWNlSWQpXG5cdCBcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdCAgIFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKVxuXHQgICBcdFx0JHNjb3BlLm1vZGVsID0gcmVzcG9uc2UuZGF0YVxuXHQgICBcdFx0JHNjb3BlLm1hcmtPbk1hcChyZXNwb25zZS5kYXRhLmxhdGl0dWRlLHJlc3BvbnNlLmRhdGEubG9uZ2l0dWRlKTtcblx0ICAgXHRcdFxuXG5cdFx0ICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdCAgICAvLyBjYWxsZWQgYXN5bmNocm9ub3VzbHkgaWYgYW4gZXJyb3Igb2NjdXJzXG5cdFx0ICAgIC8vIG9yIHNlcnZlciByZXR1cm5zIHJlc3BvbnNlIHdpdGggYW4gZXJyb3Igc3RhdHVzLlxuXHRcdCAgfSk7XG5cblx0IH1cblxuXHQgJHNjb3BlLnNldHVwKCk7XG4gXG5cdCBcblxuIFxufSlcblxuICIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1ZlaGljbGVzTmV3SW5mb0N0cmwnLGZ1bmN0aW9uKCRzY29wZSwkaHR0cCwkbG9jYXRpb24peyBcbiBcblxuJHNjb3BlLnNhdmVWZWhpY2xlRGV0YWlscyA9IGZ1bmN0aW9uKCl7XG5cdGNvbnNvbGUubG9nKFwiaW4gY29udHJvbGxlciAyXCIpXG5cdGNvbnNvbGUubG9nKCRzY29wZS5kZXZfaWQgKyAkc2NvcGUudl9udW1iZXIpXG5cdCBcblxuXHQkaHR0cC5wb3N0KCcvYXBpL3ZlaGljbGUnLHtcblx0XHRkZXZfaWQ6ICRzY29wZS5kZXZfaWQsXG4gICAgICAgIHZfbnVtYmVyOiAkc2NvcGUudl9udW1iZXIsXG4gICAgICAgIGRyaXZlcl9uYW1lIDogJHNjb3BlLmRyaXZlcl9uYW1lLFxuICAgICAgICBzb3NfbnVtYmVyIDogJHNjb3BlLnNvc19udW1iZXIgICAgICAgICAgICAgICAgICAgICAgIFxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHQgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG5cdCAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKVxuXG5cdCAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0ICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuXHQgIH0pO1xuXHRcbn1cbiBcbiBcbiBcbn0pXG5cbiAiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
