angular
    .module('erpApp')
    .controller('errorCtrl', [
        '$timeout',
        '$scope',
        '$window',
        '$state',
        'Auth',
        '$rootScope',
        function ($timeout,$scope,$window,$state,Auth,$rootScope) {
            $scope.logout = function() {
                Auth.logout();
                $state.go('login');
            }
        }
    ])
;