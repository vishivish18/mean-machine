
angular.module('app')
    .service('prognitor', function($http, $window, $location, $rootScope) {

        return {


            setSetupProcess: function($scope) {
                $scope.loading = false;
                console.log($scope)
                $scope.setup = function(callbackFn) {
                    if ($scope.loading) return;

                    $scope.loading = true;


                    $http.get($scope.apiUri)
                        .then(function(data) {
                            console.log(data)
                           /* $scope.state.lastPage = data.last_page;
                            $scope.isLastPage = ($scope.state.pageNum == $scope.state.lastPage);
                            $scope.loading = false;*/
                            if (callbackFn !== undefined)
                                callbackFn(data);
                        }, function(res) {
                            if (res.status == 404) {
                                $rootScope.$broadcast('render404');
                            }

                        });
                };
            },


            run: function($scope) {
                console.log("in prognitor service")
                this.setSetupProcess($scope);

            }
        }



    })
