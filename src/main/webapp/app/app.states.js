erpApp
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {

            $locationProvider.hashPrefix('');
            $urlRouterProvider.when('/dashboard','/')
                .otherwise("/");
            $stateProvider
            // -- ERROR PAGES --
                .state("error", {
                    url: "/error",
                    templateUrl: 'app/error/error.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit'
                            ]);
                        }]

                    }
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'app/error/404.html',
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'app/error/500.html',
                })
                .state("error.403", {
                    url: "/403",
                    templateUrl: 'app/error/403.html',
                    controller: 'errorCtrl',
                    controllerAs:'vm',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/error/error.controller.js'
                            ]);
                        }]
                    }
                })
            // -- LOGIN PAGE --
                .state("login", {
                    url: "/login",
                    templateUrl: 'app/account/login.html',
                    controller: 'LoginController',
                    controllerAs:'vm',
                    data: {
                        pageTitle: 'global.login'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_iCheck'
                            ]);
                        }],
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                            $translatePartialLoader.addPart('global');
                            return $translate.refresh();
                        }]
                    }
                })
            // -- RESTRICTED --
                .state("restricted", {
                    abstract: true,
                    templateUrl: 'app/layouts/restricted.html',
                    controller: 'RootController',
                    controllerAs:'vm',
                    url:"",
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'app/app.root.controller.js'
                            ]);
                        }],
                        authorize: ['Auth',
                            function (Auth) {
                                return Auth.authorize();
                            }
                        ]
                    }
                })
        }
    ]);
