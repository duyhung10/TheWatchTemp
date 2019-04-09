(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('TableHandleOrderColumn', TableHandleOrderColumn);

    TableHandleOrderColumn.$inject = [];

    function TableHandleOrderColumn($scope) {
        var service = {
            init: init,
            swapFilterColumn: swapFilterColumn,
            compareAndSwapFilter: compareAndSwapFilter,
            handleDragEnd: handleDragEnd,
            sortFirstTime: sortFirstTime
        };

        return service;

        function init(scope) {
            $scope = scope;
        }

        // function to swap two column of filter row
        function swapFilterColumn(from, to) {
            var cols = $("#filterRow").children('td');

            // position range in [0, col.length - 1)
            if( from < cols.length && to < cols.length) {
                if(from < to) {
                    // if beside
                    if(to - from === 1) {
                        cols.eq(from).detach().insertAfter(cols.eq(to));
                    }
                    // not beside
                    else {
                        cols.eq(from).detach().insertBefore(cols.eq(to));
                        cols.eq(to).detach().insertBefore(cols.eq(from + 1));
                    }
                } else {
                    // if beside
                    if(from - to === 1) {
                        cols.eq(to).detach().insertAfter(cols.eq(from));
                    }
                    // not beside
                    else {
                        cols.eq(to).detach().insertBefore(cols.eq(from));
                        cols.eq(from).detach().insertBefore(cols.eq(to + 1));
                    }
                }
            }
        }

        // handle drag columns event
        function handleDragEnd(document) {
            document.ready(function () {
                document.on('dragend',".dragableColumn",function () {
                    // get columns sort order
                    var table_columns = [];
                    $("#dragHeader th").each(function () {
                        var key = $(this).attr("key-drag");
                        if(key != undefined && key != null)
                            table_columns.push(key)
                    })
                    updateColumnData(table_columns)
                });
            });
        }

        // handle new column data after drag event
        function updateColumnData(column_orders) {
            var copyData = angular.copy($scope.columnData);
            var newData = [];
            for(var i = 0; i < column_orders.length; i++) {
                for(var j = 0; j < copyData.length; j++) {
                    if(copyData[j].key == column_orders[i]) {
                        newData.push(copyData[j]);
                        break;
                    }
                }
            }

            compareAndSwapFilter(copyData, newData);
            $scope.columnData = newData;

            var newOrders = [];
            for(var i= 0; i < newData.length; i++) {
                newOrders.push(newData[i].pos);
            }
            if(angular.isDefined($scope.initColumnOption)) {
                $scope.initColumnOption(newOrders.toString());
            }
        }

        // compare and swap filter column if needed
        function compareAndSwapFilter(oldData, newData) {
            if(oldData.length != newData.length)
                return;

            var array_start = [];
            var array_end = [];
            for(var i = 0; i < oldData.length; i++) {
                array_start.push(Number(oldData[i].pos))
                array_end.push(Number(newData[i].pos))
            }

            for(var i = 0; i < array_start.length - 1; i++) {
                if(array_end[i] != array_start[i]) {
                    for(var j = i + 1; j < array_start.length; j++) {
                        if(array_start[j] == array_end[i]) {
                            // console.log("Swap: "+ array_start[i] + " - "+ array_start[j]);
                            if(array_start.indexOf(0) > -1) {
                                swapFilterColumn(array_start.indexOf(array_start[i]), array_start.indexOf(array_start[j]));
                            } else {
                                swapFilterColumn(array_start.indexOf(array_start[i]) + 1, array_start.indexOf(array_start[j]) + 1);
                            }

                            var temp = array_start[i];
                            array_start[i] = array_start[j];
                            array_start[j] = temp;
                            break;
                        }
                    }
                }
            }
        }

        // sort first time
        function sortFirstTime(columnData) {
            var originData = angular.copy(columnData);
            originData.sort(function (a, b) {
                return (a.pos > b.pos) ? 1 : ((b.pos > a.pos) ? -1 : 0);
            });

            compareAndSwapFilter(originData, columnData)
        }
    }
})();
