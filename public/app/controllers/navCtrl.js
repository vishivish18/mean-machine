angular.module('app')
    .controller('navCtrl', function($scope, auth, $location) {        
        $scope.logout = function() {            
            auth.logout()                

        }
    })
