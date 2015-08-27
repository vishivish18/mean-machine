angular.module('app')
.config(function($routeProvider) {
	$routeProvider
	.when('/',{controller:'LoginCtrl',templateUrl:'login.html'})	
	.when('/posts',{controller:'PostsCtrl',templateUrl:'posts.html'})
	.when('/register',{controller:'RegisterCtrl',templateUrl:'register.html'})
	.when('/home',{controller:'HomeCtrl',templateUrl:'users/home.html'})	
	.when('/vehicles/new/info',{controller:'VehiclesCtrl',templateUrl:'vehicles/new/info.html'})	
	.when('/401',{controller:'ErrorCtrl',templateUrl:'errors/401.html'})	
	
})