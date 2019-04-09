(function () {
    'use strict';
    angular
        .module('erpApp')
        .factory('AdvancedFilter', AdvancedFilter);

    AdvancedFilter.$inject = ['$translate', 'apiData', '$http', '$timeout','$sce','User','AlertService', 'ErrorHandle','TableMultiple'];

    function AdvancedFilter($translate, apiData, $http, $timeout,$sce,User,AlertService, ErrorHandle,TableMultiple, $scope) {

        var service = {
            initAdvancedFilter: initAdvancedFilter,
            initModel:initModel,
            sumQuantity:sumQuantity,
            createAdFilter:createAdFilter
        };

        return service;
        function initAdvancedFilter(scope) {
            $scope = scope;
            $scope.modelAdFilter = null;
            $scope.tableAdFilter = null;
            $scope.initFilter = {};
            $scope.defaultFilter = {};
            $scope.customFilterList = {};
            $scope.favoriteFilterList = {};
            $scope.fieldFilter = {};
            $scope.customFilters = {};
            $scope.finalFilter = {};
            $scope.allFilters = {};
            $scope.favorites = {};
            $scope.defaultFavorite = {};
            $scope.currentFavorite = {};
            $scope.isShowSaveFavorite = {};
            $scope.blockModal;
            $scope.groupField = {};
            $scope.groupColumn = {};
            $scope.advancedFirstLoad = {};
            $scope.originCustomParam = {};
            $scope.filterClass = {};
            $scope.favoriteIconStype = {};
            $scope.defaultConfigId = {};
            $scope.orOperation = $translate.instant('masterdata.common.or');
            $scope.andOperation = $translate.instant('masterdata.common.and');

            $scope.transferFields = [
                {value:"originTransferNumber", title:$translate.instant('transfer.column.OriginTransfer'), type:"text",groupValue: false, isGroup : true, isFilter: true},
                {value:"transferNumber", title:$translate.instant('transfer.column.Reference'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"srcLocationId", title:$translate.instant('transfer.column.SourceLocation'), type:"id", model:"Location",originField:"displayName", groupValue: false, isGroup : true, isFilter: true},
                {value:"destLocationId", title:$translate.instant('transfer.column.DestinationLocation'), type:"id", model:"Location",originField:"displayName", groupValue: false, isGroup : true, isFilter: true},
                {value:"partnerId", title:$translate.instant('transfer.column.Partner'), type:"id", model:"Company",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"sourceDocument", title:$translate.instant('transfer.column.SourceDocument'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"backorderOfId", title:$translate.instant('transfer.column.BackorderOf'), type:"id", model:"Transfer",originField:"transferNumber", groupValue: false, isGroup : true, isFilter: true},
                {value:"scheduledDate", title:$translate.instant('transfer.column.ScheduleDate'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"assigneeId", title:$translate.instant('transfer.column.Assignee'), type:"id", model:"User",originField:"email", groupValue: false, isGroup : true, isFilter: true},
                {value:"operationTypeId", title:$translate.instant('transfer.column.OperationType'), type:"id", model:"OperationType",originField:"displayName", groupValue: false, isGroup : true, isFilter: true},
                {value:"routing", title:$translate.instant('transfer.column.routing'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"ownerId", title:$translate.instant('transfer.column.Owner'), type:"id", model:"User",originField:"email", groupValue: false, isGroup : true, isFilter: true},
                {value:"note", title:$translate.instant('transfer.column.note'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"productVersionId", title:$translate.instant('inventory.column.project'), type:"id", model:"ProjectVersion",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scBomId", title:$translate.instant('transfer.column.bom'), type:"id", model:"ScBom",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scPoId", title:$translate.instant('transfer.column.po'), type:"id", model:"ScPo",originField:"orderNo", groupValue: false, isGroup : true, isFilter: true},
                {value:"created", title:$translate.instant('masterdata.column.created'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"updated", title:$translate.instant('masterdata.column.updated'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"createdBy", title:$translate.instant('masterdata.column.createdby'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"updatedBy", title:$translate.instant('masterdata.column.updatedby'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"state", title:$translate.instant('transfer.column.Status'), type:"text", groupValue: false, isGroup : true, isFilter: false}
            ];

            $scope.productMoveFields = [
                {value:"reference", title:$translate.instant('transfer.column.Reference'), type:"text",groupValue: false, isGroup : true, isFilter: true},
                {value:"productName", title:$translate.instant('masterdata.common.Product'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"productDescription", title:$translate.instant('transfer.detail.detail-operation-column.Description'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"internalReference", title:"VNPT ManPN", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"srcLocationName", title:$translate.instant('transfer.detail.detail-operation-column.From'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"destLocationName", title:$translate.instant('transfer.detail.detail-operation-column.To'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"srcPackageNumber", title:$translate.instant('transfer.detail.detail-operation-column.SourcePackage'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"destPackageNumber", title:$translate.instant('transfer.detail.detail-operation-column.DestinationPackage'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"traceNumber", title:$translate.instant('transfer.detail.detail-operation-column.LotSerial'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"reserved", title:$translate.instant('transfer.column.Reserved'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"doneQuantity", title:$translate.instant('transfer.column.Done'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"productVersionId", title:$translate.instant('transfer.column.Project'), type:"id", model:"ProductVersion",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scBomId", title:$translate.instant('transfer.column.bom'), type:"id", model:"ScBom",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scPoId", title:$translate.instant('transfer.column.po'), type:"id", model:"ScPo",originField:"orderNo", groupValue: false, isGroup : true, isFilter: true},
                {value:"created", title:$translate.instant('masterdata.column.created'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"updated", title:$translate.instant('masterdata.column.updated'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"createdBy", title:$translate.instant('masterdata.column.createdby'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"updatedBy", title:$translate.instant('masterdata.column.updatedby'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"state", title:$translate.instant('transfer.column.Status'), type:"text", groupValue: false, isGroup : true, isFilter: false},
                {value:"materialStatus", title:$translate.instant('inventory.column.status'), type:"text", groupValue: false, isGroup : true, isFilter: true}
            ];

            $scope.productMoveReportFields = [
                {value:"reference", title:$translate.instant('transfer.column.Reference'), type:"text",groupValue: false, isGroup : true, isFilter: true},
                {value:"productName", title:$translate.instant('masterdata.common.Product'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"productDescription", title:$translate.instant('transfer.detail.detail-operation-column.Description'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"internalReference", title:"VNPT ManPN", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"srcLocationName", title:$translate.instant('transfer.column.SourceLocation'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"destLocationName", title:$translate.instant('transfer.column.DestinationLocation'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"srcPackageNumber", title:$translate.instant('transfer.detail.detail-operation-column.SourcePackage'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"destPackageNumber", title:$translate.instant('transfer.detail.detail-operation-column.DestinationPackage'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"traceNumber", title:$translate.instant('transfer.detail.detail-operation-column.LotSerial'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"reserved", title:$translate.instant('transfer.column.Reserved'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"doneQuantity", title:$translate.instant('transfer.column.Done'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"productVersionId", title:$translate.instant('transfer.column.Project'), type:"id", model:"ProductVersion",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scBomId", title:$translate.instant('transfer.column.bom'), type:"id", model:"ScBom",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scPoId", title:$translate.instant('transfer.column.po'), type:"id", model:"ScPo",originField:"orderNo", groupValue: false, isGroup : true, isFilter: true},
                {value:"materialStatus", title:$translate.instant('inventory.column.status'), type:"text", groupValue: false, isGroup : false, isFilter: true}
            ];

            $scope.itemsFields = [
                {value:"productName", title:$translate.instant('masterdata.common.Product'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"productDescription", title:$translate.instant('transfer.detail.detail-operation-column.Description'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"internalReference", title:"VNPT ManPN", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"initialQuantity", title:$translate.instant('transfer.detail.operation-column.InitialDemand'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"doneQuantity", title:$translate.instant('transfer.column.Done'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"price", title:$translate.instant('transfer.column.price'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"foc", title:"FOC", type:"number", groupValue: false, isGroup : false, isFilter: true},
            ];

            $scope.stockSummaryFields = [
                {value:"productName", title:$translate.instant('masterdata.common.Product'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"location", title:$translate.instant('masterdata.column.location'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"category", title:$translate.instant('masterdata.common.category'), type:"text", groupValue: false, isGroup : true, isFilter: true}
            ];

            $scope.stockDetailFields = [
                {value:"productName", title:$translate.instant('masterdata.common.Product'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"internalReference", title:"VNPT ManPN", type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"locationName", title:$translate.instant('masterdata.column.location'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"warehouse", title:$translate.instant('masterdata.common.warehouse'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"category", title:$translate.instant('masterdata.common.category'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"packageNumber", title:$translate.instant('masterdata.common.Package'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"project", title:$translate.instant('transfer.column.Project'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"scBom", title:$translate.instant('transfer.column.bom'), type:"text", model:"ScBom",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scPo", title:$translate.instant('transfer.column.po'), type:"text", model:"ScPo",originField:"orderNo", groupValue: false, isGroup : true, isFilter: true},
                {value:"materialStatus", title:'Good/Scrapped', type:"text", groupValue: false, isGroup : true, isFilter: true},
            ];

            $scope.detailsFields = [
                {value:"productName", title:$translate.instant('masterdata.common.Product'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"productDescription", title:$translate.instant('transfer.detail.detail-operation-column.Description'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"internalReference", title:"VNPT ManPN", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"srcLocationName", title:$translate.instant('transfer.detail.detail-operation-column.From'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"destLocationName", title:$translate.instant('transfer.detail.detail-operation-column.To'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"srcPackageNumber", title:$translate.instant('transfer.detail.detail-operation-column.SourcePackage'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"destPackageNumber", title:$translate.instant('transfer.detail.detail-operation-column.DestinationPackage'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"traceNumber", title:$translate.instant('transfer.detail.detail-operation-column.LotSerial'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"reserved", title:$translate.instant('transfer.column.Reserved'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"doneQuantity", title:$translate.instant('transfer.column.Done'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"materialStatus", title:$translate.instant('inventory.column.status'), type:"text", groupValue: false, isGroup : true, isFilter: true}
            ];

            $scope.stockQuantityFields = [
                {value:"productId", title:$translate.instant('masterdata.common.Product'), type:"id", model:"Product",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"internalReference", title:"VNPT ManPN", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"locationId", title:$translate.instant('masterdata.column.location'), type:"id", model:"Location",originField:"displayName", groupValue: false, isGroup : true, isFilter: true},
                {value:"packageId", title:$translate.instant('masterdata.common.Package'), type:"id", model:"Package",originField:"packageNumber", groupValue: false, isGroup : true, isFilter: true},
                {value:"lotId", title:$translate.instant('transfer.detail.detail-operation-column.LotSerial'), type:"id", model:"Lot",originField:"lotNumber", groupValue: false, isGroup : false, isFilter: true},
                {value:"reserved", title:$translate.instant('transfer.column.Reserved'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"onHand", title:$translate.instant('transfer.column.onhand'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"productVersionId", title:$translate.instant('transfer.column.Project'), type:"id", model:"ProductVersion",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scBomId", title:$translate.instant('transfer.column.bom'), type:"id", model:"ScBom",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"scPoId", title:$translate.instant('transfer.column.po'), type:"id", model:"ScPo",originField:"orderNo", groupValue: false, isGroup : true, isFilter: true},
                {value:"created", title:$translate.instant('masterdata.column.created'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"updated", title:$translate.instant('masterdata.column.updated'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"createdBy", title:$translate.instant('masterdata.column.createdby'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"updatedBy", title:$translate.instant('masterdata.column.updatedby'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"materialStatus", title:$translate.instant('inventory.column.status'), type:"text", groupValue: false, isGroup : true, isFilter: true}
            ];

            $scope.inventoryFields =[
                {value:"name", title: $translate.instant('inventory.column.iName'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"reference", title:$translate.instant('transfer.column.Reference'), type:"text",groupValue: false, isGroup : false, isFilter: true},
                {value:"created", title:$translate.instant('masterdata.column.created'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"updated", title:$translate.instant('masterdata.column.updated'), type:"date", groupValue: false, isGroup : false, isFilter: true},
                {value:"createdBy", title:$translate.instant('masterdata.column.createdby'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"updatedBy", title:$translate.instant('masterdata.column.updatedby'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"assignees", title:$translate.instant('transfer.column.Assignee'), type:"text", model:"User",originField:"email", groupValue: false, isGroup : true, isFilter: true},
                {value:"state", title:$translate.instant('inventory.column.state'), type:"text", groupValue: false, isGroup : true, isFilter: false}
            ];

            $scope.adjustmentInputFields = [
                {value:"productId", title:$translate.instant('masterdata.common.Product'), type:"id", model:"Product",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"manId", title:"VNPT ManPN", type:"special",model:"ProductMan",originField:"internalReference", groupValue: false, isGroup : true, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"packageId", title:$translate.instant('masterdata.common.Package'), type:"id", model:"Package",originField:"packageNumber", groupValue: false, isGroup : true, isFilter: true},
                {value:"traceNumber", title:$translate.instant('transfer.detail.detail-operation-column.LotSerial'), type:"id", model:"Lot",originField:"lotNumber", groupValue: false, isGroup : false, isFilter: true}
            ];

            $scope.adjustmentDetailFields = [
                {value:"productId", title:$translate.instant('masterdata.common.Product'), type:"id", model:"Product",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"internalReference", title:"VNPT ManPN", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"locationId", title:$translate.instant('masterdata.column.location'), type:"id", model:"Location",originField:"displayName", groupValue: false, isGroup : true, isFilter: true},
                {value:"packageId", title:$translate.instant('masterdata.common.Package'), type:"id", model:"Package",originField:"packageNumber", groupValue: false, isGroup : true, isFilter: true},
                {value:"lotId", title:$translate.instant('transfer.detail.detail-operation-column.LotSerial'), type:"id", model:"Lot",originField:"lotNumber", groupValue: false, isGroup : false, isFilter: true},
                {value:"productVersionId", title:$translate.instant('transfer.column.Project'), type:"id", model:"ProductVersion",originField:"name", groupValue: false, isGroup : true, isFilter: true},
                {value:"theoreticalQuantity", title:$translate.instant('masterdata.common.theoretical'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"realQuantity", title:$translate.instant('masterdata.common.real'), type:"number", groupValue: false, isGroup : false, isFilter: true},
                {value:"materialStatus", title:$translate.instant('inventory.column.status'), type:"text", groupValue: false, isGroup : true, isFilter: true}
            ];

            $scope.adjustmentProductMove = [
                {value:"productName", title:$translate.instant('masterdata.common.Product'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"productDescription", title:$translate.instant('transfer.detail.detail-operation-column.Description'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"internalReference", title:"VNPT ManPN", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"manPn", title:"Man P/N", type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"srcLocationName", title:$translate.instant('transfer.column.SourceLocation'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"destLocationName", title:$translate.instant('transfer.column.DestinationLocation'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"srcPackageNumber", title:$translate.instant('transfer.detail.detail-operation-column.SourcePackage'), type:"text", groupValue: false, isGroup : true, isFilter: true},
                {value:"traceNumber", title:$translate.instant('transfer.detail.detail-operation-column.LotSerial'), type:"text", groupValue: false, isGroup : false, isFilter: true},
                {value:"materialStatus", title:$translate.instant('inventory.column.status'), type:"text", groupValue: false, isGroup : true, isFilter: true}
            ];

            $scope.initDefault = function (model) {
                switch (model){
                    case "Transfer":
                        $timeout(function () {
                            $scope.defaultFilter[model] = [
                                {label:"Draft",value:"state==draft",selected:false,specialFilter: true},
                                {label:"Waiting",value:"state==waiting",selected:false,specialFilter: true},
                                {label:"Waiting Other",value:"state==waiting_other",selected:false,specialFilter: true},
                                {label:"Ready",value:"state==ready",selected:false,specialFilter: true},
                                {label:"Done",value:"state==done",selected:false,specialFilter: true},
                                {label:"Cancelled",value:"state==cancelled",selected:false,specialFilter: true},
                                {label:"BackOrder",value:"backorderOfId!=null",selected:false,specialFilter: true},
                                {label:"Return",value:"sourceDocument==*Return*",selected:false,specialFilter: true}
                            ];
                            $scope.filterClass[model] = "uk-width-medium-4-6 custom-border-left";
                            $scope.fieldFilter[model] = $scope.transferFields;
                        })
                        break;
                    case "TransferItem":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.itemsFields;
                        })
                        break;
                    case "TransferDetail":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.detailsFields;
                        })
                        break;
                    case "ProductMove":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.productMoveFields;
                        })
                        break;
                    case "ProductMoveTransferReport":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.productMoveReportFields;
                        })
                        break;
                    case "StockQuant":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.stockQuantityFields;
                        })
                        break;
                    case "StockSummary":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.stockSummaryFields;
                        })
                        break;
                    case "StockDetail":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.stockDetailFields;
                        })
                        break;
                    case "Inventory":
                        $timeout(function () {
                            $scope.defaultFilter[model] = [
                                {label:"Draft",value:"state==draft",selected:false,specialFilter: true},
                                {label:"In Progress",value:"state==in_progress",selected:false,specialFilter: true},
                                {label:"Validated",value:"state==validate",selected:false,specialFilter: true},
                                {label:"Done",value:"state==done",selected:false,specialFilter: true}
                            ];
                            $scope.filterClass[model] = "uk-width-medium-4-6 custom-border-left";
                            $scope.fieldFilter[model] = $scope.inventoryFields;
                        })
                        break;
                    case "AdjustmentInput":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.adjustmentInputFields;
                        })
                        break;
                    case "AdjustmentDetail":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.adjustmentDetailFields;
                        })
                        break;
                    case "AdjustmentProductMove":
                        $timeout(function () {
                            $scope.filterClass[model] = "uk-width-medium-1-1 custom-border-left";
                            $scope.fieldFilter[model] = $scope.adjustmentProductMove;
                            if($scope.state =='done'){
                                $scope.adjustmentProductMove.push({value:"doneQuantity", title:$translate.instant('transfer.detail.operation-column.InitialDemand'), type:"number", groupValue: false, isGroup : false, isFilter: true});
                            } else {
                                $scope.adjustmentProductMove.push({value:"reserved", title:$translate.instant('transfer.detail.operation-column.InitialDemand'), type:"number", groupValue: false, isGroup : false, isFilter: true});
                            }
                        })
                        break;
                }
            };

            $scope.blockUI = function () {
                if($scope.blockModal !=null){
                    $scope.blockModal.hide();
                }
                $scope.blockModal = null;
                $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            }

            $scope.getRemoveFavorites = function (){
                return $http.get('/api/default-configs/get-remove-favorites?userId='+$scope.user.id +'&page=' + $scope.modelAdFilter).then(function(response) {
                    return response.data;
                });
            }

            $scope.loadFilterFromDB = function(){
                getAdFilterGroup($scope.user.id,$scope.modelAdFilter,$scope.objectAdId).then(function (data) {
                    if(data !="" && data.length > 0){
                        for(var i=0; i < data.length; i ++){
                            $scope.customFilterList[$scope.modelAdFilter].push(data[i].advancedFilters);
                        }
                    }
                    $scope.loadFavoriteConfig();
                })
            }

            $scope.getFavorites =  function  (){
                var params = "query=(userId=="+ $scope.user.id +",isPublic==true)" + ";page==" + $scope.modelAdFilter +';objectId=='+ $scope.objectAdId;
                $scope.getRemoveFavorites().then(function (removes) {
                    if(removes.length > 0){
                        params +=";id=out=("+removes+")";
                    }
                    params += "&page=0&size=1000";
                    return $http.get('/api/personal-configs/search?' + params).then(function(response) {
                        $scope.favorites[$scope.modelAdFilter] = response.data;
                        if($scope.defaultConfigId[$scope.modelAdFilter] !=null){
                            for(var i=0; i < $scope.favorites[$scope.modelAdFilter].length; i++){
                                if($scope.favorites[$scope.modelAdFilter][i].id == $scope.defaultConfigId[$scope.modelAdFilter]){
                                    $scope.favorites[$scope.modelAdFilter][i].default =  true;
                                    $scope.defaultFavorite[$scope.modelAdFilter].name = $scope.favorites[$scope.modelAdFilter][i].name;
                                }
                            }
                        }
                    });
                });

            }

            $scope.loadFavoriteConfig = function loadFavoriteConfig(){
                $scope.blockUI();
                $scope.favoriteFilterList[$scope.modelAdFilter] = [];
                var params = '/api/personal-configs/get-default-configs?userId='+ $scope.user.id +'&page=' + $scope.modelAdFilter;
                if($scope.objectAdId !=null){
                    params +='&objectId='+ $scope.objectAdId;
                }
                $http.get(params).then(function(response) {
                    var reload = false;
                    if(angular.isDefined(response.data) && response.data !="" ){
                        $scope.defaultConfigId[$scope.modelAdFilter] = response.data.id;
                        $scope.defaultFavorite[$scope.modelAdFilter] = response.data;
                        $timeout(function () {
                            $scope.favoriteIconStype[$scope.modelAdFilter] = {
                                "color":"#ffca28"
                            };
                        })
                        if(angular.isDefined(response.data.advancedFilterGroups)){
                            var filterGroups = response.data.advancedFilterGroups;
                            for(var i=0; i < filterGroups.length; i++){
                                var filters = filterGroups[i];
                                if(filters.specialFilter){
                                    for(var j=0; j< $scope.defaultFilter[$scope.modelAdFilter].length; j++){
                                        if($scope.defaultFilter[$scope.modelAdFilter][j].label == filters.advancedFilters[0].label){
                                            console.log(filters.advancedFilters[0].selected);
                                            $scope.defaultFilter[$scope.modelAdFilter][j].selected = true;
                                        } else {
                                            $scope.defaultFilter[$scope.modelAdFilter][j].selected = false;
                                        }
                                    }
                                } else {
                                    $scope.favoriteFilterList[$scope.modelAdFilter].push(filters.advancedFilters);
                                }
                            }
                            reload = true;
                        }

                        if(angular.isDefined(response.data.groupField)){
                            var groupField = response.data.groupField;
                            $scope.groupField[$scope.modelAdFilter] = groupField;
                            $scope.TABLES[$scope.tableAdFilter].parent_column = groupField;
                            $scope.TABLES[$scope.tableAdFilter].loadFunction = $scope.loadFunctions[$scope.modelAdFilter].loadGroupFunction;
                            reload = true;
                            for(var i=0; i<$scope.fieldFilter[$scope.modelAdFilter].length; i ++){
                                if($scope.fieldFilter[$scope.modelAdFilter][i].value === groupField){
                                    $scope.fieldFilter[$scope.modelAdFilter][i].groupValue = true;
                                    $scope.groupColumn[$scope.modelAdFilter] = $scope.fieldFilter[$scope.modelAdFilter][i];
                                } else {
                                    $scope.fieldFilter[$scope.modelAdFilter][i].groupValue = false;
                                }
                            }
                        }

                    } else {
                        $timeout(function () {
                            $scope.favoriteIconStype[$scope.modelAdFilter] = {};
                        })
                    }
                    $scope.getFavorites();
                    if(reload){
                        $scope.applyCondition();
                    }

                    if ($scope.blockModal != null){
                        $scope.blockModal.hide();
                    }
                }).catch(function () {
                    if ($scope.blockModal != null){
                        $scope.blockModal.hide();
                    }
                });
            }

            function removeFromCustoms(index){
                if(index < $scope.customFilterList[$scope.modelAdFilter].length){
                    for(var i=index; i < $scope.customFilterList[$scope.modelAdFilter].length; i++){
                        if(angular.isDefined($scope.customFilterList[$scope.modelAdFilter][i][0].id) && $scope.customFilterList[$scope.modelAdFilter][i][0].id !=null){
                            $scope.customFilterList[$scope.modelAdFilter].splice(i,1);
                            break;
                        } else {
                            index ++;
                        }
                    }
                    removeFromCustoms(index);
                }
            }

            $scope.detachFavorite = function(){
                if(angular.isDefined($scope.defaultFavorite[$scope.modelAdFilter].advancedFilterGroups)){
                    var filterGroups = $scope.defaultFavorite[$scope.modelAdFilter].advancedFilterGroups;
                    for(var i=0; i < filterGroups.length; i++){
                        var filters = filterGroups[i];
                        if(filters.specialFilter){
                            for(var j=0; j< $scope.defaultFilter[$scope.modelAdFilter].length; j++){
                                if($scope.defaultFilter[$scope.modelAdFilter][j].label == filters.advancedFilters[0].label){
                                    $scope.defaultFilter[$scope.modelAdFilter][j].selected = false;
                                }
                            }
                        }
                    }
                }
                $scope.favoriteFilterList[$scope.modelAdFilter] = [];
                $scope.defaultConfigId[$scope.modelAdFilter] = null;
                if(angular.isDefined($scope.defaultFavorite[$scope.modelAdFilter].groupField)){
                    var groupField = $scope.defaultFavorite[$scope.modelAdFilter].groupField;
                    if(groupField == $scope.groupField[$scope.modelAdFilter]){
                        for(var i=0; i < $scope.fieldFilter[$scope.modelAdFilter].length; i++ ){
                            if($scope.fieldFilter[$scope.modelAdFilter][i].value == groupField){
                                $scope.fieldFilter[$scope.modelAdFilter][i].groupValue = false;
                                break;
                            }
                        }
                        $scope.groupField[$scope.modelAdFilter] = null;
                        $scope.groupColumn[$scope.modelAdFilter] =null;
                        $scope.TABLES[$scope.tableAdFilter].parent_column = null;
                        $scope.TABLES[$scope.tableAdFilter].loadFunction = $scope.loadFunctions[$scope.modelAdFilter].loadFunction;;
                        $scope.TABLES[$scope.tableAdFilter].param_current_page = 0;
                    }
                }
                $scope.applyCondition();
            }

            //==========================FILTER===============================
            $scope.handleAdvancedFilter = function () {
                $timeout(function () {
                    angular.element("#openFilterModal").trigger("click");
                })
            };

            $scope.selectFilterGroup = function () {
                $scope.applyCondition();
            };

            $scope.selectFilter = function () {
                $scope.applyCondition();
            };

            function genFilterText(filters,type){
                for(var i=0; i < filters[$scope.modelAdFilter].length; i++){
                    var groupFilter  = filters[$scope.modelAdFilter][i];
                    var groupLabel = "";
                    for(var j=0; j < groupFilter.length; j++){
                        if(groupFilter[j].selected){
                            groupLabel += groupLabel==""?groupFilter[j].label:("<b style='color: #bf360c'> "+$scope.orOperation+" </b>" +groupFilter[j].label);
                            groupLabel = $sce.trustAsHtml(groupLabel);
                        }
                    }
                    if(groupLabel !=""){
                        var ff = {
                            index: i,
                            type: type,
                            label: groupLabel
                        }
                        $scope.finalFilter[$scope.modelAdFilter].push(ff);
                    }
                }
            }

            $scope.summaryFilter = function () {
                $scope.finalFilter[$scope.modelAdFilter] = [];
                for(var i=0; i < $scope.defaultFilter[$scope.modelAdFilter].length; i++){
                    if($scope.defaultFilter[$scope.modelAdFilter][i].selected){
                        var ff = {
                            index: i,
                            type: "special",
                            label: $scope.defaultFilter[$scope.modelAdFilter][i].label
                        }
                        $scope.finalFilter[$scope.modelAdFilter].push(ff);
                    }
                }
                genFilterText($scope.customFilterList,"custom");
                genFilterText($scope.favoriteFilterList,"favorite");
            };

            $scope.removeFinalFilter = function (index){
                var ff = $scope.finalFilter[$scope.modelAdFilter][index];
                if(ff.type == "special"){
                    $scope.defaultFilter[$scope.modelAdFilter][ff.index].selected = false;
                } else if(ff.type == "custom") {
                    for(var i =0; i < $scope.customFilterList[$scope.modelAdFilter][ff.index].length; i ++){
                        $scope.customFilterList[$scope.modelAdFilter][ff.index][i].selected = false;
                    }
                } else if(ff.type == "favorite") {
                    for (var i = 0; i < $scope.favoriteFilterList[$scope.modelAdFilter][ff.index].length; i++) {
                        $scope.favoriteFilterList[$scope.modelAdFilter][ff.index][i].selected = false;
                    }
                }
                $scope.applyCondition();
            }

            $scope.applyCondition = function(){
                if(!$scope.advancedFirstLoad[$scope.modelAdFilter]){
                    $scope.originCustomParam[$scope.modelAdFilter] = $scope.TABLES[$scope.tableAdFilter].customParams;
                    $scope.advancedFirstLoad[$scope.modelAdFilter] = true;
                }

                var customFilterGroup = [];
                for(var i = 0; i < $scope.customFilters[$scope.modelAdFilter].length; i++){
                    var cf = $scope.customFilters[$scope.modelAdFilter][i];
                    if(!angular.isDefined(cf.field) || !angular.isDefined(cf.operator)  ){
                        continue;
                    }
                    if(cf.operator != "isNull" && cf.operator != "isNotNull" && !angular.isDefined(cf.value)){
                        continue;
                    }
                    cf.label ="";
                    for(var j =0; j < $scope.fieldFilter[$scope.modelAdFilter].length; j++){
                        if($scope.fieldFilter[$scope.modelAdFilter][j].value == cf.field){
                            cf.label += $scope.fieldFilter[$scope.modelAdFilter][j].title;
                            cf.type = $scope.fieldFilter[$scope.modelAdFilter][j].type;
                            cf.originalField = $scope.fieldFilter[$scope.modelAdFilter][j].originField;
                            cf.specialFilter = false;
                            cf.model = $scope.fieldFilter[$scope.modelAdFilter][j].model;
                            break;
                        }
                    }
                    cf.label += "<b>" + $scope.mapOperation[cf.operator] + "</b>";
                    if(angular.isDefined(cf.value)){
                        cf.label += cf.value;
                    }

                    cf.selected = true;
                    customFilterGroup.push(cf);
                }
                if(customFilterGroup.length > 0){
                    var customFilterGroupCreate = {
                        "specialFilter": false,
                        "advancedFilters": customFilterGroup
                    }
                    createAdFilterGroup($scope.user.id,$scope.modelAdFilter,$scope.objectAdId,customFilterGroupCreate).then(function (data) {
                        $scope.customFilterList[$scope.modelAdFilter].push(data.advancedFilters);
                        $scope.customFilters[$scope.modelAdFilter] =[{placeHolder:" Value"}];
                        $scope.summaryFilter();
                        $scope.runFilter();
                    })
                } else {
                    $scope.customFilters[$scope.modelAdFilter] =[{placeHolder:" Value"}];
                    $scope.summaryFilter();
                    $scope.runFilter();
                }
            }

            $scope.addMoreCondition = function () {
                var cFilter = {placeHolder:" Value"};
                $scope.customFilters[$scope.modelAdFilter].push(cFilter);
            };

            $scope.getAllFilters = function (){
                $scope.allFilters[$scope.modelAdFilter] = [];
                for(var i=0; i<$scope.defaultFilter[$scope.modelAdFilter].length; i ++){
                    if($scope.defaultFilter[$scope.modelAdFilter][i].selected){
                        var groupFilter = [$scope.defaultFilter[$scope.modelAdFilter][i]];
                        $scope.allFilters[$scope.modelAdFilter].push({specialFilter:true,advancedFilters:groupFilter});
                    }
                }

                for(var i=0; i< $scope.customFilterList[$scope.modelAdFilter].length; i++){
                    $scope.allFilters[$scope.modelAdFilter].push({specialFilter:false,advancedFilters:$scope.customFilterList[$scope.modelAdFilter][i]});
                }

                for(var i=0; i< $scope.favoriteFilterList[$scope.modelAdFilter].length; i++){
                    $scope.allFilters[$scope.modelAdFilter].push({specialFilter:false,advancedFilters:$scope.favoriteFilterList[$scope.modelAdFilter][i]});
                }
            }

            $scope.runFilter = function () {
                $scope.getAllFilters($scope.modelAdFilter);
                $http.post('/api/advanced-filters/parse',$scope.allFilters[$scope.modelAdFilter]).then(function (response) {
                    $scope.TABLES[$scope.tableAdFilter].param_current_page = 0;
                    if(response.data.rSql !=null && response.data.rSql !=""){
                        $scope.TABLES[$scope.tableAdFilter].customParams = "(" + response.data.rSql +")";
                        if($scope.originCustomParam[$scope.modelAdFilter] !=""){
                            $scope.TABLES[$scope.tableAdFilter].customParams = $scope.originCustomParam[$scope.modelAdFilter] + ";" + $scope.TABLES[$scope.tableAdFilter].customParams;
                        }
                    } else {
                        $scope.TABLES[$scope.tableAdFilter].customParams = $scope.originCustomParam[$scope.modelAdFilter];
                    }
                    TableMultiple.reloadPageAndPageable($scope.tableAdFilter);
                });

            };

            $scope.selectFilterField = function(index){
                for(var j =0; j < $scope.fieldFilter[$scope.modelAdFilter].length; j++){
                    if($scope.fieldFilter[$scope.modelAdFilter][j].value == $scope.customFilters[$scope.modelAdFilter][index].field){
                        if($scope.fieldFilter[$scope.modelAdFilter][j].type == "date"){
                            $scope.customFilters[$scope.modelAdFilter][index].placeHolder = "ex: 31-02-2018"
                        }
                        break;
                    }
                }
            }

            $scope.selectOperator = function(index){
                if($scope.customFilters[$scope.modelAdFilter][index].operator == "isNull" || $scope.customFilters[$scope.modelAdFilter][index].operator == "isNotNull"){
                    $scope.customFilters[$scope.modelAdFilter][index].noShowInput = true;
                } else {
                    $scope.customFilters[$scope.modelAdFilter][index].noShowInput = false;
                }

            }

            $scope.removeFavoriteFilter = function (outerIndex,innerIndex) {
                $timeout(function () {
                    var reload = $scope.favoriteFilterList[$scope.modelAdFilter][outerIndex][innerIndex].selected;
                    deleteAdFilter($scope.favoriteFilterList[$scope.modelAdFilter][outerIndex][innerIndex].id);
                    $scope.favoriteFilterList[$scope.modelAdFilter][outerIndex].splice(innerIndex, 1);
                    if($scope.favoriteFilterList[$scope.modelAdFilter][outerIndex].length == 0){
                        $scope.favoriteFilterList[$scope.modelAdFilter].splice(outerIndex, 1);
                    }
                    if(reload){
                        $scope.applyCondition();
                    }
                })
            }

            $scope.removeFilter = function (outerIndex,innerIndex) {
                $timeout(function () {
                    var reload = $scope.customFilterList[$scope.modelAdFilter][outerIndex][innerIndex].selected;
                    deleteAdFilter($scope.customFilterList[$scope.modelAdFilter][outerIndex][innerIndex].id);
                    $scope.customFilterList[$scope.modelAdFilter][outerIndex].splice(innerIndex, 1);
                    if($scope.customFilterList[$scope.modelAdFilter][outerIndex].length == 0){
                        $scope.customFilterList[$scope.modelAdFilter].splice(outerIndex, 1);
                    }
                    if(reload){
                        $scope.applyCondition();
                    }
                })
            }

            $scope.removeCustomFilter = function (index) {
                if(index==0){
                    $scope.customFilters[$scope.modelAdFilter][0]= {placeHolder:" Value"};
                } else {
                    $scope.customFilters[$scope.modelAdFilter].splice(index,1)
                }
            }


            $scope.operationFilter = [
                {value:"==", title:$translate.instant('global.common.equal')},
                {value:"!=", title:$translate.instant('global.common.notEqual')},
                {value:">", title:$translate.instant('global.common.greatThan')},
                {value:">=", title:$translate.instant('global.common.greatThanOrEqual')},
                {value:"<", title:$translate.instant('global.common.lessThan')},
                {value:"<=", title:$translate.instant('global.common.lessThanOrEqual')},
                {value:"==*", title:$translate.instant('global.common.beginWith')},
                {value:"*==", title:$translate.instant('global.common.endWith')},
                {value:"==**", title:$translate.instant('global.common.contain')},
                {value:"!=**", title:$translate.instant('global.common.notContain')},
                {value:"=in=", title:$translate.instant('global.common.inList')},
                {value:"=out=", title:$translate.instant('global.common.notInList')},
                {value:"isNotNull", title:$translate.instant('global.common.isNotNull')},
                {value:"isNull", title:$translate.instant('global.common.isNull')}


            ];

            $scope.mapOperation = {
                "==":$translate.instant('global.common.equal'),
                "!=":$translate.instant('global.common.notEqual'),
                ">":$translate.instant('global.common.greatThan'),
                ">=":$translate.instant('global.common.greatThanOrEqual'),
                "<":$translate.instant('global.common.lessThan'),
                "<=":$translate.instant('global.common.lessThanOrEqual'),
                "==*":$translate.instant('global.common.beginWith'),
                "*==":$translate.instant('global.common.endWith'),
                "==**":$translate.instant('global.common.contain'),
                "!=**":$translate.instant('global.common.notContain'),
                "=in=":$translate.instant('global.common.inList'),
                "=out=":$translate.instant('global.common.notInList'),
                "isNotNull":$translate.instant('global.common.isNotNull'),
                "isNull":$translate.instant('global.common.isNull')
            };

            $scope.selectize_filed_config = {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1,
                valueField: 'value',
                labelField: 'title',
                searchField: 'title'
            };

            // =============================GROUP==================================
            $scope.handleAdvancedGroup = function () {
                $timeout(function () {
                    angular.element("#openGroupModal").trigger("click");
                })
            };

            $scope.selectGroupBy = function(index){
                $scope.groupColumn[$scope.modelAdFilter] = $scope.fieldFilter[$scope.modelAdFilter][index];
                if($scope.groupColumn[$scope.modelAdFilter].groupValue){
                    for(var i=0; i < $scope.fieldFilter[$scope.modelAdFilter].length; i++ ){
                        if(i !=index){
                            $scope.fieldFilter[$scope.modelAdFilter][i].groupValue = false;
                        }
                    }
                    $scope.TABLES[$scope.tableAdFilter].parent_column = $scope.groupColumn[$scope.modelAdFilter].value;
                    $scope.groupField[$scope.modelAdFilter] = $scope.groupColumn[$scope.modelAdFilter].value;
                    $scope.TABLES[$scope.tableAdFilter].loadFunction = $scope.loadFunctions[$scope.modelAdFilter].loadGroupFunction;
                    $scope.TABLES[$scope.tableAdFilter].param_current_page = 0;
                    $scope.TABLES[$scope.tableAdFilter].firstLoad = false;
                    TableMultiple.reloadPage($scope.tableAdFilter);

                } else {
                    $scope.groupField[$scope.modelAdFilter] = null;
                    $scope.groupColumn[$scope.modelAdFilter] =null;
                    $scope.TABLES[$scope.tableAdFilter].parent_column = null;
                    $scope.TABLES[$scope.tableAdFilter].loadFunction = $scope.loadFunctions[$scope.modelAdFilter].loadFunction;;
                    $scope.TABLES[$scope.tableAdFilter].param_current_page = 0;
                    TableMultiple.reloadPage($scope.tableAdFilter);
                }
            };

            //==============================FAVORITE===============================

            $scope.handleFavorites = function () {
                $scope.getFavorites();
                $timeout(function () {
                    angular.element("#openFavoriteModal").trigger("click");
                })
            };

            $scope.showSaveFavorite = function (){
                $scope.isShowSaveFavorite[$scope.modelAdFilter] = !$scope.isShowSaveFavorite[$scope.modelAdFilter];
            };

            $scope.getCustomFilterIds = function(){
                var ids = [];
                for(var i=0; i< $scope.customFilterList[$scope.modelAdFilter].length; i++){
                    for(var j=0; j< $scope.customFilterList[$scope.modelAdFilter][i].length; j++){
                        if($scope.customFilterList[$scope.modelAdFilter][i][j].selected){
                            ids.push($scope.customFilterList[$scope.modelAdFilter][i][j].id);
                        }
                    }
                }
                return ids;
            }

            $scope.getSpecialFilters = function (){
                var special ={};
                for(var i=0; i< $scope.defaultFilter[$scope.modelAdFilter].length; i ++){
                    if($scope.defaultFilter[$scope.modelAdFilter][i].selected){
                        special[$scope.defaultFilter[$scope.modelAdFilter][i].label] = true;
                    }
                }
                return special;
            }

            $scope.saveFavorite = function(){
                if(!angular.isDefined($scope.currentFavorite[$scope.modelAdFilter].name) || $scope.currentFavorite[$scope.modelAdFilter].name ==""){
                    AlertService.error("transfer.messages.typeName");
                    return;
                }
                $scope.getAllFilters();
                $scope.currentFavorite[$scope.modelAdFilter].advancedFilterGroups = $scope.allFilters[$scope.modelAdFilter];
                // $scope.currentFavorite[$scope.modelAdFilter].specialFilters = $scope.getSpecialFilters();
                $scope.currentFavorite[$scope.modelAdFilter].userId = $scope.user.id;
                $scope.currentFavorite[$scope.modelAdFilter].email = $scope.user.email;
                $scope.currentFavorite[$scope.modelAdFilter].page = $scope.modelAdFilter;
                $scope.currentFavorite[$scope.modelAdFilter].objectId = $scope.objectAdId;
                $scope.currentFavorite[$scope.modelAdFilter].displayName = $scope.currentFavorite[$scope.modelAdFilter].name + " (" + $scope.user.email +") ";
                if($scope.groupColumn[$scope.modelAdFilter] !=null){
                    $scope.currentFavorite[$scope.modelAdFilter].groupField = $scope.groupColumn[$scope.modelAdFilter].value;
                }
                $scope.currentFavorite[$scope.modelAdFilter].size = parseInt($scope.TABLES[$scope.tableAdFilter].param_page_size);
                createFavorite($scope.currentFavorite[$scope.modelAdFilter]).then(function (favorite) {
                    if($scope.currentFavorite[$scope.modelAdFilter].default){
                        $scope.defaultConfigId[$scope.modelAdFilter] = favorite.id;
                        $timeout(function () {
                            $scope.favoriteIconStype[$scope.modelAdFilter] = {
                                "color":"#ffca28"
                            };
                        })
                    }
                    $scope.getFavorites();
                    $scope.isShowSaveFavorite[$scope.modelAdFilter] = !$scope.isShowSaveFavorite[$scope.modelAdFilter];
                    $scope.currentFavorite[$scope.modelAdFilter] = {};
                })

            };

            $scope.selectFavorite = function(index){
                if($scope.favorites[$scope.modelAdFilter][index].default){
                    $timeout(function () {
                        $scope.favoriteIconStype[$scope.modelAdFilter] = {
                            "color":"#ffca28"
                        };
                    })
                    for (var i=0; i < $scope.favorites[$scope.modelAdFilter].length; i++){
                        if(i != index){
                            $scope.favorites[$scope.modelAdFilter][i].default = false;
                        }
                    }
                    return $http.get('/api/personal-configs/set-default?id=' + $scope.favorites[$scope.modelAdFilter][index].id + '&userId=' + $scope.user.id +'&isDefault=true').then(function() {
                        $scope.loadFavoriteConfig();
                    });
                } else {
                    $scope.detachFavorite();
                    $scope.favoriteIconStype[$scope.modelAdFilter] = {};
                    return $http.get('/api/personal-configs/set-default?id=' + $scope.favorites[$scope.modelAdFilter][index].id + '&userId=' + $scope.user.id +'&isDefault=false').then(function() {

                    });
                }
            };

            $scope.removeFavorite = function(index){
                var favoriteId = $scope.favorites[$scope.modelAdFilter][index].id;
                if($scope.favorites[$scope.modelAdFilter][index].default){
                    $scope.detachFavorite();
                    $timeout(function () {
                        $scope.favoriteIconStype[$scope.modelAdFilter] = {};
                    })
                }
                $scope.favorites[$scope.modelAdFilter].splice(index, 1);
                deleteFavorite(favoriteId).then(function () {
                    $scope.getFavorites();
                })
            };

            function deleteFavorite(id){
                return $http.get('/api/personal-configs/remove?id='+ id +'&userId=' +$scope.user.id).then(function(response) {
                    return response;
                });
            };

            String.prototype.replaceAll = function(search, replacement) {
                var target = this;
                return target.split(search).join(replacement);
            };
        }

        function initModel(scope,model,idTable,objectId) {
            $scope = scope;
            $scope.objectAdId = objectId;
            $scope.modelAdFilter = model;
            $scope.tableAdFilter = idTable;
            if(!angular.isDefined($scope.initFilter[model])){
                $scope.initDefault(model);
                $scope.initFilter[model] = false;
                $scope.defaultFilter[model] = [];
                $scope.customFilterList[model] = [];
                $scope.favoriteFilterList[model] = []
                $scope.fieldFilter[model] =[];
                $scope.customFilters[model] = [{placeHolder:" Value"}];
                $scope.finalFilter[model] = [];
                $scope.allFilters[model] = [];
                $scope.favorites[model] = [];
                $scope.currentFavorite[model] ={};
                $scope.defaultFavorite[model] = {}
                $scope.isShowSaveFavorite[model] = false;
                $scope.groupField[model] =null;
                $scope.groupColumn[model] =null;
                $scope.advancedFirstLoad[model] = false;
                $scope.originCustomParam[model] = "";
                $scope.filterClass[model] = {};
                $scope.favoriteIconStype[model] = {};
                $scope.defaultConfigId[model] = null;
                $scope.initFilter[model] = true;
                //============== LOAD DEFAULT FAVORITE================
                User.current().then(function (data) {
                    $scope.user = data;
                    $scope.loadFilterFromDB();
                }).catch(function () {
                    if ($scope.blockModal != null){
                        $scope.blockModal.hide();
                    }
                });
            } else {
                if ($scope.blockModal != null){
                    $scope.blockModal.hide();
                }
            }
        }

        function sumQuantity (query,model,fieldQuery) {
            return $http.post('/api/advanced-filters/sum-quantity?'+query +"&model=" + model,fieldQuery).then(function(response) {
                return response.data;
            });
        }

        function createAdFilter(adFilter){
            return $http.post('/api/advanced-filters',adFilter).then(function(response) {
                return response.data;
            });
        }

        function deleteAdFilter(id){
            return $http.delete('/api/advanced-filters/'+id).then(function(response) {
                return response;
            });
        };

        function createAdFilterGroup(userId,page,objectId,adFilterGroup){
            var api = '/api/advanced-filters/groups?userId='+userId+'&page='+page;
            if(objectId!=null){
                api += '&objectId='+objectId;
            }
            return $http.post(api,adFilterGroup).then(function(response) {
                return response.data;
            });
        }

        function getAdFilterGroup(userId,page,objectId){
            var api = '/api/advanced-filters/groups?userId='+userId+'&page='+page;
            if(objectId!=null){
                api += '&objectId='+objectId;
            }
            return $http.get(api).then(function(response) {
                return response.data;
            });
        }

        function createFavorite(currentFavorite) {
            return $http.post('/api/personal-configs',currentFavorite).then(function(response) {
                return response.data;
            });
        };

        function deleteDefaultConfig(id){
            return $http.delete('/default-configs/'+id).then(function(response) {
                return response;
            });
        };

    }
})();
