(function(){
    'use strict';
    angular.module('erpApp')
        .controller('NotificationController', NotificationController);

    NotificationController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        'AlertService',
        '$translate',
        'apiData',
        '$http',
        '$filter',
        'ErrorHandle',
        'LogsService',
        'Transfer',
        'Adjustment',
        'User',
        '$window'];
    function NotificationController($rootScope, $scope, $state, AlertService, $translate, apiData, $http, $filter, ErrorHandle, LogsService, Transfer, Adjustment, User, $window) {

        console.log("WELCOME TO NOTIFICATIONS!");

        $scope.hideNotificationTitle = $translate.instant('inventory.logs.hideNotification')
        $scope.markAsReadTitle = $translate.instant('inventory.logs.markAsRead')
        $scope.markAsUnReadTitle = $translate.instant('inventory.logs.markAsUnRead')
        $scope.seenTitle = $translate.instant('inventory.logs.seen')

        $scope.TIME_DISPLAY = {
            "hour": $translate.instant('inventory.logs.time.hour'),
            "minute": $translate.instant('inventory.logs.time.minute'),
            "at": $translate.instant('inventory.logs.time.at'),
            "ago": $translate.instant('inventory.logs.time.ago'),
            "yesterday": $translate.instant('inventory.logs.time.yesterday')
        }

        $scope.pageNum = 0;
        $scope.initPageSize = 20;
        $scope.pageSizePerLoad = 10;
        $scope.notificationData = [];
        $scope.notifications = [];
        $scope.userData = {};
        User.current().then(function (data) {
            if(data.id != undefined && data.id != null) {
                $scope.userData = data;
                $scope.getNotifications(data.id, 0, $scope.initPageSize);
            }
        })

        $scope.getNotifications = function (idUser, pageNum, pageSize) {
            if(pageNum == 0)
                $scope.notifications = [];
            $scope.showMoreNotify = true;
            LogsService.getByRecipientPaging(idUser, pageNum, pageSize).then(function (data) {
                //$scope.notifications = data.data;
                if(data.data.length == 0) {
                    $scope.noMoreItemRemain = true;
                } else {
                    for(var i = 0; i < data.data.length; i++) {
                        $scope.notifications.push(data.data[i]);
                    }
                    //sortArrayByIntegerField($scope.notifications, 'created', 'desc');
                    $scope.generateNotificationTimeString($scope.notifications);
                    $scope.convertNotifications();
                }
                $scope.showMoreNotify = false;

            }).catch(function (data) {
                ErrorHandle.handleError(data);
            })
        }

        $scope.convertNotifications = function() {
            $scope.notificationData = [];
            for(var i = 0; i < $scope.notifications.length; i++) {
                var date = genDate($scope.notifications[i]['created']);
                var checkExist = $scope.checkDateExist(date);
                var isToday = $scope.isToday($scope.notifications[i]['created']) ? 'Today': date;
                if(checkExist > -1) {
                    $scope.notificationData[checkExist]['data'].push($scope.notifications[i]);
                    $scope.notificationData[checkExist]['dateDisplay'] = isToday;
                } else {
                    var newData = {
                        'date': date,
                        'dateDisplay': isToday,
                        'data': []
                    }
                    newData['data'].push($scope.notifications[i]);
                    $scope.notificationData.push(newData)
                }
            }
        }

        $scope.markAsRead = function (id, notification) {
            //console.log("Mark As Read: "+ index)
            if(id != undefined && id != null) {
                LogsService.markAsRead(id).then(function (data) {
                    if($scope.userData.id != undefined && $scope.userData.id != null) {
                        notification.read = true;
                        //$scope.getNotifications($scope.userData.id, 0, $scope.pageSizePerLoad);
                        $scope.sendUpdateNotificationEvent();
                    }
                }).catch(function (data) {
                    ErrorHandle.handleError(data);
                })
            }
        }

        $scope.markAsUnRead = function (id, notification) {
            //console.log("Mark As Read: "+ index)
            if(id != undefined && id != null) {
                LogsService.markAsUnRead(id).then(function (data) {
                    if($scope.userData.id != undefined && $scope.userData.id != null) {
                        notification.read = false;
                        //$scope.getNotifications($scope.userData.id, 0, $scope.pageSizePerLoad);
                        $scope.sendUpdateNotificationEvent();
                    }
                }).catch(function (data) {
                    ErrorHandle.handleError(data);
                })
            }
        }

        $scope.hideNotification = function (id, notification) {
            //console.log("Hide Notification: "+ index)
            if(id != undefined && id != null) {
                notification.isHide = true;
                // LogsService.hideNotification(id).then(function (data) {
                //     if($scope.userData.id != undefined && $scope.userData.id != null) {
                //         //$scope.getNotifications($scope.userData.id, 0, $scope.pageSizePerLoad);
                //         $scope.sendUpdateNotificationEvent();
                //     }
                // }).catch(function (data) {
                //     ErrorHandle.handleError(data);
                // })
            }
        }

        $scope.goToNotification = function (notify_data) {
            if(notify_data != undefined && notify_data != null) {
                var objectUrl = notify_data.objectUrl;
                if(objectUrl != undefined && objectUrl != null) {
                    // check if object is deleted
                    if(notify_data.objectType === "Transfer") {
                        Transfer.getOne(notify_data.objectId).then(function (data) {
                            window.location.href = objectUrl;
                        }).catch(function (data) {
                            UIkit.modal.alert($translate.instant("error.transfer.transfer_is_delete"), {
                                labels: {
                                    'Ok': "OK"
                                }
                            });
                        })
                    } else if(notify_data.objectType === "Inventory") {
                        Adjustment.checkOne(notify_data.objectId).then(function (data) {
                            if(data.length == 0) {
                                UIkit.modal.alert($translate.instant("error.adjustment.adjustment_is_delete"), {
                                    labels: {
                                        'Ok': "OK"
                                    }
                                });
                            } else {
                                window.location.href = objectUrl;
                            }
                        }).catch(function (data) {
                            UIkit.modal.alert($translate.instant("error.adjustment.adjustment_is_delete"), {
                                labels: {
                                    'Ok': "OK"
                                }
                            });
                        })
                    } else {
                        window.location.href = objectUrl;
                    }
                }
                $scope.markAsRead(notify_data.id, notify_data);
            }
        }

        $scope.showMoreNotify = false;
        $scope.showMoreNotifications = function () {
            $scope.pageNum++;
            $scope.showMoreNotify = true;
            if($scope.userData.id != undefined && $scope.userData.id != null) {
                setTimeout(function () {
                    $scope.getNotifications($scope.userData.id, $scope.pageNum, $scope.pageSizePerLoad);
                }, 700)
            }
        }

        $scope.viewByGroup = true;
        $scope.handleGroupByDate = function(isCheck) {
            $scope.viewByGroup = isCheck;
            $scope.viewAllFlag = !isCheck;
        }

        $scope.handleViewAll = function(isCheck) {
            $scope.viewByGroup = !isCheck;
            $scope.groupByDateFlag = !isCheck;
        }

        $scope.checkDateExist = function (date) {
            for(var i = 0; i < $scope.notificationData.length; i++) {
                if($scope.notificationData[i]['date'] === date)
                    return i;
            }

            return -1;
        }

        $scope.generateNotificationTimeString = function (data) {
            if(data != undefined && data != null) {
                for(var i = 0; i < data.length; i++) {
                    var date = new Date(data[i]['created']);
                    var presentTime = new Date();

                    var diffDate = $scope.findDifferentDate(date, presentTime);
                    if(diffDate == 0) {
                        // Today
                        var oneHour = 60 * 60 * 1000;
                        var diffTime = Math.abs(presentTime.getTime() - date.getTime());
                        if(diffTime < oneHour) {
                            var minDiff = Math.floor(diffTime / 60 / 1000);
                            data[i]['timeString'] = minDiff + " " + $scope.TIME_DISPLAY['minute'] + " " + $scope.TIME_DISPLAY['ago'];
                        } else {
                            var hourDiff = Math.floor(diffTime / 60 / 60 / 1000);
                            var minDiff = Math.floor((diffTime - hourDiff * 60 * 60 * 1000) / 60 / 1000);
                            data[i]['timeString'] = hourDiff + " " + $scope.TIME_DISPLAY['hour'] + " " +
                                minDiff + " " + $scope.TIME_DISPLAY['minute'] + " " + $scope.TIME_DISPLAY['ago'];
                        }
                    } else if(diffDate == -1) {
                        // Yesterday
                        data[i]['timeString'] = $scope.TIME_DISPLAY['yesterday'] + " " + $scope.TIME_DISPLAY['at'] + " " + genTime(date.getTime());
                    } else {
                        // Display full date
                        data[i]['timeString'] = genDate(date.getTime()) + " " + $scope.TIME_DISPLAY['at'] + " " + genTime(date.getTime());
                    }
                }
            }
        }

        function sortArrayByIntegerField(arrays, field, sort) {
            // field is an integer
            arrays.sort(function (a, b) {
                if(sort === 'asc')
                    return a[field] - b[field]
                else
                    return b[field] - a[field]
            })
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

        $scope.isToday = function (timeStamp) {
            var date = new Date(timeStamp);
            var presentTime = new Date();
            var diffDate = $scope.findDifferentDate(date, presentTime);
            if(diffDate == 0)
                return true;
            else
                return false;
        }

        $window.onbeforeunload = function() {
            if($state.current.name == 'notifications') {
                var need_hide = [];
                for(var i = 0; i < $scope.notifications.length; i++) {
                    if($scope.notifications[i].isHide)
                        need_hide.push($scope.notifications[i].id);
                }
                if(need_hide.length > 0) {
                    $scope.$emit('heyRoot', {
                        type: "hideNotifications",
                        message: "Hello Root!!!",
                        from: "notificationController",
                        data: need_hide
                    });
                }
            }
        }

        $scope.$on('$destroy', function() {
            $window.onbeforeunload = undefined;
        });

        $scope.$on('$stateChangeStart', function( event, toState, toParams, fromState, fromParams) {
            if(fromState.name == 'notifications') {
                var need_hide = [];
                for(var i = 0; i < $scope.notifications.length; i++) {
                    if($scope.notifications[i].isHide)
                        need_hide.push($scope.notifications[i].id);
                }
                if(need_hide.length > 0) {
                    $scope.$emit('heyRoot', {
                        type: "hideNotifications",
                        message: "Hello Root!!!",
                        from: "notificationController",
                        data: need_hide
                    });
                }
            }
        });

        // Send event to root controller
        $scope.sendUpdateNotificationEvent = function () {
            $scope.$emit('heyRoot', {
                type: "updateNotifications",
                message: "Hello Root!!!",
                from: "notificationController"
            });
        }

        // Listen for events from root controller
        /*$scope.$on('updateNotifications', function (event, args) {
            if(args.from !== 'notificationController') {
                if($scope.userData.id != undefined && $scope.userData.id != null) {
                    $scope.getNotifications($scope.userData.id, 0, $scope.pageSizePerLoad);
                }
            }
        });*/
    }

})();