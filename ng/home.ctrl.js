angular.module('app')
.controller('HomeCtrl',function($scope,$rootScope){ 
  $scope.hello = "this is from the controller hello"
 	console.log($rootScope.currentUser)
 	
 	$scope.name = localStorage.getItem('logged_user');
 	console.log($scope.name);
 
})

 