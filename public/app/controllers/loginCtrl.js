angular.module('app')
    .controller('loginCtrl', function($scope, auth, $location, $timeout) {
        $scope.authFail = false;
        $scope.login = function(username, password) {
            auth.login(username, password)
                .then(function(res) {
                    auth.storeToken(res.data, function() {
                        auth.getUser()
                            .then(function(res) {
                                auth.postLoginOps(res.data, function() {
                                    auth.postLoginRouteHandler();
                                });
                            })
                    });

                })
                .catch(function(response) {
                    console.error('Gists error', response.status, response.data);
                    if (response.status == 401) {
                        $scope.authFail = true
                        $timeout(function() { $scope.authFail = false; }, 3000);
                    }
                })
                .finally(function() {
                    console.log("finally finished gists");
                });


        }
    })
