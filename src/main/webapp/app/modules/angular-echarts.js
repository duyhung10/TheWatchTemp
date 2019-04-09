// https://github.com/stanleyxu2005/dashing/blob/master/src/charts/adapter/echarts.js
;'use strict';
angular
    .module('echart', [])
    .directive('echart', function($window, $timeout) {
        return {
            restrict: 'E',
            template: '<div></div>',
            replace: true,
            scope: {
                options: '=',
                data: '='
            },
            link: function(scope, element) {

                if(!scope.data) {
                    console.log('no data provided!');
                    return;
                }

                var options = scope.options,
                    elem0 = element[0];

                var chart = echarts.init(elem0);

                if (options && typeof options === "object") {
                    options.series = scope.data;
                    chart.setOption(options, true);
                }

                scope.$watch('data', function(newData, oldData) {
                    if (oldData != newData) {
                        chart.setOption({
                            series: newData
                        });
                    }
                });

                angular.element(window).on('resize', chart.resize);
                scope.$on('$destroy', function() {
                    angular.element(window).off('resize', chart.resize);
                    chart.dispose();
                    chart = null;
                });

            }
        }
    });