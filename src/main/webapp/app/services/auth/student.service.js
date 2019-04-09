(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Student', Student);

    Student.$inject = ['$http'];

    function Student ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            getStudentById: getStudentById,
        };

        return service;

        function getAll() {
            return $http.get('/api/students/search?query=&size=1000').then(function(response) {
                return response.data;
            });
        }

        function create(student) {
            return $http.post('/api/students', student).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/roles/search?' + params).then(function (response) {
                return response;
            });
        }

        function getOne(id) {
            return $http.get('/api/students/'+id).then(function(response) {
                return response.data;
            });
        }

        function update(student) {
            return $http.put('/api/students/' + student.id, student).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/students/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/students/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function getStudentById(id) {
            return $http.get('/api/students/' + id).then(function(response) {
                return response.data;
            });
        }
    }
})();
