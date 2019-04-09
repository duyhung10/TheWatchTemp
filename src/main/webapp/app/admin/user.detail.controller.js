(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserDetailController',UserDetailController);

    UserDetailController.$inject = ['$rootScope','$scope','$state','$stateParams','User','Role','AlertService','ErrorHandle','$translate','variables', 'TranslateCommonUI', '$timeout'];
    function UserDetailController($rootScope,$scope, $state, $stateParams, User, Role, AlertService, ErrorHandle, $translate, variables, TranslateCommonUI, $timeout) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.users";
        $scope.pageTitle2 = "admin.user.detail";

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

        var statusStyle = {
            true: "uk-text-success uk-text-bold",
            false: "uk-text-danger uk-text-bold"
        }

        $scope.user = {};
        User.getUserById($stateParams.userId).then(function (data) {
            $scope.user = data;
            $scope.user.createdDate = getDateString($scope.user.created);
            $scope.user.updatedDate = getDateString($scope.user.updated);

            $scope.selectize_roles_options = $scope.user.roles;

            for(var j = 0; j < $scope.user.roles.length; j++) {
                $scope.forms_advanced.selectize_roles.push($scope.user.roles[j].id);
            }

            /*Role.getAll().then(function (data) {
                $scope.allRoles = data;
                $scope.selectize_roles_options = $scope.allRoles;
            })*/
            $scope.allRoles = $scope.user.roles;
            $scope.selectize_roles_options = $scope.allRoles;

            $scope.status = "Inactive"
            $scope.active = $scope.user.active
            if ($scope.active) {
                $scope.status = "Active"
            }
            $scope.activeClass = statusStyle[$scope.active]
        })

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

        $scope.CbxActivate = {
            activateService:User.activate,
            deactivateService:User.deactivate
        }

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