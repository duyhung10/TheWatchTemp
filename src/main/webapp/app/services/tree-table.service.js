(function () {
    'use strict';
    angular
        .module('erpApp')
        .factory('TreeTable', TreeTable);

    TreeTable.$inject = ['$translate'];

    function TreeTable($translate, $scope) {
        var service = {
            sortDefault: sortDefault,
            reloadPage: reloadPage,
            getCurrentPageSize: getCurrentPageSize,
            initTableIds: initTableIds,
            getSelectedRowIDs: getSelectedRowIDs
        };

        return service;

        function init(scopeParam, table_id) {
            $scope = scopeParam;

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
            }

            $scope.resetPageDisplay = function (table_id) {
                if($scope.TABLES[table_id].param_page_size>0){
                    var a = Math.floor($scope.TABLES[table_id].param_total_result / $scope.TABLES[table_id].param_page_size);
                    var b = $scope.TABLES[table_id].param_total_result % $scope.TABLES[table_id].param_page_size;
                    if (b > 0)
                        $scope.TABLES[table_id].param_page_total = a + 1;
                    else
                        $scope.TABLES[table_id].param_page_total = a;

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

            $scope.showDeleteBtn = function (show) {
                if (show) {
                    $("#deleteBtn").removeClass("hideElement")
                    $("#activateBtn").removeClass("hideElement")
                    $("#deactivateBtn").removeClass("hideElement")
                } else {
                    $("#deleteBtn").addClass("hideElement");
                    $("#activateBtn").addClass("hideElement");
                    $("#deactivateBtn").addClass("hideElement");
                }
            }

            $scope.getChildQuery = function(table_id,parentValue) {
                var query = "";
                for (var i = 1; i < $scope.TABLES[table_id].param_filter_list.length; i++) {
                    if ($scope.TABLES[table_id].param_filter_list[i].length != "".length) {
                        if ($scope.TABLES[table_id].param_fields_type[i] =="Text"){
                            query += $scope.TABLES[table_id].param_fields[i] + '=="*' + $scope.TABLES[table_id].param_filter_list[i] + '*";';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="Number"){
                            query += $scope.TABLES[table_id].param_fields[i] + '==' + $scope.TABLES[table_id].param_filter_list[i] + ';';

                        }
                    }
                }
                query += $scope.TABLES[table_id].customParams + $scope.TABLES[table_id].tree_query;
                if (query.slice(-1) == ';')
                    query = query.substr(0, query.length - 1);
                if (parentValue != "") {
                    var v1 = $scope.TABLES[table_id].param_fields[0] + '=="*' + parentValue + '*";';
                    if (v1.slice(-1) == ';')
                        v1 = v1.substr(0, v1.length - 1);

                    var v2 = $scope.TABLES[table_id].param_fields[0] + '== "null";' ;
                    v2 += $scope.TABLES[table_id].param_fields[1] + '=="*' + parentValue + '*";';
                    if (v2.slice(-1) == ';')
                        v2 = v2.substr(0, v2.length - 1);

                    if(query !=''){
                        v1 +=";"
                        v2 +=";"
                    }
                    v1 = "(" +v1 + query +"),"
                    v2 = "(" +v2 +query +")"
                    query = v1 + v2
                }
                query = "query=" + query
                return query;
            }

            $scope.getCommonQuery = function(table_id) {
                var query = "";
                for (var i = 1; i < $scope.TABLES[table_id].param_filter_list.length; i++) {
                    if ($scope.TABLES[table_id].param_filter_list[i].length != "".length) {
                        if ($scope.TABLES[table_id].param_fields_type[i] =="Text"){
                            query += $scope.TABLES[table_id].param_fields[i] + '=="*' + $scope.TABLES[table_id].param_filter_list[i] + '*";';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="Number"){
                            query += $scope.TABLES[table_id].param_fields[i] + '==' + $scope.TABLES[table_id].param_filter_list[i] + ';';

                        }
                    }
                }
                query += $scope.TABLES[table_id].customParams + $scope.TABLES[table_id].tree_query;
                if (query.slice(-1) == ';')
                    query = query.substr(0, query.length - 1);
                if ($scope.TABLES[table_id].param_filter_list[0].length != "".length) {
                    var v1 = $scope.TABLES[table_id].param_fields[0] + '=="*' + $scope.TABLES[table_id].param_filter_list[0] + '*";';
                    if (v1.slice(-1) == ';')
                        v1 = v1.substr(0, v1.length - 1);

                    var v2 = $scope.TABLES[table_id].param_fields[0] + '== "null";' ;
                    v2 += $scope.TABLES[table_id].param_fields[1] + '=="*' + $scope.TABLES[table_id].param_filter_list[0] + '*";';
                    if (v2.slice(-1) == ';')
                        v2 = v2.substr(0, v2.length - 1);

                    if(query !=''){
                        v1 +=";"
                        v2 +=";"
                    }
                    v1 = "(" +v1 + query +"),"
                    v2 = "(" +v2 +query +")"
                    query = v1 + v2
                }
                query = "query=" + query
                return query;
            }

            $scope.expandAndCollapse = function(table_id,object,parentValue){
                object.expand = ! object.expand
                if (object.expand){
                    $scope.TABLES[table_id].getChildFunction($scope.getChildQuery(table_id,parentValue)).then(function (data) {
                        object.child = data.data
                    })
                } else {
                    object.child = []
                }
            }

            $scope.reloadPage = function (table_id, callback) {
                //console.log($scope.TABLES[table_id]);
                $scope.TABLES[table_id].loadFunction().then(function (data) {
                    // console.log(data)
                    $scope.TABLES[table_id].param_check_list = [];
                    $scope.checkSelectAllBtn(false, table_id);
                    $scope.showDeleteBtn(false);
                    var model = $scope.TABLES[table_id].model;
                    $scope[model] = data.data;
                    for (var i =0; i < data.data.length;i ++){
                        $scope[model][i].expand = false
                    }

                    if($scope.TABLES[table_id].handleAfterReload != null) {
                        $scope.TABLES[table_id].handleAfterReload(data.data, $scope.TABLES[table_id].handleAfterReloadParams);
                    }

                    // $scope.TABLES[table_id].param_total_result = data.headers()["x-total-count"];
                    // if (!$scope.TABLES[table_id].firstLoad) {
                    //     $scope.resetPageDisplay(table_id);
                    //     $scope.TABLES[table_id].selectize_pageNum = $scope.TABLES[table_id].param_page_size;
                    //     $scope.TABLES[table_id].firstLoad = true;
                    // }
                    if (callback != null)
                        callback("OK");

                    // $scope.setPageDisplay(table_id);

                    UIkit.tooltip('.tooltip').hide();
                })
            }

            $scope.customReloadPage = function (table_id, callback) {
                $scope.TABLES[table_id].loadFunction($scope.TABLES[table_id].customParams).then(function (data) {
                    if (data.data.length == 0) {return}
                    $scope.TABLES[table_id].param_check_list = [];
                    $scope.checkSelectAllBtn(false, table_id);
                    $scope.showDeleteBtn(false);
                    var model = $scope.TABLES[table_id].model;
                    $scope[model] = data.data;
                    $scope.TABLES[table_id].param_total_result = data.headers()["x-total-count"];
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
                $scope.reloadPage(table_id);
            }

            $scope.handleFilter = function (table_id) {
                var model = $scope.TABLES[table_id].model
                allowReloadDropSelectPage = false;
                //console.log($scope.TABLES[table_id]);
                $scope.TABLES[table_id].param_current_page = 0;
                var query = $scope.getCommonQuery(table_id);
                if (query == "query="){
                    $scope.reloadPage(table_id);
                } else {
                    $scope.TABLES[table_id].getChildFunction(query).then(function (data) {
                        var children = data.data
                        // console.log(children)
                        $scope[model] = []
                        $scope.parents = []
                        for (var i=0; i< children.length; i++){
                            // console.log(children[i][$scope.TABLES[table_id].parent_column])
                            var parentValue = children[i][$scope.TABLES[table_id].parent_column]
                            var childValue = children[i][$scope.TABLES[table_id].child_column]
                            if (parentValue ==null){
                                parentValue = childValue
                            }


                                var check = $scope.parents.indexOf(parentValue)
                                if(check >= 0){
                                    $scope[model][check].child.push(children[i])
                                } else {
                                    $scope.parents.push(parentValue)
                                    children[i].expand =true
                                    children[i].child = [children[i]]
                                    $scope[model].push(children[i])
                                }


                        }
                        // console.log($scope[model])
                    })
                }


                // $scope.reloadPage(table_id, function (ok) {
                //     if (ok == "OK") {
                //         $scope.resetPageDisplay(table_id);
                //     }
                // });
            }

            $scope.handleNextPage = function (table_id) {
                if ($scope.TABLES[table_id].param_current_page < $scope.TABLES[table_id].param_page_total - 1) {
                    $scope.TABLES[table_id].param_current_page++;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage(table_id);
                }
            }

            $scope.handlePreviousPage = function (table_id) {
                if ($scope.TABLES[table_id].param_current_page > 0) {
                    $scope.TABLES[table_id].param_current_page--;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage(table_id);
                }
            }

            $scope.handleFirstPage = function (table_id) {
                $scope.TABLES[table_id].param_current_page = 0;
                allowReloadDropSelectPage = false;
                $scope.reloadPage(table_id);
            }

            $scope.handleLastPage = function (table_id) {
                $scope.TABLES[table_id].param_current_page = $scope.TABLES[table_id].param_page_total - 1;
                allowReloadDropSelectPage = false;
                $scope.reloadPage(table_id);
            }

            var allowReloadDropSelectPage = false;
            $scope.selectPageHandle = function (table_id) {
                if (allowReloadDropSelectPage) {
                    $scope.TABLES[table_id].param_current_page = $("#"+$scope.TABLES[table_id].selectize_page_id).val() - 1;
                    $scope.reloadPage(table_id);
                }
            }

            $scope.selectPageClickHandle = function () {
                allowReloadDropSelectPage = true;
            }

            $scope.selectPageNumHandle = function (table_id) {
                allowReloadDropSelectPage = false;
                $scope.TABLES[table_id].param_page_size = $("#"+$scope.TABLES[table_id].selectize_pageNum_id).val();
                $scope.resetPageDisplay(table_id);
                $scope.reloadPage(table_id);
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
                $scope.showDeleteBtn(true);
                $scope.TABLES[table_id].param_check_list = [];
                var model = $scope.TABLES[table_id].model;
                for (var i = 0; i < $scope[model].length; i++) {
                    $scope.TABLES[table_id].param_check_list.push($scope[model][i].id);
                }
            }

            $scope.unSelectAllRows = function (table_id) {
                $scope.showDeleteBtn(false);
                $scope.TABLES[table_id].param_check_list = [];
            }

            $scope.selectOneRow = function (element, table_id) {
                var _id = element.closest('input').attr('id');
                $scope.TABLES[table_id].param_check_list.push(Number(_id));
                var model = $scope.TABLES[table_id].model;
                if ($scope.TABLES[table_id].param_check_list.length == $scope[model].length) {
                    $scope.checkSelectAllBtn(true, table_id);
                }
                $scope.showDeleteBtn(true);
            }

            $scope.unSelectOneRow = function (element, table_id) {
                $scope.checkSelectAllBtn(false, table_id);
                var _id = element.closest('input').attr('id');
                var index = $scope.TABLES[table_id].param_check_list.indexOf(Number(_id));
                if (index > -1) {
                    $scope.TABLES[table_id].param_check_list.splice(index, 1);
                }
                if ($scope.TABLES[table_id].param_check_list.length == 0) {
                    $scope.showDeleteBtn(false);
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

        function reloadPage(table_id) {
            $scope.reloadPage(table_id);
        }

        function getCurrentPageSize(table_id) {
            return $scope.TABLES[table_id].param_page_size;
        }

        function getSelectedRowIDs(table_id) {
            return $scope.TABLES[table_id].param_check_list;
        }

    }
})();
