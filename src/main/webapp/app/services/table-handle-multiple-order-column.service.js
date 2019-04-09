(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('TableHandleMultipleOrderColumn', TableHandleMultipleOrderColumn);

    TableHandleMultipleOrderColumn.$inject = ['$translate', 'User', 'ColumnOrder', 'ErrorHandle', 'AlertService'];

    function TableHandleMultipleOrderColumn($translate, User, ColumnOrder, ErrorHandle, AlertService, $scope) {
        var service = {
            init: init,
            swapFilterColumn: swapFilterColumn,
            compareAndSwapFilter: compareAndSwapFilter,
            handleDragEnd: handleDragEnd,
            sortFirstTime: sortFirstTime,
            applyColumnOrders: applyColumnOrders,
            changeColumnOrders: changeColumnOrders,
            removeColumnOrders: removeColumnOrders
        };

        return service;

        function init(scope, data) {
            $scope = scope;
            if($scope.COLUMN_HANDLES == null)
                $scope.COLUMN_HANDLES = {};

            var table_id = data.idTable;
            $scope.COLUMN_HANDLES[table_id] = data;
            // console.log($scope.COLUMN_HANDLES[table_id])
            User.current().then(function (data) {
                $scope.COLUMN_HANDLES[table_id].userId = data.id;
                ColumnOrder.getDefaultTable($scope.COLUMN_HANDLES[table_id].userId, $scope.COLUMN_HANDLES[table_id].tableName).then(function (columnData) {
                    if(columnData.columnOrders != undefined) {
                        generateColumnData(columnData.columnOrders, table_id);
                        sortFirstTime($scope.COLUMN_HANDLES[table_id].columnData, table_id);
                        initColumnOptions(columnData.columnOrders, columnData.columnShows, table_id);
                    } else {
                        // if user don't have default setup, then get from default of system
                        ColumnOrder.getDefaultFromSystem($scope.COLUMN_HANDLES[table_id].tableName).then(function (columnData) {
                            if(columnData.columnOrders != undefined) {
                                generateColumnData(columnData.columnOrders, table_id);
                                sortFirstTime($scope.COLUMN_HANDLES[table_id].columnData, table_id);
                                initColumnOptions(columnData.columnOrders, columnData.columnShows, table_id);
                            } else {
                                // if system don't have default setup, oh we forgot to setup :(
                                console.log("We forgot to setup " + $scope.COLUMN_HANDLES[table_id].tableName + " default on system :( !");
                            }
                        }).catch(function(error){
                            ErrorHandle.handleError(error);
                        })
                    }
                }).catch(function(error){
                    ErrorHandle.handleError(error);
                })

                // Get List Available
                ColumnOrder.getList($scope.COLUMN_HANDLES[table_id].userId, $scope.COLUMN_HANDLES[table_id].tableName).then(function (data) {
                    $scope.COLUMN_HANDLES[table_id].listSaveData = data;

                    var checkHasDefaultFromSystem = false;
                    for(var i = 0; i < $scope.COLUMN_HANDLES[table_id].listSaveData.length; i++) {
                        if(!$scope.COLUMN_HANDLES[table_id].listSaveData[i].canDelete) {
                            checkHasDefaultFromSystem = true;
                        }

                        $scope.COLUMN_HANDLES[table_id].listSaveData[i].isSelected = false;
                        if($scope.COLUMN_HANDLES[table_id].listSaveData[i].owner != $scope.COLUMN_HANDLES[table_id].userId) {
                            $scope.COLUMN_HANDLES[table_id].listSaveData[i].otherName = " (From other users)";
                        }
                        if($scope.COLUMN_HANDLES[table_id].listSaveData[i].owner == $scope.COLUMN_HANDLES[table_id].userId && $scope.COLUMN_HANDLES[table_id].listSaveData[i].default) {
                            if($scope.COLUMN_HANDLES[table_id].listSaveData[i].canDelete) {
                                $scope.COLUMN_HANDLES[table_id].listSaveData[i].isSelected = true;
                                $scope.COLUMN_HANDLES[table_id].currentDataSelectIndex = i;
                            }
                        }
                    }

                    ColumnOrder.getDefaultFromSystem($scope.COLUMN_HANDLES[table_id].tableName).then(function (data) {
                        if(!checkHasDefaultFromSystem) {
                            $scope.COLUMN_HANDLES[table_id].listSaveData.unshift(data);
                            $scope.COLUMN_HANDLES[table_id].currentDataSelectIndex++;
                            if($scope.COLUMN_HANDLES[table_id].currentDataSelectIndex == 0) {
                                $scope.COLUMN_HANDLES[table_id].listSaveData[0].isSelected = true;
                            }
                        }

                        if($scope.COLUMN_HANDLES[table_id].currentDataSelectIndex < 0) {
                            $scope.COLUMN_HANDLES[table_id].listSaveData[0].isSelected = true;
                            $scope.COLUMN_HANDLES[table_id].currentDataSelectIndex = 0;
                        }

                        $scope.COLUMN_HANDLES[table_id].listSaveData[0].otherName = "(From system)";
                    }).catch(function(error){
                        ErrorHandle.handleError(error);
                    })
                })
            })
        }

        // function to swap two column of filter row
        function swapFilterColumn(from, to, table_id) {
            var cols = $("#" + table_id + " .filterRow").children('td');

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
                document.on('dragstart',".dragableColumn",function () {
                    var table_id = $( this ).closest('table').attr('id');
                    $scope.COLUMN_HANDLES[table_id].isShowingPreload = true;
                });

                document.on('dragend',".dragableColumn",function () {
                    var table_id = $( this ).closest('table').attr('id');
                    // get columns sort order
                    var table_columns = [];
                    $("#" + table_id + " .dragHeader th").each(function () {
                        var key = $(this).attr("key-drag");
                        if(key != undefined && key != null)
                            table_columns.push(key)
                    })
                    updateColumnData(table_columns, table_id)
                });
            });
        }

        // handle new column data after drag event
        function updateColumnData(column_orders, table_id) {
            //var copyData = angular.copy($scope.columnData);
            var copyData = angular.copy($scope.COLUMN_HANDLES[table_id].columnData);
            var newData = [];
            for(var i = 0; i < column_orders.length; i++) {
                for(var j = 0; j < copyData.length; j++) {
                    if(copyData[j].key == column_orders[i]) {
                        newData.push(copyData[j]);
                        break;
                    }
                }
            }

            compareAndSwapFilter(copyData, newData, table_id);
            //$scope.columnData = newData;
            $scope.COLUMN_HANDLES[table_id].columnData = newData;

            var newOrders = [];
            for(var i= 0; i < newData.length; i++) {
                newOrders.push(newData[i].pos);
            }

            initColumnOptions(newOrders.toString(), null, table_id);
        }

        function generateColumnData(columnOrders, table_id) {
            $scope.COLUMN_HANDLES[table_id].columnData = [];
            columnOrders = columnOrders.replace("[", "");
            columnOrders = columnOrders.replace("]", "");
            var columnOrdersArray = columnOrders.split(",").map(Number);
            for(var i = 0; i < columnOrdersArray.length; i++) {
                var pos = columnOrdersArray[i];
                var hasZero = (columnOrdersArray.indexOf(0) > -1);
                var key = hasZero ? $scope.COLUMN_HANDLES[table_id].myColumns[pos] : $scope.COLUMN_HANDLES[table_id].myColumns[pos - 1];
                var name = hasZero ? $scope.COLUMN_HANDLES[table_id].columnsNameMapping[pos] : $scope.COLUMN_HANDLES[table_id].columnsNameMapping[pos - 1];
                var newData = {
                    'pos': pos,
                    'key': key,
                    'name': name,
                    'dataPriority': pos
                }
                $scope.COLUMN_HANDLES[table_id].columnData.push(newData);
            }
        }

        function applyColumnOrders(newName, isDefault, isPublic, table_id) {
            if(newName == undefined || newName.toString().trim().length == 0) {
                // Save current column order
                if($scope.COLUMN_HANDLES[table_id].listSaveData[$scope.COLUMN_HANDLES[table_id].currentDataSelectIndex].default && !$scope.COLUMN_HANDLES[table_id].listSaveData[$scope.COLUMN_HANDLES[table_id].currentDataSelectIndex].canDelete) {
                    UIkit.modal.alert($translate.instant("inventory.messages.confirmChangeSystemSaveColumnOrder"), {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                    return;
                }

                if($scope.COLUMN_HANDLES[table_id].listSaveData[$scope.COLUMN_HANDLES[table_id].currentDataSelectIndex].owner != $scope.COLUMN_HANDLES[table_id].userId) {
                    UIkit.modal.alert($translate.instant("inventory.messages.confirmChangeSaveColumnOrderOfOtherUser"), {
                        labels: {
                            'Ok': 'Ok'
                        }
                    });
                    return;
                }

                UIkit.modal.confirm($translate.instant("inventory.messages.confirmSaveColumnOrder"), function () {
                    var columnsOrders= [];
                    for(var i = 0; i < $scope.COLUMN_HANDLES[table_id].columnData.length; i++) {
                        columnsOrders.push($scope.COLUMN_HANDLES[table_id].columnData[i].pos);
                    }

                    var updateObject = $scope.COLUMN_HANDLES[table_id].listSaveData[$scope.COLUMN_HANDLES[table_id].currentDataSelectIndex];
                    updateObject.columnOrders = "[" + columnsOrders.toString() + "]";
                    updateObject.columnShows = "[" + $scope.COLUMN_HANDLES[table_id].defaultColumnClone.toString() + "]";
                    updateObject.public = isPublic;
                    updateObject.default = isDefault;

                    $scope.blockUI();
                    ColumnOrder.update(updateObject.id, updateObject).then(function(data){
                        if($scope.blockModal != null)
                            $scope.blockModal.hide();
                        AlertService.success('inventory.messages.saveColumnOrderComplete');
                    }).catch(function(data){
                        if($scope.blockModal != null)
                            $scope.blockModal.hide();
                        //AlertService.error('admin.messages.errorDeleteUser');
                        ErrorHandle.handleError(data)
                    })
                }, {
                    labels: {
                        'Ok': $translate.instant("common-ui-element.button.Apply"),
                        'Cancel': $translate.instant("common-ui-element.button.Cancel")
                    }
                });

            } else {
                // Save new column order
                var newName = newName.toString().replace(/\s+/g, " ");
                ColumnOrder.checkNameExist($scope.COLUMN_HANDLES[table_id].userId, newName, $scope.COLUMN_HANDLES[table_id].tableName).then(function(data){
                    if(data) {
                        AlertService.error('inventory.messages.saveColumnOrderExistName');
                    } else {
                        var columnsOrders= [];
                        for(var i = 0; i < $scope.COLUMN_HANDLES[table_id].columnData.length; i++) {
                            columnsOrders.push($scope.COLUMN_HANDLES[table_id].columnData[i].pos);
                        }

                        var newObject = {
                            "name": newName,
                            "tableName": $scope.COLUMN_HANDLES[table_id].tableName,
                            "owner": $scope.COLUMN_HANDLES[table_id].userId,
                            "columnOrders": "[" + columnsOrders.toString() + "]",
                            "columnShows": "[" + $scope.COLUMN_HANDLES[table_id].defaultColumnClone.toString() + "]",
                            "default": isDefault,
                            "public": isPublic,
                            "canDelete": true
                        };

                        $scope.blockUI();
                        ColumnOrder.create(newObject).then(function(data){
                            if($scope.blockModal != null)
                                $scope.blockModal.hide();
                            location.reload();
                        }).catch(function(data){
                            if($scope.blockModal != null)
                                $scope.blockModal.hide();
                            ErrorHandle.handleError(data)
                        })
                    }
                }).catch(function(data){
                    ErrorHandle.handleError(data)
                })
            }
        }

        function initColumnOptions(columnOrders, columnShows, table_id) {
            columnOrders = columnOrders.replace("[", "");
            columnOrders = columnOrders.replace("]", "");
            var columnOrdersArray = columnOrders.split(",").map(Number);
            var oldShow = [];

            if(columnShows != undefined && columnShows != null) {
                columnShows = columnShows.replace("[", "");
                columnShows = columnShows.replace("]", "");
                $scope.COLUMN_HANDLES[table_id].defaultColumnClone = columnShows.split(",").map(Number);
            }

            for(var i = 0; i < $scope.COLUMN_HANDLES[table_id].defaultColumnClone.length; i++) {
                oldShow.push($scope.COLUMN_HANDLES[table_id].myColumnsClone[$scope.COLUMN_HANDLES[table_id].defaultColumnClone[i]]);
            }

            $scope.COLUMN_HANDLES[table_id].myColumns = [];
            $scope.COLUMN_HANDLES[table_id].defaultColumn = [];
            for(var i = 0; i < $scope.COLUMN_HANDLES[table_id].myColumnsClone.length; i++) {
                $scope.COLUMN_HANDLES[table_id].myColumns.push($scope.COLUMN_HANDLES[table_id].myColumnsClone[columnOrdersArray[i] - 1]);
                if(oldShow.indexOf($scope.COLUMN_HANDLES[table_id].myColumns[i]) > -1)
                    $scope.COLUMN_HANDLES[table_id].defaultColumn.push(i);
            }

            $scope.COLUMN_HANDLES[table_id].updateFlag++;

            $scope.COLUMN_HANDLES[table_id].isShowingPreload = false;
        }

        function changeColumnOrders(index, table_id) {
            var oldData = angular.copy($scope.COLUMN_HANDLES[table_id].columnData);
            generateColumnData($scope.COLUMN_HANDLES[table_id].listSaveData[index].columnOrders, table_id);
            compareAndSwapFilter(oldData, $scope.COLUMN_HANDLES[table_id].columnData, table_id);
            initColumnOptions($scope.COLUMN_HANDLES[table_id].listSaveData[index].columnOrders, $scope.COLUMN_HANDLES[table_id].listSaveData[index].columnShows, table_id);
            $scope.COLUMN_HANDLES[table_id].currentDataSelectIndex = index;
        }

        function removeColumnOrders (saveData, index, table_id) {
            UIkit.modal.confirm($translate.instant("inventory.messages.confirmRemoveColumnOrder"), function () {
                var needReload = false;
                if(saveData.id == $scope.COLUMN_HANDLES[table_id].listSaveData[$scope.COLUMN_HANDLES[table_id].currentDataSelectIndex].id) {
                    needReload = true;
                }

                // If data from other user
                if(saveData.owner != $scope.COLUMN_HANDLES[table_id].userId) {
                    // Delete data of current user only, other users will not be affected
                    if($scope.blockModal != null)
                        $scope.blockModal.hide();

                    var newData = {
                        columnOrderId: saveData.id,
                        userId: $scope.COLUMN_HANDLES[table_id].userId
                    }
                    ColumnOrder.addDataFromOtherUser(newData).then(function(data){
                        if($scope.blockModal != null)
                            $scope.blockModal.hide();
                        AlertService.success('inventory.messages.removeColumnOrderComplete');

                        if(needReload) {
                            setTimeout(function () {
                                location.reload();
                            }, 1000);
                        } else {
                            // re-compute index
                            if(index > -1 && index < $scope.COLUMN_HANDLES[table_id].listSaveData.length) {
                                $scope.COLUMN_HANDLES[table_id].listSaveData.splice(index, 1);
                                if($scope.COLUMN_HANDLES[table_id].currentDataSelectIndex > index) {
                                    $scope.COLUMN_HANDLES[table_id].currentDataSelectIndex--;
                                }
                            }
                        }
                    }).catch(function(data){
                        if($scope.blockModal != null)
                            $scope.blockModal.hide();
                        ErrorHandle.handleError(data)
                    })
                } else {
                    // Delete data of current user
                    $scope.blockUI();
                    ColumnOrder.deleteOne(saveData.id).then(function(data){
                        if($scope.blockModal != null)
                            $scope.blockModal.hide();
                        AlertService.success('inventory.messages.removeColumnOrderComplete');

                        if(needReload) {
                            setTimeout(function () {
                                location.reload();
                            }, 1000);
                        } else {
                            // re-compute index
                            if(index > -1 && index < $scope.COLUMN_HANDLES[table_id].listSaveData.length) {
                                $scope.COLUMN_HANDLES[table_id].listSaveData.splice(index, 1);
                                if($scope.COLUMN_HANDLES[table_id].currentDataSelectIndex > index) {
                                    $scope.COLUMN_HANDLES[table_id].currentDataSelectIndex--;
                                }
                            }
                        }
                    }).catch(function(data){
                        if($scope.blockModal != null)
                            $scope.blockModal.hide();
                        ErrorHandle.handleError(data)
                    })
                }
            }, {
                labels: {
                    'Ok': $translate.instant("common-ui-element.button.Delete"),
                    'Cancel': $translate.instant("common-ui-element.button.Cancel")
                }
            });
        }

        // compare and swap filter column if needed
        function compareAndSwapFilter(oldData, newData, table_id) {
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
                            if($scope.COLUMN_HANDLES[table_id].hasCheckBox) {
                                swapFilterColumn(array_start.indexOf(array_start[i]) + 1, array_start.indexOf(array_start[j]) + 1, table_id);
                            } else {
                                swapFilterColumn(array_start.indexOf(array_start[i]), array_start.indexOf(array_start[j]), table_id);
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
        function sortFirstTime(columnData, table_id) {
            var originData = angular.copy(columnData);
            originData.sort(function (a, b) {
                return (a.pos > b.pos) ? 1 : ((b.pos > a.pos) ? -1 : 0);
            });

            compareAndSwapFilter(originData, columnData, table_id)
        }
    }
})();
