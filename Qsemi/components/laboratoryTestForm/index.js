'use strict';

app.laboratoryTestForm = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('laboratoryTestForm');

// START_CUSTOM_CODE_laboratoryTestForm
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_laboratoryTestForm
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('laboratoryTestFormModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('laboratoryTestFormModel_delayedFetch', paramFilter || null);
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
            name: 'LABORATORYTEST',
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
        laboratoryTestFormModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            RecievedReportList: '',
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
                var dataItem = e.dataItem || laboratoryTestFormModel.originalItem;

                app.mobileApp.navigate('#components/laboratoryTestForm/details.html?uid=' + dataItem.uid);

            },
            addClick: function() {
                app.mobileApp.navigate('#components/laboratoryTestForm/add.html');
            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/laboratoryTestForm/edit.html?uid=' + uid);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = laboratoryTestFormModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                laboratoryTestFormModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = laboratoryTestFormModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                laboratoryTestFormModel.set('originalItem', itemModel);
                laboratoryTestFormModel.set('currentItem',
                    laboratoryTestFormModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            saveWarningPopUp: function() {
                $("#warningPopUpLab").kendoMobileModalView("close");
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
             var $sigdiv = $("#signaturelab")
            $sigdiv.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                'color': 'black',
                 //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget. 
        },
        onShow: function(e) {
            e.view.scroller.reset();
            
             $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv = $("#signaturelab");
            // after some doodling...
            // $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

            //  dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = laboratoryTestFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                var dataSource = new kendo.data.DataSource(dataSourceOptions);
                laboratoryTestFormModel.set('dataSource', dataSource);
            // });

            laboratoryTestFormModel.RecievedReportList = app.laboratoryTestForm.laboratoryTestFormModel._dataSourceOptions.transport.jsdo.getPicklist_RECEIVED_REPORT().response.picklistData;
            
            $("#RECEIVED_REPORT").kendoDropDownList({
                dataTextField: "name",
                dataValueField: "id",
                dataSource: laboratoryTestFormModel.RecievedReportList,
            });

            this.set('addFormData', {
                concreteLaboratoTestResults: '',
                /// start add form data init
                /// end add form data init
            });
            /// start add form show
            /// end add form show
        },
        onCancel: function() {
            /// start add model cancel
            /// end add model cancel
        },
        // saveWarningPopUp: function() {
        //     $("#warningPopUpLab").kendoMobileModalView("close");
        // },
        openSignatureLPopUp: function(e) {
            $("#signaturelabPopUp").kendoMobileModalView("open");
        },
        closeSignaturePopUp: function(e) {
            if($("#signaturelab").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                document.getElementById("laboratorySignature").style.color = "red"; 
            }
            else document.getElementById("laboratorySignature").style.color = "black";
            $("#signaturelabPopUp").kendoMobileModalView("close");
        },
        onSaveClick: function(e) {
            var addFormData = this.get('addFormData'),
                filter = laboratoryTestFormModel && laboratoryTestFormModel.get('paramFilter'),
                dataSource = laboratoryTestFormModel.get('dataSource'),
                addModel = {};

            function saveModel(data) {
                /// start add form data save
                if($("#signaturelab").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                        // alert("need signature");
                        document.getElementById("warningPopUpLabText").innerHTML = app.laboratoryTestFormModel.get('strings').warningMessage.needSignature;//"Signature is missing";
                        $("#warningPopUpLab").kendoMobileModalView("open");
                        return;
                    }
                    
                addModel.R370259589 = app.elementDetailView.elementDetailViewModel.currentItem.id;
                var date =  moment($("#DateOfReport").val()).add(8,'h');
                addModel.DateOfReport = date.toString();//addFormData.DateOfReport;
                addModel.RECEIVED_REPORT = addFormData.RECEIVED_REPORT.id;
                addModel.AVARAGE_STRENGTH_MPa = addFormData.AVARAGE_STRENGTH_MPa;
                addModel.MINIMALSTRENGTHMPa = addFormData.MINIMALSTRENGTHMPa;
                addModel.APPLIANCE_WITH_CODEREQUIREMENTS = addFormData.APPLIANCE_WITH_CODEREQUIREMENTS;
                addModel.COMMENTS = addFormData.COMMENTS;
                addModel.signature = $("#signaturelab").jSignature("getData");
                /// end add form data save

                dataSource.add(addModel);
                dataSource.one('change', function(e) {
                    // alert("The check has been successfully saved");
                    window.plugins.toast.showWithOptions(
                    {
                        message: app.formDetailView.get('strings').toastsMessages.formSuccess,
                        duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                        position: "bottom",
                        addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                    });  
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
    }));

    parent.set('editItemViewModel', kendo.observable({
        /// start edit model properties
        /// end edit model properties
        /// start edit model functions
        /// end edit model functions
        editFormData: {},
        onShow: function(e) {
            var that = this,
                itemUid = e.view.params.uid,
                dataSource = laboratoryTestFormModel.get('dataSource'),
                itemData = dataSource.getByUid(itemUid),
                fixedData = laboratoryTestFormModel.fixHierarchicalData(itemData);

            /// start edit form before itemData
            /// end edit form before itemData

            this.set('itemData', itemData);
            this.set('editFormData', {
                concreteLaboratoTestResults: itemData.COMMENTS,
                /// start edit form data init
                /// end edit form data init
            });

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
                dataSource = laboratoryTestFormModel.get('dataSource');

            /// edit properties
            itemData.set('COMMENTS', editFormData.concreteLaboratoTestResults);
            /// start edit form data save
            /// end edit form data save

            function editModel(data) {
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
            editModel();
            /// end edit form save handler
        },
        onCancel: function() {
            /// start edit form cancel
            /// end edit form cancel
        }
    }));

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('laboratoryTestFormModel', laboratoryTestFormModel);
            var param = parent.get('laboratoryTestFormModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('laboratoryTestFormModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('laboratoryTestFormModel', laboratoryTestFormModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = laboratoryTestFormModel.get('_dataSourceOptions'),
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

        if (!laboratoryTestFormModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = laboratoryTestFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                laboratoryTestFormModel.set('dataSource', dataSource);

                fetchFilteredData(param);
            });
        } else {
            fetchFilteredData(param);
        }

    });

})(app.laboratoryTestForm);

// START_CUSTOM_CODE_laboratoryTestFormModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.laboratoryTestForm.laboratoryTestFormModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.laboratoryTestForm.laboratoryTestFormModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_laboratoryTestFormModel