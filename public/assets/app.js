angular.module('app',[
'ngRoute','ui.router'
])
angular.module('app')
    .controller('errorCtrl', ["$scope", "$rootScope", function($scope, $rootScope) {
        $scope.hello = "this is from the controller hello"
        console.log($scope.hello)



    }])

angular.module('app')
    .controller('homeCtrl', ["$scope", "$http", "prognitor", function($scope, $http, prognitor) {



        $scope.apiUri = "/api/data"
        prognitor.run($scope)
        $scope.setup(function(res) {
                console.log(res)
            })
            /*$http.get('/api/vehicle')
                .then(function(response) {
                    $scope.model = response.data;

                }, function(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });*/







    }])

angular.module('app')
    .controller('loginCtrl', ["$scope", "auth", "$location", "$timeout", function($scope, auth, $location, $timeout) {
        $scope.authFail = false;
        $scope.login = function(username, password) {
            auth.login(username, password)
                .then(function(res) {
                    auth.storeToken(res.data, function() {
                        auth.getUser()
                            .then(function(res) {
                                auth.postLoginOps(res.data, function() {
                                    auth.postLoginRouteHandler();
                                });
                            })
                    });

                })
                .catch(function(response) {
                    console.error('Gists error', response.status, response.data);
                    if (response.status == 401) {
                        $scope.authFail = true
                        $timeout(function() { $scope.authFail = false; }, 3000);
                    }
                })
                .finally(function() {
                    console.log("finally finished gists");
                });


        }
    }])

angular.module('app')
    .controller('masterCtrl', ["$scope", "$rootScope", "$route", "$http", function($scope, $rootScope, $route, $http) {
        console.log("masterCtrl");

        if (localStorage.getItem('logged_user')) {        	
            $rootScope.currentUser = localStorage.getItem('logged_user')
            $http.defaults.headers.common['x-auth'] = localStorage.getItem('user_token')
            console.log(localStorage.getItem('user_token'))
        }
        $scope.$on('login', function(_, user) {
            console.log("Logged In");
            $scope.currentUser = user
            $rootScope.currentUser = user
            localStorage.setItem('logged_user', $rootScope.currentUser.username)
        })
    }])

angular.module('app')
    .controller('navCtrl', ["$scope", "auth", "$location", function($scope, auth, $location) {        
        $scope.logout = function() {            
            auth.logout()                

        }
    }])

angular.module('app')
    .controller('newDataCtrl', ["$scope", "$http", "$location", function($scope, $http, $location) {


        $scope.saveData = function() {
            console.log("save")
            $http.post('/api/data', {
                    field1: $scope.field1,
                    field2: $scope.field2,
                    field3: $scope.field3,
                    field4: $scope.field4
                })
                .then(function(response) {
                    console.log(response)
                }, function(response) {
                    console.log(response)
                });

        }



    }])

angular.module('app')
.controller('registerCtrl',["$scope", "auth", "$location", function($scope,auth,$location){
	$scope.register = function(name,username,password){
		auth.register(name,username,password)
		.then(function(response){			
			auth.login(username,password)
			$scope.$emit('login',response.data)
			$location.path('/home')
		})
		.catch(function (err){
			console.log(err)
		})
	}

}])

angular.module('app')
.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider,$locationProvider){
 
    $urlRouterProvider.otherwise('/');
 
    $stateProvider
    .state('app',{
        url: '/',
        views: {
            'header': {
                templateUrl: '/nav.html',
                controller: 'navCtrl'
            },
            'content': {
                templateUrl: '/login.html' ,
                controller: 'loginCtrl'
            }
        }
    })

    .state('app.login',{
        url: 'login',
        views: {
            'header': {
                templateUrl: '/nav.html',
                controller: 'navCtrl'
            },
            'content': {
                templateUrl: '/login.html',
                controller: 'loginCtrl'

            }
        }
    })
 
    .state('app.register', {
        url: 'register',
        views: {
            'content@': {
                templateUrl: 'register.html',
                controller: 'registerCtrl'
            }
        }
 
    })

    .state('app.validate', {
        url: 'signup/validate/:id',        
 
        views: {
            'content@': {
                templateUrl: 'users/validate.html',
                controller: 'validateCtrl'        
            }
        }
 
    })

 
    .state('app.home', {
        url: 'home',
        views: {
            'content@': {
                templateUrl: 'users/home.html',
                controller: 'homeCtrl'
            }
        }
 
    })

     .state('app.home.data', {
        url: '/data/new',
        views: {
            'content@': {
                templateUrl: 'users/newData.html',
                controller: 'newDataCtrl'
            }
        }
 
    })

     .state('app.home.details', {
        url: '/vehicles/:id',        
 
        views: {
            'content@': {
                templateUrl: 'vehicles/editVehicle.html',
                controller: 'VehiclesEditInfoCtrl'        
            }
        }
 
    })

     .state('app.home.map', {
        url: '/vehicles/map/:id',        
 
        views: {
            'content@': {
                templateUrl: 'vehicles/mapVehicle.html',
                controller: 'VehiclesEditMapCtrl'        
            }
        }
 
    })


    
 
    $locationProvider.html5Mode(true)
 
}]);


angular.module('app')
    .controller('validateCtrl', ["$scope", "$http", "$stateParams", function($scope, $http, $stateParams) {

        
        $scope.loading = true

        $http.get('api/users/validate/' + $stateParams.id)
            .then(function(res) {
                console.log(res)
                if(res.status == 200){
                	$scope.verified = true
                	$scope.loading = false
                }else{
                	$scope.verified = false
                	$scope.loading = false
                }

            })




    }])

angular.module('app')
    .service('auth', ["$http", "$window", "$location", "$rootScope", function($http, $window, $location, $rootScope) {


        return {
            getUser: getUser,
            login: login,
            register: register,
            logout: logout,
            storeToken: storeToken,
            isLogged: isLogged,
            postLoginOps: postLoginOps,
            postLoginRouteHandler: postLoginRouteHandler

        }

        function getUser() {
            return $http.get('api/users')
        }

        function login(username, password) {

            return $http.post('api/sessions', {
                username: username,
                password: password
            })
        }

        function register(name, username, password) {

             return $http.post('api/users', {
                name: name,
                username: username,
                password: password
            })
        }


        function logout() {
            localStorage.removeItem('user_token');
            localStorage.removeItem('logged_user');
            delete $http.defaults.headers.common['x-auth']
            $rootScope.isLogged = false;
            $rootScope.currentUser = null;
            $location.path("/login")



        }

        function storeToken(res, cb) {
            $window.sessionStorage["user_token"] = res
            localStorage.setItem('user_token', res);
            $http.defaults.headers.common['x-auth'] = $window.sessionStorage.user_token
            if (cb && (typeof cb === 'function')) {
                cb();
            }
        }

        function isLogged() {

        }

        function postLoginOps(res, cb) {

            
            $rootScope.currentUser = res.name
            localStorage.setItem('logged_user', $rootScope.currentUser)
            $rootScope.isLogged = true;
            if (cb && (typeof cb === 'function')) {
                cb();
            }
            
        }

        function postLoginRouteHandler() {
            if ($rootScope.intendedRoute) {
                $location.path($rootScope.intendedRoute);
            } else {
                $location.path('/home');
            }
        }
        

    }])


angular.module('app')
    .service('prognitor', ["$http", "$window", "$location", "$rootScope", function($http, $window, $location, $rootScope) {

        return {


            setSetupProcess: function($scope) {
                $scope.loading = false;
                console.log($scope)
                $scope.setup = function(callbackFn) {
                    if ($scope.loading) return;

                    $scope.loading = true;


                    $http.get($scope.apiUri)
                        .then(function(data) {
                            console.log(data)
                           /* $scope.state.lastPage = data.last_page;
                            $scope.isLastPage = ($scope.state.pageNum == $scope.state.lastPage);
                            $scope.loading = false;*/
                            if (callbackFn !== undefined)
                                callbackFn(data);
                        }, function(res) {
                            if (res.status == 404) {
                                $rootScope.$broadcast('render404');
                            }

                        });
                };
            },


            run: function($scope) {
                console.log("in prognitor service")
                this.setSetupProcess($scope);

            }
        }



    }])

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImNvbnRyb2xsZXJzL2Vycm9yQ3RybC5qcyIsImNvbnRyb2xsZXJzL2hvbWVDdHJsLmpzIiwiY29udHJvbGxlcnMvbG9naW5DdHJsLmpzIiwiY29udHJvbGxlcnMvbWFzdGVyQ3RybC5qcyIsImNvbnRyb2xsZXJzL25hdkN0cmwuanMiLCJjb250cm9sbGVycy9uZXdEYXRhQ3RybC5qcyIsImNvbnRyb2xsZXJzL3JlZ2lzdGVyQ3RybC5qcyIsImNvbnRyb2xsZXJzL3JvdXRlcy5qcyIsImNvbnRyb2xsZXJzL3ZhbGlkYXRlQ3RybC5qcyIsInNlcnZpY2VzL2F1dGguanMiLCJzZXJ2aWNlcy9wcm9nbml0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBQSxPQUFBLE1BQUE7QUFDQSxVQUFBOztBQ0RBLFFBQUEsT0FBQTtLQUNBLFdBQUEsc0NBQUEsU0FBQSxRQUFBLFlBQUE7UUFDQSxPQUFBLFFBQUE7UUFDQSxRQUFBLElBQUEsT0FBQTs7Ozs7O0FDSEEsUUFBQSxPQUFBO0tBQ0EsV0FBQSw2Q0FBQSxTQUFBLFFBQUEsT0FBQSxXQUFBOzs7O1FBSUEsT0FBQSxTQUFBO1FBQ0EsVUFBQSxJQUFBO1FBQ0EsT0FBQSxNQUFBLFNBQUEsS0FBQTtnQkFDQSxRQUFBLElBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSQSxRQUFBLE9BQUE7S0FDQSxXQUFBLHlEQUFBLFNBQUEsUUFBQSxNQUFBLFdBQUEsVUFBQTtRQUNBLE9BQUEsV0FBQTtRQUNBLE9BQUEsUUFBQSxTQUFBLFVBQUEsVUFBQTtZQUNBLEtBQUEsTUFBQSxVQUFBO2lCQUNBLEtBQUEsU0FBQSxLQUFBO29CQUNBLEtBQUEsV0FBQSxJQUFBLE1BQUEsV0FBQTt3QkFDQSxLQUFBOzZCQUNBLEtBQUEsU0FBQSxLQUFBO2dDQUNBLEtBQUEsYUFBQSxJQUFBLE1BQUEsV0FBQTtvQ0FDQSxLQUFBOzs7Ozs7aUJBTUEsTUFBQSxTQUFBLFVBQUE7b0JBQ0EsUUFBQSxNQUFBLGVB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QSxXQUFBO1lBQ0EsV0FBQSxXQUFBO1lBQ0EsSUFBQSxPQUFBLE9BQUEsT0FBQSxhQUFBO2dCQUNBOzs7OztRQUtBLFNBQUEsd0JBQUE7WUFDQSxJQUFBLFdBQUEsZUFBQTtnQkFDQSxVQUFBLEtBQUEsV0FBQTttQkFDQTtnQkFDQSxVQUFBLEtBQUE7Ozs7Ozs7O0FDOUVBLFFBQUEsT0FBQTtLQUNBLFFBQUEsNkRBQUEsU0FBQSxPQUFBLFNBQUEsV0FBQSxZQUFBOztRQUVBLE9BQUE7OztZQUdBLGlCQUFBLFNBQUEsUUFBQTtnQkFDQSxPQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLE9BQUEsUUFBQSxTQUFBLFlBQUE7b0JBQ0EsSUFBQSxPQUFBLFNBQUE7O29CQUVBLE9BQUEsVUFBQTs7O29CQUdBLE1BQUEsSUFBQSxPQUFBO3lCQUNBLEtBQUEsU0FBQSxNQUFBOzRCQUNBLFFBQUEsSUFBQTs7Ozs0QkFJQSxJQUFBLGVBQUE7Z0NBQ0EsV0FBQTsyQkFDQSxTQUFBLEtBQUE7NEJBQ0EsSUFBQSxJQUFBLFVBQUEsS0FBQTtnQ0FDQSxXQUFBLFdBQUE7Ozs7Ozs7O1lBUUEsS0FBQSxTQUFBLFFBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLEtBQUEsZ0JBQUE7Ozs7Ozs7O0FBUUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2FwcCcsW1xuJ25nUm91dGUnLCd1aS5yb3V0ZXInXG5dKSIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdlcnJvckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLmhlbGxvID0gXCJ0aGlzIGlzIGZyb20gdGhlIGNvbnRyb2xsZXIgaGVsbG9cIlxuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuaGVsbG8pXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdob21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIHByb2duaXRvcikge1xuXG5cblxuICAgICAgICAkc2NvcGUuYXBpVXJpID0gXCIvYXBpL2RhdGFcIlxuICAgICAgICBwcm9nbml0b3IucnVuKCRzY29wZSlcbiAgICAgICAgJHNjb3BlLnNldHVwKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvKiRodHRwLmdldCgnL2FwaS92ZWhpY2xlJylcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9kZWwgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbGVkIGFzeW5jaHJvbm91c2x5IGlmIGFuIGVycm9yIG9jY3Vyc1xuICAgICAgICAgICAgICAgICAgICAvLyBvciBzZXJ2ZXIgcmV0dXJucyByZXNwb25zZSB3aXRoIGFuIGVycm9yIHN0YXR1cy5cbiAgICAgICAgICAgICAgICB9KTsqL1xuXG5cblxuXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdsb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGF1dGgsICRsb2NhdGlvbiwgJHRpbWVvdXQpIHtcbiAgICAgICAgJHNjb3BlLmF1dGhGYWlsID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCkge1xuICAgICAgICAgICAgYXV0aC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1dGguc3RvcmVUb2tlbihyZXMuZGF0YSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoLmdldFVzZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoLnBvc3RMb2dpbk9wcyhyZXMuZGF0YSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoLnBvc3RMb2dpblJvdXRlSGFuZGxlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0dpc3RzIGVycm9yJywgcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5hdXRoRmFpbCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkgeyAkc2NvcGUuYXV0aEZhaWwgPSBmYWxzZTsgfSwgMzAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbmFsbHkgZmluaXNoZWQgZ2lzdHNcIik7XG4gICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICB9XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdtYXN0ZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkcm91dGUsICRodHRwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibWFzdGVyQ3RybFwiKTtcblxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvZ2dlZF91c2VyJykpIHsgICAgICAgIFx0XG4gICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2xvZ2dlZF91c2VyJylcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyX3Rva2VuJylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyX3Rva2VuJykpXG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLiRvbignbG9naW4nLCBmdW5jdGlvbihfLCB1c2VyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2dlZCBJblwiKTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50VXNlciA9IHVzZXJcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbG9nZ2VkX3VzZXInLCAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyLnVzZXJuYW1lKVxuICAgICAgICB9KVxuICAgIH0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignbmF2Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgYXV0aCwgJGxvY2F0aW9uKSB7ICAgICAgICBcbiAgICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCkgeyAgICAgICAgICAgIFxuICAgICAgICAgICAgYXV0aC5sb2dvdXQoKSAgICAgICAgICAgICAgICBcblxuICAgICAgICB9XG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCduZXdEYXRhQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbikge1xuXG5cbiAgICAgICAgJHNjb3BlLnNhdmVEYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNhdmVcIilcbiAgICAgICAgICAgICRodHRwLnBvc3QoJy9hcGkvZGF0YScsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQxOiAkc2NvcGUuZmllbGQxLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZDI6ICRzY29wZS5maWVsZDIsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkMzogJHNjb3BlLmZpZWxkMyxcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ0OiAkc2NvcGUuZmllbGQ0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuLmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ3RybCcsZnVuY3Rpb24oJHNjb3BlLGF1dGgsJGxvY2F0aW9uKXtcblx0JHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24obmFtZSx1c2VybmFtZSxwYXNzd29yZCl7XG5cdFx0YXV0aC5yZWdpc3RlcihuYW1lLHVzZXJuYW1lLHBhc3N3b3JkKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcdFx0XHRcblx0XHRcdGF1dGgubG9naW4odXNlcm5hbWUscGFzc3dvcmQpXG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvZ2luJyxyZXNwb25zZS5kYXRhKVxuXHRcdFx0JGxvY2F0aW9uLnBhdGgoJy9ob21lJylcblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycilcblx0XHR9KVxuXHR9XG5cbn0pXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXBwJylcbi5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwkbG9jYXRpb25Qcm92aWRlcil7XG4gXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuIFxuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAnLHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25hdi5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbmF2Q3RybCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9sb2dpbi5odG1sJyAsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ3RybCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICAuc3RhdGUoJ2FwcC5sb2dpbicse1xuICAgICAgICB1cmw6ICdsb2dpbicsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnaGVhZGVyJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL25hdi5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbmF2Q3RybCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnY29udGVudCc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5DdHJsJ1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuIFxuICAgIC5zdGF0ZSgnYXBwLnJlZ2lzdGVyJywge1xuICAgICAgICB1cmw6ICdyZWdpc3RlcicsXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdyZWdpc3Rlci5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncmVnaXN0ZXJDdHJsJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gXG4gICAgfSlcblxuICAgIC5zdGF0ZSgnYXBwLnZhbGlkYXRlJywge1xuICAgICAgICB1cmw6ICdzaWdudXAvdmFsaWRhdGUvOmlkJywgICAgICAgIFxuIFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXNlcnMvdmFsaWRhdGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3ZhbGlkYXRlQ3RybCcgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gXG4gICAgfSlcblxuIFxuICAgIC5zdGF0ZSgnYXBwLmhvbWUnLCB7XG4gICAgICAgIHVybDogJ2hvbWUnLFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXNlcnMvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiBcbiAgICB9KVxuXG4gICAgIC5zdGF0ZSgnYXBwLmhvbWUuZGF0YScsIHtcbiAgICAgICAgdXJsOiAnL2RhdGEvbmV3JyxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdjb250ZW50QCc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3VzZXJzL25ld0RhdGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ25ld0RhdGFDdHJsJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gXG4gICAgfSlcblxuICAgICAuc3RhdGUoJ2FwcC5ob21lLmRldGFpbHMnLCB7XG4gICAgICAgIHVybDogJy92ZWhpY2xlcy86aWQnLCAgICAgICAgXG4gXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnY29udGVudEAnOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2ZWhpY2xlcy9lZGl0VmVoaWNsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVmVoaWNsZXNFZGl0SW5mb0N0cmwnICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuIFxuICAgIH0pXG5cbiAgICAgLnN0YXRlKCdhcHAuaG9tZS5tYXAnLCB7XG4gICAgICAgIHVybDogJy92ZWhpY2xlcy9tYXAvOmlkJywgICAgICAgIFxuIFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2NvbnRlbnRAJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmVoaWNsZXMvbWFwVmVoaWNsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVmVoaWNsZXNFZGl0TWFwQ3RybCcgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gXG4gICAgfSlcblxuXG4gICAgXG4gXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpXG4gXG59KTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ3ZhbGlkYXRlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcykge1xuXG4gICAgICAgIFxuICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWVcblxuICAgICAgICAkaHR0cC5nZXQoJ2FwaS91c2Vycy92YWxpZGF0ZS8nICsgJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgICAgIGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcbiAgICAgICAgICAgICAgICBcdCRzY29wZS52ZXJpZmllZCA9IHRydWVcbiAgICAgICAgICAgICAgICBcdCRzY29wZS5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBcdCRzY29wZS52ZXJpZmllZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgXHQkc2NvcGUubG9hZGluZyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuXG5cblxuXG4gICAgfSlcbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAgIC5zZXJ2aWNlKCdhdXRoJywgZnVuY3Rpb24oJGh0dHAsICR3aW5kb3csICRsb2NhdGlvbiwgJHJvb3RTY29wZSkge1xuXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldFVzZXI6IGdldFVzZXIsXG4gICAgICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgICAgICByZWdpc3RlcjogcmVnaXN0ZXIsXG4gICAgICAgICAgICBsb2dvdXQ6IGxvZ291dCxcbiAgICAgICAgICAgIHN0b3JlVG9rZW46IHN0b3JlVG9rZW4sXG4gICAgICAgICAgICBpc0xvZ2dlZDogaXNMb2dnZWQsXG4gICAgICAgICAgICBwb3N0TG9naW5PcHM6IHBvc3RMb2dpbk9wcyxcbiAgICAgICAgICAgIHBvc3RMb2dpblJvdXRlSGFuZGxlcjogcG9zdExvZ2luUm91dGVIYW5kbGVyXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdhcGkvdXNlcnMnKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdhcGkvc2Vzc2lvbnMnLCB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyKG5hbWUsIHVzZXJuYW1lLCBwYXNzd29yZCkge1xuXG4gICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2FwaS91c2VycycsIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyX3Rva2VuJyk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnbG9nZ2VkX3VzZXInKTtcbiAgICAgICAgICAgIGRlbGV0ZSAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ11cbiAgICAgICAgICAgICRyb290U2NvcGUuaXNMb2dnZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSBudWxsO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbG9naW5cIilcblxuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0b3JlVG9rZW4ocmVzLCBjYikge1xuICAgICAgICAgICAgJHdpbmRvdy5zZXNzaW9uU3RvcmFnZVtcInVzZXJfdG9rZW5cIl0gPSByZXNcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyX3Rva2VuJywgcmVzKTtcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9ICR3aW5kb3cuc2Vzc2lvblN0b3JhZ2UudXNlcl90b2tlblxuICAgICAgICAgICAgaWYgKGNiICYmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzTG9nZ2VkKCkge1xuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwb3N0TG9naW5PcHMocmVzLCBjYikge1xuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSByZXMubmFtZVxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xvZ2dlZF91c2VyJywgJHJvb3RTY29wZS5jdXJyZW50VXNlcilcbiAgICAgICAgICAgICRyb290U2NvcGUuaXNMb2dnZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGNiICYmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcG9zdExvZ2luUm91dGVIYW5kbGVyKCkge1xuICAgICAgICAgICAgaWYgKCRyb290U2NvcGUuaW50ZW5kZWRSb3V0ZSkge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCRyb290U2NvcGUuaW50ZW5kZWRSb3V0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvaG9tZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgfSlcbiIsIlxuYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gICAgLnNlcnZpY2UoJ3Byb2duaXRvcicsIGZ1bmN0aW9uKCRodHRwLCAkd2luZG93LCAkbG9jYXRpb24sICRyb290U2NvcGUpIHtcblxuICAgICAgICByZXR1cm4ge1xuXG5cbiAgICAgICAgICAgIHNldFNldHVwUHJvY2VzczogZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUpXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNldHVwID0gZnVuY3Rpb24oY2FsbGJhY2tGbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmxvYWRpbmcpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cblxuICAgICAgICAgICAgICAgICAgICAkaHR0cC5nZXQoJHNjb3BlLmFwaVVyaSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogJHNjb3BlLnN0YXRlLmxhc3RQYWdlID0gZGF0YS5sYXN0X3BhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmlzTGFzdFBhZ2UgPSAoJHNjb3BlLnN0YXRlLnBhZ2VOdW0gPT0gJHNjb3BlLnN0YXRlLmxhc3RQYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlOyovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrRm4gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tGbihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09IDQwNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3JlbmRlcjQwNCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG5cblxuICAgICAgICAgICAgcnVuOiBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluIHByb2duaXRvciBzZXJ2aWNlXCIpXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZXR1cFByb2Nlc3MoJHNjb3BlKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuXG4gICAgfSlcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
