(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserHomeController',UserHomeController);

    UserHomeController.$inject = ['$rootScope','$scope','$state','User', 'Role', 'AlertService','$translate','variables', 'TableMultiple', 'TranslateCommonUI','ErrorHandle', '$window'];
    function UserHomeController($rootScope,$scope, $state, User, Role, AlertService,$translate, variables, TableMultiple, TranslateCommonUI, ErrorHandle, $window) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.users";

        $scope.user = {};

        /*User.getAll().then(function(data) {
            $scope.users = data;
        })*/

        var fields =     ["id",     "email", "firstName", "lastName", "created", "createdBy", "updated", "updatedBy", "active"];
        var fieldsType = ["Number", "Text",  "Text",      "Text",     "Number",  "Text",      "Number",  "Text"     , "Number"];
        var loadFunction = User.getPage;

        var newTableIds = {
            idTable: "table_user",
            model: "users",
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
            pager_id: "table_user_pager",
            selectize_page_id: "user_selectize_page",
            selectize_pageNum_id: "user_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIds);
        TableMultiple.sortDefault(newTableIds.idTable);
        TableMultiple.reloadPage(newTableIds.idTable);

        $scope.columnsName = {
            Email: "admin.user.column.Email",
            FirstName: "admin.user.column.FirstName",
            LastName: "admin.user.column.LastName",
            Status: "admin.user.column.Status",
            Created: "admin.user.column.Created",
            Updated: "admin.user.column.Updated",
            CreatedBy: "admin.user.column.CreatedBy",
            UpdatedBy: "admin.user.column.UpdatedBy"
        }

        $scope.detail = {
            Email: "admin.user.column.Email",
            Password: "admin.user.column.Password",
            ConfirmPassword: "admin.user.column.ConfirmPassword",
            FirstName: "admin.user.column.FirstName",
            LastName: "admin.user.column.LastName",
            Address: "admin.user.column.Address",
            Phone: "admin.user.column.Phone",
            Position: "admin.user.column.Position",
            Roles: "admin.user.column.Roles",
            Status: "admin.user.column.Status",
            Created: "admin.user.column.Created",
            Updated: "admin.user.column.Updated",
            CreatedBy: "admin.user.column.CreatedBy",
            UpdatedBy: "admin.user.column.UpdatedBy"
        }

        // Handle Delete Rows
        $scope.handleDeleteRows = function () {
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                var ids = TableMultiple.getSelectedRowIDs('table_user');
                User.deleteMany(ids)
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

        $scope.activate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                User.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.active')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }

        }

        $scope.deactivate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                User.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.inactive')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }
        }

        $scope.status = "Active"
        $scope.active = $scope.user.active = true;
        var statusStyle = {
            true: "uk-text-success uk-text-bold",
            false: "uk-text-danger uk-text-bold"
        }
        if ($scope.active) {
            $scope.status = "Active"
        }
        $scope.activeClass = statusStyle[$scope.active]

        $scope.clickActiveLock = false;
        $scope.clickActive = function () {
            if(!$scope.clickActiveLock) {
                $scope.clickActiveLock = true;
                $scope.status = statusTitle[$scope.active];
            } else {
                // continue click, need change
                $scope.changeActive();
            }
        }

        $scope.changeActive = function () {
            $scope.active = !$scope.active;
            $scope.user.active = !$scope.user.active;
            if ($scope.active) {
                $scope.status = "Active"
            } else {
                $scope.status = "Inactive"
            }
            $scope.activeClass = statusStyle[$scope.active]
        }

        var statusAction = {
            true: "Activate",
            false: "Deactivate"
        }
        var statusTitle = {
            true: "Active",
            false: "Inactive"
        }
        /*$scope.mouseHoverStatus = function(){
            $scope.active = !$scope.active
            $scope.status = statusAction[$scope.active]
            $scope.activeClass = statusStyle[$scope.active]
            // console.log("HOVER: "+$scope.status)
        };
        $scope.mouseLeaveStatus = function(){
            $scope.active = !$scope.active
            $scope.status = statusTitle[$scope.active]
            $scope.activeClass = statusStyle[$scope.active]
            // console.log("LEAVE: "+$scope.status)
            if($scope.clickActiveLock){
                $scope.changeActive();
                $scope.clickActiveLock = false;
            }
        };*/

        $scope.CbxActive = {
            Placeholder : 'Select status',
            Api : "api/users",
            Table : $scope.TABLES['table_user'],
            Column : 8,
            Scope : $scope,
            ngModel:{value:1, title:"Active"}
        }

        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        }

        $scope.DatetimeRange1 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_user'], // ** table filter
            Column: 4, // ** number column filter on table
            Scope: $scope
        }
        $scope.DatetimeRange2 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_user'], // ** table filter
            Column: 6, // ** number column filter on table
            Scope: $scope
        }

        $scope.submit = function() {
            $('#form_createuser').parsley();
            if($scope.form_createuser.$valid){
                $scope.user.roles = [];
                for(var i = 0; i < $scope.forms_advanced.selectize_roles.length; i++) {
                    var role_id = $scope.forms_advanced.selectize_roles[i];
                    for(var j = 0; j < $scope.allRoles.length; j++) {
                        if($scope.allRoles[j].id == role_id) {
                            $scope.user.roles.push($scope.allRoles[j]);
                            break;
                        }
                    }
                }

                User.create($scope.user)
                    .then(function(data){
                        $state.go('users');
                    })
                    .catch(function(data){
                        //AlertService.error('admin.messages.errorCreateUser');
                        ErrorHandle.handleError(data);
                    })
            }
        }

        $("#table_user").css('min-height', $( window ).height() - 300);
        $("#table_user").css('max-height', $( window ).height() - 300);
        angular.element($window).bind('resize', function(){
            $("#table_user").css('min-height', $( window ).height() - 300);
            $("#table_user").css('max-height', $( window ).height() - 300);
        });

        if ( angular.element('#form_createuser').length ) {
            $scope.forms_advanced = {
                selectize_roles: []
            };

            var roles_data = $scope.selectize_roles_options = [];

            $scope.selectize_roles_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: null,
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                create: false,
                render: {
                    option: function(roles_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(roles_data.name) + '</span>' +
                            '</div>';
                    },
                    item: function(roles_data, escape) {
                        return '<div class="item longTextShowToolTip" title="'+escape(roles_data.name)+'"><a href="/#/roles/'+ escape(roles_data.id) + '/detail">'  + escape(roles_data.name) + '</a></div>';
                    }
                }
            };

            Role.getAll().then(function (data) {$scope.active
                $scope.allRoles = data;
                $scope.selectize_roles_options = $scope.allRoles;
            })

            $scope.email_msg = $translate.instant('admin.messages.invalidEmail')
            $scope.required_msg = $translate.instant('admin.messages.required')
            $scope.confirmPassword_msg = $translate.instant('admin.messages.confirmPassword')
            $scope.passwordPattern = $translate.instant('admin.messages.passwordPattern')
            var $formValidate = $('#form_createuser');
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