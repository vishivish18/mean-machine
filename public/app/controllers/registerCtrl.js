angular.module('app')
.controller('registerCtrl',function($scope,auth,$location){
	$scope.oauth = function(provider){
		console.log(provider)
		window.open('http://localhost:1805/auth/'+provider)
	}

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

})
