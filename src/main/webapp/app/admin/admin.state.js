(function(){
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {
        $stateProvider
            .state('admin',{
                parent:'restricted',
                template:"<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('common-ui-element');
                        $translatePartialLoader.addPart('inventory');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('users',{
                parent: 'admin',
                url: '/users',
                templateUrl: 'app/admin/user.home.html',
                controller: 'UserHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.user.list',
                    authorities: ['ROLE_ADMIN', 'priv_base_User_read'], //TODO change role,
                    sideBarMenu: 'admin'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/admin/user.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('users-create',{
                url:'/users/create',
                templateUrl:'app/admin/user.create.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.user.create',
                    authorities:['ROLE_ADMIN', 'priv_base_User_create'],
                    sideBarMenu: 'admin'
                },
                controller: 'UserHomeController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'assets/js/custom/uikit_fileinput.min.js',
                            'app/admin/user.home.controller.js'
                        ]);
                    }]
                }

            })
            .state('users-detail',{
                url:'/users/{userId:[0-9]{1,4}}/detail',
                templateUrl:'app/admin/user.detail.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.user.detail',
                    authorities:['ROLE_ADMIN', 'priv_base_User_read'],
                    sideBarMenu: 'admin'
                },
                controller: 'UserDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/user.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('users-edit',{
                url:'/users/{userId:[0-9]{1,4}}/edit',
                templateUrl:'app/admin/user.edit.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.user.edit',
                    authorities:['ROLE_ADMIN', 'priv_base_User_update', 'priv_base_User_delete'],
                    sideBarMenu: 'admin'
                },
                controller: 'UserEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/user.edit.controller.js',
                            'assets/js/custom/uikit_fileinput.min.js'
                        ]);
                    }]
                }

            })
            .state('privileges',{
                parent: 'admin',
                url: '/privileges',
                templateUrl: 'app/admin/privilege.home.html',
                controller: 'PrivilegeHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.privilege.list',
                    authorities: ['ROLE_ADMIN', 'priv_base_Privilege_read'], //TODO change role,
                    sideBarMenu: 'admin'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/admin/privilege.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('privileges-create',{
                url:'/privileges/create',
                templateUrl:'app/admin/privilege.create.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.privilege.create',
                    authorities:['ROLE_ADMIN', 'priv_base_Privilege_create'],
                    sideBarMenu: 'admin'
                },
                controller: 'PrivilegeHomeController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/privilege.home.controller.js'
                        ]);
                    }]
                }

            })
            .state('privileges-detail',{
                url:'/privileges/{privilegeName}/detail',
                templateUrl:'app/admin/privilege.detail.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.privilege.detail',
                    authorities:['ROLE_ADMIN', 'priv_base_Privilege_read'],
                    sideBarMenu: 'admin'
                },
                controller: 'PrivilegeDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/privilege.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('privileges-edit',{
                url:'/privileges/{privilegeName}/edit',
                templateUrl:'app/admin/privilege.edit.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.privilege.edit',
                    authorities:['ROLE_ADMIN', 'priv_base_Privilege_update', 'priv_base_Privilege_delete'],
                    sideBarMenu: 'admin'
                },
                controller: 'PrivilegeEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/privilege.edit.controller.js'
                        ]);
                    }]
                }

            })
            .state('roles',{
                parent: 'admin',
                url: '/roles',
                templateUrl: 'app/admin/role.home.html',
                controller: 'RoleHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.role.list',
                    authorities: ['ROLE_ADMIN', 'priv_base_Role_read'], //TODO change role,
                    sideBarMenu: 'admin'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/admin/role.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('roles-create',{
                url:'/roles/create',
                templateUrl:'app/admin/role.create.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.role.create',
                    authorities:['ROLE_ADMIN', 'priv_base_Role_create'],
                    sideBarMenu: 'admin'
                },
                controller: 'RoleHomeController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_tree',
                            'app/admin/role.home.controller.js'
                        ]);
                    }]
                }

            })
            .state('roles-detail',{
                url:'/roles/{roleName}/detail',
                templateUrl:'app/admin/role.detail.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.role.detail',
                    authorities:['ROLE_ADMIN', 'priv_base_Role_read'],
                    sideBarMenu: 'admin'
                },
                controller: 'RoleDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_tree',
                            'app/admin/role.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('roles-edit',{
                url:'/roles/{roleName}/edit',
                templateUrl:'app/admin/role.edit.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.role.edit',
                    authorities:['ROLE_ADMIN', 'priv_base_Role_update', 'priv_base_Role_delete'],
                    sideBarMenu: 'admin'
                },
                controller: 'RoleEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_tree',
                            'app/admin/role.edit.controller.js'
                        ]);
                    }]
                }

            })
            .state('students',{
                url:'/students',
                templateUrl:'app/admin/student.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.student',
                    authorities:['ROLE_ADMIN', 'priv_base_Student_update', 'priv_base_Student_delete'],
                    sideBarMenu: 'admin'
                },
                controller: 'StudentController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_tree',
                            'app/admin/student.controller.js'
                        ]);
                    }]
                }
            })
            .state('students-detail',{
                url:'/students/{studentId:[0-9]{1,4}}/detail',
                templateUrl:'app/admin/student.detail.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.student.detail',
                    authorities:['ROLE_ADMIN', 'priv_base_Student_read'],
                    sideBarMenu: 'admin'
                },
                controller: 'StudentDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/student.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('students-create',{
                url:'/students/create',
                templateUrl:'app/admin/student.create.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.student.create',
                    authorities:['ROLE_ADMIN', 'priv_base_Student_create'],
                    sideBarMenu: 'admin'
                },
                controller: 'StudentCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'assets/js/custom/uikit_fileinput.min.js',
                            'app/admin/student.create.controller.js'
                        ]);
                    }]
                }

            })
            .state('students-edit',{
                url:'/students/{studentId:[0-9]{1,4}}/edit',
                templateUrl:'app/admin/student.edit.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.student.edit',
                    authorities:['ROLE_ADMIN', 'priv_base_Student_edit'],
                    sideBarMenu: 'admin'
                },
                controller: 'StudentEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'assets/js/custom/uikit_fileinput.min.js',
                            'app/admin/student.edit.controller.js'
                        ]);
                    }]
                }

            })
    }
})();