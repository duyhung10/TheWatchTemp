(function(){
    'use strict';
    angular.module('erpApp')
        .controller('StudentCreateController',StudentCreateController);

    StudentCreateController.$inject = ['$rootScope','$scope','$state','Student', 'Role', 'AlertService','$translate','variables', 'TableMultiple', 'TranslateCommonUI','ErrorHandle', '$window'];
    function StudentCreateController($rootScope,$scope, $state, Student, Role, AlertService,$translate, variables, TableMultiple, TranslateCommonUI, ErrorHandle, $window) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.students";

        $scope.student = {};

        /*User.getAll().then(function(data) {
            $scope.users = data;
        })*/

        var fields =     ["id",     "email", "name", "address", "phone", "created", "createdBy", "updated", "updatedBy", "active"];
        var fieldsType = ["Number", "Text",  "Text",      "Text", "Text",    "Number",  "Text",      "Number",  "Text"     , "Number"];
        var loadFunction = Student.getPage;

        $scope.detail = {
            Email: "admin.student.column.Email",
            Name: "admin.student.column.Name",
            Address: "admin.student.column.Address",
            Phone: "admin.student.column.Phone",
            Status: "admin.student.column.Status",
            Created: "admin.student.column.Created",
            Updated: "admin.student.column.Updated",
            CreatedBy: "admin.student.column.CreatedBy",
            UpdatedBy: "admin.student.column.UpdatedBy"
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

        var statusAction = {
            true: "Activate",
            false: "Deactivate"
        }
        var statusTitle = {
            true: "Active",
            false: "Inactive"
        }

        $scope.submit = function() {
            $('#form_createstudent').parsley();
            if($scope.form_createstudent.$valid){

                Student.create($scope.student)
                    .then(function(data){
                        $state.go('students');
                    })
                    .catch(function(data){
                        //AlertService.error('admin.messages.errorCreateUser');
                        ErrorHandle.handleError(data);
                    })
            }
        }


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

            Role.getAll().then(function (data) {$scope.active
                $scope.allRoles = data;
                $scope.selectize_roles_options = $scope.allRoles;
            })

            $scope.email_msg = $translate.instant('admin.messages.invalidEmail')
            $scope.required_msg = $translate.instant('admin.messages.required')
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