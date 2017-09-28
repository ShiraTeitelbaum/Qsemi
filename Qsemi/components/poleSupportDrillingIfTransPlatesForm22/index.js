'use strict';

app.poleSupportDrillingIfTransPlatesForm22 = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('poleSupportDrillingIfTransPlatesForm22');

// START_CUSTOM_CODE_poleSupportDrillingIfTransPlatesForm22
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_poleSupportDrillingIfTransPlatesForm22
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties
        current,
        processImage = function(img) {
            if (!img) {
                var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
                img = 'data:image/png;base64,' + empty1x1png;
            }
            return img;
        },
        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('poleSupportDrillingIfTransPlatesForm22Model'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('poleSupportDrillingIfTransPlatesForm22Model_delayedFetch', paramFilter || null);
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
            name: 'POLE_SUPPORT_DRILLING__IF__TRANS_PLATES',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                if(type == "read") { current = response; }
                if(type == "create") { current = response; }
                 if(type == "update") { current = response; }
            },
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
        poleSupportDrillingIfTransPlatesForm22Model = kendo.observable({
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
                var dataItem = e.dataItem || poleSupportDrillingIfTransPlatesForm22Model.originalItem;

                app.mobileApp.navigate('#components/poleSupportDrillingIfTransPlatesForm22/edit.html?uid=' + dataItem.uid); //details

            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/poleSupportDrillingIfTransPlatesForm22/edit.html?uid=' + uid);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = poleSupportDrillingIfTransPlatesForm22Model.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                poleSupportDrillingIfTransPlatesForm22Model.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = poleSupportDrillingIfTransPlatesForm22Model.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                poleSupportDrillingIfTransPlatesForm22Model.set('originalItem', itemModel);
                poleSupportDrillingIfTransPlatesForm22Model.set('currentItem',
                    poleSupportDrillingIfTransPlatesForm22Model.fixHierarchicalData(itemModel));

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
             var $sigdiv = $("#signaturePSDTP")
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
            var $sigdiv = $("#signaturePSDTP");
            // after some doodling...
            $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

            var that = this,
                element_id = e.view.params.elementId,
                element_uid = e.view.params.elementUid,
                dataSource = poleSupportDrillingIfTransPlatesForm22Model.get('dataSource'),
                itemData, fixedData;
            
                app.mobileApp.showLoading();
            /// start edit form before itemData
                var jsdoOptions2 = poleSupportDrillingIfTransPlatesForm22Model.get('_jsdoOptions'),
                    jsdo2 = new progress.data.JSDO(jsdoOptions2);
                dataSourceOptions.transport.jsdo = jsdo2;
                var dataSource2 = new kendo.data.DataSource(dataSourceOptions);
                dataSource2.filter({ field: "R363890801", operator: "==", value: element_id });

                dataSource2.fetch(function() {
                    var view = dataSource2.data();
                   
                    that.itemUid = view[0].uid;
                    that.itemId = view[0].id;
                    itemData = dataSource2.getByUid(view[0].uid);
                    fixedData = poleSupportDrillingIfTransPlatesForm22Model.fixHierarchicalData(itemData);

                     var checkBox1List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox1().response.picklistData;
                     var checkBox2List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox2().response.picklistData;
                     var checkBox3List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox3().response.picklistData;
                     var checkBox4List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox4().response.picklistData;
                     var checkBox5List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox5().response.picklistData;
                     
                     if(itemData.Checkbox1 != "null") {
                        for(var i=0; i<checkBox1List.length; i++) {
                            if(itemData.Checkbox1 == checkBox1List[i].id && checkBox1List[i].name == "OK") {
                                $("#checkbox1PSDTP").attr("checked", true);
                            }
                            else if(itemData.Checkbox1 == checkBox1List[i].id && checkBox1List[i].name == "Not OK") {
                                $("#checkbox1NotOkPSDTP").attr("checked", true);
                                $("#comments1FieldPSDTP").show();
                            }
                        }
                     }
                     if(itemData.Checkbox2 != "null") {
                        for(var i=0; i<checkBox2List.length; i++) {
                            if(itemData.Checkbox2 == checkBox2List[i].id && checkBox2List[i].name == "OK") {
                                $("#checkbox2PSDTP").attr("checked", true);
                            }
                            else if(itemData.Checkbox2 == checkBox2List[i].id && checkBox2List[i].name == "Not OK") {
                                $("#checkbox2NotOkPSDTP").attr("checked", true);
                                $("#comments2FieldPSDTP").show();
                            }
                        }
                     }
                     if(itemData.Checkbox3 != "null") {
                        for(var i=0; i<checkBox3List.length; i++) {
                            if(itemData.Checkbox3 == checkBox3List[i].id && checkBox3List[i].name == "OK") {
                                $("#checkbox3PSDTP").attr("checked", true);
                            }
                            else if(itemData.Checkbox3 == checkBox3List[i].id && checkBox3List[i].name == "Not OK") {
                                $("#checkbox3NotOkPSDTP").attr("checked", true);
                                $("#comments3FieldPSDTP").show();
                            }
                        }
                     }
                     if(itemData.Checkbox4 != "null") {
                        for(var i=0; i<checkBox4List.length; i++) {
                            if(itemData.Checkbox4 == checkBox4List[i].id && checkBox4List[i].name == "OK") {
                                $("#checkbox4PSDTP").attr("checked", true);
                            }
                            else if(itemData.Checkbox4 == checkBox4List[i].id && checkBox4List[i].name == "Not OK") {
                                $("#checkbox4NotOkPSDTP").attr("checked", true);
                                $("#comments4FieldPSDTP").show();
                            }
                        }
                     }
                     if(itemData.Checkbox5 != "null") {
                        for(var i=0; i<checkBox5List.length; i++) {
                            if(itemData.Checkbox5 == checkBox5List[i].id && checkBox5List[i].name == "OK") {
                                $("#checkbox5PSDTP").attr("checked", true);
                            }
                            else if(itemData.Checkbox5 == checkBox5List[i].id && checkBox5List[i].name == "Not OK") {
                                $("#checkbox5NotOkPSDTP").attr("checked", true);
                                $("#comments5FieldPSDTP").show();
                            }
                        }
                     }

                     if(itemData.Completed == true) {
                         $("#completedPSDTP").attr("checked", true);
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
            /// end edit form before itemData

            /// start edit form show
            $("#comments1FieldPSDTP").hide();
            $("#comments2FieldPSDTP").hide();
            $("#comments3FieldPSDTP").hide();
            $("#comments4FieldPSDTP").hide();
            $("#comments5FieldPSDTP").hide();
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
                dataSource = poleSupportDrillingIfTransPlatesForm22Model.get('dataSource');
                
                dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                    var jsdoOptions2 = poleSupportDrillingIfTransPlatesForm22Model.get('_jsdoOptions'),
                        jsdo2 = new progress.data.JSDO(jsdoOptions2);
                    dataSourceOptions.transport.jsdo = jsdo2;
                    var dataSource2 = new kendo.data.DataSource(dataSourceOptions);

                    dataSource2.filter({ field: "id", operator: "==", value: that.itemId });
                    
                    dataSource2.fetch(function() {
                        var view = dataSource2.data();
                        
                        var checkBox1List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox1().response.picklistData;
                        var checkBox2List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox2().response.picklistData;
                        var checkBox3List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox3().response.picklistData;
                        var checkBox4List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox4().response.picklistData;
                        var checkBox5List = app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model._dataSourceOptions.transport.jsdo.getPicklist_Checkbox5().response.picklistData;

                        for(var i=0; i<checkBox1List.length; i++) {
                            if($("#checkbox1PSDTP").is(':checked')) {
                                if(checkBox1List[i].name == "OK")
                                    itemData.set('Checkbox1', checkBox1List[i].id);
                            }
                            else if($("#checkbox1NotOkPSDTP").is(':checked')) {
                                if(checkBox1List[i].name == "Not OK")
                                itemData.set('Checkbox1', checkBox1List[i].id);
                            }
                        }

                        for(var i=0; i<checkBox1List.length; i++) {
                            if($("#checkbox2PSDTP").is(':checked')) {
                                if(checkBox2List[i].name == "OK")
                                    itemData.set('Checkbox2', checkBox2List[i].id);
                            }
                            else if($("#checkbox2NotOkPSDTP").is(':checked')) {
                                if(checkBox2List[i].name == "Not OK")
                                itemData.set('Checkbox2', checkBox2List[i].id);
                            }
                        }

                        for(var i=0; i<checkBox3List.length; i++) {
                            if($("#checkbox3PSDTP").is(':checked')) {
                                if(checkBox3List[i].name == "OK")
                                    itemData.set('Checkbox3', checkBox3List[i].id);
                            }
                            else if($("#checkbox3NotOkPSDTP").is(':checked')) {
                                if(checkBox3List[i].name == "Not OK")
                                itemData.set('Checkbox3', checkBox3List[i].id);
                            }
                        }

                        for(var i=0; i<checkBox1List.length; i++) {
                            if($("#checkbox4PSDTP").is(':checked')) {
                                if(checkBox4List[i].name == "OK")
                                    itemData.set('Checkbox4', checkBox4List[i].id);
                            }
                            else if($("#checkbox4NotOkPSDTP").is(':checked')) {
                                if(checkBox4List[i].name == "Not OK")
                                itemData.set('Checkbox4', checkBox4List[i].id);
                            }
                        }

                        for(var i=0; i<checkBox5List.length; i++) {
                            if($("#checkbox5PSDTP").is(':checked')) {
                                if(checkBox5List[i].name == "OK")
                                    itemData.set('Checkbox5', checkBox5List[i].id);
                            }
                            else if($("#checkbox5NotOkPSDTP").is(':checked')) {
                                if(checkBox5List[i].name == "Not OK")
                                itemData.set('Checkbox5', checkBox5List[i].id);
                            }
                        }

                        if($("#completedPSDTP").is(':checked')) {
                            itemData.set('Completed', true);
                        }

                        itemData.set('Comments5', editFormData.comments5);
                        itemData.set('Comments4', editFormData.comments4);
                        itemData.set('Comments3', editFormData.comments3);
                        itemData.set('Comments2', editFormData.comments2);
                        itemData.set('Comments1', editFormData.comments1);
                        itemData.set('signature', $("#signaturePSDTP").jSignature("getData"));
                        
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
             
            /// start edit form data save
            /// end edit form data save
            /// start edit form save
            /// end edit form save
            /// start edit form save handler
            /// end edit form save handler
        },
        onCancel: function() {
            /// start edit form cancel
            var itemData = this.get('itemData'),
                dataSource = poleSupportDrillingIfTransPlatesForm22Model.get('dataSource');
            dataSource.cancelChanges(itemData);
            /// end edit form cancel
        }
    }));

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('poleSupportDrillingIfTransPlatesForm22Model', poleSupportDrillingIfTransPlatesForm22Model);
            var param = parent.get('poleSupportDrillingIfTransPlatesForm22Model_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('poleSupportDrillingIfTransPlatesForm22Model_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('poleSupportDrillingIfTransPlatesForm22Model', poleSupportDrillingIfTransPlatesForm22Model);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = poleSupportDrillingIfTransPlatesForm22Model.get('_dataSourceOptions'),
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

        if (!poleSupportDrillingIfTransPlatesForm22Model.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = poleSupportDrillingIfTransPlatesForm22Model.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                poleSupportDrillingIfTransPlatesForm22Model.set('dataSource', dataSource);

                fetchFilteredData(param);
            });
        } else {
            fetchFilteredData(param);
        }

    });

})(app.poleSupportDrillingIfTransPlatesForm22);

// START_CUSTOM_CODE_poleSupportDrillingIfTransPlatesForm22Model
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.poleSupportDrillingIfTransPlatesForm22.poleSupportDrillingIfTransPlatesForm22Model,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_poleSupportDrillingIfTransPlatesForm22Model