angular.module('app')
.config(function($stateProvider, $urlRouterProvider,$locationProvider){
 
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
 
    .state('app.home', {
        url: 'home',
        views: {
            'content@': {
                templateUrl: 'users/home.html',
                controller: 'homeCtrl'
            }
        }
 
    })

     .state('app.home.vehicles', {
        url: '/vehicles/new',
        views: {
            'content@': {
                templateUrl: 'vehicles/newVehicle.html',
                controller: 'VehiclesNewInfoCtrl'
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
 
});

