(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Privilege', Privilege);

    Privilege.$inject = ['$http'];

    function Privilege ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany
        };

        return service;

        function getAll() {
            return $http.get('/api/privileges/search?query=&size=1000000').then(function(response) {
                return response.data;
            });
        }

        function create(privilege) {
            return $http.post('/api/privileges', privilege).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/privileges/search?' + params).then(function (response) {
                return response;
            });
        }

        function getOne(id) {
            return $http.get('/api/privileges/'+id).then(function(response) {
                return response.data;
            });
        }

        function update(privilege) {
            return $http.put('/api/privileges/' + privilege.id, privilege).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/privileges/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/privileges/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
