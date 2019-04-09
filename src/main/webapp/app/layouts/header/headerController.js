angular
    .module('erpApp')
    .controller('main_headerCtrl', [
        '$timeout',
        '$scope',
        '$window',
        '$state',
        'Auth',
        'User',
        'ErrorHandle',
        '$filter',
        '$translate',
        '$rootScope',
        function ($timeout,$scope,$window,$state,Auth,User,ErrorHandle,$filter,$translate,$rootScope) {
            $scope.moduleTitle = {
                "admin": "Administration",
                "inventory":"Inventory"
            }
            $scope.module = $scope.moduleTitle[$rootScope.toState.data.sideBarMenu]
            $rootScope.$on('$stateChangeSuccess', function () {
                $scope.module = $scope.moduleTitle[$rootScope.toState.data.sideBarMenu]
            });
            $scope.user_data = {
                name: "Lue Feest",
                avatar: "assets/img/avatars/avatar_11_tn.png",
                alerts: [
                    {
                        "title": "Hic expedita eaque.",
                        "content": "Nemo nemo voluptatem officia voluptatum minus.",
                        "type": "warning"
                    },
                    {
                        "title": "Voluptatibus sed eveniet.",
                        "content": "Tempora magnam aut ea.",
                        "type": "success"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Quod minima ipsa.",
                        "content": "Vel dignissimos neque enim ad praesentium optio.",
                        "type": "primary"
                    }
                ],
                messages: [
                    {
                        "title": "Reiciendis aut rerum.",
                        "content": "In adipisci amet nostrum natus recusandae animi fugit consequatur.",
                        "sender": "Korbin Doyle",
                        "color": "cyan"
                    },
                    {
                        "title": "Tenetur commodi animi.",
                        "content": "Voluptate aut quis rerum laborum expedita qui eaque doloremque a corporis.",
                        "sender": "Alia Walter",
                        "color": "indigo",
                        "avatar": "assets/img/avatars/avatar_07_tn.png"
                    },
                    {
                        "title": "At quia quis.",
                        "content": "Fugiat rerum aperiam et deleniti fugiat corporis incidunt aut enim et distinctio.",
                        "sender": "William Block",
                        "color": "light-green"
                    },
                    {
                        "title": "Incidunt sunt.",
                        "content": "Accusamus necessitatibus officia porro nisi consectetur dolorem.",
                        "sender": "Delilah Littel",
                        "color": "blue",
                        "avatar": "assets/img/avatars/avatar_02_tn.png"
                    },
                    {
                        "title": "Porro ut.",
                        "content": "Est vitae magni eum expedita odit quisquam natus vel maiores.",
                        "sender": "Amira Hagenes",
                        "color": "amber",
                        "avatar": "assets/img/avatars/avatar_09_tn.png"
                    }
                ]
            };

            $scope.alerts_length = $scope.user_data.alerts.length;
            $scope.messages_length = $scope.user_data.messages.length;


            $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function(){
                $timeout(function() {
                    $($window).resize();
                },280)
            });

            // autocomplete
            $('.header_main_search_form').on('click','#autocomplete_results .item', function(e) {
                e.preventDefault();
                var $this = $(this);
                $state.go($this.attr('href'));
                $('.header_main_search_input').val('');
            })

            $scope.logout = function() {
                Auth.logout();
                $scope.$emit('heyRoot', {
                    type: "userLogout",
                    message: "User Logout!!!",
                    from: "headerController"
                });
                $state.go('login');
            }

            /*============================================= NOTIFICATIONS ============================================*/
            $scope.hideNotificationTitle = $translate.instant('inventory.logs.hideNotification')
            $scope.markAsReadTitle = $translate.instant('inventory.logs.markAsRead')
            $scope.markAsUnReadTitle = $translate.instant('inventory.logs.markAsUnRead')
            $scope.notificationTitle = $translate.instant('inventory.logs.notification')
            $scope.seenTitle = $translate.instant('inventory.logs.seen')

            $scope.TIME_DISPLAY = {
                "hour": $translate.instant('inventory.logs.time.hour'),
                "minute": $translate.instant('inventory.logs.time.minute'),
                "at": $translate.instant('inventory.logs.time.at'),
                "ago": $translate.instant('inventory.logs.time.ago'),
                "yesterday": $translate.instant('inventory.logs.time.yesterday')
            }

            $scope.logDatas = {}
            //$scope.logDatas = LogsService.getAllNotification();

            $scope.notifications = [];
            $scope.avatarImg = 'assets/img/avatars/avatar.jpg';


            $scope.mouseHoverNotification = function(index, status) {
                $scope.notifications[index]['mouse_hover'] = status;
            }






            $scope.showAllNotification = function () {
                //console.log("Show All Notification!")
                $state.go('notifications');
            }

            $scope.pageNum = 0;
            $scope.pageSizePerLoad = 10;
            $scope.showMoreNotify = false;
            $scope.showMoreNotifications = function () {
                $scope.pageNum++;
                $scope.showMoreNotify = true;
                if($scope.userData.id != undefined && $scope.userData.id != null) {
                    setTimeout(function () {
                        $scope.getPagingNotifications($scope.userData.id, $scope.pageNum, $scope.pageSizePerLoad);
                    }, 700)
                }
            }


            $('#notificationDropdownContainer').on('show.uk.dropdown', function(){
                //console.log("open")
            });

            $('#notificationDropdownContainer').on('hide.uk.dropdown', function(){
                //console.log("close")
                var need_hide = [];
                for(var i = 0; i < $scope.notifications.length; i++) {
                    if($scope.notifications[i].isHide)
                        need_hide.push($scope.notifications[i].id);
                }
                if(need_hide.length > 0) {
                    $scope.$emit('heyRoot', {
                        type: "hideNotifications",
                        message: "Hello Root!!!",
                        from: "headerController",
                        data: need_hide
                    });
                }
            });

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

            $scope.goToNotification = function (index) {
                if(index >= 0 && index < $scope.notifications.length) {
                    var objectUrl = $scope.notifications[index].objectUrl;
                    if(objectUrl != undefined && objectUrl != null) {
                        UIkit.dropdown($('#notificationDropdownContainer')).hide()
                        window.location.href = objectUrl;
                        window.location.reload();
                    }
                    $scope.markAsRead(index);
                }
            }


            // Send event to root controller
            $scope.sendUpdateNotificationEvent = function () {
                $scope.$emit('heyRoot', {
                    type: "updateNotifications",
                    message: "Hello Root!!!",
                    from: "headerController"
                });
            }

            /*=========================================== END NOTIFICATIONS ==========================================*/
        }
    ])
;