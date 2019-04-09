(function(){
    'use strict';
    angular.module('erpApp')
        .controller('RootController', RootController);

    RootController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        '$filter',
        '$timeout',
        'User',
        'ErrorHandle',
        '$translate',
        '$window'];
    function RootController($rootScope, $scope, $state, $filter, $timeout, User, ErrorHandle, $translate, $window) {

        // console.log("ROOT!");

        $scope.MESSAGE_TYPE = ['userLogin', 'userLogout', 'normal', 'updateNotifications', 'hideNotifications'];

        $scope.TIME_DISPLAY = {
            "hour": $translate.instant('inventory.logs.time.hour'),
            "minute": $translate.instant('inventory.logs.time.minute'),
            "at": $translate.instant('inventory.logs.time.at'),
            "ago": $translate.instant('inventory.logs.time.ago'),
            "yesterday": $translate.instant('inventory.logs.time.yesterday')
        }

        $scope.user = null;
        $scope.userLogin = false;
        $scope.firstLogin = false;
        $scope.timeDelayToCallUpdate = 1000;
        $scope.timeDelayToShowPopup = 100;

        // Check if data is changing, notify other users
        var TimeoutF;
        $scope.lastNotReadNumberNotifications = 0;
        $scope.lastHideNumberNotifications = 0;
        $scope.lastShowNotificationTime = 0;

        User.current().then(function (data) {
            $scope.user = data;
            $scope.userLogin = true;
            //$scope.firstLogin = true;
            $scope.callInterval();
        }).catch(function (data) {

        })

        // Listen for events pass from child components


        // Growl Notifications
        $scope.avatarImg = 'assets/img/avatars/avatar.jpg';
        $scope.listNotifications = {};
        var index = 0;

        $scope.addNewNotification = function (notification) {
            for(var key in $scope.listNotifications) {
                if($scope.listNotifications[key].id == notification.id) {
                    return;
                }
            }

            var i = index++;
            setTimeout(function () {
                for(var key in $scope.listNotifications) {
                    if($scope.listNotifications[key].id == notification.id) {
                        return;
                    }
                }
                $scope.listNotifications[i] = notification;
                if(!notification.created)
                    $scope.listNotifications[i].showTime = 3000;
                else
                    $scope.listNotifications[i].showTime = 10000;
                $scope.generateNotificationTimeString($scope.listNotifications[i]);
                $scope.markAsShowPopup(i);
            }, $scope.timeDelayToShowPopup * i)
        }

        function isEmpty(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

        $scope.removeNotification = function (id) {
            delete $scope.listNotifications[id];
            if(isEmpty($scope.listNotifications)) {
                index = 0;
            }
        }

        $scope.generateNotificationTimeString = function (data) {
            if(data != undefined && data != null) {
                var date = new Date(data['created']);
                var presentTime = new Date();

                var diffDate = $scope.findDifferentDate(date, presentTime);
                if(diffDate == 0) {
                    // Today
                    var oneHour = 60 * 60 * 1000;
                    var diffTime = Math.abs(presentTime.getTime() - date.getTime());
                    if(diffTime < oneHour) {
                        var minDiff = Math.floor(diffTime / 60 / 1000);
                        data['timeString'] = minDiff + " " + $scope.TIME_DISPLAY['minute'] + " " + $scope.TIME_DISPLAY['ago'];
                    } else {
                        var hourDiff = Math.floor(diffTime / 60 / 60 / 1000);
                        var minDiff = Math.floor((diffTime - hourDiff * 60 * 60 * 1000) / 60 / 1000);
                        data['timeString'] = hourDiff + " " + $scope.TIME_DISPLAY['hour'] + " " +
                            minDiff + " " + $scope.TIME_DISPLAY['minute'] + " " + $scope.TIME_DISPLAY['ago'];
                    }
                } else if(diffDate == -1) {
                    // Yesterday
                    data['timeString'] = $scope.TIME_DISPLAY['yesterday'] + " " + $scope.TIME_DISPLAY['at'] + " " + genTime(date.getTime());
                } else {
                    // Display full date
                    data['timeString'] = genDate(date.getTime()) + " " + $scope.TIME_DISPLAY['at'] + " " + genTime(date.getTime());
                }
            }
        }

        function genDate(time) {
            return $filter('date')(time, 'dd/MM/yyyy');
        }

        function genTime(time) {
            return $filter('date')(time, 'hh:mm:ss');
        }

        $scope.findDifferentDate = function (firstDate, secondDate) {
            var oneDay = 24 * 60 * 60 * 1000;
            var diffTime = firstDate.getTime() - secondDate.getTime();
            return diffTime >= 0 ? Math.round(Math.abs( diffTime / oneDay )) : -Math.round(Math.abs( diffTime / oneDay ));
        }
    }

})();