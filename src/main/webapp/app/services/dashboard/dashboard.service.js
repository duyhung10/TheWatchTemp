(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Dashboard', Dashboard);

    Dashboard.$inject = ['$http'];

    function Dashboard ($http) {
        var service = {
            getFinalProductAvailable: getFinalProductAvailable,
            getTransfersCount: getTransfersCount
        };

        return service;

        function getFinalProductAvailable() {
            return $http.get('/api/dashboard/final-product-available').then(function(response) {
                return response.data;
            });
        }

        function getTransfersCount(query) {
            return $http.get('/api/dashboard/transfers-count?' + query).then(function(response) {
                return response.data;
            });
        }
    }
})();
