(function () {
    'use strict';

    /******************************** GUILD **********************************
        var fields = ["id", "email", "firstName", "lastName", "created"];
        var fieldsType = ["Number","Text","Text","Text","Text"]
        var loadFunction = User.getPage;

        var newTableIds = {
            idTable: "table_id",
            model: "users",
            param_allow_show_tooltip : "false",
            tree_query: "",
            firstLoad: false,
            param_current_page: 0,
            param_page_size: 0,
            param_total_result: 0,
            param_page_total: 0,
            param_sort_field: "",
            param_sort_type: "asc",
            param_sort_list: [],
            param_filter_list: [],
            param_check_list: [],
            selectize_page_options: [],
            selectize_page_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            selectize_pageNum_options: ["5", "10", "25", "50"],
            selectize_pageNum_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            loadFunction: loadFunction,
            param_fields: fields,
            param_fields_type: fieldsType,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            showDeleteBtnCallback: null,
            customParams: "",
            pager_id: "table_id_pager",
            selectize_page_id: "selectize_page_id",
            selectize_pageNum_id: "selectize_pageNum_id"
        }

        TableMultiple.initTableIds($scope, newTableIds);
        TableMultiple.reloadPage(newTableIds.idTable);

     ************************************************************************/

    angular
        .module('erpApp')
        .factory('TableMultiple', TableMultiple);

    TableMultiple.$inject = ['$translate'];

    function TableMultiple($translate, $scope) {
        var service = {
            sortDefault: sortDefault,
            sortDefaultByUpdated: sortDefaultByUpdated,
            reloadPage: reloadPage,
            reloadPageAndPageable:reloadPageAndPageable,
            getCurrentPageSize: getCurrentPageSize,
            getMans:getMans,
            initTableIds: initTableIds,
            getSelectedRowIDs: getSelectedRowIDs,
            goToFirstPage: goToFirstPage,
            goToLastPage: goToLastPage
        };

        return service;

        function init(scopeParam, table_id) {
            $scope = scopeParam;
            // $scope.blockModal = scopeParam.blockModal;
            // $scope.blockUI = scopeParam.blockUI;
            if($scope.selectPage == null)
                $scope.selectPage = $translate.instant('admin.pagination.selectPage');
            if($scope.pageSize == null)
                $scope.pageSize = $translate.instant('admin.pagination.pageSize');
            if($scope.sortIcons == null)
                $scope.sortIcons = ["sort", "keyboard_arrow_up", "keyboard_arrow_down"];

            for (var i = 0; i < $scope.TABLES[table_id].param_fields.length; i++) {
                $scope.TABLES[table_id].param_sort_list.push($scope.sortIcons[0]);
                $scope.TABLES[table_id].param_filter_list.push("");
            }
            $scope.TABLES[table_id].param_page_size = $scope.TABLES[table_id].selectize_pageNum_options[1];
        }

        function main() {
            $scope.setPageDisplay = function (table_id) {
                var left = $scope.TABLES[table_id].param_current_page * $scope.TABLES[table_id].param_page_size + 1;
                var right;
                if ($scope.TABLES[table_id].param_current_page == $scope.TABLES[table_id].param_page_total - 1) {
                    right = $scope.TABLES[table_id].param_total_result;
                } else {
                    right = ($scope.TABLES[table_id].param_current_page + 1) * $scope.TABLES[table_id].param_page_size;
                }
                if ($scope.TABLES[table_id].param_total_result == 0)
                    $("#" + $scope.TABLES[table_id].pager_id).find('.pageDisplay').html("0");
                else
                    $("#" + $scope.TABLES[table_id].pager_id).find('.pageDisplay').html(left + "-" + right + "/" + $scope.TABLES[table_id].param_total_result);
                if (!allowReloadDropSelectPage) {
                    $scope.TABLES[table_id].selectize_page = $scope.TABLES[table_id].param_current_page + 1;
                }

                // Disable all action if result have only one page
                if($scope.TABLES[table_id].param_page_total == 1) {
                    $("#" + $scope.TABLES[table_id].pager_id).find('.firstPage').addClass('disableMouse');
                    $("#" + $scope.TABLES[table_id].pager_id).find('.lastPage').addClass('disableMouse');
                    $("#" + $scope.TABLES[table_id].pager_id).find('.prevPage').addClass('disableMouse');
                    $("#" + $scope.TABLES[table_id].pager_id).find('.nextPage').addClass('disableMouse');
                } else if($scope.TABLES[table_id].param_page_total > 1) {
                    $("#" + $scope.TABLES[table_id].pager_id).find('.firstPage').removeClass('disableMouse');
                    $("#" + $scope.TABLES[table_id].pager_id).find('.lastPage').removeClass('disableMouse');
                    $("#" + $scope.TABLES[table_id].pager_id).find('.prevPage').removeClass('disableMouse');
                    $("#" + $scope.TABLES[table_id].pager_id).find('.nextPage').removeClass('disableMouse');

                    // if current page is first page, then disable first & prev action
                    if($scope.TABLES[table_id].param_current_page == 0) {
                        $("#" + $scope.TABLES[table_id].pager_id).find('.firstPage').addClass('disableMouse');
                        $("#" + $scope.TABLES[table_id].pager_id).find('.prevPage').addClass('disableMouse');
                    }

                    // if current page is last page, then disable last & next action
                    if($scope.TABLES[table_id].param_current_page == $scope.TABLES[table_id].param_page_total - 1) {
                        $("#" + $scope.TABLES[table_id].pager_id).find('.lastPage').addClass('disableMouse');
                        $("#" + $scope.TABLES[table_id].pager_id).find('.nextPage').addClass('disableMouse');
                    }
                }
            }

            $scope.resetPageDisplay = function (table_id) {
                if($scope.TABLES[table_id].param_page_size>0){
                    var a = Math.floor($scope.TABLES[table_id].param_total_result / $scope.TABLES[table_id].param_page_size);
                    var b = $scope.TABLES[table_id].param_total_result % $scope.TABLES[table_id].param_page_size;
                    if (b > 0) {
                        $scope.TABLES[table_id].param_page_total = a + 1;
                    } else {
                        $scope.TABLES[table_id].param_page_total = a;
                    }
                    $scope.TABLES[table_id].param_current_page = 0;
                    $scope.TABLES[table_id].selectize_page_options = [];
                    for (var i = 0; i < $scope.TABLES[table_id].param_page_total; i++) {
                        $scope.TABLES[table_id].selectize_page_options.push("" + (i + 1));
                    }
                }
            }

            $scope.checkSelectAllBtn = function (show, table_id) {
                $("#" + table_id).find('.ts_checkbox_all').prop('checked', show).iCheck('update');
            }

            $scope.showDeleteBtn = function (table_id, show) {
                if($scope.TABLES[table_id].configActiveBtn) {
                    $("#activateBtn").removeClass("hideElement")
                    $("#deactivateBtn").removeClass("hideElement")
                    $("#restoreBtn").removeClass("hideElement")
                    if (show) {
                        $("#deleteBtn").removeClass("hideElement")
                        $("#activateBtn").removeClass("hideElement")
                        $("#deactivateBtn").removeClass("hideElement")
                        $("#restoreBtn").removeClass("hideElement")
                    } else {
                        $("#deleteBtn").addClass("hideElement");
                    }
                } else {
                    if (show) {
                        $("#deleteBtn").removeClass("hideElement")
                        $("#activateBtn").removeClass("hideElement")
                        $("#deactivateBtn").removeClass("hideElement")
                        $("#restoreBtn").removeClass("hideElement")
                    } else {
                        $("#deleteBtn").addClass("hideElement");
                        $("#activateBtn").addClass("hideElement");
                        $("#deactivateBtn").addClass("hideElement");
                        $("#restoreBtn").addClass("hideElement")
                    }
                }

                if ($scope.TABLES[table_id].showDeleteBtnCallback != null) {
                    $scope.TABLES[table_id].showDeleteBtnCallback(table_id, show);
                }
            }

            $scope.getCommonQuery = function(table_id,parentValue) {
                var query = "";
                for (var i = 0; i < $scope.TABLES[table_id].param_filter_list.length; i++) {
                    if ($scope.TABLES[table_id].param_filter_list[i] != null && $scope.TABLES[table_id].param_filter_list[i].length != "".length) {
                        if ($scope.TABLES[table_id].param_fields_type[i] =="Text"){
                            query += $scope.TABLES[table_id].param_fields[i] + '=="*' + $scope.TABLES[table_id].param_filter_list[i] + '*";';
                        } else if ($scope.TABLES[table_id].param_fields_type[i] =="TextExact"){
                            query += $scope.TABLES[table_id].param_fields[i] + '=="' + $scope.TABLES[table_id].param_filter_list[i] + '";';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="Number"){
                            query += $scope.TABLES[table_id].param_fields[i] + '==' + $scope.TABLES[table_id].param_filter_list[i] + ';';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="MultiText" && $scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            var searchValue = $scope.TABLES[table_id].param_filter_list[i].toString();
                            query += $scope.TABLES[table_id].param_fields[i] + '=in=("' + searchValue.replace(/,/g , '","') + '");';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="MultiNumber" && $scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            query += $scope.TABLES[table_id].param_fields[i] + '=in=(' + $scope.TABLES[table_id].param_filter_list[i].toString() + ');';

                            //=========================================================================================/
                            // change only for search none project
                            // change id of none project to null
                            var CONSTANT_NONE_PROJECT = 19091992; // Don't change :)
                            if(query.indexOf(CONSTANT_NONE_PROJECT) > -1) {
                                if($scope.TABLES[table_id].param_filter_list[i].length == 1)
                                    query = query.replace('=in=(-'+CONSTANT_NONE_PROJECT+")", '==null');
                                else if($scope.TABLES[table_id].param_filter_list[i].length > 1){
                                    query = query.replace('-'+CONSTANT_NONE_PROJECT+",", '');
                                    query = query.replace(',-'+CONSTANT_NONE_PROJECT, '');
                                    query = query.replace('productVersionId=in=', 'productVersionId==null,productVersionId=in=');
                                }
                            }
                            //=========================================================================================/
                        }
                    }
                    if($scope.TABLES[table_id].param_fields_type[i] =="NumberRange") {
                        if($scope.TABLES[table_id].param_filter_list[i] == null){
                            query += $scope.TABLES[table_id].param_fields[i] + "=='null';";
                        }else{
                            query += $scope.TABLES[table_id].param_fields[i] + '>=' + $scope.TABLES[table_id].param_filter_list[i].from + ';' + $scope.TABLES[table_id].param_fields[i] + '<=' + $scope.TABLES[table_id].param_filter_list[i].to + ';';
                        }
                    }
                    if($scope.TABLES[table_id].param_fields_type[i] =="DateTime") {
                        if ($scope.TABLES[table_id].param_filter_list[i] == null) {
                            query += $scope.TABLES[table_id].param_fields[i] + "=='null';";
                        } else if ($scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            var datetime = $scope.TABLES[table_id].param_filter_list[i].split("&");
                            query += $scope.TABLES[table_id].param_fields[i] + '>=' + datetime[0] + ';' + $scope.TABLES[table_id].param_fields[i] + '<=' + datetime[1] + ';';
                        }
                    }
                }
                query += $scope.TABLES[table_id].customParams + $scope.TABLES[table_id].tree_query;
                if (query.slice(-1) == ';')
                    query = query.substr(0, query.length - 1);

                if (parentValue != null) {
                    if(query != ""){
                        query +=";"
                    } else { query +="query="}
                    query += $scope.TABLES[table_id].parent_column + '==' + parentValue;
                }

                var params = "&page=" + $scope.TABLES[table_id].param_current_page +
                    "&size=" + $scope.TABLES[table_id].param_page_size +
                    "&sort=" + $scope.TABLES[table_id].param_sort_field +
                    "," + $scope.TABLES[table_id].param_sort_type;
                // console.log(query+params)
                if(angular.isDefined($scope.TABLES[table_id].parent_column) && $scope.TABLES[table_id].parent_column != null){
                    query = query + params
                    return query;
                }
                query = "query=" + query + params
                return query;
            }

            $scope.getChildQuery = function(table_id,parentValue,type,page) {
                var query = "";
                for (var i = 0; i < $scope.TABLES[table_id].param_filter_list.length; i++) {
                    if ($scope.TABLES[table_id].param_filter_list[i] != null && $scope.TABLES[table_id].param_filter_list[i].length != "".length) {
                        if ($scope.TABLES[table_id].param_fields_type[i] =="Text"){
                            query += $scope.TABLES[table_id].param_fields[i] + '=="*' + $scope.TABLES[table_id].param_filter_list[i] + '*";';
                        } else if ($scope.TABLES[table_id].param_fields_type[i] =="TextExact"){
                            query += $scope.TABLES[table_id].param_fields[i] + '=="' + $scope.TABLES[table_id].param_filter_list[i] + '";';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="Number"){
                            query += $scope.TABLES[table_id].param_fields[i] + '==' + $scope.TABLES[table_id].param_filter_list[i] + ';';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="MultiText" && $scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            var searchValue = $scope.TABLES[table_id].param_filter_list[i].toString();
                            query += $scope.TABLES[table_id].param_fields[i] + '=in=("' + searchValue.replace(/,/g , '","') + '");';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="MultiNumber" && $scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            query += $scope.TABLES[table_id].param_fields[i] + '=in=(' + $scope.TABLES[table_id].param_filter_list[i].toString() + ');';

                            //=========================================================================================/
                            // change only for search none project
                            // change id of none project to null
                            var CONSTANT_NONE_PROJECT = 19091992; // Don't change :)
                            if(query.indexOf(CONSTANT_NONE_PROJECT) > -1) {
                                if($scope.TABLES[table_id].param_filter_list[i].length == 1)
                                    query = query.replace('=in=(-'+CONSTANT_NONE_PROJECT+")", '==null');
                                else if($scope.TABLES[table_id].param_filter_list[i].length > 1){
                                    query = query.replace('-'+CONSTANT_NONE_PROJECT+",", '');
                                    query = query.replace(',-'+CONSTANT_NONE_PROJECT, '');
                                    query = query.replace('productVersionId=in=', 'productVersionId==null,productVersionId=in=');
                                }
                            }
                            //=========================================================================================/
                        }
                    }
                    if($scope.TABLES[table_id].param_fields_type[i] =="NumberRange") {
                        if($scope.TABLES[table_id].param_filter_list[i] == null){
                            query += $scope.TABLES[table_id].param_fields[i] + "=='null';";
                        }else{
                            query += $scope.TABLES[table_id].param_fields[i] + '>=' + $scope.TABLES[table_id].param_filter_list[i].from + ';' + $scope.TABLES[table_id].param_fields[i] + '<=' + $scope.TABLES[table_id].param_filter_list[i].to + ';';
                        }
                    }
                    if($scope.TABLES[table_id].param_fields_type[i] =="DateTime") {
                        if ($scope.TABLES[table_id].param_filter_list[i] == null) {
                            query += $scope.TABLES[table_id].param_fields[i] + "=='null';";
                        } else if ($scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            var datetime = $scope.TABLES[table_id].param_filter_list[i].split("&");
                            query += $scope.TABLES[table_id].param_fields[i] + '>=' + datetime[0] + ';' + $scope.TABLES[table_id].param_fields[i] + '<=' + datetime[1] + ';';
                        }
                    }
                }
                query += $scope.TABLES[table_id].customParams + $scope.TABLES[table_id].tree_query;
                if (query.slice(-1) == ';')
                    query = query.substr(0, query.length - 1);

                if (parentValue != null) {
                    if(query != ""){
                        query +=";"
                    }
                    if(type == "text"){
                        query += $scope.TABLES[table_id].parent_column + '=="' + parentValue + '"';
                    } else {
                        query += $scope.TABLES[table_id].parent_column + '==' + parentValue;
                    }
                } else {
                    if(query != ""){
                        query +=";"
                    }
                    query += $scope.TABLES[table_id].parent_column + '==null';
                }

                var params = "&page=" + page +
                    "&size=" + $scope.TABLES[table_id].param_page_size +
                    "&sort=" + $scope.TABLES[table_id].param_sort_field +
                    "," + $scope.TABLES[table_id].param_sort_type;
                query = "query=" + query + params
                return query;
            }

            $scope.expandAndCollapse = function(table_id,object,type){
                object.expand = ! object.expand;
                object.pageNum = 0;
                if (object.expand){
                    $scope.getChildObjects(table_id,object,type);
                } else {
                    object.pageableValue = false;
                    object.child = [];
                }
            }

            $scope.showMoreObjects  =function (table_id,object,type) {
                object.pageNum = object.pageNum +1;
                $scope.getChildObjects(table_id,object,type);
            }

            $scope.getChildObjects = function (table_id,object,type) {
                var parentValue = object[$scope.TABLES[table_id].parent_column];
                var model = $scope.TABLES[table_id].model;
                $scope.TABLES[table_id].getChildFunction($scope.getChildQuery(table_id,parentValue,type,object.pageNum)).then(function (response) {
                    if(angular.isDefined(object.child)){
                        object.child = object.child.concat(response.data);
                    } else {
                        object.child = response.data;
                    }
                    if(object.child.length < response.headers()["x-total-count"]){
                        object.pageableValue = "Show more...(" + object.child.length + "/" +response.headers()["x-total-count"] +")"
                    } else {
                        object.pageableValue = null;
                    }
                    for(var i =0; i< object.child.length; i ++){
                        var id = object.child[i].id;
                        if(!$scope.checkBoxIds[model].includes(id)){
                            $scope.checkBoxIds[model].push(id);
                        }
                    }
                })
            }

            function quantityCalculator (table_id,index){
                var model = $scope.TABLES[table_id].model;
                if(index < $scope[model].length){
                    var quantity_column = $scope.TABLES[table_id].quantity_column;
                    var quantity_query = $scope.TABLES[table_id].quantity_query;
                    var parentValue = $scope[model][index][$scope.TABLES[table_id].parent_column];
                    var query = $scope.getChildQuery(table_id,parentValue,$scope.groupColumn[$scope.modelAdFilter].type,0);
                    var tableModel = $scope.TABLES[table_id].tableModel;
                    $scope.TABLES[table_id].sumQuantity(query,tableModel,quantity_query).then(function (quantities) {
                        for(var i=0; i<quantity_column.length; i++){
                            $scope[model][index][quantity_column[i]] = quantities[0][i];
                        }
                        index++;
                        quantityCalculator(table_id,index);
                    })
                }
            }

            function quantityTotalCalculator (table_id){
                var quantity_query = $scope.TABLES[table_id].quantity_query;
                var query = "query=" + $scope.getCommonQuery(table_id,null);
                var tableModel = $scope.TABLES[table_id].tableModel;
                $scope.TABLES[table_id].sumQuantity(query,tableModel,quantity_query).then(function (quantities) {
                    $scope.TABLES[table_id].assignQuantities(quantities[0]);
                })
            }

            $scope.checkBoxIds= {}
            $scope.reloadPage = function (table_id, callback,isClearCheckList) {
                $scope.TABLES[table_id].loading = true;
                console.log($scope.TABLES[table_id].loading)
                //console.log($scope.TABLES[table_id]);
                if($scope.TABLES[table_id].param_page_size == undefined || $scope.TABLES[table_id].param_page_size == null || $scope.TABLES[table_id].param_page_size.length == 0)
                    return;
                var allParams = $scope.getCommonQuery(table_id,null);
                var objectBody = null;

                if($scope.TABLES[table_id].paramBody != undefined && $scope.TABLES[table_id].paramBody != null) {
                    objectBody = $scope.TABLES[table_id].paramBody;
                }

                if(objectBody != null) {
                    $scope.TABLES[table_id].loadFunction(allParams, objectBody).then(function (data) {
                        $scope.handleData(table_id, callback,isClearCheckList, data);
                        $scope.TABLES[table_id].loading = false;
                    }).catch(function () {
                        $scope.TABLES[table_id].loading = false;
                    });
                } else if(angular.isDefined($scope.TABLES[table_id].parent_column) && $scope.TABLES[table_id].parent_column !=null){
                    $scope.TABLES[table_id].loadFunction(allParams,$scope.TABLES[table_id].parent_column).then(function (data) {
                        $scope.handleData(table_id, callback,isClearCheckList, data);
                        $scope.TABLES[table_id].loading = false;
                    }).catch(function () {
                        $scope.TABLES[table_id].loading = false;
                    });
                } else {
                    $scope.TABLES[table_id].loadFunction(allParams).then(function (data) {
                        $scope.handleData(table_id, callback,isClearCheckList, data);
                        $scope.TABLES[table_id].loading = false;
                    }).catch(function () {
                        $scope.TABLES[table_id].loading = false;
                    });
                }
            }

            $scope.reloadPageAndPageable = function(table_id){
                $scope.reloadPage(table_id, function (ok) {
                    if (ok == "OK") {
                        $scope.resetPageDisplay(table_id);
                        $scope.TABLES[table_id].preventSearch = false;
                    }
                    if ($scope.blockModal != null){$scope.blockModal.hide();}
                },true);
            }

            $scope.handleData = function (table_id, callback,isClearCheckList, data) {
                console.log("Call reload: " + table_id)      //DO NOT COMMENT THIS CONSOLE LOG
                //console.log($scope.TABLES[table_id]);
                // $scope.TABLES[table_id].param_check_list = [];
                $scope.checkSelectAllBtn(false, table_id);
                $scope.showDeleteBtn(table_id, false);
                if(!angular.isDefined(isClearCheckList)){
                    $scope.TABLES[table_id].param_check_list = [];
                }

                var model = $scope.TABLES[table_id].model;
                $scope[model] = data.data;
                $scope.checkBoxIds[model] = []
                for(var i =0; i< $scope[model].length; i ++){
                    $scope.checkBoxIds[model].push($scope[model][i].id)
                }
                if($scope.TABLES[table_id].handleAfterReload != null) {
                    $scope.TABLES[table_id].handleAfterReload(data.data, $scope.TABLES[table_id].handleAfterReloadParams);
                }

                if($scope.TABLES[table_id].handleAfterReload2 != null) {
                    $scope.TABLES[table_id].handleAfterReload2(data, $scope.TABLES[table_id].handleAfterReloadParams);
                }

                $scope.TABLES[table_id].param_total_result = data.headers()["x-total-count"];
                if($scope.TABLES[table_id].param_total_result == 0){
                    if (!angular.element('#noResult'+$scope.TABLES[table_id].idTable).length) {
                        if($scope.TABLES[table_id]['DONT_SHOW_NO_DATA']){
                            return;
                        }
                        $scope.showNoResult = $translate.instant('common-ui-element.messages.noResult');
                        //$( "#"+$scope.TABLES[table_id].idTable ).after( $( "<div id=\"noResult\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center uk-alert-info\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );
                        $( "#"+$scope.TABLES[table_id].idTable ).after( $( "<div id=\"noResult"+$scope.TABLES[table_id].idTable +"\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center uk-alert-info\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );
                    }
                }else{
                    if (angular.element('#noResult'+$scope.TABLES[table_id].idTable).length) {
                        $("#noResult"+$scope.TABLES[table_id].idTable).remove();
                    }
                }
                if (!$scope.TABLES[table_id].firstLoad) {
                    $scope.resetPageDisplay(table_id);
                    $scope.TABLES[table_id].selectize_pageNum = $scope.TABLES[table_id].param_page_size;
                    $scope.TABLES[table_id].firstLoad = true;
                }

                if (callback != null){
                    callback("OK");
                }

                if(Number($scope.TABLES[table_id].param_page_total) == 0 || ((Number($scope.TABLES[table_id].param_page_total) * Number($scope.TABLES[table_id].param_page_size) < Number($scope.TABLES[table_id].param_total_result)))) {
                    $scope.resetPageDisplay(table_id);
                }
                $scope.setPageDisplay(table_id);

                UIkit.tooltip('.tooltip').hide();

                if(angular.isDefined($scope.TABLES[table_id].parent_column) && $scope.TABLES[table_id].parent_column != null){
                    $scope.handleTreeTable(table_id)
                }
            }

            $scope.handleTreeTable =function (table_id) {
                //expand first row
                var model = $scope.TABLES[table_id].model;
                if($scope[model].length > 0){
                    var parentValue = $scope[model][0][$scope.TABLES[table_id].parent_column];
                    $scope[model][0].expand = true;
                    $scope[model][0].pageNum = 0;
                    $scope.TABLES[table_id].getChildFunction($scope.getChildQuery(table_id,parentValue,$scope.groupColumn[$scope.modelAdFilter].type,0)).then(function (response) {
                        $scope[model][0].child = response.data
                        if($scope[model][0].child.length < response.headers()["x-total-count"]){
                            $scope[model][0].pageableValue = "Show more...(" + $scope[model][0].child.length + "/" +response.headers()["x-total-count"] +")"
                        } else {
                            $scope[model][0].pageableValue = null;
                        }
                    })
                }
                if(angular.isDefined($scope.TABLES[table_id].quantity_column) && $scope.TABLES[table_id].quantity_column !=null){
                    quantityCalculator(table_id,0);
                }
                if(angular.isDefined($scope.TABLES[table_id].assignQuantities) && $scope.TABLES[table_id].assignQuantities !=null){
                    quantityTotalCalculator(table_id);
                }
            }

            $scope.customReloadPage = function (table_id, callback) {
                $scope.TABLES[table_id].loadFunction($scope.TABLES[table_id].customParams).then(function (data) {
                    if (data.data.length == 0) {return}
                    // $scope.TABLES[table_id].param_check_list = [];
                    $scope.checkSelectAllBtn(false, table_id);
                    $scope.showDeleteBtn(table_id, false);
                    var model = $scope.TABLES[table_id].model;
                    $scope[model] = data.data;
                    $scope.TABLES[table_id].param_total_result = data.headers()["x-total-count"];
                    if($scope.TABLES[table_id].param_total_result == 0){
                        if (!angular.element('#noResult'+$scope.TABLES[table_id].idTable).length) {

                            if($scope.TABLES[table_id]['DONT_SHOW_NO_DATA'])
                                return;

                            $scope.showNoResult = $translate.instant('common-ui-element.messages.noResult');
                           // $("#" + $scope.TABLES[table_id].idTable).after($("<div id=\"noResult\"  class=\"uk-alert uk-text-center uk-alert-info\" style=\"background: white!important;color: black;\" data-uk-alert><span>" + $scope.showNoResult + "</span></div>"));
                            $( "#"+$scope.TABLES[table_id].idTable ).after( $( "<div id=\"noResult"+$scope.TABLES[table_id].idTable +"\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center uk-alert-info\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );

                        }
                    }else{
                        if (angular.element('#noResult'+$scope.TABLES[table_id].idTable).length) {
                            $("#noResult"+$scope.TABLES[table_id].idTable).remove();
                        }
                    }
                    if (!$scope.TABLES[table_id].firstLoad) {
                        $scope.resetPageDisplay(table_id);
                        $scope.TABLES[table_id].selectize_pageNum = $scope.TABLES[table_id].param_page_size;
                        $scope.TABLES[table_id].firstLoad = true;
                    }
                    if (callback != null)
                        callback("OK");
                    $scope.setPageDisplay(table_id);

                    UIkit.tooltip('.tooltip').hide();
                })
            }

            $scope.handleSort = function ($event, pos, table_id) {
                switch ($scope.TABLES[table_id].param_sort_list[pos]) {
                    case $scope.sortIcons[0]:
                        // sort asc
                        $scope.TABLES[table_id].param_sort_list[pos] = $scope.sortIcons[1];
                        $scope.TABLES[table_id].param_sort_type = "asc";
                        break;
                    case $scope.sortIcons[1]:
                        // sort desc
                        $scope.TABLES[table_id].param_sort_list[pos] = $scope.sortIcons[2];
                        $scope.TABLES[table_id].param_sort_type = "desc";
                        break;
                    case $scope.sortIcons[2]:
                        // sort asc
                        $scope.TABLES[table_id].param_sort_list[pos] = $scope.sortIcons[1];
                        $scope.TABLES[table_id].param_sort_type = "asc";
                        break;
                }

                // sort 1 column only
                $("#" + table_id + " thead th")
                    .removeClass("tablesorter-headerAsc")
                $($event.target.closest("th"))
                    .addClass("tablesorter-headerAsc")

                for (var i = 0; i < $scope.TABLES[table_id].param_sort_list.length; i++) {
                    if (i != pos) {
                        $scope.TABLES[table_id].param_sort_list[i] = $scope.sortIcons[0];
                    }
                }

                $scope.TABLES[table_id].param_sort_field = $scope.TABLES[table_id].param_fields[pos];
                allowReloadDropSelectPage = false;
                $scope.reloadPage(table_id,null,true);
            }

            // Now filter trigger after 500 ms after keypress
            // Make sure call only one time if user press too quickly
            var timeoutF;
            $scope.handleFilter = function (table_id) {
                if($scope.TABLES[table_id].preventSearch) {
                    clearTimeout(timeoutF);
                    timeoutF = setTimeout(function () {
                        allowReloadDropSelectPage = false;
                        //console.log($scope.TABLES[table_id]);
                        $scope.TABLES[table_id].param_current_page = 0;
                        $scope.reloadPage(table_id, function (ok) {
                            if (ok == "OK") {
                                $scope.resetPageDisplay(table_id);
                                $scope.TABLES[table_id].preventSearch = false;
                            }
                        },true);
                    }, 500);
                    return;
                }
                $scope.TABLES[table_id].preventSearch = true;
                timeoutF = setTimeout(function () {
                    allowReloadDropSelectPage = false;
                    //console.log($scope.TABLES[table_id]);
                    $scope.TABLES[table_id].param_current_page = 0;
                    $scope.reloadPage(table_id, function (ok) {
                        if (ok == "OK") {
                            $scope.resetPageDisplay(table_id);
                            $scope.TABLES[table_id].preventSearch = false;
                        }
                    },true);
                }, 500);
            }

            $scope.handleNextPage = function (table_id) {
                if ($scope.TABLES[table_id].param_current_page < $scope.TABLES[table_id].param_page_total - 1) {
                    $scope.TABLES[table_id].param_current_page++;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage(table_id,null,true);
                }
            }

            $scope.handlePreviousPage = function (table_id) {
                if ($scope.TABLES[table_id].param_current_page > 0) {
                    $scope.TABLES[table_id].param_current_page--;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage(table_id,null,true);
                }
            }

            $scope.handleFirstPage = function (table_id) {
                if($scope.TABLES[table_id].param_current_page == 0)
                    return;

                $scope.TABLES[table_id].param_current_page = 0;
                allowReloadDropSelectPage = false;
                $scope.reloadPage(table_id,null,true);
            }

            $scope.handleLastPage = function (table_id) {
                if($scope.TABLES[table_id].param_current_page == $scope.TABLES[table_id].param_page_total - 1)
                    return;

                $scope.TABLES[table_id].param_current_page = $scope.TABLES[table_id].param_page_total - 1;
                allowReloadDropSelectPage = false;
                $scope.reloadPage(table_id,null,true);
            }

            var allowReloadDropSelectPage = false;
            $scope.selectPageHandle = function (table_id) {
                if (allowReloadDropSelectPage) {
                    $scope.TABLES[table_id].param_current_page = $("#"+$scope.TABLES[table_id].selectize_page_id).val() - 1;
                    $scope.reloadPage(table_id,null,true);
                }
            }

            $scope.selectPageClickHandle = function () {
                allowReloadDropSelectPage = true;
            }

            $scope.selectPageNumHandle = function (table_id) {
                allowReloadDropSelectPage = false;
                $scope.TABLES[table_id].param_page_size = $("#"+$scope.TABLES[table_id].selectize_pageNum_id).val();
                $scope.resetPageDisplay(table_id);
                $scope.reloadPage(table_id,null,true);
            }

            $scope.deleteRows = function (table_id) {
                $scope.TABLES[table_id].param_check_list.sort();
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    //$("#ts_pager_filter").trigger('update');
                    if ($scope.TABLES[table_id].deleteCallback != null) {
                        $scope.TABLES[table_id].deleteCallback(table_id);
                    }
                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Delete"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });
            }

            $scope.selectAllRows = function (table_id) {
                // $scope.TABLES[table_id].param_check_list = [];
                var model = $scope.TABLES[table_id].model;
                for (var i = 0; i < $scope[model].length; i++) {
                    if(!$scope.TABLES[table_id].param_check_list.includes($scope[model][i].id)){
                        $scope.TABLES[table_id].param_check_list.push($scope[model][i].id);

                        if(angular.isDefined($scope.TABLES[table_id].param_check_data)) {
                            var exist = false;
                            for(var j = 0; j < $scope.TABLES[table_id].param_check_data.length; j++) {
                                if($scope.TABLES[table_id].param_check_data[j].id == $scope[model][i].id) {
                                    exist = true;
                                    break;
                                }
                            }
                            if(!exist) {
                                $scope.TABLES[table_id].param_check_data.push($scope[model][i]);
                            }
                        }

                    }
                }
                $scope.showDeleteBtn(table_id, true);
            }

            $scope.unSelectAllRows = function (table_id) {
                var model = $scope.TABLES[table_id].model;
                for (var i = 0; i < $scope[model].length; i++) {
                    var valueIndex = $scope.TABLES[table_id].param_check_list.indexOf($scope[model][i].id);
                    if (valueIndex > -1) {
                        $scope.TABLES[table_id].param_check_list.splice(valueIndex, 1);

                        if(angular.isDefined($scope.TABLES[table_id].param_check_data)) {
                            for(var j = $scope.TABLES[table_id].param_check_data.length - 1; j >= 0; j--) {
                                if($scope.TABLES[table_id].param_check_data[j].id == $scope[model][i].id) {
                                    $scope.TABLES[table_id].param_check_data.splice(j, 1);
                                }
                            }
                        }

                    }
                }
                $scope.showDeleteBtn(table_id, false);
                // $scope.TABLES[table_id].param_check_list = [];
            }

            $scope.selectOneRow = function (element, table_id) {
                var _id = element.closest('input').attr('id');
                $scope.TABLES[table_id].param_check_list.push(_id);
                var model = $scope.TABLES[table_id].model;

                if(angular.isDefined($scope.TABLES[table_id].param_check_data)) {
                    for(var i = 0; i < $scope[model].length; i++) {
                        if($scope[model][i].id == _id) {
                            var exist = false;
                            for(var j = 0; j < $scope.TABLES[table_id].param_check_data.length; j++) {
                                if($scope.TABLES[table_id].param_check_data[j].id == $scope[model][i].id) {
                                    exist = true;
                                    break;
                                }
                            }
                            if(!exist) {
                                $scope.TABLES[table_id].param_check_data.push($scope[model][i]);
                            }
                        }
                    }
                }

                if (($scope.TABLES[table_id].param_check_list.length == $scope[model].length) ||
                    ($scope.TABLES[table_id].param_check_list.length % $scope[model].length == 0)) {
                    $scope.checkSelectAllBtn(true, table_id);
                }
                $scope.showDeleteBtn(table_id, true);
            }

            $scope.unSelectOneRow = function (element, table_id) {
                $scope.checkSelectAllBtn(false, table_id);
                var _id = element.closest('input').attr('id');
                var _id2 = Number(_id)
                var index = $scope.TABLES[table_id].param_check_list.indexOf(_id);
                if(index == - 1) index = $scope.TABLES[table_id].param_check_list.indexOf(_id2);
                if (index > -1) {
                    $scope.TABLES[table_id].param_check_list.splice(index, 1);

                    if(angular.isDefined($scope.TABLES[table_id].param_check_data)) {
                        for(var i = $scope.TABLES[table_id].param_check_data.length - 1; i >= 0; i--) {
                            if($scope.TABLES[table_id].param_check_data[i].id == _id) {
                                $scope.TABLES[table_id].param_check_data.splice(i, 1);
                            }
                        }
                    }

                }
                if ($scope.TABLES[table_id].param_check_list.length == 0) {
                    $scope.showDeleteBtn(table_id, false);
                } else {
                    $scope.showDeleteBtn(table_id, true);
                }
            }
        }

        function initTableIds(scope, newTableIds) {
            $scope = scope;

            if($scope.TABLES == null)
                $scope.TABLES = {};

            var table_id = newTableIds.idTable;
            $scope.TABLES[table_id] = newTableIds;
            //console.log($scope.TABLES)

            init(scope, table_id);
            if($scope.initFirstTime == null || $scope.initFirstTime == false) {
                main();
                $scope.initFirstTime = true;
            }

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                var $ts_pager_filter = $("#"+table_id);
                if ($(element).closest($ts_pager_filter).length) {
                    // Tooltip for long text
                    if($scope.TABLES[table_id].param_allow_show_tooltip) {
                        $ts_pager_filter.find('.ts_checkbox').each(function() {
                            var tr_tag = $(this).closest('tr');
                            $(tr_tag).find('td').each(function() {
                                if($(this).hasClass('fullDisplayText'))
                                    return;
                                if($(this).width() >= 200) {
                                    $(this).addClass('longTextShowToolTip');
                                    $(this).attr('title',$(this).text());
                                } else {
                                    $(this).removeClass('longTextShowToolTip');
                                    $(this).removeAttr('title');
                                }
                                /*if($(this).text().length >= 50) {
                                    $(this).addClass('longTextShowToolTip');
                                    $(this).attr('title',$(this).text());
                                } else {
                                    $(this).removeClass('longTextShowToolTip');
                                    $(this).removeAttr('title');
                                }*/
                            });
                        });
                    }

                    // select/unselect all table rows
                    $ts_pager_filter.find('.ts_checkbox_all')
                        .iCheck({
                            checkboxClass: 'icheckbox_md',
                            radioClass: 'iradio_md',
                            increaseArea: '20%'
                        })
                        .on('ifChecked', function () {
                            $ts_pager_filter
                                .find('.ts_checkbox')
                                // check all checkboxes in table
                                .prop('checked', true)
                                .iCheck('update')
                                // add highlight to row
                                .closest('tr')
                                .addClass('row_highlighted');

                            $scope.selectAllRows(table_id);
                        })
                        .on('ifUnchecked', function () {
                            $ts_pager_filter
                                .find('.ts_checkbox')
                                // uncheck all checkboxes in table
                                .prop('checked', false)
                                .iCheck('update')
                                // remove highlight from row
                                .closest('tr')
                                .removeClass('row_highlighted');

                            $scope.unSelectAllRows(table_id);
                        });

                    // select/unselect table row
                    $ts_pager_filter.find('.ts_checkbox')
                        .on('ifUnchecked', function () {
                            $(this).closest('tr').removeClass('row_highlighted');
                            $scope.unSelectOneRow($(this), table_id);
                        })
                        .on('ifChecked', function () {
                            $(this).closest('tr').addClass('row_highlighted');
                            $scope.selectOneRow($(this), table_id);
                        });
                }

                var checkCount = 0;
                var model = $scope.TABLES[table_id].model;
                for(var i =0; i< $scope.TABLES[table_id].param_check_list.length; i++){
                    var checkedId = Number($scope.TABLES[table_id].param_check_list[i]);
                    if ($scope.checkBoxIds[model].indexOf(checkedId) > -1){
                        checkCount ++;
                        var $row_checked = $("#"+ checkedId);
                        $row_checked.prop('checked', true)
                            .iCheck('update')
                            // add highlight to row
                            .closest('tr')
                            .addClass('row_highlighted');
                    }
                }
                if(angular.isDefined($scope[model])){
                    if(checkCount == $scope[model].length){
                        $ts_pager_filter.find('.ts_checkbox_all').prop('checked', true)
                            .iCheck('update')
                            // add highlight to row
                            .closest('tr')
                            .addClass('row_highlighted');
                    }
                }
            });

        }

        function sortDefault(table_id) {
            var pos = -1;
            for (var i = 0; i < $scope.TABLES[table_id].param_fields.length; i++) {
                if($scope.TABLES[table_id].param_fields[i] == "created") {
                    pos = i;
                    break;
                }
            }
            if(pos > -1) {
                $scope.TABLES[table_id].param_sort_list[pos] = $scope.sortIcons[2];
                $scope.TABLES[table_id].param_sort_type = "desc";
                $scope.TABLES[table_id].param_sort_field = $scope.TABLES[table_id].param_fields[pos];
            }
        }

        function sortDefaultByUpdated(table_id) {
            var pos = -1;
            for (var i = 0; i < $scope.TABLES[table_id].param_fields.length; i++) {
                if($scope.TABLES[table_id].param_fields[i] == "updated") {
                    pos = i;
                    break;
                }
            }
            if(pos > -1) {
                $scope.TABLES[table_id].param_sort_list[pos] = $scope.sortIcons[2];
                $scope.TABLES[table_id].param_sort_type = "desc";
                $scope.TABLES[table_id].param_sort_field = $scope.TABLES[table_id].param_fields[pos];
            }
        }

        function reloadPage(table_id) {
            $scope.reloadPage(table_id);
        }

        function reloadPageAndPageable(table_id){
            $scope.reloadPageAndPageable(table_id);
        }

        function getCurrentPageSize(table_id) {
            return $scope.TABLES[table_id].param_page_size;
        }

        function getSelectedRowIDs(table_id) {
            return $scope.TABLES[table_id].param_check_list;
        }

        function goToFirstPage(table_id) {
            $scope.handleFirstPage(table_id)
        }

        function goToLastPage(table_id) {
            $scope.handleLastPage(table_id)
        }

        function getMans(product){
            var manTable=[]
            var productName = product.name
            var manWithCode = JSON.parse(product.manWithCode)
            var manNames = JSON.parse(product.manIdMap)
            var suppliers = JSON.parse(product.manWithSuppliers)
            var manWithPns = JSON.parse(product.manWithPns)
            for (var key in manWithCode) {
                if (manWithCode.hasOwnProperty(key)) {
                    var manPNArray = manWithPns[key]
                    var supArray = suppliers[key]
                    var rowspan =1;
                    if (supArray[0]){
                        rowspan = supArray.length
                    }

                    var vnptMan = productName+manWithCode[key]
                    // if(supArray.length > 1 && manPNArray.length >1){
                    //     console.log(vnptMan)
                    // }
                    var dict ={
                        "rowspan":rowspan,
                        "vnptMan": vnptMan,
                        "manName":getManName(key,manNames),
                        "manPN":'',
                        "suplier":['N/A']
                    }

                    if ( manPNArray[0]) {
                        dict['manPN'] = manPNArray
                    }

                    if (supArray[0]) {
                        dict['suplier'] = supArray
                    }
                    manTable.push(dict)
                }

            }
            if (manTable.length == 0){
                var emptyDict ={
                    "rowspan":1,
                    "vnptMan": 'N/A',
                    "manName":'N/A',
                    "manPN":'',
                    "suplier":['N/A']
                }
                manTable.push(emptyDict)
            }
            return manTable
        }

        function getManName(value,manNames) {
            for (var key in manNames) {
                if (manNames.hasOwnProperty(key)) {
                    if(manNames[key] == value){
                        return key
                    }
                }
            }
        }

    }
})();
