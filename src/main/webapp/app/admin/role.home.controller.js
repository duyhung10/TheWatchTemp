(function () {
    'use strict';
    angular.module('erpApp')
        .controller('RoleHomeController', RoleHomeController);

    RoleHomeController.$inject = ['$rootScope', '$scope', '$state', 'Role', 'Privilege', 'AlertService', '$translate', 'variables', '$timeout', 'TableMultiple', 'TranslateCommonUI', 'ErrorHandle','$window'];

    function RoleHomeController($rootScope, $scope, $state, Role, Privilege, AlertService, $translate, variables, $timeout, TableMultiple, TranslateCommonUI, ErrorHandle, $window) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.roles"

        $scope.columnsName = {
            Name: "admin.role.column.Name",
            Description: "admin.role.column.Description",
            Created: "admin.role.column.Created",
            Updated: "admin.role.column.Updated",
            CreatedBy: "admin.role.column.CreatedBy",
            UpdatedBy: "admin.role.column.UpdatedBy"
        }

        $scope.detail = {
            Name: "admin.role.column.Name",
            Description: "admin.role.column.Description",
            AvailablePrivileges: "admin.role.column.AvailablePrivileges",
            SelectPrivileges: "admin.role.column.SelectPrivileges",
            FilterTree: "admin.role.column.FilterTree",
            Created: "admin.role.column.Created",
            Updated: "admin.role.column.Updated",
            CreatedBy: "admin.role.column.CreatedBy",
            UpdatedBy: "admin.role.column.UpdatedBy"
        }

        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        }

        var tmp_priv = [];
        $scope.role = {
            "privileges": []
        };

        var nodeFilterLeft = [];
        var nodeFilterRight = [];

        var fields =     ["id",     "name", "description", "created", "createdBy", "updated", "updatedBy"];
        var fieldsType = ["Number", "Text", "Text",        "Number",  "Text",      "Number",  "Text"     ];
        var loadFunction = Role.getPage;
        /*TableCommon.allowShowTooltips($scope, true);
        TableCommon.initData($scope, "roles", fields, fieldsType, loadFunction, function () {
            // delete callback
            //alert("ID: " + $scope.param_check_list);
        });
        TableCommon.sortDefault();
        TableCommon.reloadPage();*/

        var newTableIds = {
            idTable: "table_role",
            model: "roles",
            param_allow_show_tooltip : "true",
            tree_query: "",
            firstLoad: false,
            param_current_page: 0,
            param_page_size: 0,
            param_total_result: 0,
            param_page_total: 0,
            param_sort_field: "",
            param_sort_type: "asc",
            param_sort_list: [],
            param_filter_list: [],
            param_check_list: [],
            selectize_page_options: [],
            selectize_page_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            selectize_pageNum_options: ["5", "10", "25", "50"],
            selectize_pageNum_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            loadFunction: loadFunction,
            param_fields: fields,
            param_fields_type: fieldsType,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "",
            pager_id: "table_role_pager",
            selectize_page_id: "role_selectize_page",
            selectize_pageNum_id: "role_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIds);
        TableMultiple.sortDefault(newTableIds.idTable);
        TableMultiple.reloadPage(newTableIds.idTable);

        $scope.DatetimeRange1 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_role'], // ** table filter
            Column: 3, // ** number column filter on table
            Scope: $scope
        }
        $scope.DatetimeRange2 = {
            dateStart: null,
            dateEnd: null,
            Table: $scope.TABLES['table_role'], // ** table filter
            Column: 5, // ** number column filter on table
            Scope: $scope
        }

        $scope.getFilterListIDs = function (tree, nodeFilters) {
            var ids = [];
            for(var i = 0; i < nodeFilters.length; i++) {
                var node = nodeFilters[i];
                if (!node.hasChildren() && !node.isFolder()) {
                    // Action Node
                    ids.push(Number(node.key));
                } else if(node.getParent() == tree.getRootNode()){
                    // Root node
                    if(node.hasChildren()) {
                        var childs = node.getChildren();
                        for(var j = 0; j < childs.length; j++) {
                            if(childs[j].hasChildren()) {
                                for(var k = 0; k < childs[j].getChildren().length; k++) {
                                    var cActionNode = childs[j].getChildren()[k];
                                    ids.push(Number(cActionNode.key))
                                }
                            }
                        }
                    }
                } else if(node.getParent() != tree.getRootNode()){
                    // Parent Node
                    if(node.hasChildren()) {
                        var childs = node.getChildren();
                        for (var j = 0; j < childs.length; j++) {
                            var cActionNode = childs[j];
                            ids.push(Number(cActionNode.key))
                        }
                    }
                }
            }

            return ids;
        }

        $scope.addPrivilege = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            var selected_nodes = left_tree.getSelectedNodes();
            var idFilters = $scope.getFilterListIDs(left_tree, nodeFilterLeft);
            var hasFilter = nodeFilterLeft.length > 0 ? true : false;
            for (var i = 0; i < selected_nodes.length; i++) {
                if (!selected_nodes[i].hasChildren()) {
                    // the selected node is action node
                    // check if node in filter list
                    if(hasFilter) {
                        if(idFilters.indexOf(Number(selected_nodes[i].key)) != -1) {
                            var parentNode = selected_nodes[i].getParent().key;
                            //console.log(selected_nodes[i].key)
                            var currentPNode = right_tree.getNodeByKey(parentNode);
                            var existNode = right_tree.getNodeByKey(selected_nodes[i].key);
                            if (existNode == null) {
                                var actionNode = {
                                    "title": selected_nodes[i].title,
                                    "parentId": currentPNode.key,
                                    "key": selected_nodes[i].key,
                                    "icon": false,
                                    "folder": false
                                }
                                currentPNode.addChildren(actionNode);
                                currentPNode.setExpanded(true);
                                currentPNode.getParent().setExpanded(true);
                                currentPNode.sortChildren(function (a, b) {
                                    a = a.key;
                                    b = b.key;
                                    return a > b ? 1 : a < b ? -1 : 0;
                                }, false);
                                tmp_priv.push("priv_" +
                                    currentPNode.getParent().title + "_" +
                                    currentPNode.title + "_" + actionNode.title);
                                selected_nodes[i].remove();
                            }
                        }
                    } else {
                        var parentNode = selected_nodes[i].getParent().key;
                        //console.log(selected_nodes[i].key)
                        var currentPNode = right_tree.getNodeByKey(parentNode);
                        var existNode = right_tree.getNodeByKey(selected_nodes[i].key);
                        if (existNode == null) {
                            var actionNode = {
                                "title": selected_nodes[i].title,
                                "parentId": currentPNode.key,
                                "key": selected_nodes[i].key,
                                "icon": false,
                                "folder": false
                            }
                            currentPNode.addChildren(actionNode);
                            currentPNode.setExpanded(true);
                            currentPNode.getParent().setExpanded(true);
                            currentPNode.sortChildren(function (a, b) {
                                a = a.key;
                                b = b.key;
                                return a > b ? 1 : a < b ? -1 : 0;
                            }, false);
                            tmp_priv.push("priv_" +
                                currentPNode.getParent().title + "_" +
                                currentPNode.title + "_" + actionNode.title);
                            selected_nodes[i].remove();
                        }
                    }

                }
            }

            if(hasFilter) {
                $("#filter_input").val("");
                left_tree.clearFilter();
                nodeFilterLeft = [];
            }

            left_tree.visit(function (node) {
                node.setSelected(false);
                if(node.isFolder() && !node.hasChildren()) {
                    $(node.li).hide();
                }
            });

            // hide root node
            left_tree.visit(function (node) {
                if(node.getParent() == left_tree.getRootNode()) {
                    var forceExpand = false;
                    if(!node.isExpanded()) {
                        forceExpand = true;
                        node.setExpanded(true);
                    }
                    if($(node.ul).children(':visible').length == 0) {
                        // action when all are hidden
                        $(node.li).hide();
                    }
                    if(forceExpand) {
                        node.setExpanded(false);
                        forceExpand = false;
                    }
                }
            });

            $scope.renderRightNodes();
        }

        $scope.addActionNode = function (node, right_tree, node_remove) {
            var parentNode = node.getParent().key;
            var currentPNode = right_tree.getNodeByKey(parentNode);
            var existNode = right_tree.getNodeByKey(node.key);
            if (existNode == null) {
                var actionNode = {
                    "title": node.title,
                    "parentId": currentPNode.key,
                    "key": node.key,
                    "icon": false,
                    "folder": false
                }
                currentPNode.addChildren(actionNode);
                currentPNode.setExpanded(true);
                currentPNode.getParent().setExpanded(true);
                currentPNode.sortChildren(function (a, b) {
                    a = a.key;
                    b = b.key;
                    return a > b ? 1 : a < b ? -1 : 0;
                }, false);
                tmp_priv.push("priv_" +
                    currentPNode.getParent().title + "_" +
                    currentPNode.title + "_" + actionNode.title);
            }
            node_remove.push(node.key)
        }

        $scope.removeActionNode = function (node, left_tree, node_remove) {
            var parentNode = node.getParent().key;
            var currentPNode = left_tree.getNodeByKey(parentNode);
            var existNode = left_tree.getNodeByKey(node.key);
            if (existNode == null) {
                var actionNode = {
                    "title": node.title,
                    "parentId": currentPNode.key,
                    "key": node.key,
                    "icon": false,
                    "folder": false
                }
                $(currentPNode.li).show();
                $(currentPNode.getParent().li).show();
                currentPNode.addChildren(actionNode);
                currentPNode.setExpanded(true);
                currentPNode.getParent().setExpanded(true);
                currentPNode.sortChildren(function (a, b) {
                    a = a.key;
                    b = b.key;
                    return a > b ? 1 : a < b ? -1 : 0;
                }, false);
                var privData = "priv_" +
                    currentPNode.getParent().title + "_" +
                    currentPNode.title + "_" + actionNode.title;
                var index = tmp_priv.indexOf(privData);
                tmp_priv.splice(index, 1);
            }
            node_remove.push(node.key)
        }

        $scope.addAllPrivilege = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            var node_remove = [];

            // Add all Filter
            if(nodeFilterLeft.length > 0) {
                for(var i = 0; i < nodeFilterLeft.length; i++) {
                    var node = nodeFilterLeft[i];
                    if (!node.hasChildren() && !node.isFolder()) {
                        // Action Node
                        $scope.addActionNode(node, right_tree, node_remove);
                    } else if(node.getParent() == left_tree.getRootNode()){
                        // Root node
                        if(node.hasChildren()) {
                            var childs = node.getChildren();
                            for(var j = 0; j < childs.length; j++) {
                                if(childs[j].hasChildren()) {
                                    for(var k = 0; k < childs[j].getChildren().length; k++) {
                                        var cActionNode = childs[j].getChildren()[k];
                                        $scope.addActionNode(cActionNode, right_tree, node_remove);
                                    }
                                }
                            }
                        }
                    } else if(node.getParent() != left_tree.getRootNode()){
                        // Parent Node
                        if(node.hasChildren()) {
                            var childs = node.getChildren();
                            for (var j = 0; j < childs.length; j++) {
                                var cActionNode = childs[j];
                                $scope.addActionNode(cActionNode, right_tree, node_remove);
                            }
                        }
                    }
                    node.setSelected(false);
                }

                $("#filter_input").val("");
                left_tree.clearFilter();
                nodeFilterLeft = [];
            } else {
                left_tree.visit(function (node) {
                    if (!node.hasChildren() && !node.isFolder()) {
                        var parentNode = node.getParent().key;
                        var currentPNode = right_tree.getNodeByKey(parentNode);
                        var existNode = right_tree.getNodeByKey(node.key);
                        if (existNode == null) {
                            var actionNode = {
                                "title": node.title,
                                "parentId": currentPNode.key,
                                "key": node.key,
                                "icon": false,
                                "folder": false
                            }
                            currentPNode.addChildren(actionNode);
                            currentPNode.setExpanded(true);
                            currentPNode.getParent().setExpanded(true);
                            currentPNode.sortChildren(function (a, b) {
                                a = a.key;
                                b = b.key;
                                return a > b ? 1 : a < b ? -1 : 0;
                            }, false);
                            tmp_priv.push("priv_" +
                                currentPNode.getParent().title + "_" +
                                currentPNode.title + "_" + actionNode.title);
                        }
                        node_remove.push(node.key)
                    }
                    node.setSelected(false);
                });
            }

            for (var i = 0; i < node_remove.length; i++) {
                var existNode = left_tree.getNodeByKey(node_remove[i]);
                if (existNode != null) {
                    existNode.remove();
                }
            }

            left_tree.visit(function (node) {
                node.setSelected(false);
                if(node.isFolder() && !node.hasChildren()) {
                    $(node.li).hide();
                }
            });

            // hide root node
            left_tree.visit(function (node) {
                if(node.getParent() == left_tree.getRootNode()) {
                    var forceExpand = false;
                    if(!node.isExpanded()) {
                        forceExpand = true;
                        node.setExpanded(true);
                    }
                    if($(node.ul).children(':visible').length == 0) {
                        // action when all are hidden
                        $(node.li).hide();
                    }
                    if(forceExpand) {
                        node.setExpanded(false);
                        forceExpand = false;
                    }
                }
            });

            $scope.renderRightNodes();
        }

        $scope.removePrivilege = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            var selected_nodes = right_tree.getSelectedNodes();
            var idFilters = $scope.getFilterListIDs(right_tree, nodeFilterRight);
            var hasFilter = nodeFilterRight.length > 0 ? true : false;
            for (var i = 0; i < selected_nodes.length; i++) {
                if (!selected_nodes[i].hasChildren()) {
                    // the selected node is action node
                    // check if node in filter list
                    if(hasFilter) {
                        if(idFilters.indexOf(Number(selected_nodes[i].key)) != -1) {
                            var parentNode = selected_nodes[i].getParent().key;
                            //console.log(selected_nodes[i].key)
                            var currentPNode = left_tree.getNodeByKey(parentNode);
                            var existNode = left_tree.getNodeByKey(selected_nodes[i].key);
                            if (existNode == null) {
                                var actionNode = {
                                    "title": selected_nodes[i].title,
                                    "parentId": currentPNode.key,
                                    "key": selected_nodes[i].key,
                                    "icon": false,
                                    "folder": false
                                }
                                $(currentPNode.li).show();
                                $(currentPNode.getParent().li).show();
                                currentPNode.addChildren(actionNode);
                                currentPNode.setExpanded(true);
                                currentPNode.getParent().setExpanded(true);
                                currentPNode.sortChildren(function (a, b) {
                                    a = a.key;
                                    b = b.key;
                                    return a > b ? 1 : a < b ? -1 : 0;
                                }, false);
                                var privData = "priv_" +
                                    currentPNode.getParent().title + "_" +
                                    currentPNode.title + "_" + actionNode.title;
                                var index = tmp_priv.indexOf(privData);
                                tmp_priv.splice(index, 1);
                                selected_nodes[i].remove();
                            }
                        }
                    } else {
                        var parentNode = selected_nodes[i].getParent().key;
                        //console.log(selected_nodes[i].key)
                        var currentPNode = left_tree.getNodeByKey(parentNode);
                        var existNode = left_tree.getNodeByKey(selected_nodes[i].key);
                        if (existNode == null) {
                            var actionNode = {
                                "title": selected_nodes[i].title,
                                "parentId": currentPNode.key,
                                "key": selected_nodes[i].key,
                                "icon": false,
                                "folder": false
                            }
                            $(currentPNode.li).show();
                            $(currentPNode.getParent().li).show();
                            currentPNode.addChildren(actionNode);
                            currentPNode.setExpanded(true);
                            currentPNode.getParent().setExpanded(true);
                            currentPNode.sortChildren(function (a, b) {
                                a = a.key;
                                b = b.key;
                                return a > b ? 1 : a < b ? -1 : 0;
                            }, false);
                            var privData = "priv_" +
                                currentPNode.getParent().title + "_" +
                                currentPNode.title + "_" + actionNode.title;
                            var index = tmp_priv.indexOf(privData);
                            tmp_priv.splice(index, 1);
                            selected_nodes[i].remove();
                        }
                    }
                }
            }

            if(hasFilter) {
                $("#filter_input_selected").val("");
                right_tree.clearFilter();
                nodeFilterRight = [];
            }

            right_tree.visit(function (node) {
                node.setSelected(false);
            });

            var right_tree = $("#tFilter_selected").fancytree("getTree");
            $("#filter_input_selected").val("");
            right_tree.clearFilter();
            nodeFilterRight = [];

            $scope.renderRightNodes();
        }

        $scope.removeAllPrivilege = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            var node_remove = [];

            // Remove Filter List
            if(nodeFilterRight.length > 0) {
                for(var i = 0; i < nodeFilterRight.length; i++) {
                    var node = nodeFilterRight[i];
                    if (!node.hasChildren() && !node.isFolder()) {
                        // Action Node
                        $scope.removeActionNode(node, left_tree, node_remove);
                    } else if(node.getParent() == right_tree.getRootNode()){
                        // Root node
                        if(node.hasChildren()) {
                            var childs = node.getChildren();
                            for (var j = 0; j < childs.length; j++) {
                                if (childs[j].hasChildren()) {
                                    for (var k = 0; k < childs[j].getChildren().length; k++) {
                                        var cActionNode = childs[j].getChildren()[k];
                                        $scope.removeActionNode(cActionNode, left_tree, node_remove);
                                    }
                                }
                            }
                        }
                    } else if(node.getParent() != right_tree.getRootNode()){
                        // Parent Node
                        if(node.hasChildren()) {
                            var childs = node.getChildren();
                            for (var j = 0; j < childs.length; j++) {
                                var cActionNode = childs[j];
                                $scope.removeActionNode(cActionNode, left_tree, node_remove);
                            }
                        }
                    }
                    node.setSelected(false);
                }

                $("#filter_input_selected").val("");
                right_tree.clearFilter();
                nodeFilterRight = [];
            } else {
                right_tree.visit(function (node) {
                    if (!node.hasChildren() && !node.isFolder()) {
                        var parentNode = node.getParent().key;
                        var currentPNode = left_tree.getNodeByKey(parentNode);
                        var existNode = left_tree.getNodeByKey(node.key);
                        if (existNode == null) {
                            var actionNode = {
                                "title": node.title,
                                "parentId": currentPNode.key,
                                "key": node.key,
                                "icon": false,
                                "folder": false
                            }
                            $(currentPNode.li).show();
                            $(currentPNode.getParent().li).show();
                            currentPNode.addChildren(actionNode);
                            currentPNode.setExpanded(true);
                            currentPNode.getParent().setExpanded(true);
                            currentPNode.sortChildren(function (a, b) {
                                a = a.key;
                                b = b.key;
                                return a > b ? 1 : a < b ? -1 : 0;
                            }, false);
                            var privData = "priv_" +
                                currentPNode.getParent().title + "_" +
                                currentPNode.title + "_" + actionNode.title;
                            var index = tmp_priv.indexOf(privData);
                            tmp_priv.splice(index, 1);
                        }
                        node_remove.push(node.key)
                    }
                    node.setSelected(false);
                });
            }

            for (var i = 0; i < node_remove.length; i++) {
                var existNode = right_tree.getNodeByKey(node_remove[i]);
                if (existNode != null) {
                    existNode.remove();
                }
            }

            $scope.renderRightNodes();
        }

        $scope.parseData = function (treeModel, data, treeLeft) {
            var parentNode = [];
            var childNode = {};
            var actionNode = {};
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name.indexOf("priv") !== -1) {
                    count++;
                    var nodes = data[i].name.split("_");
                    var nodeP1 = nodes[1];
                    var nodeP2 = nodes[2];
                    var nodeP3 = nodes[3];
                    if (parentNode.indexOf(nodeP1) == -1) {
                        parentNode.push(nodeP1);
                    }
                    if (!(nodeP1 in childNode)) {
                        childNode[nodeP1] = [];
                    }
                    if (childNode[nodeP1].indexOf(nodeP2) == -1) {
                        childNode[nodeP1].push(nodeP2);
                    }
                    if (!(nodeP2 in actionNode)) {
                        actionNode[nodeP2] = [];
                    }
                    if (actionNode[nodeP2].indexOf(nodeP3) == -1) {
                        actionNode[nodeP2].push(nodeP3);
                    }
                }
            }
            $scope.privileges_length = count;

            // Config parent node
            var tree_nodes = 1;
            for (var i = 0; i < parentNode.length; i++) {
                var parentN = {
                    "children": [],
                    "title": parentNode[i],
                    "key": i + 1,
                    "folder": true,
                    "expanded": true
                }
                treeModel.push(parentN);
                tree_nodes++;
            }

            // Config child node
            for (var i = 0; i < treeModel.length; i++) {
                var parentN = treeModel[i];
                var titleP = parentN["title"];
                if (titleP in childNode) {
                    for (var j = 0; j < childNode[titleP].length; j++) {
                        var childN = {
                            "children": [],
                            "title": childNode[titleP][j],
                            "parentId": parentN["key"],
                            "key": tree_nodes,
                            "folder": true
                        }
                        parentN["children"].push(childN);
                        tree_nodes++;
                    }
                }
            }

            // Config action node
            if (treeLeft) {
                for (var i = 0; i < treeModel.length; i++) {
                    var parentN = treeModel[i];
                    for (var j = 0; j < parentN.children.length; j++) {
                        var childN = parentN.children[j];
                        var titleC = childN["title"];
                        if (titleC in actionNode) {
                            for (var k = 0; k < actionNode[titleC].length; k++) {
                                var actionN = {
                                    "title": actionNode[titleC][k],
                                    "parentId": childN["key"],
                                    "key": tree_nodes,
                                    "icon": false,
                                    "folder": false
                                }
                                childN["children"].push(actionN);
                                tree_nodes++;
                            }
                        }
                    }
                }
            }
        }

        $scope.renderRightNodes = function () {
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            right_tree.visit(function (node) {
                if(node.hasChildren()) {
                    // if node is root node
                    if(node.getParent() == right_tree.getRootNode()) {
                        var notEmpty = false;
                        for(var i = 0; i < node.getChildren().length; i++) {
                            if(node.getChildren()[i].hasChildren()){
                                notEmpty = true;
                                break;
                            }
                        }
                        if(!notEmpty)
                            $(node.li).hide();
                        else
                            $(node.li).show();
                    } else {
                        // if node is parent node
                        $(node.li).show();
                    }
                } else {
                    // if node is root node
                    if(node.getParent() == right_tree.getRootNode()) {
                        $(node.li).hide();
                    } else {
                        var isParentNode = false;
                        for(var i = 0; i < right_tree.getRootNode().getChildren().length; i++) {
                            if(right_tree.getRootNode().getChildren()[i] == node.getParent()){
                                isParentNode = true;
                                break;
                            }
                        }
                        // if node is parent node
                        if(isParentNode)
                            $(node.li).hide();
                        else
                            $(node.li).show();
                    }
                }
            });

            $scope.renderButtonAction();
        }

        $scope.renderButtonAction = function () {
            var left_tree = $("#tFilter").fancytree("getTree");
            var right_tree = $("#tFilter_selected").fancytree("getTree");
            if(tmp_priv.length > 0 && tmp_priv.length < $scope.privileges_length) {
                $("#addAll").removeClass("disabled");
                $("#removeAll").removeClass("disabled");
            } else if(tmp_priv.length == $scope.privileges_length) {
                $("#addAll").addClass("disabled");
                $("#removeAll").removeClass("disabled");
            } else if(tmp_priv.length == 0) {
                $("#removeAll").addClass("disabled");
                $("#addAll").removeClass("disabled");
            }

            if(left_tree.getSelectedNodes().length > 0) {
                $("#addSelect").removeClass("disabled");
            } else {
                $("#addSelect").addClass("disabled");
            }

            if(right_tree.getSelectedNodes().length > 0) {
                $("#removeSelect").removeClass("disabled");
            } else {
                $("#removeSelect").addClass("disabled");
            }

        }

        $timeout(function () {
            if (angular.element('#tFilter').length) {
                Privilege.getAll().then(function (data) {
                    $scope.allPrivileges = data;
                    $scope.treeData = [];
                    $scope.treeData_selected = [];
                    $scope.parseData($scope.treeData, data, true);
                    $scope.parseData($scope.treeData_selected, data, false);

                    // TREE LEFT
                    // Filters
                    var $tFilter = $("#tFilter");
                    $tFilter.fancytree({
                        checkbox: true,
                        selectMode: 3,
                        extensions: ["filter"],
                        quicksearch: true,
                        source: $scope.treeData,
                        filter: {
                            autoApply: true,  // Re-apply last filter if lazy data is loaded
                            counter: true,  // Show a badge with number of matching child nodes near parent icons
                            fuzzy: true,  // Match single characters in order, e.g. 'fb' will match 'FooBar'
                            hideExpandedCounter: true,  // Hide counter badge, when parent is expanded
                            highlight: true,  // Highlight matches by wrapping inside <mark> tags
                            mode: "hide"  // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                        },
                        activate: function (event, data) {
                            // alert("activate " + data.node);
                        },

                        select: function (event, data) {
                            $scope.renderButtonAction();
                        }
                    });
                    var tree = $tFilter.fancytree("getTree");

                    $("#filter_input").keydown(function(event) {
                        if (event.keyCode == 13) {
                            event.preventDefault();
                        }
                    });

                    $("#filter_input").keyup(function (e) {
                        var n,
                            opts = {
                                autoExpand: true,
                                leavesOnly: $("#leavesOnly").is(":checked")
                            },
                            match = $(this).val();

                        if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
                            $("#tree_filter_reset").click();
                            return;
                        }

                        /*if ($("#tree_filter_regex").is(":checked")) {
                            // Pass function to perform match
                            n = tree.filterBranches(function (node) {
                                return new RegExp(match, "i").test(node.title);
                            }, opts);
                        } else {
                            // Pass a string to perform case insensitive matching
                            n = tree.filterBranches(match, opts);
                        }*/

                        var rex = new RegExp(match, "i");

                        nodeFilterLeft = [];
                        n = tree.filterBranches(function(node) {
                            var rs = rex.test(node.title);
                            if(rs) {
                                nodeFilterLeft.push(node);
                                var re2 = new RegExp(match, "gi");
                                node.titleWithHighlight = node.title.replace(re2, function(s){
                                    return "<mark>" + s + "</mark>";
                                });
                                return rs;
                            }
                        }, opts);
                        $("#tree_filter_reset").attr("disabled", false);

                    });

                    // reset filter
                    $scope.resetFilters = function ($event) {
                        $scope.tree.filterInput = '';
                        tree.clearFilter();
                        nodeFilterLeft = [];
                    };

                    $("#filter_switches").find("input:checkbox").on('ifChanged', function (e) {
                        var id = $(this).attr("id"),
                            flag = $(this).is(":checked");

                        switch (id) {
                            case "autoExpand":
                            case "regex":
                            case "leavesOnly":
                                // Re-apply filter only
                                break;
                            case "hideMode":
                                tree.options.filter.mode = flag ? "hide" : "dimm";
                                break;
                            case "counter":
                            case "fuzzy":
                            case "hideExpandedCounter":
                            case "highlight":
                                tree.options.filter[id] = flag;
                                break;
                        }
                        tree.clearFilter();
                        $("#filter_input").keyup();
                    });

                    // activate filters
                    $scope.tree = {
                        counter: true,
                        hideExpandedCounter: true,
                        highlight: true
                    };

                    // TREE RIGHT
                    // Filters
                    var $tFilter_selected = $("#tFilter_selected");
                    $tFilter_selected.fancytree({
                        checkbox: true,
                        selectMode: 3,
                        extensions: ["filter"],
                        quicksearch: true,
                        source: $scope.treeData_selected,
                        filter: {
                            autoApply: true,  // Re-apply last filter if lazy data is loaded
                            counter: true,  // Show a badge with number of matching child nodes near parent icons
                            fuzzy: true,  // Match single characters in order, e.g. 'fb' will match 'FooBar'
                            hideExpandedCounter: true,  // Hide counter badge, when parent is expanded
                            highlight: true,  // Highlight matches by wrapping inside <mark> tags
                            mode: "hide"  // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                        },
                        activate: function (event, data) {
                            // alert("activate " + data.node);
                        },

                        select: function (event, data) {
                            $scope.renderButtonAction();
                        }
                    });
                    var tree_selected = $tFilter_selected.fancytree("getTree");

                    $("#filter_input_selected").keydown(function(event) {
                        if (event.keyCode == 13) {
                            event.preventDefault();
                        }
                    });

                    $("#filter_input_selected").keyup(function (e) {
                        var n,
                            opts = {
                                autoExpand: true,
                                leavesOnly: $("#leavesOnly").is(":checked")
                            },
                            match = $(this).val();

                        if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
                            $("#tree_selected_filter_reset").click();
                            return;
                        }

                        /*if ($("#tree_selected_filter_regex").is(":checked")) {
                            // Pass function to perform match
                            n = tree_selected.filterBranches(function (node) {
                                return new RegExp(match, "i").test(node.title);
                            }, opts);
                        } else {
                            // Pass a string to perform case insensitive matching
                            n = tree_selected.filterBranches(match, opts);
                        }*/

                        var rex = new RegExp(match, "i");

                        nodeFilterRight = [];
                        n = tree_selected.filterBranches(function(node) {
                            var rs = rex.test(node.title);
                            if(rs) {
                                nodeFilterRight.push(node);
                                var re2 = new RegExp(match, "gi");
                                node.titleWithHighlight = node.title.replace(re2, function(s){
                                    return "<mark>" + s + "</mark>";
                                });
                                return rs;
                            }
                        }, opts);
                        $("#tree_selected_filter_reset").attr("disabled", false);

                    });

                    // reset filter
                    $scope.resetFilters_selected = function ($event) {
                        $scope.tree_selected.filterInput = '';
                        tree_selected.clearFilter();
                        nodeFilterRight = [];
                    };

                    $("#filter_switches_selected").find("input:checkbox").on('ifChanged', function (e) {
                        var id = $(this).attr("id"),
                            flag = $(this).is(":checked");

                        switch (id) {
                            case "autoExpand":
                            case "regex":
                            case "leavesOnly":
                                // Re-apply filter only
                                break;
                            case "hideMode":
                                tree_selected.options.filter.mode = flag ? "hide" : "dimm";
                                break;
                            case "counter":
                            case "fuzzy":
                            case "hideExpandedCounter":
                            case "highlight":
                                tree_selected.options.filter[id] = flag;
                                break;
                        }
                        tree_selected.clearFilter();
                        $("#filter_input_selected").keyup();
                    });

                    // activate filters
                    $scope.tree_selected = {
                        counter: true,
                        hideExpandedCounter: true,
                        highlight: true
                    };

                    $scope.renderRightNodes();
                })
            }

        });

        // Handle Delete Rows
        $scope.handleDeleteRows = function () {
            UIkit.modal.confirm($translate.instant("common-ui-element.actionConfirm.Delete"), function () {
                var ids = TableMultiple.getSelectedRowIDs('table_role');
                Role.deleteMany(ids)
                    .then(function(data){
                        if (data.length > 0) {
                            var erMsg = $translate.instant('error.common.deleteError')
                            erMsg += data
                            AlertService.error(erMsg)
                        } else {
                            AlertService.success('success.msg.delete');
                            TableMultiple.reloadPage(newTableIds.idTable);
                        }
                    })
                    .catch(function(data){
                        ErrorHandle.handleError(data);
                    })
            }, {
                labels: {
                    'Ok': $translate.instant("common-ui-element.button.Delete"),
                    'Cancel': $translate.instant("common-ui-element.button.Cancel")
                }
            });
        }

        $scope.submit = function () {
            $('#form_createrole').parsley();
            if ($scope.form_createrole.$valid) {
                tmp_priv.sort();
                $scope.role.privileges = []
                if (tmp_priv.length > 0) {
                    var allow = true;
                    var counter = 0;
                    for (var i = 0; i < tmp_priv.length; i++) {
                        var priv_i = tmp_priv[i];
                        for(var j = 0 ; j < $scope.allPrivileges.length; j++) {
                            if($scope.allPrivileges[j].name == priv_i){
                                $scope.role.privileges.push($scope.allPrivileges[j]);
                                break;
                            }
                        }

                        /*Privilege.getOne(tmp_priv[i]).then(function (data) {
                            $scope.role.privileges.push(data);
                            counter++;
                            //console.log($scope.role.privileges);
                            if (counter == tmp_priv.length) {
                                if (allow) {
                                    Role.create($scope.role)
                                        .then(function () {
                                            $state.go('roles');
                                        })
                                        .catch(function () {
                                            AlertService.error('admin.messages.errorCreateRole');
                                        })
                                }

                            }
                        }).catch(function () {
                            AlertService.error('admin.messages.errorCreateRole');
                            allow = false;
                        })*/
                    }

                    Role.create($scope.role)
                        .then(function (data) {
                            $state.go('roles');
                        })
                        .catch(function (data) {
                            //AlertService.error('admin.messages.errorCreateRole');
                            ErrorHandle.handleError(data);
                        })

                } else {
                    Role.create($scope.role)
                        .then(function (data) {
                            $state.go('roles');
                        })
                        .catch(function (data) {
                            //AlertService.error('admin.messages.errorCreateRole');
                            ErrorHandle.handleError(data);
                        })
                }


            }
        }

        $("#ts_pager_filter").css('min-height', $( window ).height() - 300);
        $("#ts_pager_filter").css('max-height', $( window ).height() - 300);
        angular.element($window).bind('resize', function(){
            $("#ts_pager_filter").css('min-height', $( window ).height() - 300);
            $("#ts_pager_filter").css('max-height', $( window ).height() - 300);
        });

        if (angular.element('#form_createrole').length) {
            $scope.required_msg = $translate.instant('admin.messages.required')
            var $formValidate = $('#form_createrole');
            $formValidate
                .parsley({
                    'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
                })
                .on('form:validated', function () {
                    $scope.$apply();
                })
                .on('field:validated', function (parsleyField) {
                    if ($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });
        }
    }

})();