angular.module('app')
    .controller('validateCtrl', function($scope, $http, $stateParams) {

        
        $scope.loading = true

        $http.get('api/users/validate/' + $stateParams.id)
            .then(function(res) {
                console.log(res)
                if(res.status == 200){
                	$scope.verified = true
                	$scope.loading = false
                }else{
                	$scope.verified = false
                	$scope.loading = false
                }

            })




    })
