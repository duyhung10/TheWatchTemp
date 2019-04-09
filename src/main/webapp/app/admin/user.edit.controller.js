(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserEditController',UserEditController);

    UserEditController.$inject = ['$rootScope','$scope','$state','$stateParams','User', 'Role', 'AlertService', 'ErrorHandle', '$translate','variables', 'TranslateCommonUI', '$timeout'];
    function UserEditController($rootScope,$scope, $state, $stateParams, User, Role, AlertService, ErrorHandle, $translate, variables, TranslateCommonUI, $timeout) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.users";
        $scope.pageTitle2 = "admin.user.edit";

        $scope.detail = {
            Email: "admin.user.column.Email",
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

        $scope.user = {};
        $scope.allRoles = {};

        var statusStyle = {
            true: "uk-text-success uk-text-bold",
            false: "uk-text-danger uk-text-bold"
        }

        User.getUserById($stateParams.userId).then(function (data) {
            $scope.user = data;
            $scope.user.createdDate = getDateString($scope.user.created);
            $scope.user.updatedDate = getDateString($scope.user.updated);

            $scope.selectize_roles_options = $scope.user.roles;

            for(var j = 0; j < $scope.user.roles.length; j++) {
                $scope.forms_advanced.selectize_roles.push($scope.user.roles[j].id);
            }

            Role.getAll().then(function (data) {
                $scope.allRoles = data;
                $scope.selectize_roles_options = $scope.allRoles;
            })

            $scope.status = "Inactive"
            $scope.active = $scope.user.active
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

        $scope.CbxActivate = {
            activateService:User.activate,
            deactivateService:User.deactivate
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

        $scope.deleteUser = function () {
            UIkit.modal.confirm($translate.instant($scope.actionConfirm.delete), function () {
                User.deleteOne($scope.user.id).then(function(data){
                    $state.go('users');
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

        //save avatar
        $timeout(function () {
            $("#user_edit_avatar_control").change(function(e) {
                var file = $('#inventory-input-form-file')[0].files[0];


            });
        })

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

                User.update($scope.user)
                    .then(function(data){
                        $state.go('users-detail',{userId: $scope.user.id });
                    })
                    .catch(function(data){
                        //console.log('data',data);
                        AlertService.error('admin.messages.errorUpdateUser');
                    })
            }
        }

        if ( angular.element('#form_createuser').length ) {
            $scope.email_msg = $translate.instant('admin.messages.invalidEmail')
            $scope.required_msg = $translate.instant('admin.messages.required')
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

        $("#user-input-form-file").change(function(e) {
            var file = $('#user-input-form-file')[0].files[0];
            if(file != undefined && file != null) {
                $timeout(function () {
                    UIkit.modal.confirm($translate.instant("inventory.messages.changeAvatar"), function () {
                        User.uploadAvatar($stateParams.userId, file).then(function (data) {
                            location.reload();
                        }).catch(function (data) {
                            ErrorHandle.handleError(data);
                        })
                    }, {
                        labels: {
                            'Ok': "OK",
                            'Cancel': $translate.instant($scope.button.cancel)
                        }
                    });

                });
            }

        });

        $scope.deleteUserAvatar = function () {
            UIkit.modal.confirm($translate.instant("inventory.messages.deleteAvatar"), function () {
                User.deleteAvatar($stateParams.userId).then(function (data) {
                    location.reload();
                }).catch(function (data) {
                    ErrorHandle.handleError(data);
                })
            }, {
                labels: {
                    'Ok': "OK",
                    'Cancel': $translate.instant($scope.button.cancel)
                }
            });

        }
    }

})();