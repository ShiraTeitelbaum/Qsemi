'use strict';

app.geotechnicalForm = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('geotechnicalForm');

// START_CUSTOM_CODE_geotechnicalForm
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_geotechnicalForm
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('geotechnicalFormModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('geotechnicalFormModel_delayedFetch', paramFilter || null);
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
            name: 'GEOTECHNICAL',
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
        geotechnicalFormModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            geoFlag: false,
            currentGeo: {},
            currentGeoId: '',
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
                var dataItem = e.dataItem || geotechnicalFormModel.originalItem;

                app.mobileApp.navigate('#components/geotechnicalForm/details.html?uid=' + dataItem.uid);

            },
            addClick: function() {
                app.mobileApp.navigate('#components/geotechnicalForm/add.html');
            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/geotechnicalForm/edit.html?uid=' + uid);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = geotechnicalFormModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                geotechnicalFormModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = geotechnicalFormModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                geotechnicalFormModel.set('originalItem', itemModel);
                geotechnicalFormModel.set('currentItem',
                    geotechnicalFormModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            saveWarningPopUpGeo: function () {
                $("#warningPopUpGeo").kendoMobileModalView("close"); 
            },
            /// start masterDetails view model functions
            /// end masterDetails view model functions
            currentItem: {}
        });

    parent.set('addItemViewModel', kendo.observable({
        /// start add model properties
        /// end add model properties
        /// start add model functions
        /// end add model functions
        onInit: function(e) {
            //  var $sigdiv = $("#signatureGeo")
            // $sigdiv.jSignature({
            //     'background-color': 'transparent',
            //     'decor-color': 'transparent',
            //      //'height':'8em'
            //     'width': '300',
            //     'height': '110'
            //     }) // inits the jSignature widget.
        },
        onShow: function(e) {
            e.view.scroller.reset();
            var that = this;

            //  $(".km-scroll-container").css("overflow", "hidden");
            // var $sigdiv = $("#signatureGeo");
            // after some doodling...
            // $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

            var elementid = e.view.params.elementId;
            var elementuid = e.view.params.elementUid;

            var jsdoOptions = geotechnicalFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
            var dataSource = new kendo.data.DataSource(dataSourceOptions);
                geotechnicalFormModel.set('dataSource', dataSource);
            
            dataSource.filter({ field: "R370259577", operator: "==", value: app.elementDetailView.elementDetailViewModel.currentItem.id });
            dataSource.fetch(function() {
                var view = dataSource.data();
                
                if(view.length > 0) {
                    geotechnicalFormModel.geoFlag = true;
                    geotechnicalFormModel.currentGeo = view[0];
                    geotechnicalFormModel.currentGeoId = view[0].id;
                    that.set('addFormData', {
                        DrillingDate: view[0].DrillingDate,
                        EstimatedUnit: view[0].EstimatedUnit,
                        TOP_LAYER: view[0].TOP_LAYER,
                        TopLayerTHICKNESS: view[0].TopLayerTHICKNESS,
                        SecondLayerUNIT: view[0].SecondLayerUNIT,
                        SecondLayerTHICKNESS: view[0].SecondLayerTHICKNESS,
                        ThirdLayerUNIT: view[0].ThirdLayerUNIT,
                        ThirdLayerTHICKNESS: view[0].ThirdLayerTHICKNESS,
                        TotalDepth: view[0].TotalDepth,
                        PlainTerraineStimated: view[0].PlainTerraineStimated,
                        PlainTerrainACTUAL: view[0].PlainTerrainACTUAL,
                        COMMENTS: view[0].COMMENTS,
                        signature: view[0].signature,
                        /// start add form data init
                        /// end add form data init
                    });
                     if($("#signatureGeo").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                            $sigdiv.jSignature("importData", view[0].signature);
                            document.getElementById("geotechnicalSignature").style.color = "red";
                        }
                }
                else {
                     that.geoFlag = false;
                    that.set('addFormData', {
                        DrillingDate: '',
                        EstimatedUnit: '',
                        TOP_LAYER: '',
                        TopLayerTHICKNESS: '',
                        SecondLayerUNIT: '',
                        SecondLayerTHICKNESS: '',
                        ThirdLayerUNIT: '',
                        ThirdLayerTHICKNESS: '',
                        TotalDepth: '',
                        PlainTerraineStimated: '',
                        PlainTerrainACTUAL: '',
                        COMMENTS: '',
                        signature: '',
                        /// start add form data init
                        /// end add form data init
                    });
                }
            });
            // this.set('addFormData', {
            //     secondLayerThickness: '',
            //     plainTerrainActual: '',
            //     /// start add form data init
            //     /// end add form data init
            // });
            /// start add form show
            /// end add form show
        },
        onCancel: function() {
            /// start add model cancel
            /// end add model cancel
        },
        // openSignatureGPopUp: function(e) {
        //     $("#signatureGeoPopUp").kendoMobileModalView("open"); 
        // },
        // closeSignaturePopUp: function(e) {
        //     $("#signatureGeoPopUp").kendoMobileModalView("close"); 
        // },
        onSaveClick: function(e) {
            var addFormData = this.get('addFormData'),
                filter = geotechnicalFormModel && geotechnicalFormModel.get('paramFilter'),
                dataSource = geotechnicalFormModel.get('dataSource'),
                addModel = {};
            
            if(this.geoFlag == false) {
                function saveModel(data) {
                    /// start add form data save
                    addModel.R370259577 = app.elementDetailView.elementDetailViewModel.currentItem.id;
                     var DrillingDate = moment($("#DrillingDate").val()).add(8,'h');
                    
                    addModel.DrillingDate = DrillingDate.toString(); //addFormData.secondLayerThickness;
                    addModel.EstimatedUnit = addFormData.EstimatedUnit;
                    addModel.TOP_LAYER = addFormData.TOP_LAYER;
                    addModel.TopLayerTHICKNESS = addFormData.TopLayerTHICKNESS;
                    addModel.SecondLayerUNIT = addFormData.SecondLayerUNIT;
                    addModel.SecondLayerTHICKNESS = addFormData.SecondLayerTHICKNESS;
                    addModel.ThirdLayerUNIT = addFormData.ThirdLayerUNIT;
                    addModel.ThirdLayerTHICKNESS = addFormData.ThirdLayerTHICKNESS;
                    addModel.TotalDepth = addFormData.TotalDepth;
                    addModel.PlainTerraineStimated = addFormData.PlainTerraineStimated;
                    addModel.PlainTerrainACTUAL = addFormData.PlainTerrainACTUAL;
                    addModel.COMMENTS = addFormData.COMMENTS;
                    addModel.signature = $("#signatureGeo").jSignature("getData"); //addFormData.plainTerrainActual;
                    /// end add form data save

                    dataSource.add(addModel);
                    dataSource.one('change', function(e) {
                        app.mobileApp.navigate('#:back');
                    });

                    dataSource.sync();

                    app.clearFormDomData('add-item-view');
                };

                /// start add form save
                /// end add form save
                /// start add form save handler
                saveModel();
                /// end add form save handler
            }
            else {
               var that = this,
                // editFormData = this.get('editFormData'),
                itemData = {};
                // dataSource = geotechnicalFormModel.get('dataSource');

                /// edit properties
                // itemData.R370259577 = app.elementDetailView.elementDetailViewModel.currentItem.id;
                itemData.DrillingDate = moment($("#DrillingDate").val()).add(8,'h'); //addFormData.secondLayerThickness;
                itemData.EstimatedUnit = addFormData.EstimatedUnit;
                itemData.TOP_LAYER = addFormData.TOP_LAYER;
                itemData.TopLayerTHICKNESS = addFormData.TopLayerTHICKNESS;
                itemData.SecondLayerUNIT = addFormData.SecondLayerUNIT;
                itemData.SecondLayerTHICKNESS = addFormData.SecondLayerTHICKNESS;
                itemData.ThirdLayerUNIT = addFormData.ThirdLayerUNIT;
                itemData.ThirdLayerTHICKNESS = addFormData.ThirdLayerTHICKNESS;
                itemData.TotalDepth = addFormData.TotalDepth;
                itemData.PlainTerraineStimated = addFormData.PlainTerraineStimated;
                itemData.PlainTerrainACTUAL = addFormData.PlainTerrainACTUAL;
                itemData.COMMENTS = addFormData.COMMENTS;
                itemData.signature = $("#signatureGeo").jSignature("getData"); //addFormData.plainTerrainActual;
                /// start edit form data save
                /// end edit form data save
              
                // function editModel(data) {
                //     /// start edit form data prepare
                //     /// end edit form data prepare
                //     dataSource.one('sync', function(e) {
                //         /// start edit form data save success
                //         /// end edit form data save success
                //         app.mobileApp.navigate('#:back');
                //     });

                //     dataSource.one('error', function() {
                //         dataSource.cancelChanges(itemData);
                //     });

                //     dataSource.sync();

                //     app.clearFormDomData('edit-item-view');
                // };
                // /// start edit form save
                // /// end edit form save
                // /// start edit form save handler
                // editModel();
                // /// end edit form save handler
            }
        }
    }));

    parent.set('editItemViewModel', kendo.observable({
        /// start edit model properties
        /// end edit model properties
        /// start edit model functions
        /// end edit model functions
        editFormData: {},
        onInit: function(e) {
                var $sigdiv = $("#signatureGeo")
            $sigdiv.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                 //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget.
        },
        onShow: function(e) {
             e.view.scroller.reset();

            document.getElementById("element_name11").innerHTML = app.elementDetailView.elementDetailViewModel.currentItem.name;
            document.getElementById("step_name11").innerHTML = (app.geotechnicalForm.get('strings').controlPanel.stage1name).toLowerCase();
            document.getElementById("form_name11").innerHTML = (app.geotechnicalForm.get('strings').stage0CoreForms.geotechnical).toLowerCase();
           
              $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv = $("#signatureGeo");
            // after some doodling...
            // $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

             var that = this,
                itemUid = e.view.params.uid,
                // dataSource = geotechnicalFormModel.get('dataSource'),
                itemData /*= dataSource.getByUid(itemUid)*/,
                fixedData /*= geotechnicalFormModel.fixHierarchicalData(itemData)*/;

             var jsdoOptions = geotechnicalFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
            var dataSource = new kendo.data.DataSource(dataSourceOptions);
             geotechnicalFormModel.set('dataSource', dataSource);

            dataSource.filter({ field: "R370259577", operator: "==", value: app.elementDetailView.elementDetailViewModel.currentItem.id });
            dataSource.fetch(function() {
                var view = dataSource.data();
               
                if(view.length > 0) {
                    geotechnicalFormModel.geoFlag = true;
                    geotechnicalFormModel.currentGeo = view[0];
                    geotechnicalFormModel.currentGeoId = view[0].id;
                    itemData = dataSource.getByUid(view[0].uid);
                    
                    var comments;
                    if(itemData.COMMENTS == "null")
                        comments = '';
                    else comments = itemData.COMMENTS;

                    fixedData = geotechnicalFormModel.fixHierarchicalData(itemData);
                    that.set('itemData', itemData);
                    that.set('editFormData', {
                        R370259577: itemData.R370259577,
                        DrillingDate: itemData.DrillingDate,
                        EstimatedUnit: itemData.EstimatedUnit,
                        TOP_LAYER: itemData.TOP_LAYER,
                        TopLayerTHICKNESS: itemData.TopLayerTHICKNESS,
                        SecondLayerUNIT: itemData.SecondLayerUNIT,
                        SecondLayerTHICKNESS: itemData.SecondLayerTHICKNESS,
                        ThirdLayerUNIT: itemData.ThirdLayerUNIT,
                        ThirdLayerTHICKNESS: itemData.ThirdLayerTHICKNESS,
                        TotalDepth: itemData.TotalDepth,
                        PlainTerraineStimated: itemData.PlainTerraineStimated,
                        PlainTerrainACTUAL: itemData.PlainTerrainACTUAL,
                        COMMENTS: comments,//itemData.COMMENTS,
                        signature: itemData.signature
                        /// start edit form data init
                        /// end edit form data init
                    });
                     if(itemData.signature != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                            $sigdiv.jSignature("importData", itemData.signature);
                            document.getElementById("geotechnicalSignature").style.color = "red";
                        }
                }
                else {
                    geotechnicalFormModel.geoFlag = false;
                    that.set('itemData', itemData);
                    that.set('editFormData', {
                        R370259577: '',
                        DrillingDate: '',
                        EstimatedUnit: '',
                        TOP_LAYER: '',
                        TopLayerTHICKNESS: '',
                        SecondLayerUNIT: '',
                        SecondLayerTHICKNESS: '',
                        ThirdLayerUNIT: '',
                        ThirdLayerTHICKNESS: '',
                        TotalDepth: '',
                        PlainTerraineStimated: '',
                        PlainTerrainACTUAL: '',
                        COMMENTS: '',
                        signature: ''
                        /// start edit form data init
                        /// end edit form data init
                    });
                    document.getElementById("geotechnicalSignature").style.color = "black";
                    $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.
                }
            });

           
            /// start edit form before itemData
            /// end edit form before itemData
            
            /// start edit form show
            /// end edit form show
        },
        linkBind: function(linkString) {
            var linkChunks = linkString.split(':');
            return linkChunks[0] + ':' + this.get('itemData.' + linkChunks[1]);
        },
        // saveWarningPopUpGeo: function () {
        //     $("#warningPopUpGeo").kendoMobileModalView("close"); 
        // },
         openSignatureGPopUp: function(e) {
            $("#signatureGeoPopUp").kendoMobileModalView("open"); 
        },
        closeSignaturePopUp: function(e) {
            $("#signatureGeoPopUp").kendoMobileModalView("close");
            if($("#signatureGeo").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                document.getElementById("geotechnicalSignature").style.color = "red";
            }
            else  document.getElementById("geotechnicalSignature").style.color = "black";
        },
        onSaveClick: function(e) {
            var that = this,
                editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = geotechnicalFormModel.get('dataSource');
            if($("#DrillingDate").val() == '' || editFormData.EstimatedUnit == '' || editFormData.TOP_LAYER == '' || editFormData.TopLayerTHICKNESS == '' ||
            editFormData.SecondLayerUNIT == '' || editFormData.ThirdLayerTHICKNESS == '' || editFormData.TotalDepth == '' ||
            editFormData.PlainTerraineStimated == '' || editFormData.PlainTerrainACTUAL == '') {
                document.getElementById("warningPopUpGeoText").innerHTML = app.geotechnicalForm.get('strings').warningMessage.detailsMissing;//"Signature is missing";
                $("#warningPopUpGeo").kendoMobileModalView("open");
                return;
            }

            if($("#signatureGeo").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                document.getElementById("warningPopUpGeoText").innerHTML = app.geotechnicalForm.get('strings').warningMessage.needSignature;//"Signature is missing";
                $("#warningPopUpGeo").kendoMobileModalView("open");
                return;
            }

            // var date = moment($("#DrillingDate").val()).add(8,'h');

            if(geotechnicalFormModel.geoFlag == true) {
                // itemData.set('R370259577', editFormData.R370259577);
                 var date = /*$("#DrillingDate").val(); //*/ moment($("#DrillingDate").val()).add(8,'h');
                itemData.set('DrillingDate', date.toString());
                itemData.set('EstimatedUnit', editFormData.EstimatedUnit);
                itemData.set('TOP_LAYER', editFormData.TOP_LAYER);
                itemData.set('TopLayerTHICKNESS', editFormData.TopLayerTHICKNESS);
                itemData.set('SecondLayerUNIT', editFormData.SecondLayerUNIT);
                itemData.set('SecondLayerTHICKNESS', editFormData.SecondLayerTHICKNESS);
                itemData.set('ThirdLayerUNIT', editFormData.ThirdLayerUNIT);
                itemData.set('ThirdLayerTHICKNESS', editFormData.ThirdLayerTHICKNESS);
                itemData.set('TotalDepth', editFormData.TotalDepth);
                itemData.set('PlainTerraineStimated', editFormData.PlainTerraineStimated);
                itemData.set('PlainTerrainACTUAL', editFormData.PlainTerrainACTUAL);
                itemData.set('COMMENTS', editFormData.COMMENTS);
                itemData.set('signature', $("#signatureGeo").jSignature("getData"));

                 function editModel(data) {
                    /// start edit form data prepare
                    /// end edit form data prepare
                    dataSource.one('sync', function(e) {
                        /// start edit form data save success
                        /// end edit form data save success
                        window.plugins.toast.showWithOptions(
                        {
                            message: app.formDetailView.get('strings').toastsMessages.formSuccess,
                            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                            position: "bottom",
                            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                        }); 
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
                editModel();
                /// end edit form save handler
            }
            else {
                if(itemData == undefined)
                    itemData = {};
                itemData.R370259577 = app.elementDetailView.elementDetailViewModel.currentItem.id;
                var date = /*$("#DrillingDate").val(); //*/ moment($("#DrillingDate").val()).add(8,'h');
                itemData.DrillingDate = date.toString();
                itemData.EstimatedUnit = editFormData.EstimatedUnit;
                itemData.TOP_LAYER = editFormData.TOP_LAYER;
                itemData.TopLayerTHICKNESS = editFormData.TopLayerTHICKNESS;
                itemData.SecondLayerUNIT = editFormData.SecondLayerUNIT;
                itemData.SecondLayerTHICKNESS = editFormData.SecondLayerTHICKNESS;
                itemData.ThirdLayerUNIT = editFormData.ThirdLayerUNIT;
                itemData.ThirdLayerTHICKNESS = editFormData.ThirdLayerTHICKNESS;
                itemData.TotalDepth = editFormData.TotalDepth;
                itemData.PlainTerraineStimated = editFormData.PlainTerraineStimated;
                itemData.PlainTerrainACTUAL = editFormData.PlainTerrainACTUAL;
                itemData.COMMENTS = editFormData.COMMENTS;
                itemData.signature = $("#signatureGeo").jSignature("getData");

                var jsdoOptions = geotechnicalFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);

                var jsrow = jsdo.add(itemData);
                var afterCreateFn;
                afterCreateFn = function (jsdo, record, success, request) {
                    jsdo.unsubscribeAll('afterCreate', afterCreateFn);
                    if (success == true) {
                        app.clearFormDomData('edit-item-view');
                        window.plugins.toast.showWithOptions(
                        {
                            message: app.formDetailView.get('strings').toastsMessages.formSuccess,
                            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                            position: "bottom",
                            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                        }); 
                        app.mobileApp.navigate('#:back');
                    }
                    else {
                        // alert("error")
                    }
                };
                jsdo.subscribe('afterCreate', afterCreateFn);
                jsdo.saveChanges();
            }
            /// edit properties
            /// start edit form data save
            /// end edit form data save
        },
        onCancel: function() {
            /// start edit form cancel
            /// end edit form cancel
        }
    }));

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('geotechnicalFormModel', geotechnicalFormModel);
            var param = parent.get('geotechnicalFormModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('geotechnicalFormModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('geotechnicalFormModel', geotechnicalFormModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = geotechnicalFormModel.get('_dataSourceOptions'),
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

        // if (!geotechnicalFormModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = geotechnicalFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                geotechnicalFormModel.set('dataSource', dataSource);

                fetchFilteredData(param);
            });
        // } else {
        //     fetchFilteredData(param);
        // }

    });

})(app.geotechnicalForm);

// START_CUSTOM_CODE_geotechnicalFormModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.geotechnicalForm.geotechnicalFormModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.geotechnicalForm.geotechnicalFormModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_geotechnicalFormModel