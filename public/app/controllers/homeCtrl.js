angular.module('app')
    .controller('homeCtrl', function($scope, $http) {
        $scope.apiUri = "/api/data"
        //prognitor.run($scope)
        $scope.setup(function(res) {
            console.log(res)
        })
    })
