(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Role', Role);

    Role.$inject = ['$http'];

    function Role ($http) {
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
            return $http.get('/api/roles/search?query=&size=1000').then(function(response) {
                return response.data;
            });
        }

        function create(role) {
            return $http.post('/api/roles', role).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/roles/search?' + params).then(function (response) {
                return response;
            });
        }

        function getOne(id) {
            return $http.get('/api/roles/'+id).then(function(response) {
                return response.data;
            });
        }

        function update(role) {
            return $http.put('/api/roles/' + role.id, role).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/roles/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/roles/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
