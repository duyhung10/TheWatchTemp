(function(){
    'use strict';
    angular.module('erpApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$rootScope','$scope','$state','$stateParams', 'AlertService','$translate','variables', 'apiData', '$http', 'ErrorHandle', '$window', 'Dashboard'];
    function DashboardController($rootScope,$scope, $state,$stateParams, AlertService, $translate, variables, apiData, $http, ErrorHandle, $window, Dashboard) {

    }

})();