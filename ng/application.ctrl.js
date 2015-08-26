angular.module('app')
.controller('ApplicationCtrl',function($scope,$rootScope){
	$scope.$on('login',function(_,user){
		$scope.currentUser = user
		$rootScope.currentUser = user
		localStorage.setItem('logged_user',$rootScope.currentUser.username)
	})

})