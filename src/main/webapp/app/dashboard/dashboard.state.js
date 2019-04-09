(function(){
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('masterdata',{
                parent:'restricted',
                template:"<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('masterdata');
                        $translatePartialLoader.addPart('bom');
                        $translatePartialLoader.addPart('common-ui-element');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('inventory');
                        return $translate.refresh();
                    }]
                }
            })
            .state('home',{
                parent: 'masterdata',
                url: '/',
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'masterdata.common.dashboard',
                    authorities: ['ROLE_ADMIN', 'ROLE_USER'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_tree',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/dashboard/dashboard.controller.js'
                        ]);
                    }]
                }
            })
            .state('dashboard',{
                parent: 'masterdata',
                url: '/',
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                params: {
                    from: null
                },
                data: {
                    pageTitle: 'masterdata.common.dashboard',
                    authorities: ['ROLE_ADMIN', 'ROLE_USER'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_tree',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/dashboard/dashboard.controller.js'
                        ]);
                    }]
                }
            })
    }
})();