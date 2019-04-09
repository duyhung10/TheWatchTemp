(function() {
    'use strict';

    var jhiAlert = {
        template: '<div ng-repeat="alert in $ctrl.alerts">' +
            '<div class="uk-notify uk-notify-top-center hierarchical_show" style="display: block;z-index: 60000" hierarchical-show>'+
            '<div class="{{alert.msgClass}}" style="opacity: 1; margin-top: 0px; margin-bottom: 10px;">\n' +
            '<a class="uk-close"></a>\n' +
            '<div style="word-wrap:break-word;">{{alert.msg}}</div>\n' +
            '</div></div>' +
        '          </div>',

        controller: jhiAlertController
    };

    angular
        .module('erpApp')
        .component('jhiAlert', jhiAlert);

    jhiAlertController.$inject = ['$scope', 'AlertService','$rootScope'];

    function jhiAlertController($scope, AlertService,$rootScope) {
        var vm = this;
        vm.alerts = AlertService.get();
        $scope.$on('$destroy', function () {
            vm.alerts = [];
        });
    }
})();


