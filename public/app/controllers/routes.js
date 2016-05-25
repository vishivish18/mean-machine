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
 
});

