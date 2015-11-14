angular.module('app',[
'ngRoute'
])
angular.module('app')
.controller('ApplicationCtrl',function($scope,$rootScope){
	$scope.$on('login',function(_,user){
		$scope.currentUser = user
		$rootScope.currentUser = user
		localStorage.setItem('logged_user',$rootScope.currentUser.username)
	})

})
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
.run(function($rootScope,$timeout){
	(function connect(){
	var url = 'wss://frozen-brushlands-5757.herokuapp.com'
	var connection = new WebSocket(url)
		connection.onclose = function(e){
		console.log('WebSocket Disconnected......')
		$timeout(connect,10*1000)
		}	

	connection.onmessage = function(e){
		console.log(e)
		console.log("New WebSocket Connected")
		var payload = JSON.parse(e.data)
		$rootScope.$broadcast('ws:'+payload.topic, payload.data)
	}

	})()
	
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

 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFwcGxpY2F0aW9uLmN0cmwuanMiLCJlcnJvci5jdHJsLmpzIiwiaG9tZS5jdHJsLmpzIiwibG9naW4uY3RybC5qcyIsInBvc3RzLmN0cmwuanMiLCJwb3N0cy5zdmMuanMiLCJyZWdpc3Rlci5jdHJsLmpzIiwicm91dGVzLmpzIiwidXNlci5zdmMuanMiLCJ3ZWJzb2NrZXRzLmpzIiwidmVoaWNsZXMvZWRpdC9pbmZvLmpzIiwidmVoaWNsZXMvZWRpdC9tYXAuanMiLCJ2ZWhpY2xlcy9uZXcvaW5mby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsW1xuJ25nUm91dGUnXG5dKSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0FwcGxpY2F0aW9uQ3RybCcsZnVuY3Rpb24oJHNjb3BlLCRyb290U2NvcGUpe1xuXHQkc2NvcGUuJG9uKCdsb2dpbicsZnVuY3Rpb24oXyx1c2VyKXtcblx0XHQkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG5cdFx0JHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXJcblx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9nZ2VkX3VzZXInLCRyb290U2NvcGUuY3VycmVudFVzZXIudXNlcm5hbWUpXG5cdH0pXG5cbn0pIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignRXJyb3JDdHJsJyxmdW5jdGlvbigkc2NvcGUsJHJvb3RTY29wZSl7IFxuJHNjb3BlLmhlbGxvID0gXCJ0aGlzIGlzIGZyb20gdGhlIGNvbnRyb2xsZXIgaGVsbG9cIlxuIFx0Y29uc29sZS5sb2coJHNjb3BlLmhlbGxvKVxuIFx0XG4gXHRcbiAgIFxufSlcblxuICIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJyxmdW5jdGlvbigkc2NvcGUsJGh0dHApeyBcbiAgXHRcblxuXHQkc2NvcGUuc2V0dXAgPSBmdW5jdGlvbigpe1xuXHQgXG5cdCRodHRwLmdldCgnL2FwaS92ZWhpY2xlJylcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0ICAgXHQkc2NvcGUubW9kZWwgPSByZXNwb25zZS5kYXRhO1xuXG5cdCAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0ICAgIC8vIGNhbGxlZCBhc3luY2hyb25vdXNseSBpZiBhbiBlcnJvciBvY2N1cnNcblx0ICAgIC8vIG9yIHNlcnZlciByZXR1cm5zIHJlc3BvbnNlIHdpdGggYW4gZXJyb3Igc3RhdHVzLlxuXHQgIH0pO1xuXHRcblx0IH1cblxuXHQgJHNjb3BlLnNldHVwKCk7XG5cblxuIFxufSlcblxuICIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsZnVuY3Rpb24oJHNjb3BlLFVzZXJTdmMsJGxvY2F0aW9uKXtcblx0JHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUscGFzc3dvcmQpe1xuXHRcdFVzZXJTdmMubG9naW4odXNlcm5hbWUscGFzc3dvcmQpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0Y29uc29sZS5sb2coXCJwcmludGluZyByZXNwb25zZVwiKVxuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSlcblx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLHJlc3BvbnNlLmRhdGEpXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2hvbWUnKVxuXHRcdFx0XG5cdFx0fSlcblx0fVxufSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdQb3N0c0N0cmwnLGZ1bmN0aW9uKCRzY29wZSxQb3N0c1N2Yyl7IFxuICBQb3N0c1N2Yy5mZXRjaCgpXG4gXHQuc3VjY2VzcyhmdW5jdGlvbiAocG9zdHMpe1xuIFx0XHQkc2NvcGUucG9zdHMgPSBwb3N0c1xuXG4gXHR9KVxuXHRcbiBcdCAkc2NvcGUuYWRkUG9zdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJHNjb3BlLnBvc3RCb2R5KSB7XG4gICAgICAgICAgICBQb3N0c1N2Yy5jcmVhdGUoe1xuICAgICAgICAgICAgICAvKnVzZXJuYW1lOiAndmlzaGFsUmFuamFuJywqL1xuICAgICAgICAgICAgICBib2R5OiAgICAgJHNjb3BlLnBvc3RCb2R5ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICAgICAgLy8kc2NvcGUucG9zdHMudW5zaGlmdChwb3N0KVxuICAgICAgICAgICAgICAkc2NvcGUucG9zdEJvZHkgPSBudWxsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgJHNjb3BlLiRvbignd3M6bmV3X3Bvc3QnLGZ1bmN0aW9uKF8scG9zdCl7XG4gICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpe1xuICAgICAgJHNjb3BlLnBvc3RzLnVuc2hpZnQocG9zdClcbiAgICB9KVxuICB9KVxuIFxufSlcblxuICIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ1Bvc3RzU3ZjJywgZnVuY3Rpb24oJGh0dHApe1xuICAgdGhpcy5mZXRjaCA9IGZ1bmN0aW9uICgpIHsgICBcdFxuICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Bvc3RzJylcbiAgIH1cbiAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHBvc3Qpe1xuICAgXHRcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Bvc3RzJyxwb3N0KVxuICAgfVxuIH0pIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignUmVnaXN0ZXJDdHJsJyxmdW5jdGlvbigkc2NvcGUsVXNlclN2YyAsJGxvY2F0aW9uKXtcblx0JHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24obmFtZSx1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0VXNlclN2Yy5yZWdpc3RlcihuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcdFx0XHRcblx0XHRcdCRzY29wZS4kZW1pdCgnbG9naW4nLHJlc3BvbnNlLmRhdGEpXG5cdFx0XHQkbG9jYXRpb24ucGF0aCgnL2hvbWUnKVxuXHRcdH0pXG5cdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnIpe1xuXHRcdFx0Y29uc29sZS5sb2coZXJyKVxuXHRcdH0pXG5cdH1cblxufSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwkbG9jYXRpb25Qcm92aWRlcikge1xuXHQkcm91dGVQcm92aWRlclxuXHQud2hlbignLycse2NvbnRyb2xsZXI6J0xvZ2luQ3RybCcsdGVtcGxhdGVVcmw6Jy9sb2dpbi5odG1sJ30pXHRcblx0LndoZW4oJy9wb3N0cycse2NvbnRyb2xsZXI6J1Bvc3RzQ3RybCcsdGVtcGxhdGVVcmw6J3Bvc3RzLmh0bWwnfSlcblx0LndoZW4oJy9yZWdpc3Rlcicse2NvbnRyb2xsZXI6J1JlZ2lzdGVyQ3RybCcsdGVtcGxhdGVVcmw6J3JlZ2lzdGVyLmh0bWwnfSlcblx0LndoZW4oJy9ob21lJyx7Y29udHJvbGxlcjonSG9tZUN0cmwnLHRlbXBsYXRlVXJsOid1c2Vycy9ob21lLmh0bWwnfSlcdFxuXHQud2hlbignL3ZlaGljbGVzL25ldy9pbmZvJyx7Y29udHJvbGxlcjonVmVoaWNsZXNOZXdJbmZvQ3RybCcsdGVtcGxhdGVVcmw6J3ZlaGljbGVzL25ldy9pbmZvLmh0bWwnfSlcdFxuXHQud2hlbignL3ZlaGljbGVzL2VkaXQvOmRldmljZUlkL2luZm8nLHtjb250cm9sbGVyOidWZWhpY2xlc0VkaXRJbmZvQ3RybCcsdGVtcGxhdGVVcmw6J3ZlaGljbGVzL2VkaXQvaW5mby5odG1sJ30pXHRcblx0LndoZW4oJy92ZWhpY2xlcy9lZGl0LzpkZXZpY2VJZC9tYXAnLHtjb250cm9sbGVyOidWZWhpY2xlc0VkaXRNYXBDdHJsJyx0ZW1wbGF0ZVVybDondmVoaWNsZXMvZWRpdC9tYXAuaHRtbCd9KVx0XG5cdC53aGVuKCcvNDAxJyx7Y29udHJvbGxlcjonRXJyb3JDdHJsJyx0ZW1wbGF0ZVVybDonZXJyb3JzLzQwMS5odG1sJ30pXHRcblxuXHQkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSlcblx0XG59KSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ1VzZXJTdmMnLCBmdW5jdGlvbigkaHR0cCwkd2luZG93LCRsb2NhdGlvbil7XG5cdHZhciBzdmMgPSB0aGlzXG5cdHN2Yy5nZXRVc2VyPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJ2FwaS91c2VycycpXG5cdH1cblxuXHRzdmMubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCl7XG5cdCByZXR1cm4gJGh0dHAucG9zdCgnYXBpL3Nlc3Npb25zJyx7XG5cdFx0XHR1c2VybmFtZSA6IHVzZXJuYW1lLCBwYXNzd29yZCA6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1x0XHRcdFxuXHRcdFx0c3ZjLnRva2VuID0gdmFsLmRhdGFcblx0XHRcdCR3aW5kb3cuc2Vzc2lvblN0b3JhZ2VbXCJ1c2VyX3Rva2VuXCJdID0gSlNPTi5zdHJpbmdpZnkoc3ZjLnRva2VuKVxuXHRcdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddID0gdmFsLmRhdGFcblx0XHRcdHJldHVybiBzdmMuZ2V0VXNlcigpXG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgXHRcdFx0Y29uc29sZS5lcnJvcignR2lzdHMgZXJyb3InLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLmRhdGEpO1xuICBcdFx0XHQkbG9jYXRpb24ucGF0aCgnLzQwMScpXG5cdFx0fSlcblx0XHQuZmluYWxseShmdW5jdGlvbigpIHtcblx0XHQgIGNvbnNvbGUubG9nKFwiZmluYWxseSBmaW5pc2hlZCBnaXN0c1wiKTtcblx0XHR9KTtcdFxuXHR9XG5cblxuXHRzdmMucmVnaXN0ZXIgPSBmdW5jdGlvbiAobmFtZSx1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJ2FwaS91c2Vycycse1xuXHRcdFx0bmFtZSA6IG5hbWUsIHVzZXJuYW1lIDogdXNlcm5hbWUsIHBhc3N3b3JkIDogcGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHZhbCl7XHRcdFx0XG5cdFx0XHQvL3JldHVybiB2YWw7XHRcdFx0XG5cdFx0XHRyZXR1cm4gc3ZjLmxvZ2luKHVzZXJuYW1lLHBhc3N3b3JkKSBcblxuXHRcdH0pXG5cdH1cblxufSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwkdGltZW91dCl7XG5cdChmdW5jdGlvbiBjb25uZWN0KCl7XG5cdHZhciB1cmwgPSAnd3NzOi8vZnJvemVuLWJydXNobGFuZHMtNTc1Ny5oZXJva3VhcHAuY29tJ1xuXHR2YXIgY29ubmVjdGlvbiA9IG5ldyBXZWJTb2NrZXQodXJsKVxuXHRcdGNvbm5lY3Rpb24ub25jbG9zZSA9IGZ1bmN0aW9uKGUpe1xuXHRcdGNvbnNvbGUubG9nKCdXZWJTb2NrZXQgRGlzY29ubmVjdGVkLi4uLi4uJylcblx0XHQkdGltZW91dChjb25uZWN0LDEwKjEwMDApXG5cdFx0fVx0XG5cblx0Y29ubmVjdGlvbi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKXtcblx0XHRjb25zb2xlLmxvZyhlKVxuXHRcdGNvbnNvbGUubG9nKFwiTmV3IFdlYlNvY2tldCBDb25uZWN0ZWRcIilcblx0XHR2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoZS5kYXRhKVxuXHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnd3M6JytwYXlsb2FkLnRvcGljLCBwYXlsb2FkLmRhdGEpXG5cdH1cblxuXHR9KSgpXG5cdFxufSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdWZWhpY2xlc0VkaXRJbmZvQ3RybCcsZnVuY3Rpb24oJHNjb3BlLCRodHRwLCRsb2NhdGlvbiwkcm91dGVQYXJhbXMpeyBcbiBcblxuJHNjb3BlLnNldHVwID0gZnVuY3Rpb24oKXtcblx0Y29uc29sZS5sb2coJHJvdXRlUGFyYW1zKVxuXHQkaHR0cC5nZXQoJy9hcGkvdmVoaWNsZS8nKyRyb3V0ZVBhcmFtcy5kZXZpY2VJZClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0ICAgICRzY29wZS5tb2RlbCA9IHJlc3BvbnNlLmRhdGE7XG5cdCAgICBjb25zb2xlLmxvZygkc2NvcGUubW9kZWwpXG5cblx0ICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuXHQgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG5cdCAgfSk7XG5cdFxufVxuXG4kc2NvcGUuc2V0dXAoKTtcbiBcbiBcbiBcbn0pXG5cbiAiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdWZWhpY2xlc0VkaXRNYXBDdHJsJyxmdW5jdGlvbigkc2NvcGUsJGh0dHAsJGxvY2F0aW9uLCRyb3V0ZVBhcmFtcyl7IFxuIFxuXHQkc2NvcGUubWFya09uTWFwID0gZnVuY3Rpb24obGF0LGxvbmcpe1xuXG5cdCBcdHZhciBteUNlbnRlcj1uZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCxsb25nKTtcblxuXHRcdFx0ZnVuY3Rpb24gaW5pdGlhbGl6ZSgpXG5cdFx0XHR7XG5cdFx0XHR2YXIgbWFwUHJvcCA9IHtcblx0XHRcdCAgY2VudGVyOm15Q2VudGVyLFxuXHRcdFx0ICB6b29tOjEwLFxuXHRcdFx0ICBtYXBUeXBlSWQ6Z29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVBcblx0XHRcdCAgfTtcblxuXHRcdFx0dmFyIG1hcD1uZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ29vZ2xlTWFwXCIpLG1hcFByb3ApO1xuXG5cblx0XHRcdHZhciBtYXJrZXI9bmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHQgIHBvc2l0aW9uOm15Q2VudGVyXG5cdFx0XHQgIH0pO1xuXG5cdFx0XHRtYXJrZXIuc2V0TWFwKG1hcCk7XG5cdFx0XHR9XG5cblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZERvbUxpc3RlbmVyKHdpbmRvdywgJ2xvYWQnLCBpbml0aWFsaXplKTtcblxuXHQgfVxuXG5cbiBcblx0ICRzY29wZS5zZXR1cCA9IGZ1bmN0aW9uKCl7XHQgXHRcdCBcdFxuXHQgXHQkaHR0cC5nZXQoJy9hcGkvdmVoaWNsZS9sb2NhdGlvbi8nKyRyb3V0ZVBhcmFtcy5kZXZpY2VJZClcblx0IFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0ICAgXHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpXG5cdCAgIFx0XHQkc2NvcGUubWFya09uTWFwKHJlc3BvbnNlLmRhdGEubG9uZ2l0dWRlLHJlc3BvbnNlLmRhdGEubGF0aXR1ZGUpO1xuXHQgICBcdFx0XG5cblx0XHQgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0ICAgIC8vIGNhbGxlZCBhc3luY2hyb25vdXNseSBpZiBhbiBlcnJvciBvY2N1cnNcblx0XHQgICAgLy8gb3Igc2VydmVyIHJldHVybnMgcmVzcG9uc2Ugd2l0aCBhbiBlcnJvciBzdGF0dXMuXG5cdFx0ICB9KTtcblxuXHQgfVxuXG5cdCAkc2NvcGUuc2V0dXAoKTtcbiBcblx0IFxuXG4gXG59KVxuXG4gIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignVmVoaWNsZXNOZXdJbmZvQ3RybCcsZnVuY3Rpb24oJHNjb3BlLCRodHRwLCRsb2NhdGlvbil7IFxuIFxuXG4kc2NvcGUuc2F2ZVZlaGljbGVEZXRhaWxzID0gZnVuY3Rpb24oKXtcblx0Y29uc29sZS5sb2coXCJpbiBjb250cm9sbGVyIDJcIilcblx0Y29uc29sZS5sb2coJHNjb3BlLmRldl9pZCArICRzY29wZS52X251bWJlcilcblx0IFxuXG5cdCRodHRwLnBvc3QoJy9hcGkvdmVoaWNsZScse1xuXHRcdGRldl9pZDogJHNjb3BlLmRldl9pZCxcbiAgICAgICAgdl9udW1iZXI6ICRzY29wZS52X251bWJlcixcbiAgICAgICAgZHJpdmVyX25hbWUgOiAkc2NvcGUuZHJpdmVyX25hbWUsXG4gICAgICAgIHNvc19udW1iZXIgOiAkc2NvcGUuc29zX251bWJlciAgICAgICAgICAgICAgICAgICAgICAgXG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdCAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcblx0ICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpXG5cblx0ICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuXHQgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG5cdCAgfSk7XG5cdFxufVxuIFxuIFxuIFxufSlcblxuICJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
