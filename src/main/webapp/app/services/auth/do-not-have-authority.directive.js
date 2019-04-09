(function() {
    'use strict';

    angular
        .module('erpApp')
        .directive('doNotHaveAuthority', doNotHaveAuthority);

    doNotHaveAuthority.$inject = ['Principal'];

    function doNotHaveAuthority(Principal) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            var authorities = attrs.doNotHaveAuthority.replace(/\s+/g, '').split(',');
            var setVisible = function () {
                $(element).show();
                },
                setHidden = function () {
                    $(element).hide();
                },
                defineVisibility = function (reset) {
                    var result;
                    if (reset) {
                        setVisible();
                    }

                    result = Principal.doNotHaveAuthority(authorities);
                    if (result) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (authorities.length > 0) {
                defineVisibility(true);

                scope.$watch(function() {
                    return Principal.isAuthenticated();
                }, function() {
                    defineVisibility(true);
                });
            }
        }
    }
})();
