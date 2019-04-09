(function(){
    'use strict';
    angular.module('erpApp')
        .controller('PrivilegeHomeController',PrivilegeHomeController);

    PrivilegeHomeController.$inject = ['$rootScope','$scope','$state','Privilege','AlertService', 'ErrorHandle', '$translate','variables', 'TableMultiple', 'TranslateCommonUI', '$window'];
    function PrivilegeHomeController($rootScope,$scope, $state, Privilege, AlertService, ErrorHandle, $translate, variables, TableMultiple, TranslateCommonUI, $window) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.privileges"

        $scope.columnsName = {
            Name: "admin.role.column.Name",
            Description: "admin.role.column.Description",
            Created: "admin.role.column.Created",
            Updated: "admin.role.column.Updated",
            CreatedBy: "admin.role.column.CreatedBy",
            UpdatedBy: "admin.role.column.UpdatedBy"
        }

        $scope.detail = {
            Name: "admin.role.column.Name",
            Description: "admin.role.column.Description",
            Created: "admin.role.column.Created",
            Updated: "admin.role.column.Updated",
            CreatedBy: "admin.role.column.CreatedBy",
            UpdatedBy: "admin.role.column.UpdatedBy"
        }

        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        }

        $scope.privilege = {};

        var fields =     ["id",     "name", "description", "created", "createdBy", "updated", "updatedBy"];
        var fieldsType = ["Number", "Text", "Text",        "Number",  "Text",      "Number",  "Text"     ]
        var loadFunction = Privilege.getPage;
        /*TableCommon.allowShowTooltips($scope, true);
        TableCommon.initData($scope, "privileges", fields, fieldsType, loadFunction, function () {
            // delete callback
            //alert("ID: "+ $scope.param_check_list);
        });
        TableCommon.sortDefault();
        TableCommon.reloadPage();*/

        var newTableIds = {
            idTable: "table_priv",
            model: "privileges",
            param_allow_show_tooltip : "true",
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
            customParams: "",
            pager_id: "table_priv_pager",
            selectize_page_id: "priv_selectize_page",
            selectize_pageNum_id: "priv_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIds);
        TableMultiple.sortDefault(newTableIds.idTable);
        TableMultiple.reloadPage(newTableIds.idTable);

        $scope.DatetimeRange1 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_priv'], // ** table filter
            Column: 3, // ** number column filter on table
            Scope: $scope
        }
        $scope.DatetimeRange2 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_priv'], // ** table filter
            Column: 5, // ** number column filter on table
            Scope: $scope
        }

        // Handle Delete Rows
        $scope.handleDeleteRows = function () {
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                var ids = TableMultiple.getSelectedRowIDs('table_priv');
                Privilege.deleteMany(ids)
                    .then(function(data){
                        if (data.length > 0) {
                            var erMsg = $translate.instant('error.common.deleteError')
                            erMsg += data
                            AlertService.error(erMsg)
                        } else {
                            AlertService.success('success.msg.delete');
                            TableMultiple.reloadPage(newTableIds.idTable);
                        }
                    })
                    .catch(function(data){
                        ErrorHandle.handleError(data);
                    })
            }, {
                labels: {
                    'Ok': $translate.instant("common-ui-element.button.Delete"),
                    'Cancel': $translate.instant("common-ui-element.button.Cancel")
                }
            });
        }

        $scope.submit = function() {
            $('#form_createprivilege').parsley();
            if($scope.form_createprivilege.$valid){
                Privilege.create($scope.privilege)
                    .then(function(){
                        $state.go('privileges');
                    })
                    .catch(function(){
                        AlertService.error('admin.messages.errorCreatePrivilege');
                    })
            }
        }

        $("#ts_pager_filter").css('min-height', $( window ).height() - 300);
        $("#ts_pager_filter").css('max-height', $( window ).height() - 300);
        angular.element($window).bind('resize', function(){
            $("#ts_pager_filter").css('min-height', $( window ).height() - 300);
            $("#ts_pager_filter").css('max-height', $( window ).height() - 300);
        });

        if ( angular.element('#form_createprivilege').length ) {
            $scope.required_msg = $translate.instant('admin.messages.required')
            var $formValidate = $('#form_createprivilege');
            $formValidate
                .parsley({
                    'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
                })
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });
        }
    }

})();