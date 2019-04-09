(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('StockDetail', StockDetail);

    StockDetail.$inject = ['$http'];

    function StockDetail ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            getOrigins:getOrigins
        };

        return service;

        function getAll() {
            return $http.get('/api/stock-report-details').then(function(response) {
                return response.data;
            });
        }

        function create(product) {
            return $http.post('/api/stock-report-details',product).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/stock-report-details/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/stock-report-details/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(sequence) {
            return $http.put('/api/stock-report-details/' + sequence.id, sequence).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/stock-report-details/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/stock-report-details/'+ id).then(function(response) {
                return response.data;
            });
        }

        function getOrigins(params,groupBy) {
            var url = '/api/stock-report-details/advanced-group?query=expression=="groupBy=='+groupBy+ ';orderBy==id,desc"'
            if(params !='' && params[0] !='&'){
                url += ";";
            }
            url +=params;
            return $http.get(url).then(function(response) {
                return response;
            });
        }

    }
})();
