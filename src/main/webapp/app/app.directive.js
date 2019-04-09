/*
*  erp Admin AngularJS
*  directives
*/
;'use strict';

erpApp
// page title
    .directive('pageTitle', [
        '$rootScope',
        '$timeout',
        function($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function() {
                    var listener = function(event, toState) {
                        var default_title = 'ERP';
                        $timeout(function() {
                            $rootScope.page_title = (toState.data && toState.data.pageTitle)
                                ? default_title + ' - ' + toState.data.pageTitle : default_title;
                        });
                    };
                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            }
        }
    ])
    // add width/height properities to Image
    .directive('addImageProp', [
        '$timeout',
        'utils',
        function ($timeout,utils) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.on('load', function () {
                        $timeout(function() {
                            var w = !utils.isHighDensity() ? $(elem).actual('width') : $(elem).actual('width')/2,
                                h = !utils.isHighDensity() ? $(elem).actual('height') : $(elem).actual('height')/2;
                            $(elem).attr('width',w).attr('height',h);
                        })
                    });
                }
            };
        }
    ])
    // print page
    .directive('printPage', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var message = attrs['printMessage'];
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        UIkit.modal.confirm(message ? message : 'Do you want to print this page?', function () {
                            // hide sidebar
                            $rootScope.primarySidebarActive = false;
                            $rootScope.primarySidebarOpen = false;
                            // wait for dialog to fully hide
                            $timeout(function () {
                                window.print();
                            }, 300)
                        }, {
                            labels: {
                                'Ok': 'print'
                            }
                        });
                    });
                }
            };
        }
    ])
    // full screen
    .directive('fullScreenToggle', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        screenfull.toggle();
                        $(window).resize();
                    });
                }
            };
        }
    ])
    // single card
    .directive('singleCard', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    var $md_card_single = $(elem),
                        w = angular.element($window);

                    function md_card_content_height() {
                        var content_height = w.height() - ((48 * 2) + 12);
                        $md_card_single.find('.md-card-content').innerHeight(content_height);
                    }

                    $timeout(function() {
                        md_card_content_height();
                    },100);

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_card_content_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // outside list
    .directive('listOutside', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $md_list_outside_wrapper = $(elem),
                        w = angular.element($window);

                    function md_list_outside_height() {
                        var content_height = w.height() - ((48 * 2) + 10);
                        $md_list_outside_wrapper.height(content_height);
                    }

                    md_list_outside_height();

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_list_outside_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // callback on last element in ng-repeat
    .directive('onLastRepeat', function ($timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('onLastRepeat', element, attrs);
                })
            }
        };
    })
    // check table row
    .directive('tableCheckAll', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $checkRow = $(elem).closest('table').find('.check_row');

                    $(elem)
                        .on('ifChecked',function() {
                            $checkRow.iCheck('check');
                        })
                        .on('ifUnchecked',function() {
                            $checkRow.iCheck('uncheck');
                        });

                }
            }
        }
    ])
    // table row check
    .directive('tableCheckRow', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function(newValue) {
                        if(newValue) {
                            $this.closest('tr').addClass('row_checked');
                        } else {
                            $this.closest('tr').removeClass('row_checked');
                        }
                    });

                }
            }
        }
    ])
    // content sidebar
    .directive('contentSidebar', [
        '$rootScope',
        '$document',
        function ($rootScope,$document) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    if(!$rootScope.header_double_height) {
                        $rootScope.$watch('hide_content_sidebar', function() {
                            if($rootScope.hide_content_sidebar) {
                                $('#page_content').css('max-height', $('html').height() - 40);
                                $('html').css({
                                    'paddingRight': scrollbarWidth(),
                                    'overflow': 'hidden'
                                });
                            } else {
                                $('#page_content').css('max-height','');
                                $('html').css({
                                    'paddingRight': '',
                                    'overflow': ''
                                });
                            }
                        });

                    }
                }
            }
        }
    ])
    // attach events to document
    .directive('documentEvents', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    var hidePrimarySidebar = function() {
                        $rootScope.primarySidebarActive = false;
                        $rootScope.primarySidebarOpen = false;
                        $rootScope.hide_content_sidebar = false;
                        $rootScope.primarySidebarHiding = true;
                        $timeout(function() {
                            $rootScope.primarySidebarHiding = false;
                        },280);
                    };

                    var hideSecondarySidebar = function() {
                        $rootScope.secondarySidebarActive = false;
                    };

                    var hideMainSearch = function() {
                        var $header_main = $('#header_main');
                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });
                    };

                    // hide components on $document click
                    scope.onClick = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$($event.target).closest('#sidebar_main').length && !$($event.target).closest('#sSwitch_primary').length && !$rootScope.largeScreen) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( ($rootScope.secondarySidebarActive && !$($event.target).closest('#sidebar_secondary').length && !$($event.target).closest('#sSwitch_secondary').length) && !$rootScope.secondarySidebarPersistent) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && !$($event.target).closest('.header_main_search_form').length && !$($event.target).closest('#main_search_btn').length) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && !$($event.target).closest('#style_switcher').length) {
                            $rootScope.styleSwitcherActive = false;
                        }
                        // sticky notes form
                        if( $rootScope.noteFormActive && !$($event.target).closest('#note_form').length) {
                            $rootScope.noteFormActive = false;
                        }
                    };

                    // hide components on key press (esc)
                    scope.onKeyUp = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$rootScope.largeScreen && $event.keyCode == 27) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( !$rootScope.secondarySidebarPersistent && $rootScope.secondarySidebarActive && $event.keyCode == 27) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && $event.keyCode == 27) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && $event.keyCode == 27) {
                            $rootScope.styleSwitcherActive = false;
                        }
                        // sticky notes form
                        if( $rootScope.noteFormActive && $event.keyCode == 27) {
                            $rootScope.noteFormActive = false;
                        }
                    };

                }
            };
        }
    ])
    // main search show
    .directive('mainSearchShow', [
        '$rootScope',
        '$window',
        'variables',
        '$timeout',
        function ($rootScope, $window, variables, $timeout) {
            return {
                restrict: 'E',
                template: '<a id="main_search_btn" class="user_action_icon" ng-click="showSearch()"><i class="material-icons md-24 md-light">&#xE8B6;</i></a>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.showSearch = function() {

                        $('#header_main')
                            .children('.header_main_content')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $rootScope.mainSearchActive = true;
                                },
                                complete: function() {
                                    $('#header_main')
                                        .children('.header_main_search_form')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').focus();
                                            }
                                        })
                                }
                            });
                    };
                }
            };
        }
    ])
    // main search hide
    .directive('mainSearchHide', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                template: '<i class="md-icon header_main_search_close material-icons" ng-click="hideSearch()">&#xE5CD;</i>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.hideSearch = function () {

                        var $header_main = $('#header_main');

                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });

                    };
                }
            };
        }
    ])

    // primary sidebar
    .directive('sidebarPrimary', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                scope: 'true',
                link: function(scope,el,attr) {

                    var $sidebar_main = $('#sidebar_main');

                    scope.submenuToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $($event.currentTarget),
                            slideToogle = $this.next('ul').is(':visible') ? 'slideUp' : 'slideDown';

                        $this.next('ul')
                            .velocity(slideToogle, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    if(slideToogle == 'slideUp') {
                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                    } else {
                                        if($rootScope.menuAccordionMode) {
                                            $this.closest('li').siblings('.submenu_trigger').each(function() {
                                                $(this).children('ul').velocity('slideUp', {
                                                    duration: 500,
                                                    easing: variables.easing_swiftOut,
                                                    begin: function() {
                                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                                    }
                                                })
                                            })
                                        }
                                        $(this).closest('.submenu_trigger').addClass('act_section')
                                    }
                                },
                                complete: function() {
                                    if(slideToogle !== 'slideUp') {
                                        var scrollContainer = $sidebar_main.find(".scroll-content").length ? $sidebar_main.find(".scroll-content") :  $sidebar_main.find(".scrollbar-inner");
                                        $this.closest('.act_section').velocity("scroll", {
                                            duration: 500,
                                            easing: variables.easing_swiftOut,
                                            container: scrollContainer
                                        });
                                    }
                                }
                            });
                    };

                    $rootScope.$watch('slimSidebarActive', function ( status ) {
                        if(status) {
                            var $body = $('body');
                            $sidebar_main
                                .mouseenter(function() {
                                    $body.removeClass('sidebar_slim_inactive');
                                    $body.addClass('sidebar_slim_active');
                                })
                                .mouseleave(function() {
                                    $body.addClass('sidebar_slim_inactive');
                                    $body.removeClass('sidebar_slim_active');
                                })
                        }
                    });

                }
            };
        }
    ])
    // toggle primary sidebar
    .directive('sidebarPrimaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<a id="sSwitch_primary" href="#" class="sSwitch sSwitch_left" ng-click="togglePrimarySidebar($event)" ng-hide="miniSidebarActive || slimSidebarActive || topMenuActive"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.togglePrimarySidebar = function ($event) {

                        $event.preventDefault();

                        if($rootScope.primarySidebarActive) {
                            $rootScope.primarySidebarHiding = true;
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $rootScope.primarySidebarHiding = false;
                                    $(window).resize();
                                },290);
                            }
                        } else {
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $(window).resize();
                                },290);
                            }
                        }

                        $rootScope.primarySidebarActive = !$rootScope.primarySidebarActive;

                        if( !$rootScope.largeScreen ) {
                            $rootScope.hide_content_sidebar = $rootScope.primarySidebarActive ? true : false;
                        }

                        if($rootScope.primarySidebarOpen) {
                            $rootScope.primarySidebarOpen = false;
                            $rootScope.primarySidebarActive = false;
                        }
                    };

                }
            };
        }
    ])
    // secondary sidebar
    .directive('sidebarSecondary', [
        '$rootScope',
        '$timeout',
        'variables',
        function ($rootScope,$timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attrs) {
                    $rootScope.sidebar_secondary = true;
                    if(attrs.toggleHidden == 'large') {
                        $rootScope.secondarySidebarHiddenLarge = true;
                    }

                    // chat
                    var $sidebar_secondary = $(el);
                    if($sidebar_secondary.find('.md-list.chat_users').length) {

                        $('.md-list.chat_users').on('click', 'li', function() {
                            $('.md-list.chat_users').velocity("transition.slideRightBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $sidebar_secondary
                                        .find('.chat_box_wrapper')
                                        .addClass('chat_box_active')
                                        .velocity("transition.slideRightBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            begin: function() {
                                                $sidebar_secondary.addClass('chat_sidebar')
                                            }
                                        })
                                }
                            });
                        });

                        $sidebar_secondary
                            .find('.chat_sidebar_close')
                            .on('click',function() {
                                $sidebar_secondary
                                    .find('.chat_box_wrapper')
                                    .removeClass('chat_box_active')
                                    .velocity("transition.slideRightBigOut", {
                                        duration: 280,
                                        easing: variables.easing_swiftOut,
                                        complete: function () {
                                            $sidebar_secondary.removeClass('chat_sidebar');
                                            $('.md-list.chat_users').velocity("transition.slideRightBigIn", {
                                                duration: 280,
                                                easing: variables.easing_swiftOut
                                            })
                                        }
                                    })
                            });

                        if($sidebar_secondary.find('.uk-tab').length) {
                            $sidebar_secondary.find('.uk-tab').on('change.uk.tab',function(event, active_item, previous_item) {
                                if($(active_item).hasClass('chat_sidebar_tab') && $sidebar_secondary.find('.chat_box_wrapper').hasClass('chat_box_active')) {
                                    $sidebar_secondary.addClass('chat_sidebar')
                                } else {
                                    $sidebar_secondary.removeClass('chat_sidebar')
                                }
                            })
                        }
                    }

                }
            };
        }
    ])
    // toggle secondary sidebar
    .directive('sidebarSecondaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                template: '<a href="#" id="sSwitch_secondary" class="sSwitch sSwitch_right" ng-show="sidebar_secondary" ng-click="toggleSecondarySidebar($event)"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.toggleSecondarySidebar = function ($event) {
                        $event.preventDefault();
                        $rootScope.secondarySidebarActive = !$rootScope.secondarySidebarActive;
                    };
                }
            };
        }
    ])
    // activate card fullscreen
    .directive('cardFullscreenActivate', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-fullscreen-activate" ng-click="cardFullscreenActivate($event)">&#xE5D0;</i>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenActivate = function ($event) {
                        $event.preventDefault();

                        var $thisCard = $(el).closest('.md-card'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdCard_offset = $thisCard.offset();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add overflow hidden to #page_content (fix for ios)
                        //$body.addClass('md-card-fullscreen-active');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h,
                                'left': mdCard_offset.left,
                                'top': mdCard_offset.top - body_scroll_top
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    //$thisCard.find('.md-card-toolbar').prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                                    //erp_page_content.hide_content_sidebar();
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // activate onResize callback for some js plugins
                                    //$(window).resize();
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    }
                }
            }
        }
    ])
    // deactivate card fullscreen
    .directive('cardFullscreenDeactivate', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                replace: true,
                template: '<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left" ng-show="card_fullscreen" ng-click="cardFullscreenDeactivate($event)">&#xE5C4;</span>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenDeactivate = function ($event) {
                        $event.preventDefault();

                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top - body_scroll_top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                        // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    }
                }
            }
        }
    ])
    // fullscren on card click
    .directive('cardFullscreenWhole', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'A',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    $(el).on('click',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSActivate();
                        }
                    });

                    $(el).on('click','.cardFSDeactivate',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSDeactivate();
                        }
                    });

                    scope.cardFSActivate = function () {
                        var $thisCard = $(el),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdCard_offset = $thisCard.offset();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    $thisCard.append('<span class="md-icon material-icons uk-position-top-right cardFSDeactivate" style="margin:10px 10px 0 0">&#xE5CD;</span>')
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            }, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    };
                    scope.cardFSDeactivate = function () {
                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                        // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                    $thisCard.find('.cardFSDeactivate').remove();
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    };
                }
            }
        }
    ])
    // card close
    .directive('cardClose', [
        'utils',
        function (utils) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-close" ng-click="cardClose($event)">&#xE14C;</i>',
                link: function (scope, el, attrs) {
                    scope.cardClose = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card'),
                            removeCard = function() {
                                $(thisCard).remove();
                                $(window).resize();
                            };

                        utils.card_show_hide(thisCard,undefined,removeCard);

                    }
                }
            }
        }
    ])
    // card toggle
    .directive('cardToggle', [
        'variables',
        function (variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-toggle" ng-click="cardToggle($event)">&#xE316;</i>',
                link: function (scope, el, attrs) {

                    scope.cardToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card');

                        $(thisCard).toggleClass('md-card-collapsed').children('.md-card-content').slideToggle('280', variables.bez_easing_swiftOut);

                        $this.velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                $(thisCard).hasClass('md-card-collapsed') ? $this.html('&#xE313;') : $this.html('&#xE316;');
                                $this.velocity('reverse');
                                $(window).resize();
                            }
                        });
                    };

                    // hide card content on page load
                    var thisCard = $(el).closest('.md-card');
                    if(thisCard.hasClass('md-card-collapsed')) {
                        var $this_toggle = thisCard.find('.md-card-toggle');

                        $this_toggle.html('&#xE313;');
                        thisCard.children('.md-card-content').hide();
                    }

                }
            }
        }
    ])
    // card overlay toggle
    .directive('cardOverlayToggle', [
        function () {
            return {
                restrict: 'E',
                template: '<i class="md-icon material-icons" ng-click="toggleOverlay($event)">&#xE5D4;</i>',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    if(el.closest('.md-card').hasClass('md-card-overlay-active')) {
                        el.html('&#xE5CD;')
                    }

                    scope.toggleOverlay = function ($event) {

                        $event.preventDefault();

                        if(!el.closest('.md-card').hasClass('md-card-overlay-active')) {
                            el
                                .html('&#xE5CD;')
                                .closest('.md-card').addClass('md-card-overlay-active');

                        } else {
                            el
                                .html('&#xE5D4;')
                                .closest('.md-card').removeClass('md-card-overlay-active');
                        }

                    }
                }
            }
        }
    ])
    // card toolbar progress
    .directive('cardProgress', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    var $this = $(el).children('.md-card-toolbar'),
                        bg_percent = parseInt(attrs.cardProgress);


                    function updateCard(percent) {
                        var bg_color_default = $this.attr('card-bg-default');

                        var bg_color = !bg_color_default ? $this.css('backgroundColor') : bg_color_default;
                        if(!bg_color_default) {
                            $this.attr('card-bg-default',bg_color)
                        }

                        $this
                            .css({ 'background': '-moz-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': '-webkit-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': 'linear-gradient(to right,  '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'});


                        scope.cardPercentage = percent;
                    }

                    updateCard(bg_percent);

                    scope.$watch(function() {
                        return $(el).attr('card-progress')
                    }, function(newValue) {
                        updateCard(newValue);
                    });

                }
            }
        }
    ])
    // custom scrollbar
    .directive('customScrollbar', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    // check if mini sidebar is enabled
                    if(attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {
                        return;
                    }

                    $(el)
                        .addClass('uk-height-1-1')
                        .wrapInner("<div class='scrollbar-inner'></div>");

                    if(Modernizr.touch) {
                        $(el).children('.scrollbar-inner').addClass('touchscroll');
                    } else {
                        $timeout(function() {
                            $(el).children('.scrollbar-inner').scrollbar({
                                //disableBodyScroll: true,
                                scrollx: false,
                                duration: 100
                            });
                        })
                    }

                }
            }
        }
    ])
    // material design inputs
    .directive('mdInput',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                controller: function ($scope,$element) {
                    var $elem = $($element);
                    $scope.updateInput = function() {
                        // clear wrapper classes
                        $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                        if($elem.hasClass('md-input-danger')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                        }
                        if($elem.hasClass('md-input-success')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                        }
                        if($elem.prop('disabled')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                        }
                        if($elem.hasClass('label-fixed')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                        if($elem.val() != '') {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                    };
                },
                link: function (scope, elem, attrs) {

                    var $elem = $(elem);

                    $timeout(function() {
                        if(!$elem.hasClass('md-input-processed')) {

                            var extraClass = '';
                            if($elem.is('[class*="uk-form-width-"]')) {
                                var elClasses = $elem.attr('class').split (' ');
                                for(var i = 0; i < elClasses.length; i++){
                                    var classPart = elClasses[i].substr(0,14);
                                    if(classPart == "uk-form-width-"){
                                        var extraClass = elClasses[i];
                                    }
                                }
                            }

                            if ($elem.prev('label').length) {
                                $elem.prev('label').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else if ($elem.siblings('[data-uk-form-password]').length) {
                                $elem.siblings('[data-uk-form-password]').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else {
                                $elem.wrap('<div class="md-input-wrapper"/>');
                            }
                            $elem
                                .addClass('md-input-processed')
                                .closest('.md-input-wrapper')
                                .append('<span class="md-input-bar '+extraClass+'"/>');
                        }

                        scope.updateInput();

                    });

                    scope.$watch(function() {
                            return $elem.attr('class'); },
                        function(newValue,oldValue){
                            if(newValue != oldValue) {
                                scope.updateInput();
                            }
                        }
                    );

                    scope.$watch(function() {
                            return $elem.val(); },
                        function(newValue,oldValue){
                            if( !$elem.is(':focus') && (newValue != oldValue) ) {
                                scope.updateInput();
                            }
                        }
                    );

                    $elem
                        .on('focus', function() {
                            $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                        })
                        .on('blur', function() {
                            $timeout(function() {
                                $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                if($elem.val() == '') {
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                                } else {
                                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                }
                            },100)
                        });

                }
            }
        }
    ])
    // material design fab speed dial
    .directive('mdFabSpeedDial',[
        'variables',
        '$timeout',
        function (variables,$timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $elem = $(elem),
                        $wrapper = $(elem).closest('.md-fab-speed-dial,.md-fab-speed-dial-horizontal');

                    function activateFAB(obj) {
                        obj.closest('.md-fab-wrapper').addClass('md-fab-active');
                        obj.velocity({
                            scale: 0
                        }, {
                            duration: 140,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                obj
                                    .velocity({ scale: 1 },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                    .children().toggle()
                            }
                        })
                    }
                    function deactivateFAB(obj) {
                        obj.closest('.md-fab-wrapper').removeClass('md-fab-active');
                        obj.velocity({
                            scale: 0
                        }, {
                            duration: 140,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                obj
                                    .velocity({ scale: 1 },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                    .children().toggle()
                            }
                        })
                    }

                    $(elem).append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>');

                    if($wrapper.is('[data-fab-hover]')) {
                        var deactiveateFabTimeout;
                        $wrapper
                            .on('mouseenter',function() {
                                $wrapper.addClass('md-fab-over');
                                $timeout.cancel(deactiveateFabTimeout);
                                setTimeout(function() {
                                    activateFAB($elem);
                                },100);
                            })
                            .on('mouseleave',function() {
                                deactivateFAB($elem);
                                deactiveateFabTimeout = $timeout(function() {
                                    $wrapper.removeClass('md-fab-over');
                                },500);
                            })
                    } else {
                        $elem
                            .on('click',function() {
                                if(!$elem.closest('.md-fab-wrapper').hasClass('md-fab-active')) {
                                    activateFAB($elem);
                                } else {
                                    deactivateFAB($elem);
                                }
                            })
                            .closest('.md-fab-wrapper').find('.md-fab-small')
                            .on('click',function() {
                                deactivateFAB($elem);
                            });
                    }
                    /*$(elem)
                        .append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>')
                        .on('click',function(e) {
                            e.preventDefault();

                            var $this = $(this),
                                $this_wrapper = $this.closest('.md-fab-wrapper');

                            if(!$this_wrapper.hasClass('md-fab-active')) {
                                $this_wrapper.addClass('md-fab-active');
                            } else {
                                $this_wrapper.removeClass('md-fab-active');
                            }

                            $this.velocity({
                                scale: 0
                            },{
                                duration: 140,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $this.children().toggle();
                                    $this.velocity({
                                        scale: 1
                                    },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                }
                            })
                        })
                        .closest('.md-fab-wrapper').find('.md-fab-small')
                        .on('click',function() {
                            $(elem).trigger('click');
                        });*/
                }
            }
        }
    ])
    // material design fab toolbar
    .directive('mdFabToolbar',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $fab_toolbar = $(elem);

                    $fab_toolbar
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var toolbarItems = $fab_toolbar.children('.md-fab-toolbar-actions').children().length;

                            $fab_toolbar.addClass('md-fab-animated');

                            var FAB_padding = !$fab_toolbar.hasClass('md-fab-small') ? 16 : 24,
                                FAB_size = !$fab_toolbar.hasClass('md-fab-small') ? 64 : 44;

                            setTimeout(function() {
                                $fab_toolbar
                                    .width((toolbarItems*FAB_size + FAB_padding))
                            },140);

                            setTimeout(function() {
                                $fab_toolbar.addClass('md-fab-active');
                            },420);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_toolbar.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_toolbar).length) {

                                $fab_toolbar
                                    .css('width','')
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_toolbar.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // material design fab sheet
    .directive('mdFabSheet',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    var $fab_sheet = $(elem);

                    $fab_sheet
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                            $fab_sheet.addClass('md-fab-animated');

                            setTimeout(function() {
                                $fab_sheet
                                    .width('240px')
                                    .height(sheetItems*40 + 8);
                            },140);

                            setTimeout(function() {
                                $fab_sheet.addClass('md-fab-active');
                            },280);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_sheet.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_sheet).length) {

                                $fab_sheet
                                    .css({
                                        'height':'',
                                        'width':''
                                    })
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_sheet.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // hierarchical show
    .directive('hierarchicalShow', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {


                    var parent_el = $(elem),
                        baseDelay = 60;


                    var add_animation = function(children,length) {
                        children
                            .each(function(index) {
                                $(this).css({
                                    '-webkit-animation-delay': (index * baseDelay) + "ms",
                                    'animation-delay': (index * baseDelay) + "ms"
                                })
                            })
                            .end()
                            .waypoint({
                                element: elem[0],
                                handler: function() {
                                    parent_el.addClass('hierarchical_show_inView');
                                    setTimeout(function() {
                                        parent_el
                                            .removeClass('hierarchical_show hierarchical_show_inView fast_animation')
                                            .children()
                                            .css({
                                                '-webkit-animation-delay': '',
                                                'animation-delay': ''
                                            });
                                    }, (length*baseDelay)+1200 );
                                    this.destroy();
                                },
                                context: window,
                                offset: '90%'
                            });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var children = parent_el.children(),
                                children_length = children.length;

                            $timeout(function() {
                                add_animation(children,children_length)
                            },560)

                        }
                    });

                    scope.$watch(function() {
                        return parent_el.hasClass('hierarchical_show');
                    }, function(newValue){
                        if($rootScope.pageLoaded && newValue) {
                            var children = parent_el.children(),
                                children_length = children.length;
                            add_animation(children,children_length);
                        }
                    });


                }
            }
        }
    ])
    // hierarchical slide in
    .directive('hierarchicalSlide', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $this = $(elem),
                        baseDelay = 100;

                    var add_animation = function(children,context,childrenLength) {
                        children.each(function(index) {
                            $(this).css({
                                '-webkit-animation-delay': (index * baseDelay) + "ms",
                                'animation-delay': (index * baseDelay) + "ms"
                            })
                        });
                        $this.waypoint({
                            handler: function() {
                                $this.addClass('hierarchical_slide_inView');
                                $timeout(function() {
                                    $this.removeClass('hierarchical_slide hierarchical_slide_inView');
                                    children.css({
                                        '-webkit-animation-delay': '',
                                        'animation-delay': ''
                                    });
                                }, (childrenLength*baseDelay)+1200 );
                                this.destroy();
                            },
                            context: context[0],
                            offset: '90%'
                        });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            if(thisChildrenLength >= 1) {
                                $timeout(function() {
                                    add_animation(thisChildren,thisContext,thisChildrenLength)
                                },560)
                            }
                        }
                    });

                    scope.$watch(function() {
                        return $this.hasClass('hierarchical_slide');
                    }, function(newValue){
                        if($rootScope.pageLoaded && newValue) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            add_animation(thisChildren,thisContext,thisChildrenLength);
                        }
                    });

                }
            }
        }
    ])
    // preloaders
    .directive('mdPreloader',[
        function () {
            return {
                restrict: 'E',
                scope: {
                    width: '=?',
                    height: '=?',
                    strokeWidth: '=?',
                    style: '@?'
                },
                template: '<div class="md-preloader{{style}}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" ng-attr-height="{{ height }}" ng-attr-width="{{ width }}" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" ng-attr-stroke-width="{{ strokeWidth }}"/></svg></div>',
                link: function (scope, elem, attr) {

                    scope.width = scope.width ? scope.width : 48;
                    scope.height = scope.height ? scope.height : 48;
                    scope.strokeWidth = scope.strokeWidth ? scope.strokeWidth : 4;

                    attr.$observe('warning', function() {
                        scope.style = ' md-preloader-warning'
                    });

                    attr.$observe('success', function() {
                        scope.style = ' md-preloader-success'
                    });

                    attr.$observe('danger', function() {
                        scope.style = ' md-preloader-danger'
                    });

                }
            }
        }
    ])
    .directive('preloader',[
        '$rootScope',
        'utils',
        function ($rootScope,utils) {
            return {
                restrict: 'E',
                scope: {
                    width: '=?',
                    height: '=?',
                    style: '@?'
                },
                template: '<img src="assets/img/spinners/{{style}}{{imgDensity}}.gif" alt="" ng-attr-width="{{width}}" ng-attr-height="{{height}}">',
                link: function (scope, elem, attrs) {

                    scope.width = scope.width ? scope.width : 32;
                    scope.height = scope.height ? scope.height : 32;
                    scope.style = scope.style ? scope.style : 'spinner';
                    scope.imgDensity = utils.isHighDensity() ? '@2x' : '' ;

                    attrs.$observe('warning', function() {
                        scope.style = 'spinner_warning'
                    });

                    attrs.$observe('success', function() {
                        scope.style = 'spinner_success'
                    });

                    attrs.$observe('danger', function() {
                        scope.style = 'spinner_danger'
                    });

                    attrs.$observe('small', function() {
                        scope.style = 'spinner_small'
                    });

                    attrs.$observe('medium', function() {
                        scope.style = 'spinner_medium'
                    });

                    attrs.$observe('large', function() {
                        scope.style = 'spinner_large'
                    });

                }
            }
        }
    ])
    // uikit components
    .directive('ukHtmlEditor',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function() {
                        UIkit.htmleditor(elem[0], {
                            'toolbar': '',
                            'height': '240'
                        });
                    });
                }
            }
        }
    ])
    .directive('ukNotification',[
        '$window',
        function ($window) {
            return {
                restrict: 'A',
                scope: {
                    message: '@',
                    status: '@?',
                    timeout: '@?',
                    group: '@?',
                    position: '@?',
                    callback: '&?'
                },
                link: function (scope, elem, attrs) {

                    var w = angular.element($window),
                        $element = $(elem);

                    scope.showNotify = function() {
                        var thisNotify = UIkit.notify({
                            message: scope.message,
                            status: scope.status ? scope.status : '',
                            timeout: scope.timeout ? scope.timeout : 5000,
                            group: scope.group ? scope.group : '',
                            pos: scope.position ? scope.position : 'top-center',
                            onClose: function() {
                                $('body').find('.md-fab-wrapper').css('margin-bottom','');
                                clearTimeout(thisNotify.timeout);

                                if(scope.callback) {
                                    if( angular.isFunction(scope.callback()) ) {
                                        scope.$apply(scope.callback());
                                    } else {
                                        console.log('Callback is not a function');
                                    }
                                }

                            }
                        });
                        if(
                            ( (w.width() < 768) && (
                                (scope.position == 'bottom-right')
                                || (scope.position == 'bottom-left')
                                || (scope.position == 'bottom-center')
                            ) )
                            || (scope.position == 'bottom-right')
                        ) {
                            var thisNotify_height = $(thisNotify.element).outerHeight(),
                                spacer = (w.width() < 768) ? -6 : 8;
                            $('body').find('.md-fab-wrapper').css('margin-bottom',thisNotify_height + spacer);
                        }
                    };

                    $element.on("click", function(){
                        if($('body').find('.uk-notify-message').length) {
                            $('body').find('.uk-notify-message').click();
                            setTimeout(function() {
                                scope.showNotify()
                            },450)
                        } else {
                            scope.showNotify()
                        }
                    });

                }
            }
        }
    ])
    .directive('accordionSectionOpen',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var sectOpen = attrs.accordionSectionOpen.toString().split(","),
                        $elem = $(elem);
                    $timeout(function() {
                        var data = $(elem).data();
                        // close all accordion sections
                        $elem.children('.uk-accordion-title.uk-active').each(function() {
                            $(this).trigger('click');
                        })
                        if(!data.accordion.options.collapse && (sectOpen.length > 1)) {
                            // open multiple sections
                            for(var $i = 0;$i <= sectOpen.length;$i++) {
                                $elem.children('.uk-accordion-title').eq(sectOpen[$i] - 1).trigger('click')
                            }
                        } else {
                            $elem.children('.uk-accordion-title').eq(sectOpen[0] - 1).trigger('click')
                        }
                    },220);
                }
            }
        }
    ])
    .directive('pageAside', [
        '$timeout',
        '$window',
        function ($timeout,$window) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var w = angular.element($window);

                    function calculateHeight() {
                        var viewportHeight = w.height(),
                            asideTop = $(elem).offset().top;

                        $(elem).height(viewportHeight - asideTop);
                    }
                    calculateHeight();
                    w.on('debouncedresize',function() {
                        calculateHeight();
                    });
                }
            }
        }
    ])
    .directive('pageAsideToggle', [
        '$timeout',
        '$window',
        function ($timeout,$window) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $(elem).on('click',function() {
                        $('body').toggleClass('page_aside_collapsed');
                    })
                }
            }
        }
    ])
    .directive('pageOverflow', [
        '$timeout',
        '$window',
        function ($timeout,$window) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var w = angular.element($window);

                    function calculateHeight() {
                        var viewportHeight = w.height(),
                            overflowTop = $(elem).offset().top,
                            height = viewportHeight - overflowTop;

                        if($(elem).children('.uk-overflow-container').length) {
                            $(elem).children('.uk-overflow-container').height(height);
                        } else {
                            $(elem).height(height);
                        }

                    }
                    calculateHeight();
                    w.on('debouncedresize',function() {
                        calculateHeight();
                    });

                }
            }
        }
    ])

    // get Attr
    .directive('getAttrByKey', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            //controllerAs: 'BomController',
            template: '<div>{{valueReturn}}</div>',
            scope: {
                url: '=',
                key: '=',
                value: '=',
                attr: '='
            },
            link: function(scope, element, attrs) {
                //console.log(scope.value);
                if(angular.isDefined(scope.value)){
                    apiData.getAttrByKey(scope.url,scope.key,scope.value,scope.attr).then(function (data) {
                        scope.valueReturn = data;
                    })
                }
            }
        };
    }])
    .directive('getFkValue', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            //controllerAs: 'BomController',
            template: '<span title="{{valueReturn}}">{{valueReturn}}</span>',
            scope: {
                field: '=',
                value: '='
            },
            link: function(scope, element, attrs) {
                if(angular.isDefined(scope.value)){
                    apiData.getFkValue(scope.field,scope.value).then(function (data) {
                        scope.valueReturn = data;
                    })
                }
            }
        };
    }])
    .directive('getAttrByKeyHyperlink', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            //controllerAs: 'BomController',
            template: '<a href="{{hyperlink}}">{{valueReturn}}</a>',
            scope: {
                url: '=',
                key: '=',
                value: '=',
                attr: '=',
                suffix:'=',
                prefix:'='
            },
            link: function(scope, element, attrs) {
                scope.$watch('value', function(newVal){
                    if(angular.isDefined(newVal) && newVal != null && newVal !=''){
                        apiData.getAttrByKey(scope.url,scope.key,newVal,scope.attr).then(function (data) {
                            scope.valueReturn = data;
                        })
                        apiData.getAttrByKey(scope.url,scope.key,newVal,'id').then(function (data) {
                            scope.hyperlink = scope.prefix + data + scope.suffix;
                        })
                    }
                },true);

            }
        };
    }])
    .directive('getAttrById', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div style="display: inline">{{valueReturn}}</div>',
            scope: {
                url: '=',
                value: '=',
                attr: '='
            },
            link: function(scope, element, attrs) {
                //console.log(scope.value);
                if(angular.isDefined(scope.value)){
                    apiData.getAttrById(scope.url,scope.value,scope.attr).then(function (data) {
                        scope.valueReturn = data;
                    })
                }
                scope.$watch('value', function(newVal) {
                    if(angular.isDefined(newVal)&& newVal != null) {
                        apiData.getAttrById(scope.url,scope.value,scope.attr).then(function (data) {
                            scope.valueReturn = data;
                        })
                    }
                }, true);
            }
        };
    }])
    .directive('getAttrByIdTooltip', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div style="display: inline" title="{{valueReturn}}">{{valueReturn}}</div>',
            scope: {
                url: '=',
                value: '=',
                attr: '='
            },
            link: function(scope, element, attrs) {
                // console.log(scope.value);
                if(angular.isDefined(scope.value) && scope.value !=null){
                    apiData.getAttrById(scope.url,scope.value,scope.attr).then(function (data) {
                        scope.valueReturn = data;
                    })
                }
            }
        };
    }])
    .directive('inputAttrById', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<input readonly id="{{inputid}}" class="longTextShowToolTipFullWidth md-input ng-isolate-scope md-input-processed" title="{{valueReturn}}" value="{{valueReturn}}">',
            scope: {
                inputid: '=',
                url: '=',
                keyvalue: '=',
                attr: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('keyvalue', function(newVal) {
                    if(angular.isDefined(newVal)&& newVal != null) {
                        apiData.getAttrById(scope.url,scope.keyvalue,scope.attr).then(function (data) {
                            scope.valueReturn = data;
                        })
                    }
                }, true);
            }
        };
    }])
    .directive('hyperlinkAttrById', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template:'<div class="custom-opr longTextShowToolTipFullWidth" title="{{valueReturn}}"><a href="{{hyperlink}}">{{valueReturn}}</a><span>&nbsp;</span></div>',
            scope: {
                inputid: '=',
                url: '=',
                keyvalue: '=',
                attr: '=',
                hyperlink: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('keyvalue', function(newVal) {
                    if(angular.isDefined(newVal)&& newVal != null) {
                        apiData.getAttrById(scope.url,scope.keyvalue,scope.attr).then(function (data) {
                            scope.valueReturn = data;
                        })
                    }
                }, true);
            }
        };
    }])
    .directive('hyperlinkAttrByIdCustom', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template:'<div class="custom-info longTextShowToolTipFullWidth" title="{{valueReturn}}"><a href="{{hyperlink}}">{{valueReturn}}</a><span>&nbsp;</span></div>',
            scope: {
                inputid: '=',
                url: '=',
                keyvalue: '=',
                attr: '=',
                hyperlink: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('keyvalue', function(newVal) {
                    if(angular.isDefined(newVal)&& newVal != null) {
                        apiData.getAttrById(scope.url,scope.keyvalue,scope.attr).then(function (data) {
                            scope.valueReturn = data;
                        })
                    }
                }, true);
            }
        };
    }])
    .directive('inputHyperlinkAttrById', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template:'<div class="custom-opr"><a href="{{hyperlink}}">{{valueReturn}}</a><span>&nbsp;</span></div>',
            scope: {
                inputid: '=',
                url: '=',
                keyvalue: '=',
                attr: '=',
                suffix:'=',
                prefix:'='
            },
            link: function(scope, element, attrs) {
                scope.$watch('keyvalue', function(newVal) {
                    if(angular.isDefined(newVal)&& newVal != null) {
                        scope.hyperlink = scope.suffix + scope.keyvalue + scope.prefix;
                        apiData.getAttrById(scope.url,scope.keyvalue,scope.attr).then(function (data) {
                            scope.valueReturn = data;
                        })
                    }
                }, true);
            }
        };
    }])

    // select search
    .directive('selectSearchTable', ['apiData','TableMultiple','$q',function (apiData, TableMultiple, $q) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="cbxtextfield"\n' +
            '                    k-data-value-field="cbxvaluefield"\n' +
            '                    k-filter="\'contains\'"\n' +
            '                    k-auto-bind="true"\n' +
            '                    k-min-length="3"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ChooseValue"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </select>',
            scope: {
                cbxplaceholder: '=',
                cbxtextfield: '=',
                cbxvaluefield: '=',
                api: '=',
                //key: '='
                size: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel : '=',
                valuerelatedbefore : '=',
                fieldrelatedbefore : '=',
                valuerelatedafter : '=',
                fieldrelatedafter : '=',
                apiafter : '=',
                valuefieldafter : '=',
                attrgetfromafter : '=',
                originparams : '='
            },
            link: function(scope, element, attrs) {
                // console.log(scope.table);

                scope.loadData = function () {
                    // console.log('load data default');
                    scope.DataSource = {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                //console.log(options);
                                apiData.getCbxSearchTable(options, scope.api, scope.cbxtextfield, scope.size, scope.table.param_fields_type[scope.column], scope.originparams).then(function (data) {
                                    options.success(data);
                                })
                            }
                        }
                    };
                }
                scope.loadData();

                scope.ChooseValue = null;
                scope.selectValue = function () {
                    // console.log(scope.ChooseValue);
                    if(angular.isDefined(scope.ChooseValue) && scope.ChooseValue != null){
                        scope.ngmodel = scope.ChooseValue.id;
                        // console.log(scope.ngmodel);
                        scope.table.param_filter_list[scope.column] = scope.ChooseValue.id;
                        scope.scopecontroller.handleFilter(scope.table.idTable);
                    } else {
                        scope.table.param_filter_list[scope.column] = "";
                        scope.scopecontroller.handleFilter(scope.table.idTable);

                        scope.ngmodel = null;
                        if(scope.fieldrelatedbefore != null && scope.valuerelatedbefore != null){
                            scope.loadDataRelated(scope.valuerelatedbefore);
                        } else if(scope.fieldrelatedafter != null && scope.valuerelatedafter != null){
                            scope.loadDataRelated(scope.valuerelatedafter);
                        } else {
                            scope.loadData();
                        }
                    }
                }

                scope.loadDataRelated = function (valuerelated) {
                    console.log('load data relate');
                    console.log(valuerelated);
                    scope.DataSource = {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                //console.log(options);
                                if(angular.isDefined(scope.fieldrelatedbefore) && scope.fieldrelatedbefore != null){
                                    apiData.getCbxSearchTableRelated(valuerelated, scope.api, scope.fieldrelatedbefore, scope.size, scope.table.param_fields_type[scope.column]).then(function (data) {
                                        options.success(data);
                                        // console.log(data);
                                    })
                                }else if(angular.isDefined(scope.fieldrelatedafter) && scope.fieldrelatedafter != null){
                                    apiData.getCbxSearchTableRelated(valuerelated, scope.api, scope.fieldrelatedafter, scope.size, scope.table.param_fields_type[scope.column]).then(function (data) {
                                        options.success(data);
                                        // console.log(data);
                                    })
                                }
                            }
                        }
                    };
                }

                scope.getValueRelatedAfter = function (api,value,field,attr) {
                    console.log('load value relate by after');
                    var deferred = $q.defer();
                    apiData.getAttrByKey(api,field,value,attr).then(function (data) {
                        //console.log(data);
                        deferred.resolve(data);
                    })
                    return deferred.promise;
                }

                scope.$watch('valuerelatedbefore', function(newVal) {
                    if(angular.isDefined(newVal)&& newVal != null) {
                        // console.log(newVal);
                        scope.loadDataRelated(newVal);
                    }else{ //if(angular.isDefined(scope.ChooseValue) && scope.ChooseValue != null){
                        scope.loadData();
                    }
                }, true);

                scope.$watch('valuerelatedafter', function(newVal) {
                    if(angular.isDefined(newVal)&& newVal != null) {
                        // console.log(newVal);
                        scope.getValueRelatedAfter(scope.apiafter, newVal, scope.valuefieldafter, scope.attrgetfromafter)
                            .then(function(result) {
                                //console.log(result)
                                scope.loadDataRelated(result);
                            })
                            .catch(function(fallback) {

                            });
                    }
                }, true);
            }
        };
    }])

    // datetime filter
    .directive('datePickerFilter', ['TableMultiple','utils',function (TableMultiple, utils) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div>\n' +
                    '\t<input id="filter_date_column" class="filter-table-cell ng-pristine ng-valid ng-empty ng-touched"\n' +
                    '\t   ng-model="inputValue" type="search" placeholder=" Select date..."\n' +
                    '\t   style="height: 38px;width: 150px;"\n' +
                    '\t   ng-click="openModalDateRange()">\n' +
                    '\t<div class="uk-modal uk-open" id="modal_date_range" aria-hidden="false" style="display: block; overflow-y: scroll;" ng-show="EnableShow">\n' +
                    '\t\t<div class="uk-modal-dialog" style="top: 22.5px;">\n' +
                    '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                    '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                    '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 10px;">\n' +
                    '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_range" icheck ng-model="radio_model" value="radio_1" ng-checked="true"/>\n' +
                    '\t\t\t\t\t\t<label class="inline-label">Between</label>\n' +
                    '\t\t\t\t\t</p>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                    '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                    '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                    '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_start" data-uk-datepicker="{format:\'YYYY-MM-DD\'}" ng-model="ukDateStart">\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;">\n' +
                    '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                    '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                    '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_end" data-uk-datepicker="{format:\'YYYY-MM-DD\'}" ng-model="ukDateEnd">\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t</div>\n' +
                    '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                    '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                    '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 13px;">\n' +
                    '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_equal" icheck ng-model="radio_model" value="radio_2" />\n' +
                    '\t\t\t\t\t\t<label class="inline-label">On</label>\n' +
                    '\t\t\t\t\t</p>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                    '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                    '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                    '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_equal" data-uk-datepicker="{format:\'YYYY-MM-DD\'}" ng-model="ukDateEqual">\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                    '\t\t\t</div>\n' +
                    '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                    '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                    '\t\t\t\t\t<p style="margin-left: -30px;">\n' +
                    '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_empty" icheck ng-model="radio_model" value="radio_3" ng-change="chooseEmpty()"/>\n' +
                    '\t\t\t\t\t\t<label class="inline-label">Is Empty</label>\n' +
                    '\t\t\t\t\t</p>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;"></div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                    '\t\t\t</div>\n' +
                    '\t\t\t<div class="uk-modal-footer uk-text-right" style="width: 560px;margin-top: -10px;">\n' +
                    '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="cancelModalDateRange()">Cancel</button>\n' +
                    '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="clearModalDateRange()">Clear</button>\n' +
                    '\t\t\t\t<button type="button" id="dateRangeApply" class="md-btn md-btn-flat md-btn-flat-primary" ng-click="selectDateRange()">OK</button>\n' +
                    '\t\t\t</div>\n' +
                    '\t\t</div>\n' +
                    '\t</div>\n' +
                    '</div>',
            scope: {
                dateStart: '=',
                dateEnd: '=',
                table: '=',
                column: '=',
                scopeController: '=',
                originParams : '='
            },
            link: function(scope, element, attrs) {

                //init
                scope.EnableShow = false;
                scope.radio_model = null;

                //var $uk_date_start = $('#uk_date_start'), $uk_date_end = $('#uk_date_end'), $uk_date_equal = $('#uk_date_equal');
                //var start_date_range = UIkit.datepicker($uk_date_start, {format:'YYYY-MM-DD'});
                //var end_date_range = UIkit.datepicker($uk_date_end, {format:'YYYY-MM-DD'});
                //var date_equal = UIkit.datepicker($uk_date_equal, {format:'YYYY-MM-DD'});

                /*$uk_date_start.on('change',function() {
                    scope.dateStart = $uk_date_start.val().toString() + " 00:00:00.000";
                    //console.log(scope.dateStart)
                });
                $uk_date_end.on('change',function() {
                    scope.dateEnd = $uk_date_end.val().toString() + " 24:00:00.000";
                    //console.log(scope.dateEnd)
                });
                $uk_date_equal.on('change',function() {
                    scope.dateStart = $uk_date_equal.val().toString() + " 00:00:00.000";
                    scope.dateEnd = $uk_date_equal.val().toString() + " 24:00:00.000";
                    //console.log(scope.ngModelEqual)
                });*/

                scope.clear = function () {
                    scope.inputValue = null;
                    scope.dateStart = "";
                    scope.dateEnd = "";

                    scope.ukDateEqual = "";
                    scope.ukDateStart = "";
                    scope.ukDateEnd = "";

                    //$uk_date_start.val("");
                    //$uk_date_end.val("");
                    //$uk_date_equal.val("");
                }
                scope.clear();

                scope.openModalDateRange = function(){
                    scope.EnableShow = true;
                }
                scope.cancelModalDateRange = function () {
                    scope.EnableShow = false;
                }
                scope.clearModalDateRange = function(){
                    scope.clear();
                }
                scope.resetTable = function(){
                    scope.table.param_filter_list[scope.column] = "";
                    scope.scopeController.handleFilter(scope.table.idTable);
                }
                scope.chooseEmpty = function () {
                    //console.log(scope.radio_model)
                    if(scope.radio_model == 'radio_3'){
                        //console.log('set null')
                        scope.inputValue = null;
                        scope.table.param_filter_list[scope.column] = null;scope.dateStart = null;scope.dateEnd = null;
                        scope.ukDateEqual = null;scope.ukDateStart = null;scope.ukDateEnd == null;
                    }else{
                        scope.clear();
                    }
                }
                scope.selectDateRange = function(){
                    //console.log(scope.radio_model)
                    //console.log(scope.ukDateStart)
                    //console.log(scope.ukDateEnd)
                    //console.log(scope.ukDateEqual)

                    if(scope.ukDateEqual == "" && scope.ukDateStart == "" && scope.ukDateEnd == ""){
                        scope.resetTable();
                    }else if(scope.radio_model == null || scope.radio_model == 'radio_1'){
                        if(scope.ukDateStart == null || scope.ukDateEnd == null){
                            scope.inputValue = null;
                            scope.resetTable();
                        }else{
                            scope.dateStart = scope.ukDateStart.toString() + " 00:00:00.000";
                            scope.dateEnd = scope.ukDateEnd.toString() + " 24:00:00.000";
                            scope.table.param_filter_list[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                            scope.scopeController.handleFilter(scope.table.idTable);
                            //scope.inputValue = $uk_date_start.val().toString() + ' - ' + $uk_date_end.val().toString();
                            scope.inputValue = scope.ukDateStart.toString() + ' - ' + scope.ukDateEnd.toString();
                        }
                    }else if(scope.radio_model == 'radio_2'){
                        if(scope.ukDateEqual == null){
                            scope.inputValue = null;
                            scope.resetTable();
                        }else{
                            //scope.inputValue = $uk_date_equal.val().toString();
                            scope.inputValue = scope.ukDateEqual.toString();
                            scope.dateStart = scope.ukDateEqual.toString() + " 00:00:00.000";
                            scope.dateEnd = scope.ukDateEqual.toString() + " 24:00:00.000";
                            scope.table.param_filter_list[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                            scope.scopeController.handleFilter(scope.table.idTable);
                        }
                    }else if(scope.radio_model == 'radio_3'){
                        //console.log('filter null')
                        scope.scopeController.handleFilter(scope.table.idTable);
                    }
                    scope.EnableShow = false;
                }
            }
        };
    }])
    .directive('datetimePickerFilter', ['TableMultiple','utils',function (TableMultiple, utils) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div>\n' +
                    '\t<input id="filter_column" class="filter-table-cell ng-pristine ng-valid ng-empty ng-touched"\n' +
                    '\t\t   ng-model="inputValue" type="search" placeholder=" Select datetime..."\n' +
                    '\t\t   style="height: 38px;width: 200px;"\n' +
                    '\t\t   ng-click="openModalDateTimeRange()">\n' +
                    '\t<div class="uk-modal uk-open" id="modal_daterange" aria-hidden="false" style="display: block; overflow-y: scroll;" ng-show="EnableShow">\n' +
                    '\t\t<div class="uk-modal-dialog" style="top: 22.5px;">\n' +
                    '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                    '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                    '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 16px;">\n' +
                    '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_range" icheck ng-model="radio_model" value="radio_1" ng-checked="true"/>\n' +
                    '\t\t\t\t\t\t<label class="inline-label">Range</label>\n' +
                    '\t\t\t\t\t</p>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                    '\t\t\t\t\t<div class="uk-input-group" style="width: 120%;">\n' +
                    // '\t\t\t\t\t\t<label for="uk_dp_start">Start Date</label><br>\n' +
                    '\t\t\t\t\t\t<div style="padding-top: 7px;">\n' +
                    '\t\t\t\t\t\t\t<input kendo-date-time-picker ng-model="ngModelStart" k-ng-model="kNgModelStart" style="width: 100%;" id="kUI_datetimepicker_start"/>\n' +
                    '\t\t\t\t\t\t</div>\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;">\n' +
                    '\t\t\t\t\t<div class="uk-input-group" style="width: 120%;">\n' +
                    // '\t\t\t\t\t\t<label for="uk_dp_end">End Date</label><br>\n' +
                    '\t\t\t\t\t\t<div style="padding-top: 7px;">\n' +
                    '\t\t\t\t\t\t\t<input kendo-date-time-picker ng-model="ngModelEnd" k-ng-model="kNgModelEnd" style="width: 100%;" id="kUI_datetimepicker_end"/>\n' +
                    '\t\t\t\t\t\t</div>\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t</div>\n' +
                    '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                    '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                    '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 10px;">\n' +
                    '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_equal" icheck ng-model="radio_model" value="radio_2" />\n' +
                    '\t\t\t\t\t\t<label class="inline-label">Equal</label>\n' +
                    '\t\t\t\t\t</p>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                    '\t\t\t\t\t<div class="uk-input-group" style="width: 120%;">\n' +
                    '\t\t\t\t\t\t<input kendo-date-time-picker ng-model="ngModelEqual" k-ng-model="kNgModelEqual" style="width: 100%;" id="kUI_datetimepicker"/>\n' +
                    '\t\t\t\t\t</div>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                    '\t\t\t</div>\n' +
                    '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                    '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                    '\t\t\t\t\t<p style="margin-left: -30px;">\n' +
                    '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_empty" icheck ng-model="radio_model" value="radio_3" />\n' +
                    '\t\t\t\t\t\t<label class="inline-label">Is Empty</label>\n' +
                    '\t\t\t\t\t</p>\n' +
                    '\t\t\t\t</div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;"></div>\n' +
                    '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                    '\t\t\t</div>\n' +
                    '\t\t\t<div class="uk-modal-footer uk-text-right" style="width: 560px;margin-top: -10px;">\n' +
                    '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="cancelModalDateTimeRange()">Cancel</button>\n' +
                    '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="clearModalDateTimeRange()">Clear</button>\n' +
                    '\t\t\t\t<button type="button" id="daterangeApply" class="md-btn md-btn-flat md-btn-flat-primary" ng-click="selectDateTimeRange()">OK</button>\n' +
                    '\t\t\t</div>\n' +
                    '\t\t</div>\n' +
                    '\t</div>\n' +
                    '</div>',
            scope: {
                dateStart: '=',
                dateEnd: '=',
                table: '=',
                column: '=',
                scopeController: '=',
                originParams : '='
            },
            link: function(scope, element, attrs) {

                scope.EnableShow = false;

                scope.clear = function () {
                    scope.inputValue = null;
                    scope.ngModelStart = null;
                    scope.ngModelEnd = null;
                    scope.kNgModelStart = null;
                    scope.kNgModelEnd = null;
                    scope.ngModelEqual = null;
                    scope.kNgModelEqual = null;
                    //scope.radio_model = 'radio_1';
                }
                scope.clear();

                scope.radio_model = null;

                scope.openModalDateTimeRange = function(){
                    scope.EnableShow = true;
                }
                scope.cancelModalDateTimeRange = function () {
                    scope.EnableShow = false;
                }
                scope.clearModalDateTimeRange = function(){
                    scope.clear();
                }
                scope.resetTable = function(){
                    scope.table.param_filter_list[scope.column] = "";
                    scope.scopeController.handleFilter(scope.table.idTable);
                }
                scope.selectDateTimeRange = function(){
                    //console.log(scope.radio_model)
                    if(scope.radio_model == null || scope.radio_model == 'radio_1'){
                        scope.dateStart = kendo.toString(scope.kNgModelStart,"yyyy-MM-dd HH:mm:ss.sss");
                        scope.dateEnd = kendo.toString(scope.kNgModelEnd,"yyyy-MM-dd HH:mm:ss.sss");

                        if(scope.dateStart == null || scope.dateEnd == null){
                            scope.inputValue = null;
                            scope.resetTable();
                        }else{
                            scope.table.param_filter_list[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                            scope.scopeController.handleFilter(scope.table.idTable);
                            scope.inputValue = kendo.toString(scope.kNgModelStart,"yyyy/MM/dd") + ' - ' + kendo.toString(scope.kNgModelEnd,"yyyy/MM/dd");
                        }

                    }else if(scope.radio_model == 'radio_2'){
                        scope.dateStart = scope.dateEnd = kendo.toString(scope.kNgModelEqual,"yyyy-MM-dd HH:mm:ss.sss");

                        if(scope.dateStart == null){
                            scope.inputValue = kendo.toString(scope.kNgModelEqual,"yyyy-MM-dd HH:mm:ss");
                            scope.resetTable();
                        }else{
                            scope.inputValue = scope.dateStart;
                            scope.table.param_filter_list[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                            scope.scopeController.handleFilter(scope.table.idTable);
                        }
                    }else{
                        scope.resetTable();
                        scope.inputValue = null;
                        scope.dateStart = scope.dateEnd = null;
                    }
                    scope.EnableShow = false;
                }

                /*scope.$watch('kNgModelStart', function(newVal) {
                    console.log(kendo.toString(newVal,"yyyy-MM-dd HH:mm:ss"))
                }, true);*/
            }
        };
    }])
    .directive('datetimePickerRangeFilter', ['TableMultiple','$compile','utils',function (TableMultiple, $compile, utils) {
        return {
            restrict: 'EAC',
            replace: true,
            // templateUrl:'assets/templates/bootstrap-daterangepicker-master/bootstrap-daterangepicker-filter.html',
            template:   '<div class="demo">\n' +
            '                <input type="text" id="config-demo" class="form-control" style="height: 38px;border-radius: unset;">\n' +
            '                <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>\n' +
            '            </div>',
            scope: {
                startdate: '=',
                enddate: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                originparams : '='
            },
            link: function(scope, element, attrs) {
                var boostrap = '<link href="assets/css/bootstrap.min.css" rel="stylesheet">';
                element.append($compile(boostrap)(scope));

                var css = '<style>\n' +
                    '\t.demo { position: relative; }\n' +
                    '\t.demo i {\n' +
                    '\t\tposition: absolute; bottom: 12px; right: 10px; top: auto; cursor: pointer;\n' +
                    '\t}\n' +
                    '\t.uk-pagination>li>span {\n' +
                    '\t\tfont-size: medium;\n' +
                    '\t}\n' +
                    '\t.container-checkbox {\n' +
                    '\t\tfont-weight: normal;\n' +
                    '\t}\n' +
                    '\t.container-checkbox .checkmark:after {\n' +
                    '\t\twidth: 7px;\n' +
                    '\t\theight: 13px;\n' +
                    '\t}\n' +
                    '</style>';
                element.append($compile(css)(scope));

                scope.$watchGroup(['startdate', 'enddate'], function(newValues, oldValues, scope) {
                    if(angular.isDefined(scope.startdate) && angular.isDefined(scope.enddate)
                        && scope.startdate != null && scope.enddate != null){
                        //onsole.log(scope.startdate.format('YYYY-MM-dd HH:mm:ss') + ' - ' + scope.enddate.format('YYYY-MM-dd HH:mm:ss'));
                        //console.log(utils.toTimestamp(scope.startdate.format('YYYY-MM-dd HH:mm:ss')) + '&' + utils.toTimestamp(scope.enddate.format('YYYY-MM-dd HH:mm:ss')));
                        scope.table.param_filter_list[scope.column] = utils.toTimestamp(scope.startdate.format('YYYY-MM-dd HH:mm:ss')) + '&' + utils.toTimestamp(scope.enddate.format('YYYY-MM-dd HH:mm:ss'));
                        scope.scopecontroller.handleFilter(scope.table.idTable);
                    }
                });

                $(document).ready(function() {

                    //console.log('datetimepicker range');

                    $('.configurator input, .configurator select').change(function() {
                        updateConfig();
                    });

                    $('.demo i').click(function() {
                        //console.log('choose datetime');
                        $(this).parent().find('input').click();
                    });

                    $('#startDate').daterangepicker({
                        singleDatePicker: true,
                        startDate: moment().subtract(6, 'days')
                    });

                    $('#endDate').daterangepicker({
                        singleDatePicker: true,
                        startDate: moment()
                    });

                    updateConfig();

                    function updateConfig() {
                        var options = {};

                        if ($('#singleDatePicker').is(':checked'))
                            options.singleDatePicker = true;

                        if ($('#showDropdowns').is(':checked'))
                            options.showDropdowns = true;

                        if ($('#showWeekNumbers').is(':checked'))
                            options.showWeekNumbers = true;

                        if ($('#showISOWeekNumbers').is(':checked'))
                            options.showISOWeekNumbers = true;

                        if ($('#timePicker').is(':checked'))
                            options.timePicker = true;

                        if ($('#timePicker24Hour').is(':checked'))
                            options.timePicker24Hour = true;

                        if ($('#timePickerSeconds').is(':checked'))
                            options.timePickerSeconds = true;

                        if ($('#autoApply').is(':checked'))
                            options.autoApply = true;

                        if ($('#dateLimit').is(':checked'))
                            options.dateLimit = { days: 7 };

                        if ($('#ranges').is(':checked')) {
                            options.ranges = {
                                'Today': [moment(), moment()],
                                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                            };
                        }

                        if ($('#locale').is(':checked')) {
                            $('#rtl-wrap').show();
                            options.locale = {
                                direction: $('#rtl').is(':checked') ? 'rtl' : 'ltr',
                                format: 'MM/DD/YYYY HH:mm',
                                separator: ' - ',
                                applyLabel: 'Apply',
                                cancelLabel: 'Cancel',
                                fromLabel: 'From',
                                toLabel: 'To',
                                customRangeLabel: 'Custom',
                                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                firstDay: 1
                            };
                        } else {
                            $('#rtl-wrap').hide();
                        }

                        if (!$('#linkedCalendars').is(':checked'))
                            options.linkedCalendars = false;

                        if (!$('#autoUpdateInput').is(':checked'))
                            options.autoUpdateInput = false;

                        if (!$('#showCustomRangeLabel').is(':checked'))
                            options.showCustomRangeLabel = false;

                        if ($('#alwaysShowCalendars').is(':checked'))
                            options.alwaysShowCalendars = true;

                        //console.log('config-demo');
                        $('#config-demo').daterangepicker({
                            "timePicker": true,
                            "locale": {
                                "direction": "ltr",
                                // "format": "MM/DD/YYYY HH:mm",
                                "format": "MM/DD/YYYY",
                                "separator": " - ",
                                "applyLabel": "Apply",
                                "cancelLabel": "Cancel",
                                "fromLabel": "From",
                                "toLabel": "To",
                                "customRangeLabel": "Custom",
                                "daysOfWeek": [
                                    "Su",
                                    "Mo",
                                    "Tu",
                                    "We",
                                    "Th",
                                    "Fr",
                                    "Sa"
                                ],
                                "monthNames": [
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December"
                                ],
                                "firstDay": 1
                            },
                            "startDate": "01/01/2018",
                            "endDate": "01/07/2018"
                        }, function(start, end) {
                            //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
                            scope.startdate = start;
                            scope.enddate = end;
                        });

                        $('#daterangepicker_cancel').click(function () {
                            //console.log('cancel datetime picker');
                            scope.table.param_filter_list[scope.column] = "";
                            TableMultiple.reloadPage(scope.table.idTable);
                        });
                    }

                });
            }
        };
    }])

    // active filter
    .directive('activeSearchTable', ['apiData','TableMultiple','$timeout',function (apiData, TableMultiple,$timeout) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="activeFilter" kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="\'title\'"\n' +
            '                    k-data-value-field="\'value\'"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ngmodel"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </select>',
            scope: {
                cbxplaceholder: '=',
                api: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel : '='
            },
            link: function(scope, element, attrs) {
                data =[
                    {value:1, title:"Active"},
                    {value:0, title:"Archived"}
                ]
                scope.DataSource = data;
                // scope.chooseValue = {value:1, title:"Active"};

                scope.$watch('ngmodel', function() {
                    $timeout(function () {
                        if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                            scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                            scope.scopecontroller.handleFilter(scope.table.idTable);
                        } else {
                            scope.table.param_filter_list[scope.column] = "";
                            TableMultiple.reloadPage(scope.table.idTable);
                        }
                    });
                })

                scope.selectValue = function () {
                    // if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                    //     // scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                    //     // scope.scopecontroller.handleFilter(scope.table.idTable);
                    // } else {
                    //     scope.table.param_filter_list[scope.column] = "";
                    //     TableMultiple.reloadPage(scope.table.idTable);
                    // }
                }
                var fabric = $("#activeFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true)
                    .on("keydown", function(e) {
                        if (e.keyCode === 8) {
                            e.preventDefault();
                        }
                    });
            }
        };
    }])
    .directive('checkedSearchTable', ['apiData','TableMultiple','$timeout',function (apiData, TableMultiple,$timeout) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="checkedFilter" kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="\'title\'"\n' +
            '                    k-data-value-field="\'value\'"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ngmodel"\n' +
            '                    style="width:100%;">\n' +
            '            </select>',
            scope: {
                cbxplaceholder: '=',
                api: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel : '='
            },
            link: function(scope, element, attrs) {
                data =[
                    {value:1, title:"Checked"},
                    {value:0, title:"Unchecked"}
                ]
                scope.DataSource = data;
                // scope.chooseValue = {value:1, title:"checked"};

                scope.$watch('ngmodel', function() {
                    $timeout(function () {
                        if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                            scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                            scope.scopecontroller.handleFilter(scope.table.idTable);
                        } else {
                            scope.table.param_filter_list[scope.column] = "";
                            TableMultiple.reloadPage(scope.table.idTable);
                        }
                    });
                })

                var fabric = $("#checkedFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true)
                    .on("keydown", function(e) {
                        if (e.keyCode === 8) {
                            e.preventDefault();
                        }
                    });
            }
        };
    }])
    .directive('publicSearchTable', ['apiData','TableMultiple','$timeout',function (apiData, TableMultiple,$timeout) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="publicFilter" kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="\'title\'"\n' +
            '                    k-data-value-field="\'value\'"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ngmodel"\n' +
            '                    style="width:100%;">\n' +
            '            </select>',
            scope: {
                cbxplaceholder: '=',
                api: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel : '='
            },
            link: function(scope, element, attrs) {
                data =[
                    {value:1, title:"Public"},
                    {value:0, title:"Private"}
                ]
                scope.DataSource = data;
                // scope.chooseValue = {value:1, title:"checked"};

                scope.$watch('ngmodel', function() {
                    $timeout(function () {
                        if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                            scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                            scope.scopecontroller.handleFilter(scope.table.idTable);
                        } else {
                            scope.table.param_filter_list[scope.column] = "";
                            TableMultiple.reloadPage(scope.table.idTable);
                        }
                    });
                })

                var fabric = $("#publicFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true)
                    .on("keydown", function(e) {
                        if (e.keyCode === 8) {
                            e.preventDefault();
                        }
                    });
            }
        };
    }])
    .directive('activeSearchOldTable', ['apiData','TableCommon',function (apiData, TableCommon) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div><select id="activeFilter" kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="\'title\'"\n' +
            '                    k-data-value-field="\'value\'"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ngmodel"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </select></div>',
            scope: {
                cbxplaceholder: '=',
                api: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel:'='
            },
            link: function(scope, element, attrs) {
                data =[
                    {value:1, title:"Active"},
                    {value:0, title:"Archived"}
                ]
                scope.DataSource = data;
                scope.$watch('ngmodel', function() {
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.scopecontroller.param_filter_list[scope.column] = scope.ngmodel.value;
                        scope.scopecontroller.handleFilter();
                    } else {
                        scope.scopecontroller.param_filter_list[scope.column] = "";
                        TableCommon.reloadPage();
                    }
                })
                scope.selectValue = function () {
                    // console.log(scope.ngmodel);
                    // if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                    //     scope.scopecontroller.param_filter_list[scope.column] = scope.ngmodel.value;
                    //     scope.scopecontroller.handleFilter();
                    // } else {
                    //     scope.scopecontroller.param_filter_list[scope.column] = "";
                    //     TableCommon.reloadPage();
                    // }
                }
                var fabric = $("#activeFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true)
                    .on("keydown", function(e) {
                        if (e.keyCode === 8) {
                            e.preventDefault();
                        }
                    });
            }
        };
    }])

    //searchable multiselect
    .directive("searchableMultiselect", function($timeout) {
        return {
            templateUrl: 'assets/templates/searchable-multiselect/searchableMultiselect.html',
            restrict: 'AE',
            scope: {
                displayAttr: '@',
                selectedItems: '=',
                allItems: '=',
                readOnly: '=',
                addItem: '&',
                removeItem: '&'
            },
            link: function(scope, element, attrs) {
                element.bind('click', function (e) {
                    e.stopPropagation();
                });

                //console.log(element[0].getBoundingClientRect());
                scope.width = element[0].getBoundingClientRect();

                scope.updateSelectedItems = function(obj) {
                    var selectedObj;
                    for (i = 0; typeof scope.selectedItems !== 'undefined' && i < scope.selectedItems.length; i++) {
                        if (scope.selectedItems[i][scope.displayAttr].toUpperCase() === obj[scope.displayAttr].toUpperCase()) {
                            selectedObj = scope.selectedItems[i];
                            break;
                        }
                    }
                    if ( typeof selectedObj === 'undefined' ) {
                        scope.addItem({item: obj});
                    } else {
                        scope.removeItem({item: selectedObj});
                    }
                };

                scope.isItemSelected = function(item) {
                    if ( typeof scope.selectedItems === 'undefined' ) return false;

                    var tmpItem;
                    for (i=0; i < scope.selectedItems.length; i++) {
                        tmpItem = scope.selectedItems[i];
                        if ( typeof tmpItem !== 'undefined'
                            &&	typeof tmpItem[scope.displayAttr] !== 'undefined'
                            &&	typeof item[scope.displayAttr] !== 'undefined'
                            &&	tmpItem[scope.displayAttr].toUpperCase() === item[scope.displayAttr].toUpperCase() ) {
                            return true;
                        }
                    }

                    return false;
                };

                scope.commaDelimitedSelected = function() {
                    var list = "";
                    angular.forEach(scope.selectedItems, function (item, index) {
                        list += item[scope.displayAttr];
                        if (index < scope.selectedItems.length - 1) list += ', ';
                    });
                    return list.length ? list : "Nothing Selected";
                }
            }
        }
    })
    .directive('selectSearchTableFix', ['TableMultiple',function (TableMultiple) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="cbxtextfield"\n' +
            '                    k-data-value-field="cbxvaluefield"\n' +
            '                    k-filter="\'contains\'"\n' +
            '                    k-auto-bind="true"\n' +
            '                    k-min-length="3"\n' +
            '                    k-data-source="datasource"\n' +
            '                    k-ng-model="ChooseValue"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </select>',
            scope: {
                cbxplaceholder: '=',
                cbxtextfield: '=',
                cbxvaluefield: '=',
                datasource: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel : '='
            },
            link: function(scope, element, attrs) {
                // console.log(scope.table);
                scope.ChooseValue = null;
                scope.selectValue = function () {
                    // console.log(scope.ChooseValue);
                    if(angular.isDefined(scope.ChooseValue) && scope.ChooseValue != null){
                        scope.ngmodel = scope.ChooseValue.id;
                        // console.log(scope.ngmodel);
                        scope.table.param_filter_list[scope.column] = scope.ChooseValue.id;
                        scope.scopecontroller.handleFilter(scope.table.idTable);
                    } else {
                        scope.table.param_filter_list[scope.column] = "";
                        TableMultiple.reloadPage(scope.table.idTable);
                        scope.ngmodel = null;
                    }
                }
            }
        };
    }])

    // activate/deactivate
    .directive('activate', ['ErrorHandle', function (ErrorHandle, apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<a ng-mouseenter="mouseHoverStatus()" ng-mouseleave="mouseLeaveStatus()" ng-click=statusAction()\n' +
            '           class=" md-btn md-btn-small md-btn-wave-light md-btn-icon md-bg-grey-100 custom-btn-active float-right"\n' +
            '           href="javascript:void(0)">\n' +
            '           <div style="float:left;display:inline-block;">\n' +
            '           <i class="uk-icon-archive uk-icon-medium icon-padding-top"></i>\n' +
            '           </div>\n' +
            '           <div >\n' +
            '           <p class="line-big text-padding-top uk-text-bold">\n' +
            '           <br/>\n' +
            '           <span class="uk-text-danger uk-text-bold" id="activeBtn" ng-class="activeClass" data-translate="{{status}}"></span>\n' +
            '           </p>\n' +
            '           </div>\n' +
            '           </a>',
            scope: {
                model: '=',
                activateService:'=',
                deactivateService:'='
            },
            link: function(scope, element, attrs) {
                scope.$watch('model', function(newModel){
                    if(angular.isDefined(newModel)){
                        scope.status = "global.common.archived"
                        scope.active = newModel.active
                        var statusAction = {
                            true: "global.common.archive",
                            false: "global.common.restore"
                        }
                        var statusTitle = {
                            true: "global.common.active",
                            false: "global.common.archived"
                        }
                        var statusStyle = {
                            true: "uk-text-success uk-text-bold custom-active-txt",
                            false: "uk-text-danger uk-text-bold custom-active-txt"
                        }
                        if (scope.active) {
                            scope.status = "global.common.active"
                        }
                        scope.activeClass = statusStyle[scope.active]
                        scope.mouseHoverStatus = function () {
                            scope.status = statusAction[scope.active]
                            scope.activeClass = statusStyle[!scope.active]
                        };
                        scope.mouseLeaveStatus = function () {
                            scope.status = statusTitle[scope.active]
                            scope.activeClass = statusStyle[scope.active]
                        };

                        scope.statusAction = function() {
                            var list = [scope.model.id]
                            if(scope.active){
                                scope.deactivateService(list).then(function () {
                                    newModel.active = false
                                    scope.active = !scope.active
                                    scope.activeClass = statusStyle[scope.active]
                                    scope.status =statusTitle[scope.active]
                                }).catch(function(data){
                                    ErrorHandle.handleError(data);
                                })
                            } else {
                                scope.activateService(list).then(function () {
                                    newModel.active = true
                                    scope.active = !scope.active
                                    scope.activeClass = statusStyle[scope.active]
                                    scope.status =statusTitle[scope.active]
                                }).catch(function(data){
                                    ErrorHandle.handleError(data);
                                })
                            }

                        }
                    }

                },true)



            }
        };
    }])
    .directive('activateNotClick', ['AlertService', function (AlertService, apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<a ng-mouseenter="mouseHoverStatus()" ng-mouseleave="mouseLeaveStatus()" ng-click=statusAction()\n' +
            '           class=" md-btn md-btn-small md-btn-wave-light md-btn-icon md-bg-grey-100 custom-btn-active float-right"\n' +
            '           href="javascript:void(0)">\n' +
            '           <div style="float:left;display:inline-block;">\n' +
            '           <i class="uk-icon-archive uk-icon-medium icon-padding-top"></i>\n' +
            '           </div>\n' +
            '           <div >\n' +
            '           <p class="line-big text-padding-top uk-text-bold">\n' +
            '           <br/>\n' +
            '           <span class="uk-text-danger uk-text-bold" id="activeBtn" ng-class="activeClass" data-translate="{{status}}"></span>\n' +
            '           </p>\n' +
            '           </div>\n' +
            '           </a>',
            scope: {
                model: '=',
                activateService:'=',
                deactivateService:'='
            },
            link: function(scope, element, attrs) {
                scope.$watch('model', function(newModel){
                    if(angular.isDefined(newModel)){
                        scope.status = "global.common.archived"
                        scope.active = newModel.active
                        var statusAction = {
                            true: "global.common.archive",
                            false: "global.common.restore"
                        }
                        var statusTitle = {
                            true: "global.common.active",
                            false: "global.common.archived"
                        }
                        var statusStyle = {
                            true: "uk-text-success uk-text-bold custom-active-txt",
                            false: "uk-text-danger uk-text-bold custom-active-txt"
                        }
                        if (scope.active) {
                            scope.status = "global.common.active"
                        }
                        scope.activeClass = statusStyle[scope.active]
                        scope.mouseHoverStatus = function () {
                            scope.status = statusAction[scope.active]
                            scope.activeClass = statusStyle[!scope.active]
                        };
                        scope.mouseLeaveStatus = function () {
                            scope.status = statusTitle[scope.active]
                            scope.activeClass = statusStyle[scope.active]
                        };

                        scope.statusAction = function() {
                            AlertService.error("error.permission.canNotPerform");
                        }
                    }

                },true)



            }
        };
    }])
    .directive('selectizeSearch', ['apiData','$q',function (apiData, $q) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<input ng-required="ngrequired" data-parsley-required-message={{required_msg|translate}}' +
            '                    kendo-combo-box\n' +
            '                    class="customCombo"'+
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="cbxtextfield"\n' +
            '                    k-data-value-field="cbxvaluefield"\n' +
            '                    k-filter="\'contains\'"\n' +
            '                    k-auto-bind="true"\n' +
            '                    k-min-length="3"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ChooseValue"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </input>',
            scope: {
                cbxplaceholder: '=',
                cbxtextfield: '=',
                cbxvaluefield: '=',
                api: '=',
                //key: '='
                size: '=',
                scopecontroller: '=',
                ngmodel : '=',
                ngrequired: '=',
                customsearch: '='
            },
            link: function(scope, element, attrs) {
                scope.required_msg='admin.messages.required'
                scope.loadData = function () {
                    // console.log('load data default');
                    scope.DataSource = {
                        serverFiltering: true,
                        transport: {
                            read: function (options) {
                                //console.log(options);
                                var fieldSearch = angular.isDefined(scope.customsearch) ? scope.customsearch : scope.cbxtextfield;
                                apiData.getCbxSearch(options, scope.api, fieldSearch, scope.size).then(function (data) {
                                    options.success(data);
                                })
                            }
                        }
                    };
                }
                scope.loadData();

                scope.ChooseValue = null;
                scope.selectValue = function () {
                    // console.log(scope.ChooseValue);
                    if(angular.isDefined(scope.ChooseValue) && scope.ChooseValue != null){
                        scope.ngmodel = scope.ChooseValue.id;
                    }
                }
            }
        };
    }])
    .directive('selectizeSearchEdit', ['apiData','$q',function (apiData, $q) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<input ng-required="ngrequired" data-parsley-required-message={{required_msg|translate}}' +
            '                    kendo-combo-box\n' +
            '                    class="customCombo"'+
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="cbxtextfield"\n' +
            '                    k-data-value-field="cbxvaluefield"\n' +
            '                    k-filter="\'contains\'"\n' +
            '                    k-auto-bind="true"\n' +
            '                    k-min-length="3"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ChooseValue"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </input>',
            scope: {
                cbxplaceholder: '=',
                cbxtextfield: '=',
                cbxvaluefield: '=',
                api: '=',
                //key: '='
                size: '=',
                scopecontroller: '=',
                ngmodel : '=',
                ngrequired: '=',
                customsearch: '=',
                indexCbx: '=',
                indexNgModel: '=',
                cbxObject: '='
            },
            link: function(scope, element, attrs) {
                scope.required_msg='admin.messages.required'
                scope.DataSource = []

                scope.$watch('ngmodel', function(newval) {
                    scope.loadData = function () {
                        scope.DataSource = {
                            serverFiltering: true,
                            transport: {
                                read: function (options) {
                                    var fieldSearch = angular.isDefined(scope.customsearch) ? scope.customsearch : scope.cbxtextfield;
                                    apiData.getCbxSearch(options, scope.api, fieldSearch, scope.size,scope.ngmodel).then(function (data) {
                                        options.success(data);
                                    })
                                }
                            }
                        };
                    }
                    scope.loadData();
                    scope.ChooseValue = {id:scope.ngmodel}
                })


                scope.selectValue = function () {
                    //console.log(scope.indexCbx)
                    //console.log(scope.scopecontroller)
                    if(angular.isDefined(scope.ChooseValue) && scope.ChooseValue != null){
                        scope.ngmodel = scope.ChooseValue.id;
                        if(angular.isDefined(scope.indexCbx)) scope.cbxObject.indexCbx = scope.indexCbx;
                        if(angular.isDefined(scope.indexNgModel)) {
                            //console.log(scope.indexNgModel)
                            scope.indexNgModel = scope.indexCbx;
                            scope.cbxObject.ngModel = scope.ChooseValue.id;
                            //console.log(scope.indexNgModel)
                        }
                    } else {
                        scope.ngmodel = null;
                    }
                }
            }
        };
    }])
    .directive('fixedHeader', ['$timeout', function ($timeout){
        return {
            restrict: 'EAC',
            link: function ($scope, $elem, $attrs, $ctrl) {
                var elem = $elem[0];

                // wait for data to load and then transform the table
                $scope.$watch(tableDataLoaded, function(isTableDataLoaded) {
                    if (isTableDataLoaded) {
                        transformTable();
                    }
                });

                function tableDataLoaded() {
                    // first cell in the tbody exists when data is loaded but doesn't have a width
                    // until after the table is transformed
                    var firstCell = elem.querySelector('tbody tr:first-child td:first-child');
                    return firstCell && !firstCell.style.width;
                }

                function transformTable() {
                    // reset display styles so column widths are correct when measured below
                    angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '');

                    // wrap in $timeout to give table a chance to finish rendering
                    $timeout(function () {
                        // set widths of columns
                        angular.forEach(elem.querySelectorAll('tr:first-child th'), function (thElem, i) {

                            var tdElems = elem.querySelector('tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                            var tfElems = elem.querySelector('tfoot tr:first-child td:nth-child(' + (i + 1) + ')');

                            var columnWidth = thElem.offsetWidth;
                            if (tdElems && i >0) {
                                tdElems.style.width = columnWidth  + 'px';
                            }
                            if (thElem && i >0) {
                                thElem.style.width = columnWidth  + 'px';
                            }
                            if (tfElems && i >0) {
                                tfElems.style.width = columnWidth + 'px';
                            }
                        });

                        // set css styles on thead and tbody
                        angular.element(elem.querySelectorAll('thead, tfoot')).css('display', 'block');

                        angular.element(elem.querySelectorAll('tbody')).css({
                            'display': 'block',
                            'height': $attrs.tableHeight || 'inherit',
                            'overflow': 'auto'
                        });

                        // reduce width of last column by width of scrollbar
                        var tbody = elem.querySelector('tbody');
                        var scrollBarWidth = tbody.offsetWidth - tbody.clientWidth;
                        if (scrollBarWidth > 0) {
                            // for some reason trimming the width by 2px lines everything up better
                            scrollBarWidth -= 2;
                            var lastColumn = elem.querySelector('tbody tr:first-child td:last-child');
                            lastColumn.style.width = (lastColumn.offsetWidth - scrollBarWidth) + 'px';
                        }
                    });
                }
            }
        }
    }])

    //number filter
    .directive('numberSliderFilter', [function () {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div style="width: 150px;">\n' +
                    '<div id="ionslider_2" name="ionslider_2" ion-slider ng-model="forms_advanced.ionslider_2" min="{{minValue}}" max="{{maxValue}}" type="double" grid="false" prefix=""></div>\n' +
                    '</div>',
            scope: {
                table: '=',
                column: '=',
                scopeController: '=',
                ngModel: '=',
                minValue: '=',
                maxValue: '='
            },
            link: function(scope, element, attrs) {
                //console.log(scope.minValue)
                //console.log(scope.maxValue)

                scope.forms_advanced = {
                    "ionslider_2": {
                        "from": scope.minValue,
                        "to": scope.maxValue
                    }
                };
                //scope.ngModel = scope.forms_advanced.ionslider_2;

                scope.$watch('forms_advanced.ionslider_2', function(newVal) {
                    //console.log(newVal)

                    if(angular.isDefined(newVal) && newVal != null){
                        scope.ngModel = newVal;
                        if(angular.isDefined(scope.table)) {
                            scope.table.param_filter_list[scope.column] = newVal;
                            scope.scopeController.handleFilter(scope.table.idTable);
                        }
                    } else {
                        var origin  ={
                            "from": scope.minValue,
                            "to": scope.maxValue
                        }
                        scope.ngModel = origin;
                        if(angular.isDefined(scope.table)){
                            scope.table.param_filter_list[scope.column] = origin;
                            scope.scopeController.handleFilter(scope.table.idTable);
                        }
                    }
                }, true);
            }
        };
    }])
    .directive('numberRangeFilter', ['TableMultiple','utils',function (TableMultiple, utils) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div>\n' +
            '\t<input id="number_filter_column" class="filter-table-cell ng-pristine ng-valid ng-empty ng-touched"\n' +
            '\t\t   ng-model="inputValue" type="search" placeholder=" Select number..."\n' +
            '\t\t   style="height: 38px;width: 100%;text-align: center;"\n' +
            '\t\t   ng-click="openModalNumberRange()">\n' +
            '\t<div class="uk-modal uk-open" id="modal_number_range" aria-hidden="false" style="display: block; overflow-y: scroll;" ng-show="EnableShow">\n' +
            '\t\t<div class="uk-modal-dialog" style="top: 22.5px;">\n' +
            '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
            '\t\t\t\t<div class="uk-width-large-1-6">\n' +
            '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 17px;">\n' +
            '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_number_range" icheck ng-model="radio_model" value="radio_1" ng-checked="true"/>\n' +
            '\t\t\t\t\t\t<label class="inline-label">Between</label>\n' +
            '\t\t\t\t\t</p>\n' +
            '\t\t\t\t</div>\n' +
            '\t\t\t\t<div class="uk-width-large-2-6" style="margin-left: -4px;">\n' +
            '\t\t\t\t\t<div class="uk-input-group" style="width: 100%;">\n' +
            // '\t\t\t\t\t\t<label for="uk_dp_start">Start number</label><br>\n' +
            '\t\t\t\t\t\t<div style="padding-top: 3px;">\n' +
            '\t\t\t\t\t\t\t<input type="number" step="0.01" class="md-input" ng-model="ngModelStart" style="width: 100%;" id="number_start" md-input />\n' +
            '\t\t\t\t\t\t</div>\n' +
            '\t\t\t\t\t</div>\n' +
            '\t\t\t\t</div>\n' +
            '\t\t\t\t<div class="uk-width-large-1-6">\n' +
            '\t\t\t\t\t<p style="margin-left: -14px;margin-top: 17px;">\n' +
            '\t\t\t\t\t\t<label class="inline-label">And</label>\n' +
            '\t\t\t\t\t</p>\n' +
            '\t\t\t\t</div>\n' +
            '\t\t\t\t<div class="uk-width-large-2-6" style="margin-left: -55px;">\n' +
            '\t\t\t\t\t<div class="uk-input-group" style="width: 100%;">\n' +
            // '\t\t\t\t\t\t<label for="uk_dp_end">End number</label><br>\n' +
            '\t\t\t\t\t\t<div style="padding-top: 3px;">\n' +
            '\t\t\t\t\t\t\t<input type="number" step="0.01" class="md-input" ng-model="ngModelEnd" style="width: 100%;" id="number_end" md-input />\n' +
            '\t\t\t\t\t\t</div>\n' +
            '\t\t\t\t\t</div>\n' +
            '\t\t\t\t</div>\n' +
            '\t\t\t</div>\n' +
            '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -14px;">\n' +
            '\t\t\t\t<div class="uk-width-large-1-5">\n' +
            '\t\t\t\t\t<p style="margin-left: -27px;margin-top: 5px;">\n' +
            '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_number_equal" icheck ng-model="radio_model" value="radio_2" />\n' +
            '\t\t\t\t\t\t<label class="inline-label">On</label>\n' +
            '\t\t\t\t\t</p>\n' +
            '\t\t\t\t</div>\n' +
            '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -20px;margin-top: -3px;">\n' +
            '\t\t\t\t\t<div class="uk-input-group" style="width: 80%;margin-top: -6px;">\n' +
            '\t\t\t\t\t\t<input type="number" step="0.01" class="md-input" ng-model="ngModelEqual" style="width: 100%;" id="number_equal" md-input />\n' +
            '\t\t\t\t\t</div>\n' +
            '\t\t\t\t</div>\n' +
            '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
            '\t\t\t</div>\n' +
            '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
            '\t\t\t\t<div class="uk-width-large-1-5">\n' +
            '\t\t\t\t\t<p style="margin-left: -30px;">\n' +
            '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_number_empty" icheck ng-model="radio_model" value="radio_3" ng-change="chooseEmpty()" />\n' +
            '\t\t\t\t\t\t<label class="inline-label">Is Empty</label>\n' +
            '\t\t\t\t\t</p>\n' +
            '\t\t\t\t</div>\n' +
            '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;"></div>\n' +
            '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
            '\t\t\t</div>\n' +
            '\t\t\t<div class="uk-modal-footer uk-text-right" style="width: 545px;margin-top: -8px;">\n' +
            '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="cancelModalNumberRange()">Cancel</button>\n' +
            '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="clearModalNumberRange()">Clear</button>\n' +
            '\t\t\t\t<button type="button" id="numberApply" class="md-btn md-btn-flat md-btn-flat-primary" ng-click="selectNumberRange()">OK</button>\n' +
            '\t\t\t</div>\n' +
            '\t\t</div>\n' +
            '\t</div>\n' +
            '</div>',
            scope: {
                numberStart: '=',
                numberEnd: '=',
                ngModel: '=',
                //numberMin: '=',
                //numberMax: '=',
                table: '=',
                column: '=',
                scopeController: '=',
                originParams : '='
            },
            link: function(scope, element, attrs) {

                scope.EnableShow = false;

                scope.clear = function () {
                    scope.inputValue = null;
                    scope.ngModelStart = "";
                    scope.ngModelEnd = "";
                    scope.ngModelEqual = "";
                    scope.ngModel = null;
                }
                scope.clear();

                scope.radio_model = null;

                scope.openModalNumberRange = function(){
                    scope.EnableShow = true;
                }
                scope.cancelModalNumberRange = function () {
                    scope.EnableShow = false;
                }
                scope.clearModalNumberRange = function(){
                    scope.clear();
                }
                scope.resetTable = function(){
                    scope.table.param_filter_list[scope.column] = "";
                    scope.scopeController.handleFilter(scope.table.idTable);
                }
                scope.chooseEmpty = function () {
                    //console.log(scope.radio_model)
                    if(scope.radio_model == 'radio_3'){
                        //console.log('set null')
                        scope.inputValue = null;
                        scope.ngModelStart = null;scope.ngModelEnd = null;scope.ngModelEqual = null;
                        scope.numberStart = scope.ngModelStart;
                        scope.numberEnd = scope.ngModelEnd;
                        scope.ngModel = {from:scope.numberStart,to:scope.numberEnd};
                    }else{
                        scope.clear();
                    }
                }
                scope.selectNumberRange = function(){
                    //console.log(scope.radio_model)
                    if(scope.ngModelStart == "" && scope.ngModelEnd == "" && scope.ngModelEqual == ""){
                        if(angular.isDefined(scope.table)) scope.resetTable();
                    }else if(scope.radio_model == null || scope.radio_model == 'radio_1'){
                        if(scope.ngModelStart != null && scope.ngModelEnd != null) {
                            scope.numberStart = scope.ngModelStart;
                            scope.numberEnd = scope.ngModelEnd;
                            scope.inputValue = scope.numberStart.toString() + ' - ' + scope.numberEnd.toString();
                            scope.ngModel = {from:scope.numberStart,to:scope.numberEnd};
                        } else scope.inputValue = null;
                        if(angular.isDefined(scope.table)){
                            if(scope.numberStart == null || scope.numberEnd == null){
                                scope.resetTable();
                            }else{
                                scope.table.param_filter_list[scope.column] = {from:scope.numberStart,to:scope.numberEnd};
                                scope.scopeController.handleFilter(scope.table.idTable);
                            }
                        }
                    }else if(scope.radio_model == 'radio_2'){
                        if(scope.ngModelEqual != null) {
                            scope.numberStart = scope.numberEnd = scope.ngModelEqual;
                            scope.ngModel = {from:scope.numberStart,to:scope.numberEnd};
                            scope.inputValue = scope.numberStart;
                        }else scope.inputValue = null;

                        if(angular.isDefined(scope.table)){
                            if(scope.numberStart == null){
                                scope.resetTable();
                            }else{
                                scope.table.param_filter_list[scope.column] = {from:scope.numberStart,to:scope.numberEnd};
                                scope.scopeController.handleFilter(scope.table.idTable);
                            }
                        }
                    }else if(scope.radio_model == 'radio_3'){
                        if(angular.isDefined(scope.table)){
                            if(scope.numberStart == null){
                                scope.resetTable();
                            }else{
                                scope.table.param_filter_list[scope.column] = null;
                                scope.scopeController.handleFilter(scope.table.idTable);
                            }
                        }
                    }
                    scope.EnableShow = false;
                }

                /*scope.$watch('ngModelStart', function(newVal) {
                    console.log(kendo.toString(newVal,"yyyy-MM-dd HH:mm:ss"))
                }, true);*/
            }
        };
    }])
    .directive('stateTransfer', ['apiData','TableMultiple',function (apiData, TableMultiple) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="activeFilter" kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="\'title\'"\n' +
            '                    k-data-value-field="\'value\'"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ngmodel"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </select>',
            scope: {
                cbxplaceholder: '=',
                api: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel : '='
            },
            link: function(scope, element, attrs) {
                data = [
                    {value:'draft',title:'Draft'},
                    {value:'waiting_other',title:'Waiting Another'},
                    {value:'waiting',title:'Waiting'},
                    {value:'ready',title:'Ready'},
                    {value:'done',title:'Done'},
                    {value:'cancelled',title:'Cancelled'}
                ]
                scope.DataSource = data;
                // scope.chooseValue = {value:1, title:"Active"};
                // $timeout(function () {
                //     if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                //         scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                //         scope.scopecontroller.handleFilter(scope.table.idTable);
                //     } else {
                //         scope.table.param_filter_list[scope.column] = "";
                //         TableMultiple.reloadPage(scope.table.idTable);
                //     }
                // });
                // scope.$watch('ngmodel', function() {
                //     if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                //         scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                //         scope.scopecontroller.handleFilter(scope.table.idTable);
                //     } else {
                //         scope.table.param_filter_list[scope.column] = "";
                //         TableMultiple.reloadPage(scope.table.idTable);
                //     }
                // })

                scope.selectValue = function () {
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                        scope.scopecontroller.handleFilter(scope.table.idTable);
                    } else {
                        scope.table.param_filter_list[scope.column] = "";
                        TableMultiple.reloadPage(scope.table.idTable);
                    }
                }
                var fabric = $("#activeFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true)
                    .on("keydown", function(e) {
                        if (e.keyCode === 8) {
                            e.preventDefault();
                        }
                    });
            }
        };
    }])
    .directive('enterKeyPress', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.enterKeyPress);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('scrollDirective',['$timeout', function ($timeout) {
        return {
            restrict: 'EAC',
            replace: true,
            scope: {
                scrollHandle: '&'
            },
            link: function (scope, elm, attr) {
                var raw = elm[0];
                elm.bind('scroll', function () {
                    //scope.curScrollPos = raw.scrollTop;
                    $timeout(function () {
                        //console.log(raw.scrollLeft);
                        scope.scrollHandle({value: raw.scrollLeft});
                        scope.$apply();
                    })

                });
            }
        }
    }])
    .directive('stateTransferDetail', ['apiData','TableMultiple',function (apiData, TableMultiple) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="activeFilter" kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="\'title\'"\n' +
            '                    k-data-value-field="\'value\'"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ngmodel"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </select>',
            scope: {
                cbxplaceholder: '=',
                api: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel : '='
            },
            link: function(scope, element, attrs) {
                data = [
                    {value:'new',title:'New'},
                    {value:'cancelled',title:'Cancelled'},
                    {value:'waiting_another_move',title:'Waiting Another Move'},
                    {value:'waiting_availability',title:'Waiting Availability'},
                    {value:'partial_available',title:'Partial Available'},
                    {value:'available',title:'Available'},
                    {value:'done',title:'Done'}
                ]
                scope.DataSource = data;
                // scope.$watch('ngmodel', function() {
                //     if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                //         scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                //         scope.scopecontroller.handleFilter(scope.table.idTable);
                //     } else {
                //         scope.table.param_filter_list[scope.column] = "";
                //         TableMultiple.reloadPage(scope.table.idTable);
                //     }
                // })

                scope.selectValue = function () {
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                        scope.scopecontroller.handleFilter(scope.table.idTable);
                    } else {
                        scope.table.param_filter_list[scope.column] = "";
                        TableMultiple.reloadPage(scope.table.idTable);
                    }
                }
                var fabric = $("#activeFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true)
                    .on("keydown", function(e) {
                        if (e.keyCode === 8) {
                            e.preventDefault();
                        }
                    });
            }
        };
    }])
    .directive('columnOption', ['apiData','TableMultiple',function (apiData, TableMultiple) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div class="uk-button-dropdown " data-uk-dropdown="{mode:\'click\'}">' +
                      '<button class="md-btn md-btn-small custom-btn-type">Columns <i class="uk-icon-caret-down"></i></button>' +
                      '<div class="uk-dropdown uk-dropdown-left uk-dropdown-scrollable" style="min-height: 400px">' +
                      '<label class="container-checkbox">All' +
                      '<input ng-model="checkColumnAll" type="checkbox" checked="checked" ng-change="handleColumn()">' +
                      '<span class="checkmark"></span>' +
                      '</label>'+
                      '<ul class="uk-nav uk-nav-dropdown" ng-repeat="c in myColumns">' +
                      '<li class="checkbox-padding-left">' +
                      '<label ng-class="checkboxType">{{c}}' +
                      '<input ng-model=myColumnsShow[$index] type="checkbox" checked="checked" ng-change="handleColumn()">' +
                      '<span class="checkmark"></span>' +
                      '</label></li> </ul> </div> </div>',
            scope: {
                myColumns: '=',
                defaultColumn: '=',
                defaultSetting: '=',
                checkColumnAll: '=',
                checkboxType: '=',
                myColumnsShow: '=',
            },
            link: function(scope, element, attrs) {
                scope.checkboxType = "container-checkbox";
                scope.checkColumnAll = false;
                if(window.localStorage.getItem(scope.defaultSetting) !=null){
                    scope.myColumnsShow = JSON.parse(window.localStorage.getItem(scope.defaultSetting))
                    var checked = 0;
                    for(var i=0; i<scope.myColumnsShow.length; i ++){
                        if (scope.myColumnsShow[i]){
                            checked++;
                        }
                    }
                    if(checked == scope.myColumns.length){
                        scope.checkColumnAll = true;
                        scope.checkboxType = "container-checkbox-dis"
                    }
                } else {
                    for (var i = 0; i < scope.myColumns.length; i++) {
                        scope.myColumnsShow.push(false)
                    }
                    for (var i = 0; i < scope.defaultColumn.length; i++) {
                        scope.myColumnsShow[scope.defaultColumn[i]] = true
                    }
                }
                scope.handleColumn = function handleColumn() {
                    if (scope.checkColumnAll) {
                        for (var i = 0; i < scope.myColumnsShow.length; i++) {
                            scope.myColumnsShow[i] = true
                            scope.checkboxType = "container-checkbox-dis"
                        }
                    } else {
                        scope.checkboxType = "container-checkbox"
                    }
                    window.localStorage.setItem(scope.defaultSetting,JSON.stringify(scope.myColumnsShow))
                }

                scope.checkColumn = function () {
                    if (scope.checkColumnAll) {
                        for (var i = 0; i < scope.myColumnsShow.length; i++) {
                            scope.myColumnsShow[i] = true
                            scope.checkboxType = "container-checkbox-dis"
                        }
                    } else {
                        scope.checkboxType = "container-checkbox"
                    }
                    window.localStorage.setItem(scope.defaultSetting,JSON.stringify(scope.myColumnsShow))
                }
            }
        };
    }])
    .directive('columnOptionSortable', ['apiData', '$timeout', function (apiData, $timeout) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div class="uk-button-dropdown " data-uk-dropdown="{mode:\'click\'}">' +
            '<button class="md-btn md-btn-small custom-btn-type">Columns <i class="uk-icon-caret-down"></i></button>' +
            '<div class="uk-dropdown uk-dropdown-left uk-dropdown-scrollable" style="min-height: 400px; min-width: 300px">' +
            '<label class="uk-text-bold" data-translate="inventory.common.list_save_column_order"></label>'+
            '<div class="uk-margin-top" ng-repeat="saveData in listSaveData track by $index">' +
                '<div class="uk-grid">' +
                    '<div class="uk-width-1-10"><input type="checkbox" ng-change="changeSelectedList($index)" ng-init="saveData.isSelected" icheck ng-model="saveData.isSelected" /></div>' +
                    '<div class="uk-width-7-10">' +
                        '<label>{{saveData.name}}</label>' +
                        '<div class="uk-text-small uk-text-italic">{{saveData.otherName}}</div>' +
                    '</div>' +
                    '<div class="uk-width-1-10">' +
                        '<i ng-if="saveData.canDelete" title="Delete" ng-click="removeSaveDataColumn(saveData, $index)" class="material-icons md-24 pointerMouse">delete </i>' +
                        '<i ng-if="!(saveData.canDelete)" title="Delete" class="material-icons md-24 disableMouse">delete </i>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<hr/>'+
            '<div><input type="checkbox" ng-change="checkAllColumn()" name="checkColumnAll" id="checkColumnAll" icheck ng-model="checkColumnAll" />' +
            '&nbsp;&nbsp;<label data-translate="inventory.common.select_all"></label></div>' +
            '<div ng-repeat="c in myColumns" class="uk-margin-top">' +
            '<input ng-disabled="checkColumnAll" type="checkbox" ng-change="handleColumn($index, c)" ng-init="myColumnsShow[$index]" icheck ng-model="myColumnsShow[$index]" />' +
            '&nbsp;&nbsp;<label>{{c}}</label>' +
            '</div>' +
            '<hr/>'+
            '<label class="uk-margin-top uk-text-bold" data-translate="inventory.common.saveCurrentColumn"></label>' +
            '<input placeholder="Input something" ng-model="newColumnOrderSave" type="text" class="md-input ng-isolate-scope md-input-processed"/>' +
            '<div class="uk-margin-top"><input type="checkbox" ng-change="" ng-init="useMyDefault = false" name="useMyDefault" id="useMyDefault" icheck ng-model="useMyDefault" />' +
            '&nbsp;&nbsp;<label data-translate="inventory.common.useMyDefault"></label></div>' +
            '<div class="uk-margin-small-top"><input class="uk-margin-top" type="checkbox" ng-change="" ng-init="publicColumns = false" name="publicColumns" id="publicColumns" icheck ng-model="publicColumns" />' +
            '&nbsp;&nbsp;<label data-translate="inventory.common.public"></label></div>' +
            '<button ng-click="applyColumnOrder()" class="md-btn md-btn-primary md-btn-small md-btn-block uk-margin-top uk-text-center"><span class="uk-text-bold" data-translate="common-ui-element.button.Apply"></span></button>' +
            '</div></div>',
            scope: {
                myColumns: '=',
                myColumnsClone: '=',
                defaultColumn: '=',
                defaultColumnClone: '=',
                checkColumnAll: '=',
                myColumnsShow: '=',
                listSaveData: '=',
                applyColumnOrders: '&',
                changeColumnOrders: '&',
                removeColumnOrders: '&',
                updateFlag: '='
            },
            link: function(scope, element, attrs) {
                scope.initData = function() {
                    scope.checkColumnAll = false;
                    scope.myColumnsShow = [];
                    for (var i = 0; i < scope.myColumns.length; i++) {
                        scope.myColumnsShow.push(false)
                    }
                    var checked = 0;
                    for (var i = 0; i < scope.defaultColumn.length; i++) {
                        scope.myColumnsShow[scope.defaultColumn[i]] = true;
                        checked++;
                    }
                    if(checked == scope.myColumns.length){
                        scope.checkColumnAll = true;
                    }
                }
                scope.initData();

                scope.handleColumn = function handleColumn(index, key) {
                    if(scope.myColumnsShow[index]) {
                        var check = true;
                        for (var i = 0; i < scope.myColumnsShow.length; i++) {
                            if(!scope.myColumnsShow[i]) {
                                check = false;
                                break;
                            }
                        }
                        if(check) {
                            scope.checkColumnAll = true;
                        } else {
                            scope.checkColumnAll = false;
                        }

                        var pos = scope.myColumnsClone.indexOf(key);
                        if(pos > - 1 && scope.defaultColumnClone.indexOf(pos) == -1) {
                            scope.defaultColumnClone.push(pos);
                            scope.defaultColumnClone.sort(function (a, b) {
                                return (a > b) ? 1 : ((b > a) ? -1 : 0);
                            });
                        }
                    } else {
                        scope.checkColumnAll = false;
                        var pos = scope.myColumnsClone.indexOf(key);
                        if(pos > - 1){
                            var removeIndex = scope.defaultColumnClone.indexOf(pos);
                            if(removeIndex > -1) {
                                scope.defaultColumnClone.splice(removeIndex, 1);
                            }
                        }
                    }
                }

                scope.checkAllColumn = function () {
                    for (var i = 0; i < scope.myColumnsShow.length; i++) {
                        scope.myColumnsShow[i] = true;
                    }

                    for(var i = 0; i < scope.myColumns.length; i++) {
                        var key = scope.myColumns[i];
                        var pos = scope.myColumnsClone.indexOf(key);
                        if(pos > - 1 && scope.defaultColumnClone.indexOf(pos) == -1) {
                            scope.defaultColumnClone.push(pos);
                        }
                    }
                    scope.defaultColumnClone.sort(function (a, b) {
                        return (a > b) ? 1 : ((b > a) ? -1 : 0);
                    });
                }

                scope.applyColumnOrder = function() {
                    if(angular.isDefined(scope.applyColumnOrders)) {
                        scope.applyColumnOrders({
                            'newName': scope.newColumnOrderSave,
                            'isDefault': scope.useMyDefault,
                            'isPublic': scope.publicColumns
                        });
                    }
                }

                scope.changeSelectedList = function(index) {
                    if(scope.listSaveData[index].isSelected == false) {
                        $timeout(function () {
                            scope.listSaveData[index].isSelected = true;
                        })
                    } else {
                        for(var i = 0; i < scope.listSaveData.length; i++) {
                            if(i != index) {
                                scope.listSaveData[i].isSelected = false;
                            }
                        }
                        scope.applySelectedData(index);
                    }
                }

                scope.applySelectedData = function(index) {
                    scope.useMyDefault = false;
                    scope.publicColumns = false;

                    var orders = scope.listSaveData[index].columnOrders;
                    orders = orders.replace("[", "");
                    orders = orders.replace("]", "");
                    var columnOrdersArray = orders.split(",").map(Number);

                    var columnShows = scope.listSaveData[index].columnShows;
                    if(columnShows != undefined && columnShows != null) {
                        columnShows = columnShows.replace("[", "");
                        columnShows = columnShows.replace("]", "");
                        scope.defaultColumnClone = columnShows.split(",").map(Number);
                    }

                    var oldShow = [];
                    for(var i = 0; i < scope.defaultColumnClone.length; i++) {
                        oldShow.push(scope.myColumnsClone[scope.defaultColumnClone[i]]);
                    }

                    scope.myColumns = [];
                    scope.defaultColumn = [];
                    for(var i = 0; i < scope.myColumnsClone.length; i++) {
                        scope.myColumns.push(scope.myColumnsClone[columnOrdersArray[i] - 1]);
                        if(oldShow.indexOf(scope.myColumns[i]) > -1)
                            scope.defaultColumn.push(i);
                    }
                    scope.initData();

                    if(angular.isDefined(scope.changeColumnOrders)) {
                        scope.changeColumnOrders({index: index});
                    }
                }

                scope.$watch('updateFlag', function () {
                    scope.initData();
                }, true);

                scope.removeSaveDataColumn = function(saveData, index) {
                    if(angular.isDefined(scope.removeColumnOrders)) {
                        scope.removeColumnOrders({saveData: saveData, index: index});
                    }
                }
            }
        };
    }])
    .directive('columnOptionSortableMultiple', ['apiData', '$timeout', function (apiData, $timeout) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div class="uk-button-dropdown " data-uk-dropdown="{mode:\'click\', pos:\'bottom-right\'}">' +
            '<button class="md-btn md-btn-small custom-btn-type">Columns <i class="uk-icon-caret-down"></i></button>' +
            '<div class="uk-dropdown uk-dropdown-left uk-dropdown-scrollable" style="min-height: 400px; min-width: 300px">' +
            '<label class="uk-text-bold" data-translate="inventory.common.list_save_column_order"></label>'+
            '<div class="uk-margin-top" ng-repeat="saveData in listSaveData track by $index">' +
            '<div class="uk-grid">' +
            '<div class="uk-width-1-10"><input type="checkbox" ng-change="changeSelectedList($index)" ng-init="saveData.isSelected" icheck ng-model="saveData.isSelected" /></div>' +
            '<div class="uk-width-7-10">' +
            '<label>{{saveData.name}}</label>' +
            '<div class="uk-text-small uk-text-italic">{{saveData.otherName}}</div>' +
            '</div>' +
            '<div class="uk-width-1-10">' +
            '<i ng-if="saveData.canDelete" title="Delete" ng-click="removeSaveDataColumn(saveData, $index)" class="material-icons md-24 pointerMouse">delete </i>' +
            '<i ng-if="!(saveData.canDelete)" title="Delete" class="material-icons md-24 disableMouse">delete </i>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<hr/>'+
            '<div><input type="checkbox" ng-change="checkAllColumn()" name="checkColumnAll" id="checkColumnAll" icheck ng-model="checkColumnAll" />' +
            '&nbsp;&nbsp;<label data-translate="inventory.common.select_all"></label></div>' +
            '<div ng-repeat="c in myColumns track by $index" class="uk-margin-top">' +
            '<input ng-disabled="checkColumnAll" type="checkbox" ng-change="handleColumn($index, c)" ng-init="myColumnsShow[$index]" icheck ng-model="myColumnsShow[$index]" />' +
            '&nbsp;&nbsp;<label>{{c}}</label>' +
            '</div>' +
            '<hr/>'+
            '<label class="uk-margin-top uk-text-bold" data-translate="inventory.common.saveCurrentColumn"></label>' +
            '<input placeholder="Input something" ng-model="newColumnOrderSave" type="text" class="md-input ng-isolate-scope md-input-processed"/>' +
            '<div class="uk-margin-top"><input type="checkbox" ng-change="" ng-init="useMyDefault = false" name="useMyDefault" id="useMyDefault" icheck ng-model="useMyDefault" />' +
            '&nbsp;&nbsp;<label data-translate="inventory.common.useMyDefault"></label></div>' +
            '<div class="uk-margin-small-top"><input class="uk-margin-top" type="checkbox" ng-change="" ng-init="publicColumns = false" name="publicColumns" id="publicColumns" icheck ng-model="publicColumns" />' +
            '&nbsp;&nbsp;<label data-translate="inventory.common.public"></label></div>' +
            '<button ng-click="applyColumnOrder()" class="md-btn md-btn-primary md-btn-small md-btn-block uk-margin-top uk-text-center"><span class="uk-text-bold" data-translate="common-ui-element.button.Apply"></span></button>' +
            '</div></div>',
            scope: {
                myColumns: '=',
                myColumnsClone: '=',
                defaultColumn: '=',
                defaultColumnClone: '=',
                checkColumnAll: '=',
                myColumnsShow: '=',
                listSaveData: '=',
                applyColumnOrders: '&',
                changeColumnOrders: '&',
                removeColumnOrders: '&',
                updateFlag: '=',
                tableId: '=',
                columnData: '='
            },
            link: function(scope, element, attrs) {
                scope.initData = function() {
                    scope.checkColumnAll = false;
                    scope.myColumnsShow = [];
                    for (var i = 0; i < scope.myColumns.length; i++) {
                        scope.myColumnsShow.push(false)
                    }
                    var checked = 0;
                    for (var i = 0; i < scope.defaultColumn.length; i++) {
                        scope.myColumnsShow[scope.defaultColumn[i]] = true;
                        checked++;
                    }
                    if(checked == scope.myColumns.length){
                        scope.checkColumnAll = true;
                    }
                }
                scope.initData();

                scope.handleColumn = function handleColumn(index, key) {
                    if(scope.myColumnsShow[index]) {
                        var check = true;
                        for (var i = 0; i < scope.myColumnsShow.length; i++) {
                            if(!scope.myColumnsShow[i]) {
                                check = false;
                                break;
                            }
                        }
                        if(check) {
                            scope.checkColumnAll = true;
                        } else {
                            scope.checkColumnAll = false;
                        }

                        var pos = scope.myColumnsClone.indexOf(key);
                        if(pos > - 1 && scope.defaultColumnClone.indexOf(pos) == -1) {
                            scope.defaultColumnClone.push(pos);
                            scope.defaultColumnClone.sort(function (a, b) {
                                return (a > b) ? 1 : ((b > a) ? -1 : 0);
                            });
                        }
                    } else {
                        scope.checkColumnAll = false;
                        var pos = scope.myColumnsClone.indexOf(key);
                        if(pos > - 1){
                            var removeIndex = scope.defaultColumnClone.indexOf(pos);
                            if(removeIndex > -1) {
                                scope.defaultColumnClone.splice(removeIndex, 1);
                            }
                        }
                    }
                }

                scope.checkAllColumn = function () {
                    for (var i = 0; i < scope.myColumnsShow.length; i++) {
                        scope.myColumnsShow[i] = true;
                    }

                    for(var i = 0; i < scope.myColumns.length; i++) {
                        var key = scope.myColumns[i];
                        var pos = scope.myColumnsClone.indexOf(key);
                        if(pos > - 1 && scope.defaultColumnClone.indexOf(pos) == -1) {
                            scope.defaultColumnClone.push(pos);
                        }
                    }
                    scope.defaultColumnClone.sort(function (a, b) {
                        return (a > b) ? 1 : ((b > a) ? -1 : 0);
                    });
                }

                scope.applyColumnOrder = function() {
                    if(angular.isDefined(scope.applyColumnOrders)) {
                        scope.applyColumnOrders({
                            'newName': scope.newColumnOrderSave,
                            'isDefault': scope.useMyDefault,
                            'isPublic': scope.publicColumns,
                            'table_id': scope.tableId
                        });
                    }
                }

                scope.changeSelectedList = function(index) {
                    if(scope.listSaveData[index].isSelected == false) {
                        $timeout(function () {
                            scope.listSaveData[index].isSelected = true;
                        })
                    } else {
                        for(var i = 0; i < scope.listSaveData.length; i++) {
                            if(i != index) {
                                scope.listSaveData[i].isSelected = false;
                            }
                        }
                        scope.applySelectedData(index);
                    }
                }

                scope.applySelectedData = function(index) {
                    scope.useMyDefault = false;
                    scope.publicColumns = false;

                    var orders = scope.listSaveData[index].columnOrders;
                    orders = orders.replace("[", "");
                    orders = orders.replace("]", "");
                    var columnOrdersArray = orders.split(",").map(Number);

                    var columnShows = scope.listSaveData[index].columnShows;
                    if(columnShows != undefined && columnShows != null) {
                        columnShows = columnShows.replace("[", "");
                        columnShows = columnShows.replace("]", "");
                        scope.defaultColumnClone = columnShows.split(",").map(Number);
                    }

                    var oldShow = [];
                    for(var i = 0; i < scope.defaultColumnClone.length; i++) {
                        oldShow.push(scope.myColumnsClone[scope.defaultColumnClone[i]]);
                    }

                    scope.myColumns = [];
                    scope.defaultColumn = [];
                    for(var i = 0; i < scope.myColumnsClone.length; i++) {
                        scope.myColumns.push(scope.myColumnsClone[columnOrdersArray[i] - 1]);
                        if(oldShow.indexOf(scope.myColumns[i]) > -1)
                            scope.defaultColumn.push(i);
                    }
                    scope.initData();

                    if(angular.isDefined(scope.changeColumnOrders)) {
                        scope.changeColumnOrders({index: index, table_id: scope.tableId});
                    }
                }

                scope.$watch('updateFlag', function () {
                    scope.initData();
                }, true);

                scope.removeSaveDataColumn = function(saveData, index) {
                    if(angular.isDefined(scope.removeColumnOrders)) {
                        scope.removeColumnOrders({saveData: saveData, index: index, table_id: scope.tableId});
                    }
                }
            }
        };
    }])
    .directive('stateFilter', ['apiData','TableMultiple',function (apiData, TableMultiple) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="activeFilter" kendo-combo-box\n' +
            '                    k-placeholder="cbxplaceholder"\n' +
            '                    k-data-text-field="\'title\'"\n' +
            '                    k-data-value-field="\'value\'"\n' +
            '                    k-data-source="DataSource"\n' +
            '                    k-ng-model="ngmodel"\n' +
            '                    k-on-change="selectValue()"\n' +
            '                    style="width:100%;">\n' +
            '            </select>',
            scope: {
                cbxplaceholder: '=',
                api: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                ngmodel : '='
            },
            link: function(scope, element, attrs) {
                data = [
                    {value:true,title:'Private'},
                    {value:false,title:'Public'}
                ]
                scope.DataSource = data;
                // scope.chooseValue = {value:1, title:"Active"};
                // $timeout(function () {
                //     if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                //         scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                //         scope.scopecontroller.handleFilter(scope.table.idTable);
                //     } else {
                //         scope.table.param_filter_list[scope.column] = "";
                //         TableMultiple.reloadPage(scope.table.idTable);
                //     }
                // });
                // scope.$watch('ngmodel', function() {
                //     if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                //         scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                //         scope.scopecontroller.handleFilter(scope.table.idTable);
                //     } else {
                //         scope.table.param_filter_list[scope.column] = "";
                //         TableMultiple.reloadPage(scope.table.idTable);
                //     }
                // })

                scope.selectValue = function () {
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.table.param_filter_list[scope.column] = scope.ngmodel.value;
                        scope.scopecontroller.handleFilter(scope.table.idTable);
                    } else {
                        scope.table.param_filter_list[scope.column] = "";
                        TableMultiple.reloadPage(scope.table.idTable);
                    }
                }
                var fabric = $("#activeFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true)
                    .on("keydown", function(e) {
                        if (e.keyCode === 8) {
                            e.preventDefault();
                        }
                    });
            }
        };
    }])

    //mention
    .directive('mentio', ['mentioUtil', '$document', '$compile', '$log', '$timeout',
        function (mentioUtil, $document, $compile, $log, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    macros: '=mentioMacros',
                    search: '&mentioSearch',
                    select: '&mentioSelect',
                    items: '=mentioItems',
                    typedTerm: '=mentioTypedTerm',
                    altId: '=mentioId',
                    iframeElement: '=mentioIframeElement',
                    requireLeadingSpace: '=mentioRequireLeadingSpace',
                    selectNotFound: '=mentioSelectNotFound',
                    trimTerm: '=mentioTrimTerm',
                    ngModel: '='
                },
                controller: function($scope, $timeout, $attrs) {

                    $scope.query = function (triggerChar, triggerText) {
                        var remoteScope = $scope.triggerCharMap[triggerChar];

                        if ($scope.trimTerm === undefined || $scope.trimTerm) {
                            triggerText = triggerText.trim();
                        }

                        remoteScope.showMenu();

                        remoteScope.search({
                            term: triggerText
                        });

                        remoteScope.typedTerm = triggerText;
                    };

                    $scope.defaultSearch = function(locals) {
                        var results = [];
                        angular.forEach($scope.items, function(item) {
                            if (item.label.toUpperCase().indexOf(locals.term.toUpperCase()) >= 0) {
                                results.push(item);
                            }
                        });
                        $scope.localItems = results;
                    };

                    $scope.bridgeSearch = function(termString) {
                        var searchFn = $attrs.mentioSearch ? $scope.search : $scope.defaultSearch;
                        searchFn({
                            term: termString
                        });
                    };

                    $scope.defaultSelect = function(locals) {
                        return $scope.defaultTriggerChar + locals.item.label;
                    };

                    $scope.bridgeSelect = function(itemVar) {
                        var selectFn = $attrs.mentioSelect ? $scope.select : $scope.defaultSelect;
                        return selectFn({
                            item: itemVar
                        });
                    };

                    $scope.setTriggerText = function(text) {
                        if ($scope.syncTriggerText) {
                            $scope.typedTerm = ($scope.trimTerm === undefined || $scope.trimTerm) ? text.trim() : text;
                        }
                    };

                    $scope.context = function() {
                        if ($scope.iframeElement) {
                            return {iframe: $scope.iframeElement};
                        }
                    };

                    $scope.replaceText = function (text, hasTrailingSpace) {
                        $scope.hideAll();

                        mentioUtil.replaceTriggerText($scope.context(), $scope.targetElement, $scope.targetElementPath,
                            $scope.targetElementSelectedOffset, $scope.triggerCharSet, text, $scope.requireLeadingSpace,
                            hasTrailingSpace);

                        if (!hasTrailingSpace) {
                            $scope.setTriggerText('');
                            angular.element($scope.targetElement).triggerHandler('change');
                            if ($scope.isContentEditable()) {
                                $scope.contentEditableMenuPasted = true;
                                var timer = $timeout(function() {
                                    $scope.contentEditableMenuPasted = false;
                                }, 200);
                                $scope.$on('$destroy', function() {
                                    $timeout.cancel(timer);
                                });
                            }
                        }
                    };

                    $scope.hideAll = function () {
                        for (var key in $scope.triggerCharMap) {
                            if ($scope.triggerCharMap.hasOwnProperty(key)) {
                                $scope.triggerCharMap[key].hideMenu();
                            }
                        }
                    };

                    $scope.getActiveMenuScope = function () {
                        for (var key in $scope.triggerCharMap) {
                            if ($scope.triggerCharMap.hasOwnProperty(key)) {
                                if ($scope.triggerCharMap[key].visible) {
                                    return $scope.triggerCharMap[key];
                                }
                            }
                        }
                        return null;
                    };

                    $scope.selectActive = function () {
                        for (var key in $scope.triggerCharMap) {
                            if ($scope.triggerCharMap.hasOwnProperty(key)) {
                                if ($scope.triggerCharMap[key].visible) {
                                    $scope.triggerCharMap[key].selectActive();
                                }
                            }
                        }
                    };

                    $scope.isActive = function () {
                        for (var key in $scope.triggerCharMap) {
                            if ($scope.triggerCharMap.hasOwnProperty(key)) {
                                if ($scope.triggerCharMap[key].visible) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    $scope.isContentEditable = function() {
                        return ($scope.targetElement.nodeName !== 'INPUT' && $scope.targetElement.nodeName !== 'TEXTAREA');
                    };

                    $scope.replaceMacro = function(macro, hasTrailingSpace) {
                        if (!hasTrailingSpace) {
                            $scope.replacingMacro = true;
                            $scope.timer = $timeout(function() {
                                mentioUtil.replaceMacroText($scope.context(), $scope.targetElement,
                                    $scope.targetElementPath, $scope.targetElementSelectedOffset,
                                    $scope.macros, $scope.macros[macro]);
                                angular.element($scope.targetElement).triggerHandler('change');
                                $scope.replacingMacro = false;
                            }, 300);
                            $scope.$on('$destroy', function() {
                                $timeout.cancel($scope.timer);
                            });
                        } else {
                            mentioUtil.replaceMacroText($scope.context(), $scope.targetElement, $scope.targetElementPath,
                                $scope.targetElementSelectedOffset, $scope.macros, $scope.macros[macro]);
                        }
                    };

                    $scope.addMenu = function(menuScope) {
                        if (menuScope.parentScope && $scope.triggerCharMap.hasOwnProperty(menuScope.triggerChar)) {
                            return;
                        }
                        $scope.triggerCharMap[menuScope.triggerChar] = menuScope;
                        if ($scope.triggerCharSet === undefined) {
                            $scope.triggerCharSet = [];
                        }
                        $scope.triggerCharSet.push(menuScope.triggerChar);
                        menuScope.setParent($scope);
                    };

                    $scope.$on(
                        'menuCreated', function (event, data) {
                            if (
                                $attrs.id !== undefined ||
                                $attrs.mentioId !== undefined
                            )
                            {
                                if (
                                    $attrs.id === data.targetElement ||
                                    (
                                        $attrs.mentioId !== undefined &&
                                        $scope.altId === data.targetElement
                                    )
                                )
                                {
                                    $scope.addMenu(data.scope);
                                }
                            }
                        }
                    );

                    $document.on(
                        'click', function () {
                            if ($scope.isActive()) {
                                $scope.$apply(function () {
                                    $scope.hideAll();
                                });
                            }
                        }
                    );

                    $document.on(
                        'keydown keypress paste', function (event) {
                            var activeMenuScope = $scope.getActiveMenuScope();
                            if (activeMenuScope) {
                                if (event.which === 9 || event.which === 13) {
                                    event.preventDefault();
                                    activeMenuScope.selectActive();
                                }

                                if (event.which === 27) {
                                    event.preventDefault();
                                    activeMenuScope.$apply(function () {
                                        activeMenuScope.hideMenu();
                                    });
                                }

                                if (event.which === 40) {
                                    event.preventDefault();
                                    activeMenuScope.$apply(function () {
                                        activeMenuScope.activateNextItem();
                                    });
                                    activeMenuScope.adjustScroll(1);
                                }

                                if (event.which === 38) {
                                    event.preventDefault();
                                    activeMenuScope.$apply(function () {
                                        activeMenuScope.activatePreviousItem();
                                    });
                                    activeMenuScope.adjustScroll(-1);
                                }

                                if (event.which === 37 || event.which === 39) {
                                    event.preventDefault();
                                }
                            }
                        }
                    );
                },
                link: function (scope, element, attrs) {
                    scope.triggerCharMap = {};

                    scope.targetElement = element;
                    attrs.$set('autocomplete','off');

                    if (attrs.mentioItems) {
                        scope.localItems = [];
                        scope.parentScope = scope;
                        var itemsRef = attrs.mentioSearch ? ' mentio-items="items"' : ' mentio-items="localItems"';

                        scope.defaultTriggerChar = attrs.mentioTriggerChar ? scope.$eval(attrs.mentioTriggerChar) : '@';

                        var html = '<mentio-menu' +
                            ' mentio-search="bridgeSearch(term)"' +
                            ' mentio-select="bridgeSelect(item)"' +
                            itemsRef;

                        if (attrs.mentioTemplateUrl) {
                            html = html + ' mentio-template-url="' + attrs.mentioTemplateUrl + '"';
                        }
                        html = html + ' mentio-trigger-char="\'' + scope.defaultTriggerChar + '\'"' +
                            ' mentio-parent-scope="parentScope"' +
                            '/>';
                        var linkFn = $compile(html);
                        var el = linkFn(scope);

                        element.parent().append(el);

                        scope.$on('$destroy', function() {
                            el.remove();
                        });
                    }

                    if (attrs.mentioTypedTerm) {
                        scope.syncTriggerText = true;
                    }

                    function keyHandler(event) {
                        function stopEvent(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                        }
                        var activeMenuScope = scope.getActiveMenuScope();
                        if (activeMenuScope) {
                            if (event.which === 9 || event.which === 13) {
                                stopEvent(event);
                                activeMenuScope.selectActive();
                                return false;
                            }

                            if (event.which === 27) {
                                stopEvent(event);
                                activeMenuScope.$apply(function () {
                                    activeMenuScope.hideMenu();
                                });
                                return false;
                            }

                            if (event.which === 40) {
                                stopEvent(event);
                                activeMenuScope.$apply(function () {
                                    activeMenuScope.activateNextItem();
                                });
                                activeMenuScope.adjustScroll(1);
                                return false;
                            }

                            if (event.which === 38) {
                                stopEvent(event);
                                activeMenuScope.$apply(function () {
                                    activeMenuScope.activatePreviousItem();
                                });
                                activeMenuScope.adjustScroll(-1);
                                return false;
                            }

                            if (event.which === 37 || event.which === 39) {
                                stopEvent(event);
                                return false;
                            }
                        }
                    }

                    scope.$watch(
                        'iframeElement', function(newValue) {
                            if (newValue) {
                                var iframeDocument = newValue.contentWindow.document;
                                iframeDocument.addEventListener('click',
                                    function () {
                                        if (scope.isActive()) {
                                            scope.$apply(function () {
                                                scope.hideAll();
                                            });
                                        }
                                    }
                                );


                                iframeDocument.addEventListener('keydown', keyHandler, true /*capture*/);

                                scope.$on ( '$destroy', function() {
                                    iframeDocument.removeEventListener ( 'keydown', keyHandler );
                                });
                            }
                        }
                    );

                    scope.$watch(
                        'ngModel',
                        function (newValue) {
                            /*jshint maxcomplexity:14 */
                            /*jshint maxstatements:39 */
                            // yes this function needs refactoring
                            if ((!newValue || newValue === '') && !scope.isActive()) {
                                // ignore while setting up
                                return;
                            }
                            if (scope.triggerCharSet === undefined) {
                                $log.error('Error, no mentio-items attribute was provided, ' +
                                    'and no separate mentio-menus were specified.  Nothing to do.');
                                return;
                            }

                            if (scope.contentEditableMenuPasted) {
                                // don't respond to changes from insertion of the menu content
                                scope.contentEditableMenuPasted = false;
                                return;
                            }

                            if (scope.replacingMacro) {
                                $timeout.cancel(scope.timer);
                                scope.replacingMacro = false;
                            }

                            var isActive = scope.isActive();
                            var isContentEditable = scope.isContentEditable();

                            var mentionInfo = mentioUtil.getTriggerInfo(scope.context(), scope.triggerCharSet,
                                scope.requireLeadingSpace, isActive);

                            if (mentionInfo !== undefined &&
                                (
                                    !isActive ||
                                    (isActive &&
                                        (
                                            /* content editable selection changes to local nodes which
                                            modifies the start position of the selection over time,
                                            just consider triggerchar changes which
                                            will have the odd effect that deleting a trigger char pops
                                            the menu for a previous
                                            trigger char sequence if one exists in a content editable */
                                            (isContentEditable && mentionInfo.mentionTriggerChar ===
                                                scope.currentMentionTriggerChar) ||
                                            (!isContentEditable && mentionInfo.mentionPosition ===
                                                scope.currentMentionPosition)
                                        )
                                    )
                                )
                            )
                            {
                                /** save selection info about the target control for later re-selection */
                                if (mentionInfo.mentionSelectedElement) {
                                    scope.targetElement = mentionInfo.mentionSelectedElement;
                                    scope.targetElementPath = mentionInfo.mentionSelectedPath;
                                    scope.targetElementSelectedOffset = mentionInfo.mentionSelectedOffset;
                                }

                                /* publish to external ngModel */
                                scope.setTriggerText(mentionInfo.mentionText);
                                /* remember current position */
                                scope.currentMentionPosition = mentionInfo.mentionPosition;
                                scope.currentMentionTriggerChar = mentionInfo.mentionTriggerChar;
                                /* perform query */
                                scope.query(mentionInfo.mentionTriggerChar, mentionInfo.mentionText);
                            } else {
                                var currentTypedTerm = scope.typedTerm;
                                scope.setTriggerText('');
                                scope.hideAll();

                                var macroMatchInfo = mentioUtil.getMacroMatch(scope.context(), scope.macros);

                                if (macroMatchInfo !== undefined) {
                                    scope.targetElement = macroMatchInfo.macroSelectedElement;
                                    scope.targetElementPath = macroMatchInfo.macroSelectedPath;
                                    scope.targetElementSelectedOffset = macroMatchInfo.macroSelectedOffset;
                                    scope.replaceMacro(macroMatchInfo.macroText, macroMatchInfo.macroHasTrailingSpace);
                                } else if (scope.selectNotFound && currentTypedTerm && currentTypedTerm !== '') {
                                    var lastScope = scope.triggerCharMap[scope.currentMentionTriggerChar];
                                    if (lastScope) {
                                        // just came out of typeahead state
                                        var text = lastScope.select({
                                            item: {label: currentTypedTerm}
                                        });
                                        if (typeof text.then === 'function') {
                                            /* text is a promise, at least our best guess */
                                            text.then(scope.replaceText);
                                        } else {
                                            scope.replaceText(text, true);
                                        }
                                    }
                                }
                            }
                        }
                    );
                }
            };
        }])
    .directive('mentioMenu', ['mentioUtil', '$rootScope', '$log', '$window', '$document',
        function (mentioUtil, $rootScope, $log, $window, $document) {
            return {
                restrict: 'E',
                scope: {
                    search: '&mentioSearch',
                    select: '&mentioSelect',
                    items: '=mentioItems',
                    triggerChar: '=mentioTriggerChar',
                    forElem: '=mentioFor',
                    parentScope: '=mentioParentScope'
                },
                templateUrl: function(tElement, tAttrs) {
                    return tAttrs.mentioTemplateUrl !== undefined ? tAttrs.mentioTemplateUrl : 'app/layouts/mentio-menu.tpl.html';
                },
                controller: function ($scope) {
                    $scope.visible = false;

                    // callable both with controller (menuItem) and without controller (local)
                    this.activate = $scope.activate = function (item) {
                        $scope.activeItem = item;
                    };

                    // callable both with controller (menuItem) and without controller (local)
                    this.isActive = $scope.isActive = function (item) {
                        return $scope.activeItem === item;
                    };

                    // callable both with controller (menuItem) and without controller (local)
                    this.selectItem = $scope.selectItem = function (item) {
                        var text = $scope.select({
                            item: item
                        });
                        if (typeof text.then === 'function') {
                            /* text is a promise, at least our best guess */
                            text.then($scope.parentMentio.replaceText);
                        } else {
                            $scope.parentMentio.replaceText(text);
                        }
                    };

                    $scope.activateNextItem = function () {
                        var index = $scope.items.indexOf($scope.activeItem);
                        this.activate($scope.items[(index + 1) % $scope.items.length]);
                    };

                    $scope.activatePreviousItem = function () {
                        var index = $scope.items.indexOf($scope.activeItem);
                        this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
                    };

                    $scope.isFirstItemActive = function () {
                        var index = $scope.items.indexOf($scope.activeItem);

                        return index === 0;
                    };

                    $scope.isLastItemActive = function () {
                        var index = $scope.items.indexOf($scope.activeItem);

                        return index === ($scope.items.length - 1);
                    };

                    $scope.selectActive = function () {
                        $scope.selectItem($scope.activeItem);
                    };

                    $scope.isVisible = function () {
                        return $scope.visible;
                    };

                    $scope.showMenu = function () {
                        if (!$scope.visible) {
                            $scope.requestVisiblePendingSearch = true;
                        }
                    };

                    $scope.setParent = function (scope) {
                        $scope.parentMentio = scope;
                        $scope.targetElement = scope.targetElement;
                    };
                },

                link: function (scope, element) {
                    element[0].parentNode.removeChild(element[0]);
                    $document[0].body.appendChild(element[0]);
                    scope.menuElement = element; // for testing

                    if (scope.parentScope) {
                        scope.parentScope.addMenu(scope);
                    } else {
                        if (!scope.forElem) {
                            $log.error('mentio-menu requires a target element in tbe mentio-for attribute');
                            return;
                        }
                        if (!scope.triggerChar) {
                            $log.error('mentio-menu requires a trigger char');
                            return;
                        }
                        // send own scope to mentio directive so that the menu
                        // becomes attached
                        $rootScope.$broadcast('menuCreated',
                            {
                                targetElement : scope.forElem,
                                scope : scope
                            });
                    }

                    angular.element($window).bind(
                        'resize', function () {
                            if (scope.isVisible()) {
                                var triggerCharSet = [];
                                triggerCharSet.push(scope.triggerChar);
                                mentioUtil.popUnderMention(scope.parentMentio.context(),
                                    triggerCharSet, element, scope.requireLeadingSpace);
                            }
                        }
                    );

                    scope.$watch('items', function (items) {
                        if (items && items.length > 0) {
                            scope.activate(items[0]);
                            if (!scope.visible && scope.requestVisiblePendingSearch) {
                                scope.visible = true;
                                scope.requestVisiblePendingSearch = false;
                            }
                        } else {
                            scope.hideMenu();
                        }
                    });

                    scope.$watch('isVisible()', function (visible) {
                        // wait for the watch notification to show the menu
                        if (visible) {
                            var triggerCharSet = [];
                            triggerCharSet.push(scope.triggerChar);
                            mentioUtil.popUnderMention(scope.parentMentio.context(),
                                triggerCharSet, element, scope.requireLeadingSpace);
                        }
                    });

                    scope.parentMentio.$on('$destroy', function () {
                        element.remove();
                    });

                    scope.hideMenu = function () {
                        scope.visible = false;
                        element.css('display', 'none');
                    };

                    scope.adjustScroll = function (direction) {
                        var menuEl = element[0];
                        var menuItemsList = menuEl.querySelector('ul');
                        var menuItem = (menuEl.querySelector('[mentio-menu-item].active') ||
                            menuEl.querySelector('[data-mentio-menu-item].active'));

                        if (scope.isFirstItemActive()) {
                            return menuItemsList.scrollTop = 0;
                        } else if(scope.isLastItemActive()) {
                            return menuItemsList.scrollTop = menuItemsList.scrollHeight;
                        }

                        if (direction === 1) {
                            menuItemsList.scrollTop += menuItem.offsetHeight;
                        } else {
                            menuItemsList.scrollTop -= menuItem.offsetHeight;
                        }
                    };

                }
            };
        }])
    .directive('mentioMenuItem', function () {
        return {
            restrict: 'A',
            scope: {
                item: '=mentioMenuItem'
            },
            require: '^mentioMenu',
            link: function (scope, element, attrs, controller) {

                scope.$watch(function () {
                    return controller.isActive(scope.item);
                }, function (active) {
                    if (active) {
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                });

                element.bind('mouseenter', function () {
                    scope.$apply(function () {
                        controller.activate(scope.item);
                    });
                });

                element.bind('click', function () {
                    controller.selectItem(scope.item);
                    return false;
                });
            }
        };
    })
    .filter('unsafe', function($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    })
    .filter('mentioHighlight', function() {
        function escapeRegexp (queryToEscape) {
            return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        return function (matchItem, query, hightlightClass) {
            if (query) {
                var replaceText = hightlightClass ?
                    '<span class="' + hightlightClass + '">$&</span>' :
                    '<strong>$&</strong>';
                return ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), replaceText);
            } else {
                return matchItem;
            }
        };
    })
;