(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('TableCommon', TableCommon);

    TableCommon.$inject = ['$translate'];

    function TableCommon($translate, $scope, $model) {
        var service = {
            initData: initData,
            sortDefault: sortDefault,
            reloadPage: reloadPage,
            customReloadPage: customReloadPage,
            moreParamReloadPage: moreParamReloadPage,
            getCurrentPageSize: getCurrentPageSize,
            getMans:getMans,
            initCustomData: initCustomData,
            initBuildingParam: initBuildingParam,
            allowShowTooltips: allowShowTooltips
        };

        return service;

        function init(scopeParam, model, fields,fieldsType, loadFunction) {
            $scope = scopeParam;
            $model = model;
            if($scope.param_allow_show_tooltip == null){
                $scope.param_allow_show_tooltip = false;
            }
            $scope.tree_query = "";
            $scope.selectPage = $translate.instant('admin.pagination.selectPage');
            $scope.pageSize = $translate.instant('admin.pagination.pageSize');
            $scope.firstLoad = false;
            $scope.param_current_page = 0;
            $scope.param_page_size = 0;
            $scope.param_total_result = 0;
            $scope.param_page_total = 0;
            $scope.param_sort_field = "";
            $scope.param_sort_type = "asc";
            $scope.param_sort_list = [];
            $scope.param_filter_list = [];
            $scope.param_check_list = [];
            $scope.sortIcons = ["sort", "keyboard_arrow_up", "keyboard_arrow_down"];

            $scope.selectize_page_options = [];
            $scope.selectize_page_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            };

            $scope.selectize_pageNum_options = ["10", "5", "25", "50"];
            $scope.selectize_pageNum_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            };

            $scope.loadFunction = loadFunction;
            $scope.param_fields = fields;
            $scope.param_fields_type = fieldsType;
            for (var i = 0; i < $scope.param_fields.length; i++) {
                $scope.param_sort_list.push($scope.sortIcons[0]);
                $scope.param_filter_list.push("");
            }

            //$scope.param_page_size = $scope.selectize_pageNum_options[0];
            $scope.param_page_size = 10;
            $scope.table_data_origin = [];
        }

        function initCustom(scopeParam, handleAfterReload, params) {
            $scope = scopeParam;
            $scope.handleAfterReload = handleAfterReload;
            $scope.handleAfterReloadParams = params;
        }

        function initBuildingParam(scopeParam, buildingParams) {
            $scope = scopeParam;
            $scope.buildingParams = buildingParams;
        }

        function main(deleteCallback) {
            $scope.setPageDisplay = function () {
                var left = $scope.param_current_page * $scope.param_page_size + 1;
                var right;
                if ($scope.param_current_page == $scope.param_page_total - 1) {
                    right = $scope.param_total_result;
                } else {
                    right = ($scope.param_current_page + 1) * $scope.param_page_size;
                }
                if ($scope.param_total_result == 0)
                    $(".pageDisplay").html("0");
                else
                    $(".pageDisplay").html(left + "-" + right + "/" + $scope.param_total_result);
                if (!allowReloadDropSelectPage) {
                    $scope.selectize_page = $scope.param_current_page + 1;
                }

                // Disable all action if result have only one page
                if($scope.param_page_total == 1) {
                    $("ul.uk-pagination").find('.firstPage').addClass('disableMouse');
                    $("ul.uk-pagination").find('.lastPage').addClass('disableMouse');
                    $("ul.uk-pagination").find('.prevPage').addClass('disableMouse');
                    $("ul.uk-pagination").find('.nextPage').addClass('disableMouse');
                } else if($scope.param_page_total > 1) {
                    $("ul.uk-pagination").find('.firstPage').removeClass('disableMouse');
                    $("ul.uk-pagination").find('.lastPage').removeClass('disableMouse');
                    $("ul.uk-pagination").find('.prevPage').removeClass('disableMouse');
                    $("ul.uk-pagination").find('.nextPage').removeClass('disableMouse');

                    // if current page is first page, then disable first & prev action
                    if($scope.param_current_page == 0) {
                        $("ul.uk-pagination").find('.firstPage').addClass('disableMouse');
                        $("ul.uk-pagination").find('.prevPage').addClass('disableMouse');
                    }

                    // if current page is last page, then disable last & next action
                    if($scope.param_current_page == $scope.param_page_total - 1) {
                        $("ul.uk-pagination").find('.lastPage').addClass('disableMouse');
                        $("ul.uk-pagination").find('.nextPage').addClass('disableMouse');
                    }
                }
            }

            $scope.resetPageDisplay = function () {
                //console.log($scope.param_total_result);
                //console.log($scope.param_page_size);

                //console.log($scope.selectize_page_options);
                if($scope.param_page_size > 0){

                }else{
                    $scope.param_page_size = $scope.selectize_pageNum_options[0];
                }
                var a = Math.floor($scope.param_total_result / $scope.param_page_size);
                var b = $scope.param_total_result % $scope.param_page_size;
                if (b > 0)
                    $scope.param_page_total = a + 1;
                else
                    $scope.param_page_total = a;

                //console.log($scope.param_page_total);

                $scope.param_current_page = 0;
                $scope.selectize_page_options = [];
                if( $scope.param_page_total == 0){
                    $scope.selectize_page_options.push("1");
                }
                for (var i = 0; i < $scope.param_page_total; i++) {
                    $scope.selectize_page_options.push("" + (i + 1));
                }
            }

            $scope.checkSelectAllBtn = function (show) {
                $('.ts_checkbox_all').prop('checked', show).iCheck('update');
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

            $scope.reloadPage = function (callback) {
                //console.log(getCommonQuery());
                var stringQuery = $scope.buildingParams == null ? getCommonQuery() : $scope.buildingParams + getCommonQuery();
                $scope.loadFunction(stringQuery).then(function (data) {

                    $scope.param_check_list = [];
                    $scope.checkSelectAllBtn(false);
                    $scope.showDeleteBtn(false);
                    $scope[$model] = data.data;
                    $scope.table_data_origin = data.data;

                    if($scope.handleAfterReload != null) {
                        $scope.handleAfterReload(data.data, $scope.handleAfterReloadParams);
                        if(data.data.length == 0){
                            if (!angular.element('#noResult').length) {
                                $scope.showNoResult = $translate.instant('common-ui-element.messages.noResult');
                                $( "#ts_pager_filter") .after( $( "<div id=\"noResult\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );

                            }
                        }else{
                            if (angular.element('#noResult').length) {
                                $("#noResult").remove();
                            }
                        }
                    }

                    $scope.param_total_result = data.headers()["x-total-count"];
                    if($scope.handleAfterReload == null){
                        if($scope.param_total_result == 0){
                            if (!angular.element('#noResult').length) {
                                $scope.showNoResult = $translate.instant('common-ui-element.messages.noResult');
                                $( "#ts_pager_filter") .after( $( "<div id=\"noResult\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );

                            }
                        }else{
                            if (angular.element('#noResult').length) {
                                $("#noResult").remove();
                            }
                        }
                    }
                    if (!$scope.firstLoad) {
                        $scope.resetPageDisplay();
                        $scope.selectize_pageNum = $scope.param_page_size;
                        //$scope.firstLoad = true;
                    }
                    if (callback != null)
                        callback("OK");

                    $scope.setPageDisplay();

                    UIkit.tooltip('.tooltip').hide();
                })
            }

            $scope.customReloadPage = function (callback) {
                $scope.loadFunction($scope.customParams).then(function (data) {
                    if (data.data.length == 0) {return}
                    $scope.param_check_list = [];
                    $scope.checkSelectAllBtn(false);
                    $scope.showDeleteBtn(false);
                    $scope[$model] = data.data;
                    $scope.param_total_result = data.headers()["x-total-count"];
                    if($scope.param_total_result == 0){
                        if (!angular.element('#noResult').length) {
                            $scope.showNoResult = $translate.instant('common-ui-element.messages.noResult');
                            $( "#ts_pager_filter") .after( $( "<div id=\"noResult\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );

                        }
                    }else{
                        if (angular.element('#noResult').length) {
                            $("#noResult").remove();
                        }
                    }
                    if (!$scope.firstLoad) {
                        $scope.resetPageDisplay();
                        $scope.selectize_pageNum = $scope.param_page_size;
                        //$scope.firstLoad = true;
                    }
                    if (callback != null)
                        callback("OK");
                    $scope.setPageDisplay();

                    UIkit.tooltip('.tooltip').hide();
                })
            }

            $scope.handleSort = function ($event, pos) {
                switch ($scope.param_sort_list[pos]) {
                    case $scope.sortIcons[0]:
                        // sort asc
                        $scope.param_sort_list[pos] = $scope.sortIcons[1];
                        $scope.param_sort_type = "asc";
                        break;
                    case $scope.sortIcons[1]:
                        // sort desc
                        $scope.param_sort_list[pos] = $scope.sortIcons[2];
                        $scope.param_sort_type = "desc";
                        break;
                    case $scope.sortIcons[2]:
                        // sort asc
                        $scope.param_sort_list[pos] = $scope.sortIcons[1];
                        $scope.param_sort_type = "asc";
                        break;
                }

                // sort 1 column only
                $("#ts_pager_filter thead th")
                    .removeClass("tablesorter-headerAsc")
                $($event.target.closest("th"))
                    .addClass("tablesorter-headerAsc")

                for (var i = 0; i < $scope.param_sort_list.length; i++) {
                    if (i != pos) {
                        $scope.param_sort_list[i] = $scope.sortIcons[0];
                    }
                }

                $scope.param_sort_field = $scope.param_fields[pos];
                allowReloadDropSelectPage = false;
                $scope.reloadPage();
            }

            $scope.handleFilter = function () {
                allowReloadDropSelectPage = false;
                $scope.param_current_page = 0;
                $scope.reloadPage(function (ok) {
                    if (ok == "OK") {
                        $scope.resetPageDisplay();
                    }
                });
            }

            $scope.nextPage = function () {
                if ($scope.param_current_page < $scope.param_page_total - 1) {
                    $scope.param_current_page++;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage();
                }
            }

            $scope.prevPage = function () {
                if ($scope.param_current_page > 0) {
                    $scope.param_current_page--;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage();
                }
            }

            $scope.firstPage = function () {
                if($scope.param_current_page == 0)
                    return;

                $scope.param_current_page = 0;
                allowReloadDropSelectPage = false;
                $scope.reloadPage();
            }

            $scope.lastPage = function () {
                if($scope.param_current_page == $scope.param_page_total - 1)
                    return;

                $scope.param_current_page = $scope.param_page_total - 1;
                allowReloadDropSelectPage = false;
                $scope.reloadPage();
            }

            $('.nextPage').on("click", function () {
                if ($scope.param_current_page < $scope.param_page_total - 1) {
                    $scope.param_current_page++;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage();
                }
            })

            $('.prevPage').on("click", function () {
                if ($scope.param_current_page > 0) {
                    $scope.param_current_page--;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage();
                }
            })

            $('.firstPage').on("click", function () {
                if($scope.param_current_page == 0)
                    return;

                $scope.param_current_page = 0;
                allowReloadDropSelectPage = false;
                $scope.reloadPage();
            })

            $('.lastPage').on("click", function () {
                if($scope.param_current_page == $scope.param_page_total - 1)
                    return;

                $scope.param_current_page = $scope.param_page_total - 1;
                allowReloadDropSelectPage = false;
                $scope.reloadPage();
            })

            var allowReloadDropSelectPage = false;
            $scope.selectPageHandle = function () {
                if (allowReloadDropSelectPage) {
                    $scope.param_current_page = $("#selectize_page").val() - 1;
                    $scope.reloadPage();
                }
            }

            $scope.selectPageClickHandle = function () {
                allowReloadDropSelectPage = true;
            }

            $scope.selectPageNumHandle = function () {
                allowReloadDropSelectPage = false;
                $scope.param_page_size = $("#selectize_pageNum").val();
                if ($scope.firstLoad) {
                    $scope.resetPageDisplay();
                    $scope.reloadPage();
                } else {
                    $scope.firstLoad = true;
                }
            }

            $scope.deleteRows = function () {
                $scope.param_check_list.sort();
                UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                    //$("#ts_pager_filter").trigger('update');
                    if (deleteCallback != null) {
                        deleteCallback();
                    }
                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Delete"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });
            }

            $scope.selectAllRows = function () {
                $scope.showDeleteBtn(true);
                $scope.param_check_list = [];
                for (var i = 0; i < $scope[$model].length; i++) {
                    $scope.param_check_list.push($scope[$model][i].id);
                }
            }

            $scope.unSelectAllRows = function () {
                $scope.showDeleteBtn(false);
                $scope.param_check_list = [];
            }

            $scope.selectOneRow = function (element) {
                var _id = element.closest('input').attr('id');
                $scope.param_check_list.push(Number(_id));
                if ($scope.param_check_list.length == $scope[$model].length) {
                    $scope.checkSelectAllBtn(true);
                }
                $scope.showDeleteBtn(true);
            }

            $scope.unSelectOneRow = function (element) {
                $scope.checkSelectAllBtn(false);
                var _id = element.closest('input').attr('id');
                var index = $scope.param_check_list.indexOf(Number(_id));
                if (index > -1) {
                    $scope.param_check_list.splice(index, 1);
                }
                if ($scope.param_check_list.length == 0) {
                    $scope.showDeleteBtn(false);
                }
            }

            $scope.$on('onLastRepeat', function (scope, element, attrs) {

                var $ts_pager_filter = $("#ts_pager_filter");
                if ($(element).closest($ts_pager_filter).length) {
                    // Tooltip for long text
                    if($scope.param_allow_show_tooltip) {
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
                    $('.ts_checkbox_all')
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

                            $scope.selectAllRows();
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

                            $scope.unSelectAllRows();
                        });

                    // select/unselect table row
                    $ts_pager_filter.find('.ts_checkbox')
                        .on('ifUnchecked', function () {
                            $(this).closest('tr').removeClass('row_highlighted');
                            $scope.unSelectOneRow($(this));
                        })
                        .on('ifChecked', function () {
                            $(this).closest('tr').addClass('row_highlighted');
                            $scope.selectOneRow($(this));
                        });
                }

            });
        }

        function initData(scopeParam, model, fields,fieldsType, loadFunction, deleteCallback) {
            init(scopeParam, model, fields,fieldsType, loadFunction);
            main(deleteCallback);
        }

        function initCustomData(scopeParam, handleAfterReloadFunction, params) {
            initCustom(scopeParam, handleAfterReloadFunction, params)
        }

        function allowShowTooltips(scope, allow) {
            $scope = scope;
            $scope.param_allow_show_tooltip = allow;
        }

        function sortDefault() {
            var pos = -1;
            for (var i = 0; i < $scope.param_fields.length; i++) {
                if($scope.param_fields[i] == "created") {
                    pos = i;
                    break;
                }
            }
            if(pos > -1) {
                $scope.param_sort_list[pos] = $scope.sortIcons[2];
                $scope.param_sort_type = "desc";
                $scope.param_sort_field = $scope.param_fields[pos];
            }
        }

        function reloadPage() {
            $scope.customParams = "";
            $scope.reloadPage();
        }

        function getCommonQuery() {
            var query = "query=";
            for (var i = 0; i < $scope.param_filter_list.length; i++) {
                if ($scope.param_filter_list[i].length != "".length) {
                    if ($scope.param_fields_type[i] =="Text"){
                        query += $scope.param_fields[i] + '=="*' + $scope.param_filter_list[i] + '*";';
                    } else if($scope.param_fields_type[i] =="Number"){
                        query += $scope.param_fields[i] + '==' + $scope.param_filter_list[i] + ';';
                    } else if($scope.param_fields_type[i] =="DateTime"){
                        var datetime = $scope.param_filter_list[i].split("&");
                        query += $scope.param_fields[i] + '>=' + datetime[0] + ';' + $scope.param_fields[i] + '<=' + datetime[1] + ';';
                    } else if($scope.param_fields_type[i] =="MultiText" && $scope.param_filter_list[i].length > 0) {
                        var searchValue = $scope.param_filter_list[i].toString();
                        query += $scope.param_fields[i] + '=in=("' + searchValue.replace(/,/g , '","') + '");';
                    } else if($scope.param_fields_type[i] =="MultiNumber" && $scope.param_filter_list[i].length > 0) {
                        query += $scope.param_fields[i] + '=in=(' + $scope.param_filter_list[i].toString() + ');';
                    } else if($scope.param_fields_type[i] =="NumberRange") {
                        query += $scope.param_fields[i] + '>=' + $scope.param_filter_list[i].from + ';' + $scope.param_fields[i] + '<=' + $scope.param_filter_list[i].to + ';';
                    }
                }
            }
            query += $scope.customParams + $scope.tree_query;
            if (query.slice(-1) == ';')
                query = query.substr(0, query.length - 1);

            var params = "&page=" + $scope.param_current_page +
                "&size=" + $scope.param_page_size +
                "&sort=" + $scope.param_sort_field +
                "," + $scope.param_sort_type;
            // console.log(query+params)
            return query + params;
        }

        function customReloadPage(params) {
            $scope.customParams = params
            $scope.customReloadPage()
        }

        function moreParamReloadPage(params) {
            //console.log(params);
            $scope.customParams = params;
            $scope.reloadPage();
        }

        function getCurrentPageSize() {
            return $scope.param_page_size
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
