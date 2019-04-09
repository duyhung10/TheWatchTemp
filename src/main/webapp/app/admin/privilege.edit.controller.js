(function(){
    'use strict';
    angular.module('erpApp')
        .controller('PrivilegeEditController',PrivilegeEditController);

    PrivilegeEditController.$inject = ['$rootScope','$scope','$state','$stateParams','Privilege','AlertService','$translate','variables', 'TranslateCommonUI'];
    function PrivilegeEditController($rootScope,$scope, $state, $stateParams, Privilege, AlertService,$translate, variables, TranslateCommonUI) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.privileges";
        $scope.pageTitle2 = "admin.privilege.edit";

        $scope.detail = {
            Name: "admin.role.column.Name",
            Description: "admin.role.column.Description",
            Created: "admin.role.column.Created",
            Updated: "admin.role.column.Updated",
            CreatedBy: "admin.role.column.CreatedBy",
            UpdatedBy: "admin.role.column.UpdatedBy"
        }

        $scope.privilege = {};
        Privilege.getOne($stateParams.privilegeName).then(function (data) {
            $scope.privilege = data;

            $scope.privilege.createdDate = getDateString($scope.privilege.created);
            $scope.privilege.updatedDate = getDateString($scope.privilege.updated);
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

        $scope.deletePrivilege = function () {
            UIkit.modal.confirm($translate.instant($scope.actionConfirm.delete), function () {
                AlertService.error('admin.messages.errorDeletePrivilege');
                //$("#ts_pager_filter").trigger('update');
                /*Privilege.deleteOne($scope.privilege.id).then(function(){
                    $state.go('privileges');
                }).catch(function(){
                    AlertService.error('admin.messages.errorDeletePrivilege');
                })*/
            }, {
                labels: {
                    'Ok': $translate.instant($scope.button.delete),
                    'Cancel': $translate.instant($scope.button.cancel)
                }
            });
        }

        $scope.submit = function() {
            $('#form_createprivilege').parsley();
            if($scope.form_createprivilege.$valid){
                Privilege.update($scope.privilege)
                    .then(function(){
                        $state.go('privileges-detail',{privilegeName: $scope.privilege.id });
                    })
                    .catch(function(){
                        AlertService.error('admin.messages.errorEditPrivilege');
                    })
            }
        }

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