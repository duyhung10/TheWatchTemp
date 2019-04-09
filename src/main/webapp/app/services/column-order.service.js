(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ColumnOrder', ColumnOrder);

    ColumnOrder.$inject = ['$http'];

    function ColumnOrder ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            getDefaultFromSystem: getDefaultFromSystem,
            getDefaultTable: getDefaultTable,
            getList: getList,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate: activate,
            deactivate: deactivate,
            checkNameExist: checkNameExist,
            addDataFromOtherUser: addDataFromOtherUser,
            deleteDataFromOtherUser: deleteDataFromOtherUser
        };

        return service;

        function getAll() {
            return $http.get('/api/column-orders').then(function(response) {
                return response.data;
            });
        }

        function create(columnOrders) {
            return $http.post('/api/column-orders',columnOrders).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get('/api/column-orders/' +id).then(function (response) {
                return response.data;
            });
        }

        function getDefaultFromSystem(tableName) {
            return $http.get('/api/column-orders/get-default-from-system?table_name='+ tableName).then(function (response) {
                return response.data;
            });
        }

        function getDefaultTable(ownerId, tableName) {
            return $http.get('/api/column-orders/get-by-default?owner=' + ownerId + '&table_name='+ tableName).then(function (response) {
                return response.data;
            });
        }

        function getList(ownerId, tableName) {
            return $http.get('/api/column-orders/list?owner=' + ownerId + '&table_name='+ tableName).then(function (response) {
                return response.data;
            });
        }

        function update(id, warehouse) {
            return $http.put('/api/column-orders/' + id, warehouse).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get('/api/column-orders/search?' + params).then(function (response) {
                return response;
            });
        }

        function deleteOne(id) {
            return $http.delete('/api/column-orders/' + id).then(function (response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post('/api/column-orders/batch-delete', ids).then(function (response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post('/api/column-orders/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post('/api/column-orders/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function checkNameExist(ownerId, name, tableName) {
            return $http.get('/api/column-orders/check-name-exist?owner=' + ownerId + '&name='+ name + '&table_name='+ tableName).then(function (response) {
                return response.data;
            });
        }

        function addDataFromOtherUser(newData) {
            return $http.post('/api/column-order-ignore-users', newData).then(function(response) {
                return response.data;
            });
        }

        function deleteDataFromOtherUser(columnOrderId, ownerId) {
            return $http.post('/api/column-order-ignore-users/delete-data?column_order=' + columnOrderId + '&owner='+ ownerId).then(function (response) {
                return response.data;
            });
        }
    }
})();
