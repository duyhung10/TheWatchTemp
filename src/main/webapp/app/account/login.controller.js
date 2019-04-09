(function() {
    'use strict';

    angular
        .module('erpApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$state', '$timeout', 'Auth'];

    function LoginController ($rootScope, $state, $timeout, Auth) {
        var vm = this;

        vm.authenticationError = false;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.rememberMe = true;
        vm.email = null;

        $timeout(function (){angular.element('#email').focus();});

        function login (event) {
            event.preventDefault();
            Auth.login({
                email: vm.email,
                password: vm.password,
                rememberMe: vm.rememberMe
            }).then(function () {
                vm.authenticationError = false;

                $state.go('dashboard', {from: 'login'});

                // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // since login is successful, go to stored previousState and clear previousState
                if (Auth.getPreviousState()) {
                    var previousState = Auth.getPreviousState();
                    Auth.resetPreviousState();
                    $state.go(previousState.name, previousState.params);
                }
            }).catch(function () {
                vm.authenticationError = true;
            });
        }
    }
})();
