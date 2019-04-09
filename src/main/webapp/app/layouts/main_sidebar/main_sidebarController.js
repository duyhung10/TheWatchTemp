angular
    .module('erpApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        '$translate', 'JhiLanguageService', 'tmhDynamicLocale','$window',
        function ($timeout,$scope,$rootScope,$translate, JhiLanguageService, tmhDynamicLocale,$window) {
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    if(!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');
                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function() {
                            var $this = $(this);
    
                            $this.attr('title',$this.find('.menu_title').text());
                            UIkit.tooltip($this, {
                                pos: 'right'
                            });
                        });
                    }
                })
            });
    
            // language switcher
            if($window.localStorage.getItem("lang") !=null){
                $scope.langSwitcherModel = $window.localStorage.getItem("lang")
            } else {
                $scope.langSwitcherModel = 'gb';
            }
            var langData = $scope.langSwitcherOptions = [
                {id: 1, title: 'English', value: 'gb'},
                {id: 2, title: 'Tiếng Việt', value: 'vn'}
            ];

            $scope.langSwitcherConfig = {
                maxItems: 1,
                render: {
                    option: function(langData, escape) {
                        return  '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function(langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                onInitialize: function(selectize) {
                    $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly',true);
                },
                onChange: function(value) {
                    var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                    $translate.use(langKey);
                    tmhDynamicLocale.set(langKey);
                    $window.localStorage.setItem("lang",value)
                }
            };
            $scope.$watch('langSwitcherModel', function() {
                var value = $scope.langSwitcherModel;
                var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                $translate.use(langKey);
                tmhDynamicLocale.set(langKey);
            });
    
            // menu entries
            var menu = {
                'admin': [
                    {
                        id: 0,
                        title: 'admin.menu.setting',
                        icon: '&#xE8B8;',
                        submenu: [
                            {
                                title: 'admin.menu.generalSetting'
                            },
                            {
                                title: 'admin.menu.userPermision',
                                submenu: [
                                    {
                                        title: 'admin.menu.users',
                                        link: 'users'
                                    },
                                    {
                                        title: 'admin.menu.roles',
                                        link: 'roles'
                                    },
                                    {
                                        title: 'admin.menu.privileges',
                                        link: 'privileges'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'inventory': [
                    {
                        id: 0,
                        title: 'masterdata.common.dashboard',
                        icon: '&#xE871;',
                        link:'dashboard'
                    }
                ]
            };

            $scope.sections = menu[$rootScope.toState.data.sideBarMenu];
            $rootScope.$on('$stateChangeSuccess', function () {
                $scope.sections = menu[$rootScope.toState.data.sideBarMenu];
            });
        }
    ])
;