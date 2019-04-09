(function(){
    'use strict';
    angular.module('erpApp')
        .controller('StudentController',StudentController);

    StudentController.$inject = ['$rootScope','$scope','$state','$http','Student', 'Role', 'AlertService','$translate','variables', 'TableMultiple', 'TranslateCommonUI','ErrorHandle', '$window'];
    function StudentController($rootScope,$scope, $state, $http, Student, Role, AlertService,$translate, variables, TableMultiple, TranslateCommonUI, ErrorHandle, $window) {

        // $scope.student = {};
        // $scope.isShowDefault = false;
        //
        // Student.getAll().then(function (students) {
        //     $scope.studentList = students;
        // })
        //
        // $scope.onSubmit = function () {
        //     Student.create($scope.student).then(function () {
        //         alert('Them sinh vien thanh cong');
        //         $scope.student = null;
        //     })
        // }
        //
        // $scope.onDelete = function (id) {
        //     Student.deleteOne(id).then(function () {
        //         alert('Xoa sinh vien thanh cong');
        //         window.location.reload();
        //     })
        // }
        //
        // $scope.onClickBtnEdit = function (student) {
        //     $scope.isShowDefault = true;
        //     $scope.student = student;
        // }
        //
        // $scope.onSubmitEdit = function (student) {
        //     Student.update(student).then(function () {
        //         $scope.isShowDefault = false;
        //         $scope.student = null;
        //         alert('Cập nhật sinh viên thành công');
        //     });
        // }
        // $scope.onClickBtnCancel = function () {
        //     $scope.isShowDefault = false;
        //     $scope.student = null;
        // }

        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.students";

        $scope.student = {};

        Student.getAll().then(function (data) {
            $scope.student = data;
            console.log($scope.student);
        })


        var fields =     ["id",     "email", "name", "phone", "created", "createdBy", "updated", "updatedBy", "active"];
        var fieldsType = ["Number", "Text",  "Text",      "Text",     "Number",  "Text",      "Number",  "Text"     , "Number"];
        var loadFunction = Student.getPage;

        var newTableIds = {
            idTable: "table_student",
            model: "students",
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
            pager_id: "table_student_pager",
            selectize_page_id: "student_selectize_page",
            selectize_pageNum_id: "student_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIds);
        TableMultiple.sortDefault(newTableIds.idTable);
        TableMultiple.reloadPage(newTableIds.idTable);

        // $scope.columnsName = {
        //     Email: "admin.student.column.Email",
        //     Name: "admin.student.column.Name",
        //     Phone: "admin.student.column.Phone",
        //     Status: "admin.student.column.Status",
        //     Created: "admin.student.column.Created",
        //     Updated: "admin.student.column.Updated",
        //     CreatedBy: "admin.student.column.CreatedBy",
        //     UpdatedBy: "admin.student.column.UpdatedBy"
        // }

        // $scope.detail = {
        //     Email: "admin.student.column.Email",
        //     Password: "admin.student.column.Password",
        //     ConfirmPassword: "admin.student.column.ConfirmPassword",
        //     FirstName: "admin.student.column.FirstName",
        //     LastName: "admin.student.column.LastName",
        //     Name: "admin.student.column.Name",
        //     Address: "admin.student.column.Address",
        //     Phone: "admin.student.column.Phone",
        //     Position: "admin.student.column.Position",
        //     Roles: "admin.student.column.Roles",
        //     Status: "admin.student.column.Status",
        //     Created: "admin.student.column.Created",
        //     Updated: "admin.student.column.Updated",
        //     CreatedBy: "admin.student.column.CreatedBy",
        //     UpdatedBy: "admin.student.column.UpdatedBy"
        // }

        // Handle Delete Rows
        $scope.handleDeleteRows = function () {
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                var ids = TableMultiple.getSelectedRowIDs('table_student');
                Student.deleteMany(ids)
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
                Student.activate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.active')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }
        }

        $scope.deactivate = function () {
            if ($scope.TABLES[newTableIds.idTable].param_check_list.length > 0){
                Student.deactivate($scope.TABLES[newTableIds.idTable].param_check_list).then(function () {
                    AlertService.success('success.msg.inactive')
                    TableMultiple.reloadPage(newTableIds.idTable);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }
        }

        $scope.status = "Active"
        $scope.active = $scope.student.active = true;
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
            $scope.student.active = !$scope.student.active;
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
            Api : "api/students",
            Table : $scope.TABLES['table_student'],
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
            Table: $scope.TABLES['table_student'], // ** table filter
            Column: 4, // ** number column filter on table
            Scope: $scope
        }
        $scope.DatetimeRange2 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_student'], // ** table filter
            Column: 6, // ** number column filter on table
            Scope: $scope
        }

        $scope.submit = function() {
            $('#form_createstudent').parsley();
            if($scope.form_createstudent.$valid){
                $scope.student.roles = [];
                for(var i = 0; i < $scope.forms_advanced.selectize_roles.length; i++) {
                    var role_id = $scope.forms_advanced.selectize_roles[i];
                    for(var j = 0; j < $scope.allRoles.length; j++) {
                        if($scope.allRoles[j].id == role_id) {
                            $scope.student.roles.push($scope.allRoles[j]);
                            break;
                        }
                    }
                }

                User.create($scope.student)
                    .then(function(data){
                        $state.go('students');
                    })
                    .catch(function(data){
                        //AlertService.error('admin.messages.errorCreateUser');
                        ErrorHandle.handleError(data);
                    })
            }
        }

        $("#table_student").css('min-height', $( window ).height() - 300);
        $("#table_student").css('max-height', $( window ).height() - 300);
        angular.element($window).bind('resize', function(){
            $("#table_student").css('min-height', $( window ).height() - 300);
            $("#table_student").css('max-height', $( window ).height() - 300);
        });

        if ( angular.element('#form_createstudent').length ) {
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

            Role.getAll().then(function (data) {
                $scope.allRoles = data;
                $scope.selectize_roles_options = $scope.allRoles;
            })

            $scope.email_msg = $translate.instant('admin.messages.invalidEmail')
            $scope.required_msg = $translate.instant('admin.messages.required')
            $scope.confirmPassword_msg = $translate.instant('admin.messages.confirmPassword')
            $scope.passwordPattern = $translate.instant('admin.messages.passwordPattern')
            var $formValidate = $('#form_createstudent');
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