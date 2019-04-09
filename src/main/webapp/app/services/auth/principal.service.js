(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Principal', Principal);

    Principal.$inject = ['$q', 'User'];

    function Principal ($q, User) {
        var _identity,
            _authenticated = false;

        var service = {
            authenticate: authenticate,
            hasAnyAuthority: hasAnyAuthority,
            hasAuthority: hasAuthority,
            doNotHaveAuthority: doNotHaveAuthority,
            identity: identity,
            isAuthenticated: isAuthenticated,
            isIdentityResolved: isIdentityResolved
        };

        return service;

        function authenticate (identity) {
            _identity = identity;
            _authenticated = identity !== null;
        }

        function hasAnyAuthority (authorities) {
            if (!_authenticated || !_identity || !_identity.authorities) {
                return false;
            }

            for (var i = 0; i < authorities.length; i++) {
                if (_identity.authorities.indexOf(authorities[i]) !== -1) {
                    return true;
                }
            }

            return false;
        }

        function hasAuthority (authority) {
            if (!_authenticated) {
                return $q.when(false);
            }

            return this.identity().then(function(_id) {
                return _id.authorities && _id.authorities.indexOf(authority) !== -1;
            }, function(){
                return false;
            });
        }

        function doNotHaveAuthority (authorities) {
            if (!_authenticated || !_identity || !_identity.authorities) {
                return false;
            }

            var valid = false;
            for (var i = 0; i < authorities.length; i++) {
                if (_identity.authorities.indexOf(authorities[i]) === -1) {
                    valid = true;
                } else {
                    return false;
                }
            }

            return valid;
        }

        function identity (force) {
            var deferred = $q.defer();

            if (force === true) {
                _identity = undefined;
            }

            // check and see if we have retrieved the identity data from the server.
            // if we have, reuse it by immediately resolving
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity);

                return deferred.promise;
            }

            // retrieve the identity data from the server, update the identity object, and then resolve.
            // User.current().$promise
            User.current()
                .then(getCurrentUserThen)
                .catch(getCurrentUserCatch);

            return deferred.promise;

            function getCurrentUserThen (data) {
                _identity = data;
                _authenticated = true;
                deferred.resolve(_identity);
            }

            function getCurrentUserCatch () {
                _identity = null;
                _authenticated = false;
                deferred.resolve(_identity);
            }
        }

        function isAuthenticated () {
            return _authenticated;
        }

        function isIdentityResolved () {
            return angular.isDefined(_identity);
        }
    }
})();
