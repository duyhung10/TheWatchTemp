(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('TranslateCommonUI', TranslateCommonUI);

    TranslateCommonUI.$inject = [];

    function TranslateCommonUI($scope) {
        var service = {
            init: init
        };

        return service;

        function init(scopeParam) {
            $scope = scopeParam;

            $scope.button = {
                add: "common-ui-element.button.Add",
                remove: "common-ui-element.button.Remove",
                create: "common-ui-element.button.Create",
                new: "common-ui-element.button.New",
                edit: "common-ui-element.button.Edit",
                back: "common-ui-element.button.Back",
                delete: "common-ui-element.button.Delete",
                save: "common-ui-element.button.Save",
                cancel: "common-ui-element.button.Cancel",
                columns: "common-ui-element.button.Columns",
                filter: "common-ui-element.button.Filter",
                close: "common-ui-element.button.Close",
                clear: "common-ui-element.button.Clear"
            }

            $scope.actionConfirm = {
                delete: "common-ui-element.actionConfirm.Delete"
            }

            $scope.titlePage = {
                home: "common-ui-element.titlePage.Home",
                admin: "common-ui-element.titlePage.Admin",
                setting: "common-ui-element.titlePage.Setting",
                user_permision: "common-ui-element.titlePage.UserAndPermision",
                masterData: "common-ui-element.titlePage.MasterData",
                inventory: "common-ui-element.titlePage.Inventory"
            }
            $scope.manPage = {
                manufacturer: "common-ui-element.ManPage.Manufacturer",
                manufacturerCode: "common-ui-element.ManPage.ManufacturerCode",
                manufacturerName: "common-ui-element.ManPage.ManufacturerName",
                manufacturerAlias: "common-ui-element.ManPage.ManufacturerAlias",
                quanlity: "common-ui-element.ManPage.Quanlity",
                deleteMan: "common-ui-element.ManPage.DeleteMan",
                exportExcel: "common-ui-element.ManPage.ExportExcel",
                importMan: "common-ui-element.ManPage.ImportMan",
                duplicateMan: "common-ui-element.ManPage.DuplicateMan",
                address: "common-ui-element.ManPage.Address",
                description: "common-ui-element.ManPage.Description",
                phone: "common-ui-element.ManPage.Phone",
                fax: "common-ui-element.ManPage.Fax",
                email: "common-ui-element.ManPage.Email"
            }
            $scope.suppPage = {
                supplier: "common-ui-element.SuppPage.Supplier",
                contactName: "common-ui-element.SuppPage.ContactName",
                contactPhone: "common-ui-element.SuppPage.ContactPhone",
                supplierName: "common-ui-element.SuppPage.SupplierName",
                supplierAlias: "common-ui-element.SuppPage.SupplierAlias",
                contactEmail: "common-ui-element.SuppPage.ContactEmail",
                contactPosition: "common-ui-element.SuppPage.ContactPosition",
                contactDescription: "common-ui-element.SuppPage.ContactDescription",
                deleteSup: "common-ui-element.SuppPage.DeleteSup",
                importSup: "common-ui-element.SuppPage.ImportSup",
                duplicateSup: "common-ui-element.SuppPage.DuplicateSup",
                compareSup: "common-ui-element.SuppPage.CompareSup",
                criteriaSup: "common-ui-element.SuppPage.CriteriaSup"
            }

        }
    }
})();
