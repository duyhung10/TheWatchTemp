(function () {
    'use strict';
    angular
        .module('erpApp')
        .factory('CbxService', CbxService);

    CbxService.$inject = ['$translate','apiData','$http'];

    function CbxService($translate,apiData,$http, $scope) {
        var service = {
            initCbxs: initCbxs
        };

        return service;

        function init(scopeParam, cbxId) {
            $scope = scopeParam;
            $scope.CBXs[cbxId].CbxInit = {
                url: $scope.CBXs[cbxId].url, // ** api load data
                OriginParams: $scope.CBXs[cbxId].OriginParams, // ** init params -- default: null
                queryRelate : null, // ** init query relate cbx -- default: null
                valueField: $scope.CBXs[cbxId].valueField, labelField: $scope.CBXs[cbxId].labelField, searchField: $scope.CBXs[cbxId].searchField, // ** valueField: value select cbx, labelField: display cbx, searchField: field search
                perPage: 10, totalCount: null, page: 0, resetScroll: false
            }

            $scope.CBXs[cbxId].CbxInfo = { // ** replace name cbx
                ngModel : $scope.CBXs[cbxId].ngModel, // ** value select -- array []
                Options: $scope.CBXs[cbxId].Options, // ** list options cbx, default: []
                Table : $scope.CBXs[cbxId].table, // ** table filter
                Column :$scope.CBXs[cbxId].column, // ** number column filter on table
                Scope : $scope,
                Config: {
                    placeholder : $scope.CBXs[cbxId].placeholder,
                    plugins: ['infinite_scroll'],//enable load more
                    maxItems: $scope.CBXs[cbxId].maxItems,
                    valueField: $scope.CBXs[cbxId].CbxInit.valueField,
                    labelField: $scope.CBXs[cbxId].CbxInit.labelField,
                    searchField: $scope.CBXs[cbxId].CbxInit.searchField,
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                '<span class="title">' + escape(data[$scope.CBXs[cbxId].CbxInit.labelField]) + '</span>' +
                                '</div>';
                        },
                        item: function(data, escape) {
                            //return '<div class="item"><a href="' + escape(data[$scope.cbxSrc2UomCateInit.valueField]) + '" target="_blank">' + escape(data[$scope.cbxSrc2UomCateInit.labelField]) + '</a></div>';
                            return '<div class="item">' + escape(data[$scope.CBXs[cbxId].CbxInit.labelField]) + '</div>';
                        }
                    },
                    //use load event if use load more
                    load: function(query, callback) {
                        $scope.CBXs[cbxId].CbxInfo.ngModel =-1
                        query = JSON.parse(query)
                        if($scope.CBXs[cbxId].CbxInit.resetScroll){
                            query.page = 0;
                            callback($scope.CBXs[cbxId].CbxInit.resetScroll);
                            $scope.CBXs[cbxId].CbxInit.resetScroll = false;
                        }
                        $scope.CBXs[cbxId].CbxInit.page = query.page || 0;
                        if(!$scope.CBXs[cbxId].CbxInit.totalCount || $scope.CBXs[cbxId].CbxInit.totalCount > ( ($scope.CBXs[cbxId].CbxInit.page - 1) * $scope.CBXs[cbxId].CbxInit.perPage) ){
                            var api = apiData.genApi($scope.CBXs[cbxId].CbxInit.url, $scope.CBXs[cbxId].CbxInit.searchField, query.search, $scope.CBXs[cbxId].CbxInit.perPage, null, $scope.CBXs[cbxId].CbxInit.OriginParams,query.page,$scope.CBXs[cbxId].CbxInit.queryRelate);
                            $http.get(api).then(function (response) {
                                $scope.CBXs[cbxId].CbxInit.totalCount = parseInt( response.headers()["x-total-count"], 10 ) ;
                                callback(response.data);
                            });
                        }
                    }
                }
            }

        }

        function initCbxs(scope, newCbx) {
            $scope = scope;

            if($scope.CBXs == null)
                $scope.CBXs = {};

            var cbxId = newCbx.cbxId;
            $scope.CBXs[cbxId] = newCbx;
            //console.log($scope.TABLES)

            init(scope, cbxId);
            if($scope.initFirstTime == null || $scope.initFirstTime == false) {
                main();
                $scope.initFirstTime = true;
            }
        }

    }
})();
