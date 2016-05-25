angular.module('app')
    .controller('homeCtrl', function($scope, $http, prognitor) {



        $scope.apiUri = "/api/data"
        prognitor.run($scope)
        $scope.setup(function(res) {
                console.log(res)
            })
            /*$http.get('/api/vehicle')
                .then(function(response) {
                    $scope.model = response.data;

                }, function(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });*/







    })
