angular.module('app')
    .controller('masterCtrl', function($scope, $rootScope, $route) {
        console.log("masterCtrl");

        if (localStorage.getItem('logged_user')) {        	
            $rootScope.currentUser = localStorage.getItem('logged_user')
        }
        $scope.$on('login', function(_, user) {
            console.log("Logged In");
            $scope.currentUser = user
            $rootScope.currentUser = user
            localStorage.setItem('logged_user', $rootScope.currentUser.username)
        })
    })
