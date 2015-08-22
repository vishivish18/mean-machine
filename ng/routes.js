angular.module('app')
.config(function($routeProvider) {
	$routeProvider
	.when('/',{controller:'LoginCtrl',templateUrl:'login.html'})	
	.when('/posts',{controller:'PostsCtrl',templateUrl:'posts.html'})
	.when('/register',{controller:'RegisterCtrl',templateUrl:'register.html'})
	.when('/home',{controller:'HomeCtrl',templateUrl:'home.html'})	
	
})