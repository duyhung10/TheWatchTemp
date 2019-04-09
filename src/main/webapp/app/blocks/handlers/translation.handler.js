(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('translationHandler', translationHandler);

    translationHandler.$inject = ['$rootScope', '$window', '$state', '$translate','$timeout'];

    function translationHandler($rootScope, $window, $state, $translate,$timeout) {
        return {
            initialize: initialize,
            updateTitle: updateTitle
        };

        function initialize() {
            // if the current translation changes, update the window title
            var translateChangeSuccess = $rootScope.$on('$translateChangeSuccess', function() {
                updateTitle();
            });

            $rootScope.$on('$destroy', function () {
                if(angular.isDefined(translateChangeSuccess) && translateChangeSuccess !== null){
                    translateChangeSuccess();
                }
            });
        }


        // update the window title using params in the following
        // precedence
        // 1. titleKey parameter
        // 2. $state.$current.data.pageTitle (current state page title)
        // 3. 'global.title'
        function updateTitle(titleKey) {
            if (!titleKey && $state.$current.data && $state.$current.data.pageTitle) {
                titleKey = $state.$current.data.pageTitle;
            }
            $translate(titleKey).then(function (title) {
                $timeout(function(){
                    $window.document.title = title;
                });
            });
        }
    }
})();
