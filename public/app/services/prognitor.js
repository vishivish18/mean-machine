
angular.module('app')
    .service('prognitor', function($http, $window, $location, $rootScope) {

        return {


            setSetupProcess: function($scope) {
                $scope.loading = false;

                $scope.setup = function(callbackFn) {
                    if ($scope.loading) return;

                    $scope.loading = true;


                    $http.get($scope.apiUri, {
                            data: {
                                filters: $scope.filters,
                                sortings: $scope.sortings,
                                with: $scope.with,

                                page: $scope.state.pageNum,
                                _format: 'default',
                                _per_page: $scope.state.perPage,
                                _pagination: $scope._pagination
                            }
                        })
                        .then(function(data) {

                            $scope.state.lastPage = data.last_page;
                            $scope.isLastPage = ($scope.state.pageNum == $scope.state.lastPage);
                            $scope.loading = false;
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

                this.setSetupProcess($scope);

            }
        }



    })
