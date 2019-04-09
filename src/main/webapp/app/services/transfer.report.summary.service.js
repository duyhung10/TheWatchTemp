(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('TransferReportSummary', TransferReportSummary);

    TransferReportSummary.$inject = ['$http'];

    function TransferReportSummary ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function getAll() {
            return $http.get('/api/transfer-report-summaries').then(function(response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post('/api/transfer-report-summaries',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/transfer-report-summaries/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/transfer-report-summaries/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put('/api/transfer-report-summaries/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/transfer-report-summaries/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/transfer-report-summaries/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/transfer-report-summaries/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/transfer-report-summaries/deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
