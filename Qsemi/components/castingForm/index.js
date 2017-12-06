'use strict';

app.castingForm = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('castingForm');

// START_CUSTOM_CODE_castingForm
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_castingForm
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
            var model = parent.get('castingFormModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('castingFormModel_delayedFetch', paramFilter || null);
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
            name: 'CASTING',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},
             requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                if(type == "create")
                {
                    current = response;
                    //updatedWorker = currentWorker;
                }
                 if(type == "update")
                {
                    current = response;
                   
                }
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
        castingFormModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            castFlag: false,
            currentCast: {},
            currentCastId: '',
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
                var dataItem = e.dataItem || castingFormModel.originalItem;

                app.mobileApp.navigate('#components/castingForm/details.html?uid=' + dataItem.uid);

            },
            addClick: function() {
                app.mobileApp.navigate('#components/castingForm/add.html');
            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/castingForm/edit.html?uid=' + uid);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = castingFormModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                castingFormModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = castingFormModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                castingFormModel.set('originalItem', itemModel);
                castingFormModel.set('currentItem',
                    castingFormModel.fixHierarchicalData(itemModel));

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
                $("#warningPopUpCast").kendoMobileModalView("close");
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
            //  var $sigdiv = $("#signatureCast")
            // $sigdiv.jSignature({
            //     'background-color': 'transparent',
            //     'decor-color': 'transparent',
            //     'color': 'black',
            //      //'height':'8em'
            //     'width': '300',
            //     'height': '110'
            //     }) // inits the jSignature widget. 
        },
        onShow: function(e) {
            // $(".km-scroll-container").css("overflow", "hidden");
            // var $sigdiv = $("#signatureCast");
            // // after some doodling...
            // $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.
            this.set('addFormData', {
                factoryName: '',
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
        // openSignatureCPopUp: function(e) {
        //     $("#signatureCastPopUp").kendoMobileModalView("open"); 
        // },
        // closeSignaturePopUp: function(e) {
        //     $("#signatureCastPopUp").kendoMobileModalView("close");
        // },
        // saveAddPopUpImg: function(e) {

        // },
        // closeAddPopUpImgC: function(e) {
        //     $("#addCapturePhotoCPop").kendoMobileModalView("close");
        // },
        onSaveClick: function(e) {
            var addFormData = this.get('addFormData'),
                filter = castingFormModel && castingFormModel.get('paramFilter'),
                dataSource = castingFormModel.get('dataSource'),
                addModel = {};

            function saveModel(data) {
                /// start add form data save
                addModel.name = addFormData.factoryName;
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
    }));

    parent.set('editItemViewModel', kendo.observable({
        /// start edit model properties
        /// end edit model properties
        /// start edit model functions
        /// end edit model functions
        editFormData: {},
        onInit: function(e) {
                var $sigdiv = $("#signatureCast")
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

            document.getElementById("element_name12").innerHTML = app.elementDetailView.elementDetailViewModel.currentItem.name;
            document.getElementById("step_name12").innerHTML = (app.geotechnicalForm.get('strings').controlPanel.stage1name).toLowerCase();
            document.getElementById("form_name12").innerHTML = (app.geotechnicalForm.get('strings').stage0CoreForms.casting).toLowerCase();

              $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv = $("#signatureCast");
            // after some doodling...
            // $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

            var that = this,
                itemUid = e.view.params.uid,
                //dataSource = castingFormModel.get('dataSource'),
                itemData /*= dataSource.getByUid(itemUid)*/,
                fixedData /*= castingFormModel.fixHierarchicalData(itemData)*/;

             var jsdoOptions = castingFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
            var dataSource = new kendo.data.DataSource(dataSourceOptions);
             castingFormModel.set('dataSource', dataSource);

             dataSource.filter({ field: "R370259600", operator: "==", value: app.elementDetailView.elementDetailViewModel.currentItem.id });
             dataSource.fetch(function() {
                 var view = dataSource.data();
                 
                 if(view[0] != undefined) {
                    castingFormModel.casrFlag = true;
                    castingFormModel.currentCast = view[0];
                    castingFormModel.currentCastId = view[0].id;
                    itemData = dataSource.getByUid(view[0].uid);
                    
                    fixedData = castingFormModel.fixHierarchicalData(itemData);
                    that.set('itemData', itemData);
                    if(itemData.imageURL != "null") {
                        $("#addCapturePhotoC").css("color", "red");
                        // var imageObj = $.parseJSON(view[0].image);
                        // itemData.image = processImage(castingFormModel.get('_dataSourceOptions').transport.jsdo.url + imageObj.src);
                                    
                        // $("#addCapturePhotoSImg").src = view[0].image;
                        document.getElementById("addCapturePhotoCImg").setAttribute("src", itemData.imageURL);
                    }
                    var comments;
                    if(itemData.Comments == "null")
                        comments = '';
                    else comments = itemData.Comments;

                    that.set('editFormData', {
                        R370259600: itemData.R370259600,
                        CASTINGDATE: itemData.CASTINGDATE,
                        //image: itemData.image,
                        FactoryName: itemData.FactoryName,
                        MIXTURENUMBER: itemData.MIXTURENUMBER,
                        DeliveryNote: itemData.DeliveryNote,
                        BATCH: itemData.BATCH,
                        MeasuredDEPTH: itemData.MeasuredDEPTH,
                        DESIGNEDDEPTH: itemData.DESIGNEDDEPTH,
                        ConcreteType: itemData.ConcreteType,
                        Comments: comments, //itemData.Comments,
                        signature: itemData.signature
                        /// start edit form data init
                        /// end edit form data init
                    });
                     if(itemData.signature != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                            $sigdiv.jSignature("importData", itemData.signature);
                            document.getElementById("castingSignature").style.color = "red";
                        }
                 }
                 else {
                     castingFormModel.casrFlag = false
                     that.set('itemData', itemData);
                     that.set('editFormData', {
                        R370259600: '',
                        CASTINGDATE: '',
                        //image: '',
                        FactoryName: '',
                        MIXTURENUMBER: '',
                        DeliveryNote: '',
                        BATCH: '',
                        MeasuredDEPTH: '',
                        DESIGNEDDEPTH: '',
                        ConcreteType: '',
                        COMMENTS: '',
                        signature: ''
                        /// start edit form data init
                        /// end edit form data init
                    });
                    document.getElementById("castingSignature").style.color = "black";
                    $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.
                 }
             });

            /// start edit form before itemData
            /// end edit form before itemData

            // this.set('itemData', itemData);
            // this.set('editFormData', {
            //     factoryName: itemData.name,
            //     /// start edit form data init
            //     /// end edit form data init
            // });

            /// start edit form show
            /// end edit form show
        },
        linkBind: function(linkString) {
            var linkChunks = linkString.split(':');
            return linkChunks[0] + ':' + this.get('itemData.' + linkChunks[1]);
        },
        // saveWarningPopUp: function() {
        //     $("#warningPopUpCast").kendoMobileModalView("close");
        // },
        openSignatureCPopUp: function(e) {
            $("#signatureCastPopUp").kendoMobileModalView("open"); 
        },
        closeSignaturePopUp: function(e) {
            $("#signatureCastPopUp").kendoMobileModalView("close");
            if($("#signatureCast").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                document.getElementById("castingSignature").style.color = "red";
            }
            else  document.getElementById("castingSignature").style.color = "black";
        },
        // saveAddPopUpImg: function(e) {

        // },
        closeAddPopUpImgC: function(e) {
            $("#addCapturePhotoCPop").kendoMobileModalView("close");
        },
        onSaveClick: function(e) {
            var that = this,
                editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = castingFormModel.get('dataSource');
           
            if(editFormData.FactoryName == '' || editFormData.MIXTURENUMBER == '' || editFormData.DeliveryNote == '' ||
            editFormData.BATCH  == '' || editFormData.MeasuredDEPTH == '' || editFormData.DESIGNEDDEPTH == '' || editFormData.ConcreteType == '') {
                  document.getElementById("warningPopUpCastText").innerHTML = app.castingForm.get('strings').warningMessage.detailsMissing;//"Signature is missing";
                $("#warningPopUpCast").kendoMobileModalView("open");
                return;
            }
            if($("#signatureCast").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                 document.getElementById("warningPopUpCastText").innerHTML = app.castingForm.get('strings').warningMessage.needSignature;//"Signature is missing";
                $("#warningPopUpCast").kendoMobileModalView("open");
                return;
            }

            if(castingFormModel.castFlag == true) {
                        //image: '',
                itemData.set('R370259600', app.elementDetailView.elementDetailViewModel.currentItem.id);
                // var date = $("#DrillingDate").val(); //moment($("#DrillingDate").val()).add(8,'h');
                var date = moment($("#castingSignature").val()).add(8,'h');
                itemData.set('CASTINGDATE', date.toString());
                itemData.set('FactoryName', editFormData.FactoryName);
                itemData.set('MIXTURENUMBER', editFormData.MIXTURENUMBER);
                itemData.set('DeliveryNote', editFormData.DeliveryNote);
                itemData.set('BATCH', editFormData.BATCH);
                itemData.set('MeasuredDEPTH', editFormData.MeasuredDEPTH);
                itemData.set('DESIGNEDDEPTH', editFormData.DESIGNEDDEPTH);
                itemData.set('ConcreteType', editFormData.ConcreteType);
                itemData.set('Comments', editFormData.COMMENTS);
                itemData.set('signature', $("#castingSignature").jSignature("getData"));

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
                
                //image: '',
                 itemData.R370259600 = app.elementDetailView.elementDetailViewModel.currentItem.id;
                var date = moment($("#DrillingDate").val()).add(8,'h');
                itemData.CASTINGDATE = date.toString();
                itemData.FactoryName = editFormData.FactoryName;
                itemData.MIXTURENUMBER = editFormData.MIXTURENUMBER;
                itemData.DeliveryNote = editFormData.DeliveryNote;
                itemData.BATCH = editFormData.BATCH;
                itemData.MeasuredDEPTH = editFormData.MeasuredDEPTH;
                itemData.DESIGNEDDEPTH = editFormData.DESIGNEDDEPTH;
                itemData.ConcreteType = editFormData.ConcreteType;
                itemData.Comments = editFormData.COMMENTS;
                itemData.signature = $("#signatureCast").jSignature("getData");

                 var jsdoOptions = castingFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);

                var jsrow = jsdo.add(itemData);
                var afterCreateFn;
                afterCreateFn = function (jsdo, record, success, request) {
                    jsdo.unsubscribeAll('afterCreate', afterCreateFn);
                    if (success == true) {
                        var imagefile = $('#addCapturePhotoCImg').attr('src');
                        if(imagefile) {
                            var options = new FileUploadOptions();
                            var imageObj = $.parseJSON(jsrow.data.image) 
                            options.fileKey = "fileContents";
                            options.fileName = "element_image";
                            if (cordova.platformId == "android") {
                                options.fileName += ".jpeg"
                            }
                            options.mimeType = "image/jpeg";
                            options.params = {};  // if we need to send parameters to the server request 
                            options.headers = {
                                Connection: "Close"
                            };
                            options.chunkedMode = false;
                            var ft = new FileTransfer();
                            var urlRB = castingFormModel._dataSourceOptions.transport.jsdo.url + imageObj.src + "?objName=" + castingFormModel._jsdoOptions.name;
                            
                            ft.upload(
                                imagefile,
                                encodeURI(urlRB),
                                onFileUploadSuccess3( ),
                                onFileTransferFail3,
                                options,
                                true);
                        }
                        app.clearFormDomData('edit-item-view');
                        window.plugins.toast.showWithOptions(
                        {
                            message: app.formDetailView.get('strings').toastsMessages.checkSuccess,
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
            //itemData.set('name', editFormData.factoryName);
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
            parent.set('castingFormModel', castingFormModel);
            var param = parent.get('castingFormModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('castingFormModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('castingFormModel', castingFormModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = castingFormModel.get('_dataSourceOptions'),
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

        if (!castingFormModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = castingFormModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                castingFormModel.set('dataSource', dataSource);

                fetchFilteredData(param);
            });
        } else {
            fetchFilteredData(param);
        }

    });
function onFileUploadSuccess3() {
        $("#addCapturePhotoCPop").kendoMobileModalView("close");
       
        window.plugins.toast.showWithOptions(
        {
            message: app.formDetailView.get('strings').toastsMessages.uploadImageSuccess,
            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
            position: "bottom",
            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
        });         
    }

function onFileTransferFail3(error) {
        console.log("FileTransfer Error:");
        console.log("Code: " + error.code);
        console.log("Body:" + error.body);
        console.log("Source: " + error.source);
        console.log("Target: " + error.target);
    }
})(app.castingForm);

// START_CUSTOM_CODE_castingFormModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.castingForm.castingFormModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.castingForm.castingFormModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_castingFormModel