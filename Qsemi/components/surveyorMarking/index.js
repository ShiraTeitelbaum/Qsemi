'use strict';

app.surveyorMarking = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('surveyorMarking');

// START_CUSTOM_CODE_surveyorMarking
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_surveyorMarking
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('surveyorMarkingModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('surveyorMarkingModel_delayedFetch', paramFilter || null);
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
            name: 'surveyor_Marking',
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
        surveyorMarkingModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            mapFlag: false,
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
                var dataItem = e.dataItem || surveyorMarkingModel.originalItem;

                //app.mobileApp.navigate('#components/surveyorMarking/details.html?uid=' + dataItem.uid);
                app.mobileApp.navigate('#components/surveyorMarking/edit.html?uid=' + dataItem.uid);

            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/surveyorMarking/edit.html?uid=' + uid);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = surveyorMarkingModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                surveyorMarkingModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = surveyorMarkingModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                surveyorMarkingModel.set('originalItem', itemModel);
                surveyorMarkingModel.set('currentItem',
                    surveyorMarkingModel.fixHierarchicalData(itemModel));

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
            var $sigdiv = $("#signatureS")
            $sigdiv.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                 //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget. 
        },
        onShow: function(e) {
            if(surveyorMarkingModel.mapFlag == false) {
                $(".km-scroll-container").css( "overflow", "hidden" );
                var $sigdiv = $("#signatureS");
                // after some doodling...
                $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.
            }
            
            console.log("on show")
            //alert("on show")
            app.elementLocationMaps.elementLocationMapsModel.counter = 0;
            
            var that = this,
                //itemUid = e.view.params.uid,
                element_id = e.view.params.elementId,
                element_uid = e.view.params.elementUid,
                dataSource = surveyorMarkingModel.get('dataSource'),
                itemData, fixedData;
                //itemData = dataSource.getByUid(itemUid),
                //fixedData = surveyorMarkingModel.fixHierarchicalData(itemData);

                app.mobileApp.showLoading();
            /// start edit form before itemData
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions2 = surveyorMarkingModel.get('_jsdoOptions'),
                    jsdo2 = new progress.data.JSDO(jsdoOptions2);
                dataSourceOptions.transport.jsdo = jsdo2;
                var dataSource2 = new kendo.data.DataSource(dataSourceOptions);
                dataSource2.filter({ field: "R364448909", operator: "==", value: element_id });

                dataSource2.fetch(function() {
                    var view = dataSource2.data();
                    console.log("view")
                    console.log(view)
                    that.itemUid = view[0].uid;
                    that.itemId = view[0].id;
                    itemData = dataSource2.getByUid(view[0].uid);
                    fixedData = surveyorMarkingModel.fixHierarchicalData(itemData);
                    console.log("itemData")
                    console.log(itemData)

                     var IDPointsradioButtonList = app.surveyorMarking.surveyorMarkingModel._dataSourceOptions.transport.jsdo.getPicklist_IDPointsAndKP().response.picklistData;
                     var surveyorMarkingradioButtonList = app.surveyorMarking.surveyorMarkingModel._dataSourceOptions.transport.jsdo.getPicklist_surveyorMarkingInTheField().response.picklistData;
                     
                     if(surveyorMarkingModel.mapFlag == false) {
                        if(itemData.IDPointsAndKP != "null") {
                            for(var i=0; i<IDPointsradioButtonList.length; i++) {
                                if(itemData.IDPointsAndKP == IDPointsradioButtonList[i].id && IDPointsradioButtonList[i].name == "OK") {
                                    $("#idpointsAndKpokS").attr("checked", true);
                                }
                                else if(itemData.IDPointsAndKP == IDPointsradioButtonList[i].id && IDPointsradioButtonList[i].name == "Not OK") {
                                    $("#idpointsAndKpnotOkS").attr("checked", true);
                                }
                            }
                        }

                        if(itemData.surveyorMarkingInTheField != "null") {
                            for(var i=0; i<surveyorMarkingradioButtonList.length; i++) {
                                if(itemData.surveyorMarkingInTheField == surveyorMarkingradioButtonList[i].id && surveyorMarkingradioButtonList[i].name == "Normal") {
                                    $("#surveyorMarkingInTheFieldOkS").attr("checked", true);
                                }
                                else if(itemData.surveyorMarkingInTheField == surveyorMarkingradioButtonList[i].id && surveyorMarkingradioButtonList[i].name == "Not Normal") {
                                    $("#surveyorMarkingInTheFieldNotOkS").attr("checked", true);
                                }
                            }
                        }

                        if(itemData.Completed == true) {
                            $("#completedS").attr("checked", true);
                        }

                        if(itemData.signature != "null")
                            $sigdiv.jSignature("importData", itemData.signature)

                        //ThereticalCapacity
                        //PileCastingHeightMarked

                        that.set('itemData', itemData);
                        that.set('editFormData', {
                            thereticalCapacity: itemData.ThereticalCapacity,
                            pileCastingHeightMarked: itemData.PileCastingHeightMarked,
                            /// start edit form data init
                            /// end edit form data init
                        });
                     }
                    app.mobileApp.hideLoading();
                });
            });
            /// end edit form before itemData

            //this.set('itemData', itemData);
            //this.set('editFormData', {
                /*thereticalCapacity: itemData.ThereticalCapacity,
                surveyorMarkingInTheFieldNotOk: itemData.surveyorMarkingInTheField,
                surveyorMarkingInTheFieldOk: itemData.surveyorMarkingInTheField,
                pileCastingHeightMarked: itemData.PileCastingHeightMarked,
                idpointsAndKpnotOk: itemData.IDPointsAndKP,
                idpointsAndKpok: itemData.IDPointsAndKP,
                group1_changed: false,*/
                /// start edit form data init
                /// end edit form data init
            //});

            /// start edit form show
            /// end edit form show
        },
        linkBind: function(linkString) {
            var linkChunks = linkString.split(':');
            return linkChunks[0] + ':' + this.get('itemData.' + linkChunks[1]);
        },
        openMap: function () {
            surveyorMarkingModel.mapFlag=true;
            app.mobileApp.navigate('#components/elementLocationMaps/view.html');
        },
        onSaveClick: function(e) {
            var that = this,
                editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = surveyorMarkingModel.get('dataSource');

                dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                    var jsdoOptions2 = surveyorMarkingModel.get('_jsdoOptions'),
                        jsdo2 = new progress.data.JSDO(jsdoOptions2);
                    dataSourceOptions.transport.jsdo = jsdo2;
                    var dataSource2 = new kendo.data.DataSource(dataSourceOptions);

                    dataSource2.filter({ field: "id", operator: "==", value: that.itemId });
                    
                    dataSource2.fetch(function() {
                        var view = dataSource2.data();
                        
                        var IDPointsradioButtonList = app.surveyorMarking.surveyorMarkingModel._dataSourceOptions.transport.jsdo.getPicklist_IDPointsAndKP().response.picklistData;
                        var surveyorMarkingradioButtonList = app.surveyorMarking.surveyorMarkingModel._dataSourceOptions.transport.jsdo.getPicklist_surveyorMarkingInTheField().response.picklistData;

                        for(var i=0; i<IDPointsradioButtonList.length; i++) {
                            if($("#idpointsAndKpokS").is(':checked')) {
                                if(IDPointsradioButtonList[i].name == "OK")
                                    itemData.set('IDPointsAndKP', IDPointsradioButtonList[i].id);
                            }
                            else if($("#idpointsAndKpnotOkS").is(':checked')) {
                                if(IDPointsradioButtonList[i].name == "Not OK")
                                itemData.set('IDPointsAndKP', IDPointsradioButtonList[i].id);
                            }
                        }

                        for(var i=0; i<surveyorMarkingradioButtonList.length; i++) {
                            if($("#surveyorMarkingInTheFieldOkS").is(':checked')) {
                                if(surveyorMarkingradioButtonList[i].name == "Normal")
                                    itemData.set('surveyorMarkingInTheField', surveyorMarkingradioButtonList[i].id);
                            }
                            else if($("#surveyorMarkingInTheFieldNotOkS").is(':checked')) {
                                if(surveyorMarkingradioButtonList[i].name == "Not Normal")
                                itemData.set('surveyorMarkingInTheField', surveyorMarkingradioButtonList[i].id);
                            }
                        }

                        if($("#completedS").is(':checked')) {
                            itemData.set('Completed', true);
                        }

                        itemData.set('ThereticalCapacity', editFormData.thereticalCapacity);
                        itemData.set('PileCastingHeightMarked', editFormData.pileCastingHeightMarked);
                        itemData.set('signature', $("#signatureS").jSignature("getData"));

                        var jsrow = jsdo2.findById(that.itemId);
                            var afterUpdateFn;
                            jsrow.assign(itemData);

                            afterUpdateFn = function (jsdo2, record, success, request) {
                                jsdo2.unsubscribe('afterUpdate', afterUpdateFn);
                                if (success === true) {
                                    //app.mobileApp.navigate('#:back');

                                    var jsdoOptions3 = app.elementDetailView.elementDetailViewModel.get('_jsdoOptions'),
                                        jsdo3 = new progress.data.JSDO(jsdoOptions3);
                                    dataSourceOptions.transport.jsdo = jsdo3;
                                    var dataSource3 = new kendo.data.DataSource(dataSourceOptions);

                                    dataSource3.filter({ field: "id", operator: "==", value: app.elementDetailView.elementDetailViewModel.currentItem.id });

                                    dataSource3.fetch(function() {
                                        var element = dataSource3.data();
                                        
                                        var tmp = (app.elementDetailView.elementDetailViewModel.marker.position).toString().split(",");
                                        var lat = parseFloat((tmp[0]).substr(1, tmp[0].length)).toFixed(8);
                                        var lng = parseFloat((tmp[1]).substr(1, tmp[1].length-2)).toFixed(8);

                                        var elementLocation = {
                                            Latitude: lat,
                                            Longtitud: lng
                                        };
                                        
                                        var jsrow = jsdo3.findById(app.elementDetailView.elementDetailViewModel.currentItem.id);
                                        var afterUpdateFn;
                                        jsrow.assign(elementLocation);

                                        afterUpdateFn = function (jsdo3, record, success, request) {
                                            jsdo3.unsubscribe('afterUpdate', afterUpdateFn);
                                            if (success === true) {
                                                //app.mobileApp.navigate('#:back');
                                            } else {
                                                alert("error")
                                            }
                                        };
                                        jsdo3.subscribe('afterUpdate', afterUpdateFn);
                                        jsdo3.saveChanges();
                                    });
                                } else {
                                    alert("error")
                                }
                            };
                            jsdo2.subscribe('afterUpdate', afterUpdateFn);
                            jsdo2.saveChanges();
                            app.mobileApp.navigate('#:back');
                    });
                });
            /// edit properties
            /*itemData.set('ThereticalCapacity', editFormData.thereticalCapacity);
            if (itemData.surveyorMarkingInTheField !== editFormData.surveyorMarkingInTheFieldNotOk && !editFormData.group1_changed) {
                itemData.set('surveyorMarkingInTheField', editFormData.surveyorMarkingInTheFieldNotOk);
                editFormData.group1_changed = true;
            }
            if (itemData.surveyorMarkingInTheField !== editFormData.surveyorMarkingInTheFieldOk && !editFormData.group1_changed) {
                itemData.set('surveyorMarkingInTheField', editFormData.surveyorMarkingInTheFieldOk);
                editFormData.group1_changed = true;
            }
            itemData.set('PileCastingHeightMarked', editFormData.pileCastingHeightMarked);
            if (itemData.IDPointsAndKP !== editFormData.idpointsAndKpnotOk && !editFormData.group1_changed) {
                itemData.set('IDPointsAndKP', editFormData.idpointsAndKpnotOk);
                editFormData.group1_changed = true;
            }
            if (itemData.IDPointsAndKP !== editFormData.idpointsAndKpok && !editFormData.group1_changed) {
                itemData.set('IDPointsAndKP', editFormData.idpointsAndKpok);
                editFormData.group1_changed = true;
            }*/
            /// start edit form data save
            /// end edit form data save

            /*function editModel(data) {
                /// start edit form data prepare
                /// end edit form data prepare
                dataSource.one('sync', function(e) {
                    /// start edit form data save success
                    /// end edit form data save success
                    app.mobileApp.navigate('#:back');
                });

                dataSource.one('error', function() {
                    dataSource.cancelChanges(itemData);
                });

                dataSource.sync();

                app.clearFormDomData('edit-item-view');
            };
            /// start edit form save
            /// end edit form save
            /// start edit form save handler
            editModel();*/
            /// end edit form save handler
        },
        onCancel: function() {
            /// start edit form cancel
            app.elementDetailView.elementDetailViewModel.marker = null;
            app.surveyorMarking.surveyorMarkingModel.mapFlag=false;
            /// end edit form cancel
        }
    }));

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('surveyorMarkingModel', surveyorMarkingModel);
            var param = parent.get('surveyorMarkingModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('surveyorMarkingModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('surveyorMarkingModel', surveyorMarkingModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = surveyorMarkingModel.get('_dataSourceOptions'),
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

        if (!surveyorMarkingModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = surveyorMarkingModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                surveyorMarkingModel.set('dataSource', dataSource);

                fetchFilteredData(param);
            });
        } else {
            fetchFilteredData(param);
        }

    });

})(app.surveyorMarking);

// START_CUSTOM_CODE_surveyorMarkingModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.surveyorMarking.surveyorMarkingModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.surveyorMarking.surveyorMarkingModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_surveyorMarkingModel