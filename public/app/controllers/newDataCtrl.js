angular.module('app')
    .controller('newDataCtrl', function($scope, $http, $location) {


        $scope.saveData = function() {
            console.log("save")
            $http.post('/api/data', {
                    field1: $scope.field1,
                    field2: $scope.field2,
                    field3: $scope.field3,
                    field4: $scope.field4
                })
                .then(function(response) {
                    console.log(response)
                }, function(response) {
                    console.log(response)
                });

        }



    })
