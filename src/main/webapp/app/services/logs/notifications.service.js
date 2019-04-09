(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('NotificationService', NotificationService);

    NotificationService.$inject = ['$http'];

    function NotificationService ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate,
            getOneByNoteId:getOneByNoteId,
            countAll: countAll,
            getLastRecord: getLastRecord,
            getAllByRecepientNotRead: getAllByRecepientNotRead,
            getAllByRecepientHide: getAllByRecepientHide
        };

        return service;

        function getAll() {
            return $http.get('/api/notifications').then(function(response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post('/api/notifications',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/notifications/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/notifications/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put('/api/notifications/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post('/api/notifications/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete('/api/notifications/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/notifications/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/notifications/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function getOneByNoteId(noteId) {
            return $http.get('/api/notifications/get-by-note_id?noteId=' + noteId).then(function (response) {
                return response;
            });
        }
        
        function countAll() {
            return $http.get('/api/notifications/count-all').then(function (response) {
                return response;
            });
        }

        function getLastRecord() {
            return $http.get('/api/notifications/get-last-record').then(function (response) {
                return response;
            });
        }

        function getAllByRecepientNotRead(recepientId) {
            return $http.get('/api/notifications/get-by-recipient-not-read?recipientId=' + recepientId).then(function (response) {
                return response;
            });
        }

        function getAllByRecepientHide(recepientId) {
            return $http.get('/api/notifications/get-by-recipient-hide?recipientId=' + recepientId).then(function (response) {
                return response;
            });
        }
    }
})();
