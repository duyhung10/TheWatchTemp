(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('ErrorHandle', ErrorHandle);

    ErrorHandle.$inject = ['AlertService', '$translate'];

    function ErrorHandle(AlertService,$translate) {
        var service = {
            handleError: handleError,
            handleErrors:handleErrors
        };

        return service;

        function handleError(data) {
            var response = data.data;
            if(response != null) {
                var entity = response.entityName;
                var errorKey = response.errorKey;
                var title = response.title;
                if(title == null)
                    title = "Default Message";
                if(entity != null && errorKey != null) {
                    AlertService.error("error." + entity + "." + errorKey);
                } else {
                    AlertService.error(title);
                }
            }

        }

        function handleErrors(data) {
            var msgs = []
            for (var i=0; i< data.length; i++){
                var response = data[i]
                if(response != null) {
                    var entity = response.entityName;
                    var errorKey = response.errorKey;
                    var title = response.title;
                    if(title == null){
                        title = "error.common.referenceError";
                        if (msgs.indexOf(title) == -1){
                            msgs.push(title)
                        }
                    }
                    if(entity != null && errorKey != null) {
                        var msg = "error." + entity + "." + errorKey
                        if (msgs.indexOf(msg) == -1){
                            msgs.push(msg)
                        }
                    }
                }
            }
            var msg_show =''
            for (var i=0;i<msgs.length; i++){
                var msg_t = $translate.instant(msgs[i])
                msg_show +=msg_t +'\n'
            }
            AlertService.error(msg_show);
        }
    }
})();
