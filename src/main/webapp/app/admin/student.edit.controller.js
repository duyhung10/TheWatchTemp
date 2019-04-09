(function(){
    'use strict';
    angular.module('erpApp')
        .controller('StudentEditController',StudentEditController);

    StudentEditController.$inject = ['$rootScope','$scope','$state','$stateParams','Student', 'Role', 'AlertService', 'ErrorHandle', '$translate','variables', 'TranslateCommonUI', '$timeout'];
    function StudentEditController($rootScope,$scope, $state, $stateParams, Student, Role, AlertService, ErrorHandle, $translate, variables, TranslateCommonUI, $timeout) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.students";
        $scope.pageTitle2 = "admin.student.edit";

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

        $scope.student = {};

        var statusStyle = {
            true: "uk-text-success uk-text-bold",
            false: "uk-text-danger uk-text-bold"
        }

        Student.getStudentById($stateParams.studentId).then(function (data) {
            $scope.student = data;
            $scope.student.createdDate = getDateString($scope.student.created);
            $scope.student.updatedDate = getDateString($scope.student.updated);


            $scope.status = "Inactive"
            $scope.active = $scope.student.active
            if ($scope.active) {
                $scope.status = "Active"
            }
            $scope.activeClass = statusStyle[$scope.active]

        })

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

        $scope.CbxActivate = {
            activateService:Student.activate,
            deactivateService:Student.deactivate
        }

        /*$scope.handleCheckbox = function (belong, id) {
            if(belong == "left") {
                var checked = $("#all_role_"+id).is(":checked");
                if(checked == true){
                    if(!$scope.checkExist($scope.checkedAllList, id)) {
                        $scope.checkedAllList.push(id);
                        $scope.checkedAllList.sort();
                    }
                } else {
                    if($scope.checkExist($scope.checkedAllList, id)) {
                        var index = $scope.checkedAllList.indexOf(id);
                        $scope.checkedAllList.splice(index, 1);
                        $scope.checkedAllList.sort();
                    }
                };
            } else {
                var checked = $("#selected_role_"+id).is(":checked");
                if(checked == true){
                    if(!$scope.checkExist($scope.checkedSelectedList, id)) {
                        $scope.checkedSelectedList.push(id);
                        $scope.checkedSelectedList.sort();
                    }
                } else {
                    if($scope.checkExist($scope.checkedSelectedList, id)) {
                        var index = $scope.checkedSelectedList.indexOf(id);
                        $scope.checkedSelectedList.splice(index, 1);
                        $scope.checkedSelectedList.sort();
                    }
                };
            }

        }

        $scope.checkExist = function (array, id) {
            for(var i = 0; i < array.length; i++) {
                if(array[i] == id)
                    return true;
            }
            return false;
        }

        $scope.getRole = function(array, id) {
            for(var i = 0; i < array.length; i++) {
                if(array[i].id == id)
                    return array[i];
            }
            return null;
        }

        $scope.sortRole = function (array) {
            array.sort(function (a, b) {
                a = a.id;
                b = b.id;
                return a > b ? 1 : a < b ? -1 : 0;
            })
        }

        $scope.removeRoleOfArray = function (array, role) {
            if($scope.getRole(array, role.id) != null) {
                var index = array.indexOf(role);
                array.splice(index, 1);
            }
        }

        $scope.addRole = function () {
            for(var i = 0; i < $scope.checkedAllList.length; i++) {
                if(!$scope.checkExist($scope.checkedSelectedList, $scope.checkedAllList[i])){
                    var newRole = $scope.getRole($scope.allRoles, $scope.checkedAllList[i]);
                    var exist = $scope.getRole($scope.selectedRoles, newRole.id);
                    if(exist == null){
                        $scope.selectedRoles.push(newRole);
                        $scope.sortRole($scope.selectedRoles);
                        //$scope.removeRoleOfArray($scope.allRoles, newRole);
                        /!*$scope.checkedSelectedList.push($scope.checkedAllList[i]);
                        $scope.checkedSelectedList.sort();*!/
                        //var index = $scope.checkedAllList.indexOf($scope.checkedAllList[i]);
                        //$scope.checkedAllList.splice(index, 1);
                    } /!*else {
                        $("#all_role_" + $scope.checkedAllList[i]).prop('checked', false).iCheck('update');
                    }
                    $("#selected_role_" + $scope.checkedAllList[i]).prop('checked', true).iCheck('update');*!/
                }
            }
        }

        $scope.addAllRole = function () {
            var temp = $scope.tempAllRoles;
            $scope.selectedRoles = [];
            for(var i = 0; i < temp.length; i++) {
                $scope.selectedRoles.push(temp[i]);
                $scope.sortRole($scope.selectedRoles);
            }
        }

        $scope.removeRole = function () {
            for(var i = 0; i < $scope.checkedSelectedList.length; i++) {
                var newRole = $scope.getRole($scope.selectedRoles, $scope.checkedSelectedList[i]);
                $scope.removeRoleOfArray($scope.selectedRoles, newRole);
            }
        }

        $scope.removeAllRole = function () {
            if($scope.selectedRoles.length > 0) {
                var temp = $scope.tempAllRoles;
                $scope.allRoles = [];
                for(var i = 0; i < temp.length; i++) {
                    $scope.allRoles.push(temp[i]);
                    $scope.sortRole($scope.allRoles);
                }

                $scope.selectedRoles = [];
                $scope.checkedSelectedList = [];
            }
        }*/

        function getDateString(unix_timestamp) {
            var date = new Date(unix_timestamp);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if(day < 10)
                day = "0" + day;
            if(month < 10)
                month = "0" + month;
            return day + "/" + month + "/" + year;
        }

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

        $scope.deleteStudent = function () {
            UIkit.modal.confirm($translate.instant($scope.actionConfirm.delete), function () {
                Student.deleteOne($scope.student.id).then(function(data){
                    $state.go('students');
                }).catch(function(data){
                    //AlertService.error('admin.messages.errorDeleteUser');
                    ErrorHandle.handleError(data)
                })
            }, {
                labels: {
                    'Ok': $translate.instant($scope.button.delete),
                    'Cancel': $translate.instant($scope.button.cancel)
                }
            });
        }


        $scope.submit = function() {
            $('#form_createstudent').parsley();
            if($scope.form_createstudent.$valid){

                Student.update($scope.student)
                    .then(function(data){
                        $state.go('students-detail',{studentId: $scope.student.id });
                    })
                    .catch(function(data){
                        //console.log('data',data);
                        AlertService.error('admin.messages.errorUpdateStudent');
                    })
            }
        }

        if ( angular.element('#form_createstudent').length ) {
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