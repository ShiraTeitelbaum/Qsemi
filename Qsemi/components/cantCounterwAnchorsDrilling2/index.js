'use strict';

app.cantCounterwAnchorsDrilling2 = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('cantCounterwAnchorsDrilling2');

// START_CUSTOM_CODE_cantCounterwAnchorsDrilling2
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_cantCounterwAnchorsDrilling2
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('cantCounterwAnchorsDrilling2Model'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('cantCounterwAnchorsDrilling2Model_delayedFetch', paramFilter || null);
                return;
            }

            if (paramFilter) {
                model.set('paramFilter', paramFilter);
            } else {
                model.set('paramFilter', undefined);
            }

            if (paramFilter && searchFilter) {
                dataSource.filter({
                    logic: 'and',
                    filters: [paramFilter, searchFilter]
                });
            } else if (paramFilter || searchFilter) {
                dataSource.filter(paramFilter || searchFilter);
            } else {
                dataSource.filter({});
            }
        },

        jsdoOptions = {
            name: 'CANT_COUNTERW__ANCHORS_DRILLING',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},
            error: function(e) {
                app.mobileApp.pane.loader.hide();
                if (e.xhr) {
                    var errorText = "";
                    try {
                        errorText = JSON.stringify(e.xhr);
                    } catch (jsonErr) {
                        errorText = e.xhr.responseText || e.xhr.statusText || 'An error has occurred!';
                    }
                    alert(errorText);
                } else if (e.errorThrown) {
                    alert(e.errorThrown);
                }
            },
            schema: {
                model: {
                    fields: {
                        'name': {
                            field: 'name',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,

        },
        /// start data sources
        /// end data sources
        cantCounterwAnchorsDrilling2Model = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            fixHierarchicalData: function(data) {
                var result = {},
                    layout = {};

                $.extend(true, result, data);

                (function removeNulls(obj) {
                    var i, name,
                        names = Object.getOwnPropertyNames(obj);

                    for (i = 0; i < names.length; i++) {
                        name = names[i];

                        if (obj[name] === null) {
                            delete obj[name];
                        } else if ($.type(obj[name]) === 'object') {
                            removeNulls(obj[name]);
                        }
                    }
                })(result);

                (function fix(source, layout) {
                    var i, j, name, srcObj, ltObj, type,
                        names = Object.getOwnPropertyNames(layout);

                    if ($.type(source) !== 'object') {
                        return;
                    }

                    for (i = 0; i < names.length; i++) {
                        name = names[i];
                        srcObj = source[name];
                        ltObj = layout[name];
                        type = $.type(srcObj);

                        if (type === 'undefined' || type === 'null') {
                            source[name] = ltObj;
                        } else {
                            if (srcObj.length > 0) {
                                for (j = 0; j < srcObj.length; j++) {
                                    fix(srcObj[j], ltObj[0]);
                                }
                            } else {
                                fix(srcObj, ltObj);
                            }
                        }
                    }
                })(result, layout);

                return result;
            },
            itemClick: function(e) {
                var dataItem = e.dataItem || cantCounterwAnchorsDrilling2Model.originalItem;

                app.mobileApp.navigate('#components/cantCounterwAnchorsDrilling2/details.html?uid=' + dataItem.uid);

            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/cantCounterwAnchorsDrilling2/edit.html?uid=' + uid);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = cantCounterwAnchorsDrilling2Model.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                cantCounterwAnchorsDrilling2Model.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = cantCounterwAnchorsDrilling2Model.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                cantCounterwAnchorsDrilling2Model.set('originalItem', itemModel);
                cantCounterwAnchorsDrilling2Model.set('currentItem',
                    cantCounterwAnchorsDrilling2Model.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            /// start masterDetails view model functions
            /// end masterDetails view model functions
            currentItem: {}
        });

    parent.set('editItemViewModel', kendo.observable({
        /// start edit model properties
        /// end edit model properties
        /// start edit model functions
        /// end edit model functions
        editFormData: {},
        itemUid: '',
        itemId: '',
        onInit: function(e) {
             var $sigdiv = $("#signatureCCAD");
            $sigdiv.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget. 
        },
        onShow: function(e) {
            $(".km-scroll-container").css( "overflow", "hidden" );
            var $sigdiv = $("#signatureCCAD");
            // after some doodling...
            $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

            var that = this,
                //itemUid = e.view.params.uid,
                element_id = e.view.params.elementId,
                element_uid = e.view.params.elementUid,
                dataSource = cantCounterwAnchorsDrilling2Model.get('dataSource'),
                itemData, fixedData;
                /*itemData = dataSource.getByUid(itemUid),
                fixedData = cantCounterwAnchorsDrilling2Model.fixHierarchicalData(itemData);*/

                app.mobileApp.showLoading();
            /// start edit form before itemData
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions2 = cantCounterwAnchorsDrilling2Model.get('_jsdoOptions'),
                    jsdo2 = new progress.data.JSDO(jsdoOptions2);
                dataSourceOptions.transport.jsdo = jsdo2;
                var dataSource2 = new kendo.data.DataSource(dataSourceOptions);
                dataSource2.filter({ field: "R363889618", operator: "==", value: element_id });

                dataSource2.fetch(function() {
                     var view = dataSource2.data();
                   
                    that.itemUid = view[0].uid;
                    that.itemId = view[0].id;
                    itemData = dataSource2.getByUid(view[0].uid);
                    fixedData = cantCounterwAnchorsDrilling2Model.fixHierarchicalData(itemData);

                    var checkBox1List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox1().response.picklistData;
                     var checkBox2List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox2().response.picklistData;
                     var checkBox3List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox3().response.picklistData;
                     var checkBox4List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox4().response.picklistData;
                     var checkBox5List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox5().response.picklistData;

                     if(itemData.Checkbox1 != "null") {
                        for(var i=0; i<checkBox1List.length; i++) {
                            if(itemData.Checkbox1 == checkBox1List[i].id && checkBox1List[i].name == "OK") {
                                $("#checkbox1CCAD").attr("checked", true);
                            }
                            else if(itemData.Checkbox1 == checkBox1List[i].id && checkBox1List[i].name == "Not OK") {
                                $("#checkbox1NotOkCCAD").attr("checked", true);
                                $("#comments1FieldCCAD").show();
                            }
                        }
                     }
                     if(itemData.Checkbox2 != "null") {
                        for(var i=0; i<checkBox2List.length; i++) {
                            if(itemData.Checkbox2 == checkBox2List[i].id && checkBox2List[i].name == "OK") {
                                $("#checkbox2CCAD").attr("checked", true);
                            }
                            else if(itemData.Checkbox2 == checkBox2List[i].id && checkBox2List[i].name == "Not OK") {
                                $("#checkbox2NotOkCCAD").attr("checked", true);
                                $("#comments2FieldCCAD").show();
                            }
                        }
                     }
                     if(itemData.Checkbox3 != "null") {
                        for(var i=0; i<checkBox3List.length; i++) {
                            if(itemData.Checkbox3 == checkBox3List[i].id && checkBox3List[i].name == "OK") {
                                $("#checkbox3CCAD").attr("checked", true);
                            }
                            else if(itemData.Checkbox3 == checkBox3List[i].id && checkBox3List[i].name == "Not OK") {
                                $("#checkbox3NotOkCCAD").attr("checked", true);
                                $("#comments3FieldCCAD").show();
                            }
                        }
                     }
                     if(itemData.Checkbox4 != "null") {
                        for(var i=0; i<checkBox4List.length; i++) {
                            if(itemData.Checkbox4 == checkBox4List[i].id && checkBox4List[i].name == "OK") {
                                $("#checkbox4CCAD").attr("checked", true);
                            }
                            else if(itemData.Checkbox4 == checkBox4List[i].id && checkBox4List[i].name == "Not OK") {
                                $("#checkbox4NotOkCCAD").attr("checked", true);
                                $("#comments4FieldCCAD").show();
                            }
                        }
                     }
                     if(itemData.Checkbox5 != "null") {
                        for(var i=0; i<checkBox5List.length; i++) {
                            if(itemData.Checkbox5 == checkBox5List[i].id && checkBox5List[i].name == "OK") {
                                $("#checkbox5CCAD").attr("checked", true);
                            }
                            else if(itemData.Checkbox5 == checkBox5List[i].id && checkBox5List[i].name == "Not OK") {
                                $("#checkbox5NotOkCCAD").attr("checked", true);
                                $("#comments5FieldCCAD").show();
                            }
                        }
                     }

                     if(itemData.Completed == true) {
                         $("#completedCCAD").attr("checked", true);
                     }

                     if(itemData.signature != "null")
                         $sigdiv.jSignature("importData", itemData.signature)

                      var comm1, comm2, comm3, comm4, comm5; 
                    if(itemData.Comments5 == "null") { comm5 = '' }
                    else { comm5 = itemData.Comments5 }
                    if(itemData.Comments4 == "null") { comm4 = '' }
                    else { comm4 = itemData.Comments4 }
                    if(itemData.Comments3 == "null") { comm3 = '' }
                    else { comm3 = itemData.Comments3 }
                    if(itemData.Comments2 == "null") { comm2 = '' }
                    else { comm2 = itemData.Comments2 }
                    if(itemData.Comments1 == "null") { comm1 = '' }
                    else { comm1 = itemData.Comments1 }

                    that.set('itemData', itemData);
                    that.set('editFormData', {
                        comments5: comm5,
                        comments4: comm4,
                        comments3: comm3,
                        comments2: comm2,
                        comments1: comm1,
                        /// start edit form data init
                        /// end edit form data init
                    });
                    app.mobileApp.hideLoading();
                });
            });
            $("#comments1FieldCCAD").hide();
            $("#comments2FieldCCAD").hide();
            $("#comments3FieldCCAD").hide();
            $("#comments4FieldCCAD").hide();
            $("#comments5FieldCCAD").hide();
            /// end edit form before itemData
            /// start edit form show
            /// end edit form show
        },
        linkBind: function(linkString) {
            var linkChunks = linkString.split(':');
            return linkChunks[0] + ':' + this.get('itemData.' + linkChunks[1]);
        },
        onSaveClick: function(e) {
            var that = this,
                editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = cantCounterwAnchorsDrilling2Model.get('dataSource');

            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions2 = cantCounterwAnchorsDrilling2Model.get('_jsdoOptions'),
                        jsdo2 = new progress.data.JSDO(jsdoOptions2);
                    dataSourceOptions.transport.jsdo = jsdo2;
                    var dataSource2 = new kendo.data.DataSource(dataSourceOptions);

                dataSource2.filter({ field: "id", operator: "==", value: that.itemId });

                dataSource2.fetch(function() {
                    var view = dataSource2.data();
                        
                        var checkBox1List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox1().response.picklistData;
                        var checkBox2List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox2().response.picklistData;
                        var checkBox3List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox3().response.picklistData;
                        var checkBox4List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox4().response.picklistData;
                        var checkBox5List = app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox5().response.picklistData;

                        for(var i=0; i<checkBox1List.length; i++) {
                            if($("#checkbox1CCAD").is(':checked')) {
                                if(checkBox1List[i].name == "OK")
                                    itemData.set('Checkbox1', checkBox1List[i].id);
                            }
                            else if($("#checkbox1NotOkCCAD").is(':checked')) {
                                if(checkBox1List[i].name == "Not OK")
                                itemData.set('Checkbox1', checkBox1List[i].id);
                            }
                        }

                        for(var i=0; i<checkBox1List.length; i++) {
                            if($("#checkbox2CCAD").is(':checked')) {
                                if(checkBox2List[i].name == "OK")
                                    itemData.set('Checkbox2', checkBox2List[i].id);
                            }
                            else if($("#checkbox2NotOkCCAD").is(':checked')) {
                                if(checkBox2List[i].name == "Not OK")
                                itemData.set('Checkbox2', checkBox2List[i].id);
                            }
                        }

                        for(var i=0; i<checkBox3List.length; i++) {
                            if($("#checkbox3CCAD").is(':checked')) {
                                if(checkBox3List[i].name == "OK")
                                    itemData.set('Checkbox3', checkBox3List[i].id);
                            }
                            else if($("#checkbox3NotOkCCAD").is(':checked')) {
                                if(checkBox3List[i].name == "Not OK")
                                itemData.set('Checkbox3', checkBox3List[i].id);
                            }
                        }

                        for(var i=0; i<checkBox1List.length; i++) {
                            if($("#checkbox4CCAD").is(':checked')) {
                                if(checkBox4List[i].name == "OK")
                                    itemData.set('Checkbox4', checkBox4List[i].id);
                            }
                            else if($("#checkbox4NotOkCCAD").is(':checked')) {
                                if(checkBox4List[i].name == "Not OK")
                                itemData.set('Checkbox4', checkBox4List[i].id);
                            }
                        }

                        for(var i=0; i<checkBox5List.length; i++) {
                            if($("#checkbox5CCAD").is(':checked')) {
                                if(checkBox5List[i].name == "OK")
                                    itemData.set('Checkbox5', checkBox5List[i].id);
                            }
                            else if($("#checkbox5NotOkCCAD").is(':checked')) {
                                if(checkBox5List[i].name == "Not OK")
                                itemData.set('Checkbox5', checkBox5List[i].id);
                            }
                        }

                        if($("#completedCCAD").is(':checked')) {
                            itemData.set('Completed', true);
                        }

                        itemData.set('Comments5', editFormData.comments5);
                        itemData.set('Comments4', editFormData.comments4);
                        itemData.set('Comments3', editFormData.comments3);
                        itemData.set('Comments2', editFormData.comments2);
                        itemData.set('Comments1', editFormData.comments1);
                        itemData.set('signature', $("#signatureCCAD").jSignature("getData"));

                        var jsrow = jsdo2.findById(that.itemId);
                            var afterUpdateFn;
                            jsrow.assign(itemData);

                            afterUpdateFn = function (jsdo2, record, success, request) {
                                jsdo2.unsubscribe('afterUpdate', afterUpdateFn);
                                if (success === true) {
                                    app.mobileApp.navigate('#:back');
                                } else {
                                    alert("error")
                                }
                            };
                            jsdo2.subscribe('afterUpdate', afterUpdateFn);
                            jsdo2.saveChanges();
                });
            });
        },
        onCancel: function() {
            /// start edit form cancel
            /// end edit form cancel
        }
    }));

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('cantCounterwAnchorsDrilling2Model', cantCounterwAnchorsDrilling2Model);
            var param = parent.get('cantCounterwAnchorsDrilling2Model_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('cantCounterwAnchorsDrilling2Model_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('cantCounterwAnchorsDrilling2Model', cantCounterwAnchorsDrilling2Model);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = cantCounterwAnchorsDrilling2Model.get('_dataSourceOptions'),
            dataSource;

        if (param || isListmenu) {
            backbutton.show();
            backbutton.css('visibility', 'visible');
        } else {
            if (e.view.element.find('header [data-role="navbar"] [data-role="button"]').length) {
                backbutton.hide();
            } else {
                backbutton.css('visibility', 'hidden');
            }
        }

        if (!cantCounterwAnchorsDrilling2Model.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = cantCounterwAnchorsDrilling2Model.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                cantCounterwAnchorsDrilling2Model.set('dataSource', dataSource);

                fetchFilteredData(param);
            });
        } else {
            fetchFilteredData(param);
        }

    });

})(app.cantCounterwAnchorsDrilling2);

// START_CUSTOM_CODE_cantCounterwAnchorsDrilling2Model
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.cantCounterwAnchorsDrilling2.cantCounterwAnchorsDrilling2Model,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_cantCounterwAnchorsDrilling2Model