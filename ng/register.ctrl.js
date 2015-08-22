angular.module('app')
.controller('RegisterCtrl',function($scope,UserSvc){
	$scope.register = function(username,password){
		UserSvc.register(username,password)
		.then(function(response){
			alert('Thank you for signing up '+ response.data.username)
		})
		.catch(function (err){
			console.log(err)
		})
	}

})
