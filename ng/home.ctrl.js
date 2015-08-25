angular.module('app')
.controller('HomeCtrl',function($scope,$rootScope){ 
  $scope.hello = "this is from the controller hello"
 	$scope.name = $rootScope.currentUser
 
})

 