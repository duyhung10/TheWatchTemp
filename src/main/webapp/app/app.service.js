erpApp
    .service('detectBrowser', [
        '$window',
        function($window) {
            // http://stackoverflow.com/questions/22947535/how-to-detect-browser-using-angular
            return function() {
                var userAgent = $window.navigator.userAgent,
                    browsers  = {
                        chrome  : /chrome/i,
                        safari  : /safari/i,
                        firefox : /firefox/i,
                        ie      : /internet explorer/i
                    };

                for ( var key in browsers ) {
                    if ( browsers[key].test(userAgent) ) {
                        return key;
                    }
                }
                return 'unknown';
            }
        }
    ])
    .service('preloaders', [
        '$rootScope',
        '$timeout',
        'utils',
        function($rootScope,$timeout,utils) {
            $rootScope.content_preloader_show = function(style,variant,container,width,height) {
                var $body = $('body');
                if(!$body.find('.content-preloader').length) {
                    var image_density = utils.isHighDensity() ? '@2x' : '',
                        width = width ? width : 48,
                        height = height ? height : 48;

                    var preloader_content = (style == 'regular')
                        ? '<img src="assets/img/spinners/spinner' + image_density + '.gif" alt="" width="32" height="32">'
                        : '<div class="md-preloader"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="'+height+'" width="'+width+'" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg></div>';

                    var thisContainer = (typeof container !== 'undefined') ? $(container) : $body;

                    thisContainer.append('<div class="content-preloader content-preloader-'+variant+'" style="height:'+height+'px;width:'+width+'px;margin-left:-'+width/2+'px">' + preloader_content + '</div>');
                    $timeout(function() {
                        $('.content-preloader').addClass('preloader-active');
                    });
                }
            };
            $rootScope.content_preloader_hide = function() {
                var $body = $('body');
                if($body.find('.content-preloader').length) {
                    // hide preloader
                    $('.content-preloader').removeClass('preloader-active');
                    // remove preloader
                    $timeout(function() {
                        $('.content-preloader').remove();
                    }, 500);
                }
            };

        }
    ])
    .factory('apiData', ['$http','$q',
        function($http, $q) {
            var service = {
                getCbxSearchTable : getCbxSearchTable,
                getCbxSearchTableRelated : getCbxSearchTableRelated,
                getAttrById : getAttrById,
                getAttrByKey : getAttrByKey,
                getCbxSearch:getCbxSearch,
                findOne:findOne,
                getData:getData,
                genApi:genApi,
                getFkValue:getFkValue
            };
            return service;

            function getAttrById(url,value,attr) {
                //url = '/api/products/';
                //key = id;
                //value = 1;
                var api = url + value;
                //console.log(api);
                return $http.get(api).then(function (response) {
                    //console.log(response.data);
                    if(angular.isDefined(response.data))
                        return response.data[attr];
                    else
                        return null;
                });
            }

            function getAttrByKey(url,key,value,attr) {
                //url = '/api/products/advanced-search/?query=';
                //key = id;
                //value = id;
                if(angular.isUndefined(value) || value == null) return '';
                var api = url + key + '=in=(' + value.toString() + ')';
                // console.log(api);
                return $http.get(api).then(function (response) {
                    // console.log(response.data[0]);
                    if(angular.isDefined(response.data[0])) return response.data[0][attr]; else return '';
                });
            }

            function getFkValue(field,value) {
                if(angular.isUndefined(value) || value == null) return '';
                return $http.get('/api/personal-configs/get-fk-value?fieldName=' + field + '&fk=' +value).then(function (response) {
                    if(angular.isDefined(response.data.fkValue)) return response.data.fkValue; else return value;
                });
            }

            function getCbxSearchTable(options, api, searchField, size, typefilter, originparams) {
                var query = "/search?query=";
                if(originparams != null && originparams.length > 0){
                    query += originparams;
                }
                if(angular.isDefined(options.data.filter)
                    && options.data.filter.filters.length>0
                    && options.data.filter.filters[0].value.length>0){

                    var searchValue = "\"*"+options.data.filter.filters[0].value+"*\"";
                    /*if (typefilter =="Text"){
                        searchValue = "\"*"+options.data.filter.filters[0].value+"*\"";
                    } else if(typefilter =="Number"){
                        searchValue = options.data.filter.filters[0].value;
                    }*/
                    if(originparams != null && originparams.length > 0)
                        query += ";"+searchField+"=="+searchValue;
                    else
                        query += searchField+"=="+searchValue;
                }
                if(query.length>0)
                    api += query + "&size="+size;
                else
                    api += "&size="+size;
                // console.log(api);
                return $http.get(api).then(function (response) {
                    return response.data;
                });
            }

            function getCbxSearch(options, api, searchField, size,currentId) {
                var query = "/search?query=";
                var url = api
                var filter = false
                if(angular.isDefined(options.data.filter)
                    && options.data.filter.filters.length>0
                    && options.data.filter.filters[0].value.length>0){
                    var searchValue = "\"*"+options.data.filter.filters[0].value+"*\"";
                    query += searchField+"=="+searchValue;
                    filter = true
                }
                if (angular.isDefined(currentId) && currentId!=null){
                    if(filter){
                        url += query + "&size="+size;
                    } else{
                        query += "id!=" +currentId
                        url += query +"&size="+size;
                    }

                    // console.log(api);
                    return $http.get(url).then(function (response) {
                        var data = response.data;
                        return $http.get(api + '/' +currentId).then(function (res) {
                            if(filter){
                                return data
                            }
                            data.push(res.data)
                            return data
                        })

                    });
                } else {
                    if(query.length>0)
                        url += query + "&size="+size;
                    else
                        url += "&size="+size;

                    return $http.get(url).then(function (response) {
                        return response.data;
                    });
                }

            }

            function findOne(api, id) {
                return $http.get(api + '/' +id).then(function (response) {
                    return response.data;
                });
            }

            function getCbxSearchTableRelated(valueSearch, api, searchField, size, typefilter) {
                if(angular.isDefined(valueSearch) && valueSearch != null){
                    /*if (typefilter =="Text"){
                        searchValue = "\"*"+valueSearch+"*\"";
                    }*/
                    var query = "/search?query="+searchField+"=="+valueSearch+"&size="+size;
                    //console.log(query);
                    api = api + query ;
                }
                // console.log(api);
                return $http.get(api).then(function (response) {
                    //console.log(response.data);
                    return response.data;
                });
            }

            function getData(api, searchField, searchValue, size, typefilter, originparams, page) {
                var query = "/search?query=";
                if(originparams != null && originparams.length > 0){
                    query += originparams;
                }
                if(searchValue != null && searchValue.length > 0){

                    searchValue = "\"*"+searchValue+"*\"";
                    /*if (typefilter =="Text"){
                        searchValue = "\"*"+options.data.filter.filters[0].value+"*\"";
                    } else if(typefilter =="Number"){
                        searchValue = options.data.filter.filters[0].value;
                    }*/
                    if(originparams != null && originparams.length > 0)
                        query += ";"+searchField+"=="+searchValue;
                    else
                        query += searchField+"=="+searchValue;
                }
                if(query.length>0)
                    api += query + "&size="+size+"&page="+page;
                else
                    api += "&size="+size+"&page="+page;
                // console.log(api);
                return $http.get(api).then(function (response) {
                    console.log(response);
                    return response.data;
                });
            }

            function genApi(api, searchField, searchValue, size, typefilter, originparams, page, queryRelate,order) {
                var query = "/search?query=";
                // console.log(queryRelate)
                if((originparams != null && originparams.length > 0) && (queryRelate != null && queryRelate.length > 0)){
                    query += originparams + ';' + queryRelate;
                }else if(originparams != null && originparams.length > 0){
                    query += originparams;
                }else if(queryRelate != null && queryRelate.length > 0){
                    query += queryRelate;
                }

                if(searchValue != null && searchValue.length > 0){
                    if(searchValue.length > 2) {
                        if(searchValue.toString().charAt(0) === '#' && searchValue.toString().charAt(searchValue.length - 1) === '#') {
                            var substr = searchValue.toString().substr(1, searchValue.length - 2);
                            searchValue = "\""+ substr +"\"";
                        } else {
                            searchValue = "\"*"+searchValue+"*\"";
                        }
                    } else
                        searchValue = "\"*"+searchValue+"*\"";

                    /*if (typefilter =="Text"){
                        searchValue = "\"*"+options.data.filter.filters[0].value+"*\"";
                    } else if(typefilter =="Number"){
                        searchValue = options.data.filter.filters[0].value;
                    }*/
                    if((originparams != null && originparams.length > 0) || (queryRelate != null && queryRelate.length > 0))
                        query += ";"+searchField+"=="+searchValue;
                    else
                        query += searchField+"=="+searchValue;
                }
                if(query.length>0){
                    api += query + "&size="+size+"&page="+page;
                    if(angular.isDefined(order) && order !=null){
                        api +="&sort=" + order;
                    }
                } else {
                    api += "&size="+size+"&page="+page;
                    if(angular.isDefined(order) && order !=null){
                        api +="&sort=" + order;
                    }
                }

                // console.log(api);
                return api;
            }

            function handleError(response) {

                if (
                    !angular.isObject(response.data) ||
                    !response.data.message
                ) {
                    return ($q.reject("An unknown error occurred."));
                }
                return ($q.reject(response.data.message));
            }

            function handleSuccess(response) {
                return (response.data);
            }
        }
    ])
;