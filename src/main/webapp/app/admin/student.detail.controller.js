(function(){
    'use strict';
    angular.module('erpApp')
        .controller('StudentDetailController',StudentDetailController);

    StudentDetailController.$inject = ['$rootScope','$scope','$state','$stateParams','Student','Role','AlertService','ErrorHandle','$translate','variables', 'TranslateCommonUI', '$timeout'];
    function StudentDetailController($rootScope,$scope, $state, $stateParams, Student, Role, AlertService, ErrorHandle, $translate, variables, TranslateCommonUI, $timeout) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.students";
        $scope.pageTitle2 = "admin.student.detail";

        $scope.detail = {
            Email: "admin.student.column.Email",
            FirstName: "admin.student.column.FirstName",
            LastName: "admin.student.column.LastName",
            Name: "admin.student.column.Name",
            Address: "admin.student.column.Address",
            Phone: "admin.student.column.Phone",
            Position: "admin.student.column.Position",
            Roles: "admin.student.column.Roles",
            Status: "admin.student.column.Status",
            Created: "admin.student.column.Created",
            Updated: "admin.student.column.Updated",
            CreatedBy: "admin.student.column.CreatedBy",
            UpdatedBy: "admin.student.column.UpdatedBy"
        }

        var statusStyle = {
            true: "uk-text-success uk-text-bold",
            false: "uk-text-danger uk-text-bold"
        }

        $scope.student = {};
        Student.getStudentById($stateParams.studentId).then(function (data) {
            $scope.student = data;
            $scope.student.createdDate = getDateString($scope.student.created);
            $scope.student.updatedDate = getDateString($scope.student.updated);

            $scope.selectize_roles_options = $scope.student.roles;

            // for(var j = 0; j < $scope.student.roles.length; j++) {
            //     $scope.forms_advanced.selectize_roles.push($scope.student.roles[j].id);
            // }

            /*Role.getAll().then(function (data) {
                $scope.allRoles = data;
                $scope.selectize_roles_options = $scope.allRoles;
            })*/
            $scope.allRoles = $scope.student.roles;
            $scope.selectize_roles_options = $scope.allRoles;

            $scope.status = "Inactive"
            $scope.active = $scope.student.active
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
            activateService:Student.activate,
            deactivateService:Student.deactivate
        }

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

        $("#student-input-form-file").change(function(e) {
            var file = $('#student-input-form-file')[0].files[0];
            if(file != undefined && file != null) {
                $timeout(function () {
                    UIkit.modal.confirm($translate.instant("inventory.messages.changeAvatar"), function () {
                        Student.uploadAvatar($stateParams.studentId, file).then(function (data) {
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

        $scope.deleteStudentAvatar = function () {
            UIkit.modal.confirm($translate.instant("inventory.messages.deleteAvatar"), function () {
                Student.deleteAvatar($stateParams.studentId).then(function (data) {
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