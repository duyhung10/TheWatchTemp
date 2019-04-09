(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('User', User);

    User.$inject = ['$http'];

    function User ($http) {
        var service = {
            current : current,
            getAll: getAll,
            create: create,
            getPage: getPage,
            getUserById: getUserById,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate,
            uploadAvatar:uploadAvatar,
            deleteAvatar:deleteAvatar
        };

        return service;

        function current() {
            return $http.get('/api/users/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get('/api/users').then(function(response) {
                return response.data;
            });
        }

        function create(user) {
            return $http.post('/api/users',user).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/users/search?' + params).then(function (response) {
                return response;
            });
        }

        function getUserById(id) {
            return $http.get('/api/users/' + id).then(function(response) {
                return response.data;
            });
        }

        function update(user) {
            return $http.put('/api/users/' + user.id, user).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/users/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/users/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/users/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/users/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function uploadAvatar(userId, file) {
            var fd = new FormData();
            fd.append('file', file);
            return $http.post('/api/users/'+ userId +'/uploadAvatar?&file='+file, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response;
            });
        }

        function deleteAvatar(userId) {
            return $http.post('/api/users/'+ userId +'/deleteAvatar').then(function(response) {
                return response.data;
            });
        }
    }
})();
