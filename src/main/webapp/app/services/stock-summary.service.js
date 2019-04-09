(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('StockSummary', StockSummary);

    StockSummary.$inject = ['$http'];

    function StockSummary ($http) {
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
            return $http.get('/api/stock-report-summaries').then(function(response) {
                return response.data;
            });
        }

        function create(product) {
            return $http.post('/api/stock-report-summaries',product).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/stock-report-summaries/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/stock-report-summaries/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(sequence) {
            return $http.put('/api/stock-report-summaries/' + sequence.id, sequence).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/stock-report-summaries/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/stock-report-summaries/'+ id).then(function(response) {
                return response.data;
            });
        }

        function getOrigins(params,groupBy) {
            var url = '/api/stock-report-summaries/advanced-group?query=expression=="groupBy=='+groupBy+ ';orderBy==id,desc"'
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
