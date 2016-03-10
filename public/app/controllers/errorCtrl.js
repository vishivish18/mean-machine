angular.module('app')
    .controller('errorCtrl', function($scope, $rootScope) {
        $scope.hello = "this is from the controller hello"
        console.log($scope.hello)



    })
