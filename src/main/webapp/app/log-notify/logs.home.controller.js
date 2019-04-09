(function(){
    'use strict';
    angular.module('erpApp')
        .controller('LogsHomeController', LogsHomeController);

    LogsHomeController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        'AlertService',
        '$translate',
        'apiData',
        '$http',
        'ErrorHandle',
        '$window'];
    function LogsHomeController($rootScope, $scope, $state, AlertService, $translate, apiData, $http, ErrorHandle, $window) {

        console.log("WELCOME TO LOGS!");

        $scope.logData = [
            {
                'date': moment().startOf('month').add(7, 'days').format("DD.MM.YYYY"),
                'data': [
                    {
                        'userName': 'thuylt',
                        'action': 'The project has been updated',
                        'detail': 'GW020 -> GW040'
                    },
                    {
                        'userName': 'tranghtt',
                        'action': 'The operation type has been updated',
                        'detail': 'Receipt -> Internal'
                    }
                ]
            },
            {
                'date': moment().startOf('month').add(8, 'days').format("DD.MM.YYYY"),
                'data': [
                    {
                        'userName': 'thuylt',
                        'action': 'The project has been updated',
                        'detail': 'GW020 -> GW040'
                    }
                ]
            },
            {
                'date': moment().startOf('month').add(9, 'days').format("DD.MM.YYYY"),
                'data': [
                    {
                        'userName': 'thuylt',
                        'action': 'The project has been updated',
                        'detail': 'GW020 -> GW040'
                    },
                    {
                        'userName': 'tranghtt',
                        'action': 'The operation type has been updated',
                        'detail': 'Receipt -> Internal'
                    }
                ]
            },
            {
                'date': moment().startOf('month').add(10, 'days').format("DD.MM.YYYY"),
                'data': [
                    {
                        'userName': 'tranghtt',
                        'action': 'The operation type has been updated',
                        'detail': 'Receipt -> Internal'
                    }
                ]
            }
        ]
    }

})();