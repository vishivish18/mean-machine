angular.module('app',[
'ngRoute','ui.router'
])
angular.module('app')
    .controller('ErrorCtrl', function($scope, $rootScope) {
        $scope.hello = "this is from the controller hello"
        console.log($scope.hello)



    })

angular.module('app')
    .controller('HomeCtrl', function($scope, $http) {


        $scope.setup = function() {

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
    .controller('LoginCtrl', function($scope, UserSvc, $location) {        
        $scope.login = function(username, password) {
            UserSvc.login(username, password)
                .then(function(response) {
                    console.log("printing response")
                    console.log(response.data)
                    $scope.$emit('login', response.data)
                    $location.path('/home')

                })
        }
    })

angular.module('app')
    .controller('masterCtrl', function($scope, $rootScope, $route) {
        console.log("masterCtrl");

        function setup($event, $current, $prev) {
            console.log("masterCtrl");
            $scope.navTmpl = $current.navTmpl;
            $scope.panelTmpl = $current.panelTmpl;
            $scope.subPanelTmpl = $current.subPanelTmpl;
            $scope.playerTmpl = $current.playerTmpl;
            $scope.subNavTmpl = $current.subNavTmpl;
            $scope.footerTmpl = $current.footerTmpl;
            $scope.appTitle = $current.title;
        }

        $scope.$on('$routeChangeSuccess', setup);
        $scope.$on('login', function(_, user) {
            console.log("Logged In");
            $scope.currentUser = user
            $rootScope.currentUser = user
            localStorage.setItem('logged_user', $rootScope.currentUser.username)
        })
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
.service('segment', function($http,$window,$location){
  
     return {
        getData: function($q, $http) {
            console.log("here");
            return 2
        }
    };

})
angular.module('app')
.config(function($stateProvider, $urlRouterProvider){
 
    $urlRouterProvider.otherwise('/');
 
    $stateProvider
    .state('app',{
        url: '/',
        views: {
            'header': {
                templateUrl: '/nav.html'
            },
            'content': {
                templateUrl: '/login.html' ,
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.login',{
        url: '/login',
        views: {
            'header': {
                templateUrl: '/nav.html'
            },
            'content': {
                templateUrl: '/login.html',
                controller: 'LoginCtrl'

            }
        }
    })
 
    .state('app.register', {
        url: 'register',
        views: {
            'content@': {
                templateUrl: 'register.html',
                controller: 'RegisterCtrl'
            }
        }
 
    })
 
    .state('app.home', {
        url: 'home',
        views: {
            'content@': {
                templateUrl: 'users/home.html',
                controller: 'HomeCtrl'
            }
        }
 
    })
    
 
    
 
});

/*.config(function($routeProvider,$locationProvider) {
	$routeProvider
	.when('/',{controller:'LoginCtrl',templateUrl:'login.html'})	
	.when('/posts',{controller:'PostsCtrl',templateUrl:'posts.html'})
	.when('/register',{controller:'RegisterCtrl',templateUrl:'register.html'})
	.when('/home',{controller:'HomeCtrl',templateUrl:'users/home.html'})	
	.when('/vehicles/new/info',{controller:'VehiclesNewInfoCtrl',templateUrl:'vehicles/new/info.html'})	
	.when('/vehicles/edit/:deviceId/info',{controller:'VehiclesEditInfoCtrl',templateUrl:'vehicles/edit/info.html'})	
	.when('/vehicles/edit/:deviceId/map',{controller:'VehiclesEditMapCtrl',templateUrl:'vehicles/edit/map.html'})	
	.when('/401',{controller:'ErrorCtrl',templateUrl:'errors/401.html'})	

	$locationProvider.html5Mode(true)
	
})*/

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

 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImVycm9yLmN0cmwuanMiLCJob21lLmN0cmwuanMiLCJsb2dpbi5jdHJsLmpzIiwibWFzdGVyQ3RybC5qcyIsInBvc3RzLmN0cmwuanMiLCJwb3N0cy5zdmMuanMiLCJyZWdpc3Rlci5jdHJsLmpzIiwicm91dGVTZWdtZW50LmpzIiwicm91dGVzLmpzIiwidXNlci5zdmMuanMiLCJ2ZWhpY2xlcy9lZGl0L2luZm8uanMiLCJ2ZWhpY2xlcy9lZGl0L21hcC5qcyIsInZlaGljbGVzL25ldy9pbmZvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdhcHAnLFtcbiduZ1JvdXRlJywndWkucm91dGVyJ1xuXSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignRXJyb3JDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgICRzY29wZS5oZWxsbyA9IFwidGhpcyBpcyBmcm9tIHRoZSBjb250cm9sbGVyIGhlbGxvXCJcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmhlbGxvKVxuXG5cblxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignSG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwKSB7XG5cblxuICAgICAgICAkc2NvcGUuc2V0dXAgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvYXBpL3ZlaGljbGUnKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tb2RlbCA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsZWQgYXN5bmNocm9ub3VzbHkgaWYgYW4gZXJyb3Igb2NjdXJzXG4gICAgICAgICAgICAgICAgICAgIC8vIG9yIHNlcnZlciByZXR1cm5zIHJlc3BvbnNlIHdpdGggYW4gZXJyb3Igc3RhdHVzLlxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuc2V0dXAoKTtcblxuXG5cbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgVXNlclN2YywgJGxvY2F0aW9uKSB7ICAgICAgICBcbiAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG4gICAgICAgICAgICBVc2VyU3ZjLmxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInByaW50aW5nIHJlc3BvbnNlXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnbG9naW4nLCByZXNwb25zZS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2hvbWUnKVxuXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignbWFzdGVyQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHJvdXRlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibWFzdGVyQ3RybFwiKTtcblxuICAgICAgICBmdW5jdGlvbiBzZXR1cCgkZXZlbnQsICRjdXJyZW50LCAkcHJldikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYXN0ZXJDdHJsXCIpO1xuICAgICAgICAgICAgJHNjb3BlLm5hdlRtcGwgPSAkY3VycmVudC5uYXZUbXBsO1xuICAgICAgICAgICAgJHNjb3BlLnBhbmVsVG1wbCA9ICRjdXJyZW50LnBhbmVsVG1wbDtcbiAgICAgICAgICAgICRzY29wZS5zdWJQYW5lbFRtcGwgPSAkY3VycmVudC5zdWJQYW5lbFRtcGw7XG4gICAgICAgICAgICAkc2NvcGUucGxheWVyVG1wbCA9ICRjdXJyZW50LnBsYXllclRtcGw7XG4gICAgICAgICAgICAkc2NvcGUuc3ViTmF2VG1wbCA9ICRjdXJyZW50LnN1Yk5hdlRtcGw7XG4gICAgICAgICAgICAkc2NvcGUuZm9vdGVyVG1wbCA9ICRjdXJyZW50LmZvb3RlclRtcGw7XG4gICAgICAgICAgICAkc2NvcGUuYXBwVGl0bGUgPSAkY3VycmVudC50aXRsZTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBzZXR1cCk7XG4gICAgICAgICRzY29wZS4kb24oJ2xvZ2luJywgZnVuY3Rpb24oXywgdXNlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnZWQgSW5cIik7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvZ2dlZF91c2VyJywgJHJvb3RTY29wZS5jdXJyZW50VXNlci51c2VybmFtZSlcbiAgICAgICAgfSlcbiAgICB9KVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4uY29udHJvbGxlcignUG9zdHNDdHJsJyxmdW5jdGlvbigkc2NvcGUsUG9zdHNTdmMpeyBcbiAgUG9zdHNTdmMuZmV0Y2goKVxuIFx0LnN1Y2Nlc3MoZnVuY3Rpb24gKHBvc3RzKXtcbiBcdFx0JHNjb3BlLnBvc3RzID0gcG9zdHNcblxuIFx0fSlcblx0XG4gXHQgJHNjb3BlLmFkZFBvc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCRzY29wZS5wb3N0Qm9keSkge1xuICAgICAgICAgICAgUG9zdHNTdmMuY3JlYXRlKHtcbiAgICAgICAgICAgICAgLyp1c2VybmFtZTogJ3Zpc2hhbFJhbmphbicsKi9cbiAgICAgICAgICAgICAgYm9keTogICAgICRzY29wZS5wb3N0Qm9keSAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChwb3N0KSB7XG4gICAgICAgICAgICAgIC8vJHNjb3BlLnBvc3RzLnVuc2hpZnQocG9zdClcbiAgICAgICAgICAgICAgJHNjb3BlLnBvc3RCb2R5ID0gbnVsbFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICRzY29wZS4kb24oJ3dzOm5ld19wb3N0JyxmdW5jdGlvbihfLHBvc3Qpe1xuICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKXtcbiAgICAgICRzY29wZS5wb3N0cy51bnNoaWZ0KHBvc3QpXG4gICAgfSlcbiAgfSlcbiBcbn0pXG5cbiAiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdQb3N0c1N2YycsIGZ1bmN0aW9uKCRodHRwKXtcbiAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbiAoKSB7ICAgXHRcbiAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wb3N0cycpXG4gICB9XG4gICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uIChwb3N0KXtcbiAgIFx0XG4gICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9wb3N0cycscG9zdClcbiAgIH1cbiB9KSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ3RybCcsZnVuY3Rpb24oJHNjb3BlLFVzZXJTdmMgLCRsb2NhdGlvbil7XG5cdCRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKG5hbWUsdXNlcm5hbWUscGFzc3dvcmQpe1xuXHRcdFVzZXJTdmMucmVnaXN0ZXIobmFtZSx1c2VybmFtZSxwYXNzd29yZClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHRcdFx0XG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvZ2luJyxyZXNwb25zZS5kYXRhKVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ob21lJylcblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycilcblx0XHR9KVxuXHR9XG5cbn0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5zZXJ2aWNlKCdzZWdtZW50JywgZnVuY3Rpb24oJGh0dHAsJHdpbmRvdywkbG9jYXRpb24pe1xuICBcbiAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24oJHEsICRodHRwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhlcmVcIik7XG4gICAgICAgICAgICByZXR1cm4gMlxuICAgICAgICB9XG4gICAgfTtcblxufSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcil7XG4gXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuIFxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAnLHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25hdi5odG1sJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2xvZ2luLmh0bWwnICxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcblxuICAgIC5zdGF0ZSgnYXBwLmxvZ2luJyx7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25hdi5odG1sJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdjb250ZW50Jzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG4gXG4gICAgLnN0YXRlKCdhcHAucmVnaXN0ZXInLCB7XG4gICAgICAgIHVybDogJ3JlZ2lzdGVyJyxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdjb250ZW50QCc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3JlZ2lzdGVyLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZWdpc3RlckN0cmwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiBcbiAgICB9KVxuIFxuICAgIC5zdGF0ZSgnYXBwLmhvbWUnLCB7XG4gICAgICAgIHVybDogJ2hvbWUnLFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXNlcnMvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiBcbiAgICB9KVxuICAgIFxuIFxuICAgIFxuIFxufSk7XG5cbi8qLmNvbmZpZyhmdW5jdGlvbigkcm91dGVQcm92aWRlciwkbG9jYXRpb25Qcm92aWRlcikge1xuXHQkcm91dGVQcm92aWRlclxuXHQud2hlbignLycse2NvbnRyb2xsZXI6J0xvZ2luQ3RybCcsdGVtcGxhdGVVcmw6J2xvZ2luLmh0bWwnfSlcdFxuXHQud2hlbignL3Bvc3RzJyx7Y29udHJvbGxlcjonUG9zdHNDdHJsJyx0ZW1wbGF0ZVVybDoncG9zdHMuaHRtbCd9KVxuXHQud2hlbignL3JlZ2lzdGVyJyx7Y29udHJvbGxlcjonUmVnaXN0ZXJDdHJsJyx0ZW1wbGF0ZVVybDoncmVnaXN0ZXIuaHRtbCd9KVxuXHQud2hlbignL2hvbWUnLHtjb250cm9sbGVyOidIb21lQ3RybCcsdGVtcGxhdGVVcmw6J3VzZXJzL2hvbWUuaHRtbCd9KVx0XG5cdC53aGVuKCcvdmVoaWNsZXMvbmV3L2luZm8nLHtjb250cm9sbGVyOidWZWhpY2xlc05ld0luZm9DdHJsJyx0ZW1wbGF0ZVVybDondmVoaWNsZXMvbmV3L2luZm8uaHRtbCd9KVx0XG5cdC53aGVuKCcvdmVoaWNsZXMvZWRpdC86ZGV2aWNlSWQvaW5mbycse2NvbnRyb2xsZXI6J1ZlaGljbGVzRWRpdEluZm9DdHJsJyx0ZW1wbGF0ZVVybDondmVoaWNsZXMvZWRpdC9pbmZvLmh0bWwnfSlcdFxuXHQud2hlbignL3ZlaGljbGVzL2VkaXQvOmRldmljZUlkL21hcCcse2NvbnRyb2xsZXI6J1ZlaGljbGVzRWRpdE1hcEN0cmwnLHRlbXBsYXRlVXJsOid2ZWhpY2xlcy9lZGl0L21hcC5odG1sJ30pXHRcblx0LndoZW4oJy80MDEnLHtjb250cm9sbGVyOidFcnJvckN0cmwnLHRlbXBsYXRlVXJsOidlcnJvcnMvNDAxLmh0bWwnfSlcdFxuXG5cdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKVxuXHRcbn0pKi9cbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLnNlcnZpY2UoJ1VzZXJTdmMnLCBmdW5jdGlvbigkaHR0cCwkd2luZG93LCRsb2NhdGlvbil7XG5cdHZhciBzdmMgPSB0aGlzXG5cdHN2Yy5nZXRVc2VyPSBmdW5jdGlvbigpe1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJ2FwaS91c2VycycpXG5cdH1cblxuXHRzdmMubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSxwYXNzd29yZCl7XG5cdCByZXR1cm4gJGh0dHAucG9zdCgnYXBpL3Nlc3Npb25zJyx7XG5cdFx0XHR1c2VybmFtZSA6IHVzZXJuYW1lLCBwYXNzd29yZCA6IHBhc3N3b3JkXG5cdFx0fSkudGhlbihmdW5jdGlvbih2YWwpe1x0XHRcdFxuXHRcdFx0c3ZjLnRva2VuID0gdmFsLmRhdGFcblx0XHRcdCR3aW5kb3cuc2Vzc2lvblN0b3JhZ2VbXCJ1c2VyX3Rva2VuXCJdID0gSlNPTi5zdHJpbmdpZnkoc3ZjLnRva2VuKVxuXHRcdFx0JGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddID0gdmFsLmRhdGFcblx0XHRcdHJldHVybiBzdmMuZ2V0VXNlcigpXG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgXHRcdFx0Y29uc29sZS5lcnJvcignR2lzdHMgZXJyb3InLCByZXNwb25zZS5zdGF0dXMsIHJlc3BvbnNlLmRhdGEpO1xuICBcdFx0XHQkbG9jYXRpb24ucGF0aCgnLzQwMScpXG5cdFx0fSlcblx0XHQuZmluYWxseShmdW5jdGlvbigpIHtcblx0XHQgIGNvbnNvbGUubG9nKFwiZmluYWxseSBmaW5pc2hlZCBnaXN0c1wiKTtcblx0XHR9KTtcdFxuXHR9XG5cblxuXHRzdmMucmVnaXN0ZXIgPSBmdW5jdGlvbiAobmFtZSx1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJ2FwaS91c2Vycycse1xuXHRcdFx0bmFtZSA6IG5hbWUsIHVzZXJuYW1lIDogdXNlcm5hbWUsIHBhc3N3b3JkIDogcGFzc3dvcmRcblx0XHR9KS50aGVuKGZ1bmN0aW9uKHZhbCl7XHRcdFx0XG5cdFx0XHQvL3JldHVybiB2YWw7XHRcdFx0XG5cdFx0XHRyZXR1cm4gc3ZjLmxvZ2luKHVzZXJuYW1lLHBhc3N3b3JkKSBcblxuXHRcdH0pXG5cdH1cblxufSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdWZWhpY2xlc0VkaXRJbmZvQ3RybCcsZnVuY3Rpb24oJHNjb3BlLCRodHRwLCRsb2NhdGlvbiwkcm91dGVQYXJhbXMpeyBcbiBcblxuJHNjb3BlLnNldHVwID0gZnVuY3Rpb24oKXtcblx0Y29uc29sZS5sb2coJHJvdXRlUGFyYW1zKVxuXHQkaHR0cC5nZXQoJy9hcGkvdmVoaWNsZS8nKyRyb3V0ZVBhcmFtcy5kZXZpY2VJZClcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0ICAgICRzY29wZS5tb2RlbCA9IHJlc3BvbnNlLmRhdGE7XG5cdCAgICBjb25zb2xlLmxvZygkc2NvcGUubW9kZWwpXG5cblx0ICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuXHQgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG5cdCAgfSk7XG5cdFxufVxuXG4kc2NvcGUuc2V0dXAoKTtcbiBcbiBcbiBcbn0pXG5cbiAiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdWZWhpY2xlc0VkaXRNYXBDdHJsJyxmdW5jdGlvbigkc2NvcGUsJGh0dHAsJGxvY2F0aW9uLCRyb3V0ZVBhcmFtcyl7IFxuIFxuXHQkc2NvcGUubWFya09uTWFwID0gZnVuY3Rpb24obGF0LGxvbmcpe1xuXHRcdGNvbnNvbGUubG9nKGxvbmcpXHQgXHRcblx0XHQkc2NvcGUubXlDZW50ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG9uZyk7XG5cdCBcdCRzY29wZS5tYXBPcHRpb25zID0ge1xuXHQgXHRcdGNlbnRlcjpuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG9uZyksXG5cdFx0XHQgIHpvb206MTAsXG5cdFx0XHQgIG1hcFR5cGVJZDpnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUFxuICAgIFx0XHQgIFxuXHRcdH1cblxuXHRcdCRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnb29nbGVNYXAnKSwgJHNjb3BlLm1hcE9wdGlvbnMpO1xuXG5cblx0XHRcdCRzY29wZSxtYXJrZXI9bmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHQgIHBvc2l0aW9uOiRzY29wZS5teUNlbnRlclxuXHRcdFx0ICB9KTtcblxuXHRcdFx0bWFya2VyLnNldE1hcCgkc2NvcGUubWFwKTtcblx0XHRcdH1cblxuXHRcdFx0XG5cbiBcblx0ICRzY29wZS5zZXR1cCA9IGZ1bmN0aW9uKCl7XHQgXHRcdCBcdFxuXG5cdCBcdCRodHRwLmdldCgnL2FwaS92ZWhpY2xlL2xvY2F0aW9uLycrJHJvdXRlUGFyYW1zLmRldmljZUlkKVxuXHQgXHQudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXHQgICBcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSlcblx0ICAgXHRcdCRzY29wZS5tb2RlbCA9IHJlc3BvbnNlLmRhdGFcblx0ICAgXHRcdCRzY29wZS5tYXJrT25NYXAocmVzcG9uc2UuZGF0YS5sYXRpdHVkZSxyZXNwb25zZS5kYXRhLmxvbmdpdHVkZSk7XG5cdCAgIFx0XHRcblxuXHRcdCAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHQgICAgLy8gY2FsbGVkIGFzeW5jaHJvbm91c2x5IGlmIGFuIGVycm9yIG9jY3Vyc1xuXHRcdCAgICAvLyBvciBzZXJ2ZXIgcmV0dXJucyByZXNwb25zZSB3aXRoIGFuIGVycm9yIHN0YXR1cy5cblx0XHQgIH0pO1xuXG5cdCB9XG5cblx0ICRzY29wZS5zZXR1cCgpO1xuIFxuXHQgXG5cbiBcbn0pXG5cbiAiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb250cm9sbGVyKCdWZWhpY2xlc05ld0luZm9DdHJsJyxmdW5jdGlvbigkc2NvcGUsJGh0dHAsJGxvY2F0aW9uKXsgXG4gXG5cbiRzY29wZS5zYXZlVmVoaWNsZURldGFpbHMgPSBmdW5jdGlvbigpe1xuXHRjb25zb2xlLmxvZyhcImluIGNvbnRyb2xsZXIgMlwiKVxuXHRjb25zb2xlLmxvZygkc2NvcGUuZGV2X2lkICsgJHNjb3BlLnZfbnVtYmVyKVxuXHQgXG5cblx0JGh0dHAucG9zdCgnL2FwaS92ZWhpY2xlJyx7XG5cdFx0ZGV2X2lkOiAkc2NvcGUuZGV2X2lkLFxuICAgICAgICB2X251bWJlcjogJHNjb3BlLnZfbnVtYmVyLFxuICAgICAgICBkcml2ZXJfbmFtZSA6ICRzY29wZS5kcml2ZXJfbmFtZSxcbiAgICAgICAgc29zX251bWJlciA6ICRzY29wZS5zb3NfbnVtYmVyICAgICAgICAgICAgICAgICAgICAgICBcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0ICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuXHQgICAgJGxvY2F0aW9uLnBhdGgoJy9ob21lJylcblxuXHQgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdCAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcblx0ICB9KTtcblx0XG59XG4gXG4gXG4gXG59KVxuXG4gIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
