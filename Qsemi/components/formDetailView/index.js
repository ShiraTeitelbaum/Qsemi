'use strict';

app.formDetailView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('formDetailView');

// START_CUSTOM_CODE_formDetailView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_formDetailView
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties
        current, currentCheck, checklist, checks, 
        processImage = function(img) {

            if (!img) {
                var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
                img = 'data:image/png;base64,' + empty1x1png;
            }

            return img;
        },
        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('formDetailViewModel'),
                dataSource, dataSourceChecks;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('formDetailViewModel_delayedFetch', paramFilter || null);
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
            name: 'CheckList2',
            autoFill: false
        },
         jsdoOptionsChecks = {
            name: 'Check4',
            autoFill: false
        },
        jsdoOptionsCore = {
            name: 'CoreDataList',
            autoFill: false
        },
         jsdoOptionsCoreChecks = {
            name: 'CoreData',
            autoFill: false
        },
         jsdoOptionsGallery = {
            name: 'ElementGallery',
            autoFill: false
        },
        jsdoOptionsNCR = {
            name: 'QualityImpairment',
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
                if(type == "read") {
                    // console.log("response")
                    // console.log(response)
                    checklist = response;
                }
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
                        'status': {
                            field: 'status',
                            defaultValue: 'red'
                        }
                    }
                }
            },
            serverFiltering: true,

        },
        dataSourceOptionsChecks = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                if(type == "read") {
                    // console.log("checks response")
                    // console.log(checks)
                    checks = response;
                }
                if(type == "create")
                {
                    currentCheck = response;
                    //updatedWorker = currentWorker;
                }
                 if(type == "update")
                {
                    currentCheck = response;
                   
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
        dataSourceOptionsCoreChecks = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                if(type == "read") {
                    checks = response;
                }
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
        dataSourceOptionsCore = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                if(type == "read") {
                    // console.log("response")
                    // console.log(response)
                    checklist = response;
                }
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
         dataSourceOptionsGallery = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                /*if(type == "create")
                {
                    current = response;
                    //updatedWorker = currentWorker;
                }*/
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
            sort:{ field: "name", dir: "asc" },
            serverFiltering: true,
            serverSorting: true,
        },
         dataSourceOptionsNCR = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                /*if(type == "create")
                {
                    current = response;
                    //updatedWorker = currentWorker;
                }*/
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
            sort:{ field: "name", dir: "asc" },
            serverFiltering: true,
            serverSorting: true,
        },
        /// start data sources
        /// end data sources
        formDetailViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _dataSourceOptionsChecks: dataSourceOptionsChecks,
            _dataSourceOptionsCore: dataSourceOptionsCore,
            _dataSourceOptionsCoreChecks: dataSourceOptionsCoreChecks,
            _dataSourceOptionsGallery: dataSourceOptionsGallery,
            _dataSourceOptionsNCR: dataSourceOptionsNCR,
            _jsdoOptions: jsdoOptions,
            _jsdoOptionsChecks: jsdoOptionsChecks,
            _jsdoOptionsCore: jsdoOptionsCore,
            _jsdoOptionsCoreChecks: jsdoOptionsCoreChecks,
            _jsdoOptionsGallery: jsdoOptionsGallery,
            _jsdoOptionsNCR: jsdoOptionsNCR,
            formName: '',
            formId: '',
            stageNum: '',
            pageScroller: '',
            elementDetails: {},
            not_ok_flag: false,
            currentCheckId: '',
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
            itemCoreClick: function(e) {
                var dataItem = e.dataItem || formDetailViewModel.originalItem;
               
                app.mobileApp.navigate('#components/formDetailView/addCoreData.html?uid=' + dataItem.uid);
            },
            itemClick: function(e) {
                var dataItem = e.dataItem || formDetailViewModel.originalItem;
            //    formDetailViewModel.setCurrentItemByUid(dataItem.uid);

                app.mobileApp.navigate('#components/formDetailView/add.html?uid=' + dataItem.uid);

            },
            addClick: function() {
                app.mobileApp.navigate('#components/formDetailView/add.html');
            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/formDetailView/edit.html?uid=' + uid);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = formDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                formDetailViewModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = formDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                formDetailViewModel.set('originalItem', itemModel);
                formDetailViewModel.set('currentItem',
                    formDetailViewModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            goToElementPage2: function(e) {
                app.mobileApp.navigate('#components/elementDetailView/details.html?uid=' + app.elementDetailView.elementDetailViewModel.currentItem.uid+'&breadFlag=true');
            },
            goToStepPage2: function(e) {
                app.mobileApp.navigate('#components/elementDetailView/view.html?stageId=' + app.controlPanel.controlPanelModel.step_id);
            },
            // loadImage: function(e) {
            //     var jsdoOptionsGallery = formDetailViewModel.get('_jsdoOptionsGallery'),
            //             jsdoGallery = new progress.data.JSDO(jsdoOptionsGallery),
            //             dataSourceOptionsGallery = formDetailViewModel.get('_dataSourceOptionsGallery');
            //         dataSourceOptionsGallery.transport.jsdo = jsdoGallery;
            //     var dataSourceGallery = new kendo.data.DataSource(dataSourceOptionsGallery);

            //     dataSourceGallery.filter({
            //         logic: "and",
            //         filters: [
            //             { field: "R369676467", operator: '==', value: app.elementDetailView.elementDetailViewModel.currentItem.id},
            //             { field: "R369888918", operator: '==', value: formDetailViewModel.formId}
            //         ]
            //     });
                
            //     dataSourceGallery.sort({ field: "updatedAt", dir: "desc" });

            //     dataSourceGallery.fetch(function() {
            //         var images = dataSourceGallery.data();
            //         console.log("images")
            //         console.log(images)
            //     });                
            // },
            saveWarningPopUp: function(e) {
                $("#warningPopUp").kendoMobileModalView("close");
            },
            closeAddPopUpImg: function(e) {
                $("#addCapturePhotoPop").kendoMobileModalView("close");
            },
            saveAddPopUpImg: function(e) {
                var newElementGallery;
                 var jsdoOptionsGallery = formDetailViewModel.get('_jsdoOptionsGallery'),
                        jsdoGallery = new progress.data.JSDO(jsdoOptionsGallery),
                        dataSourceOptionsGallery = formDetailViewModel.get('_dataSourceOptionsGallery');
                    dataSourceOptionsGallery.transport.jsdo = jsdoGallery;
                var dataSourceGallery = new kendo.data.DataSource(dataSourceOptionsGallery);

                newElementGallery = {
                    R369676467: app.elementDetailView.elementDetailViewModel.currentItem.id,
                    R369888918: formDetailViewModel.formId
                };
                var jsrow = jsdoGallery.add(newElementGallery);
                var afterCreateFn;
                afterCreateFn = function (jsdoGallery, record, success, request) {
                    jsdoGallery.unsubscribeAll('afterCreate', afterCreateFn);
                    if (success == true) {
                         var imagefile = $('#addCapturePhotoImg').attr('src');
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
                            var urlRB = formDetailViewModel._dataSourceOptionsGallery.transport.jsdo.url + imageObj.src + "?objName=" + formDetailViewModel._jsdoOptionsGallery.name;
                            
                            ft.upload(
                                imagefile,
                                encodeURI(urlRB),
                                onFileUploadSuccess2( ),
                                onFileTransferFail,
                                options,
                                true);
                        }
                    }
                };
                jsdoGallery.subscribe('afterCreate', afterCreateFn);
                jsdoGallery.saveChanges();
            },
            showElementDetails: function() {
                document.getElementById("LastUpdateDate").innerHTML = kendo.toString(formDetailViewModel.elementDetails.updatedAt, "dd/MM/yyyy"); 
                document.getElementById("PoleType").innerHTML = formDetailViewModel.elementDetails.PoleType;
                document.getElementById("Ancohorage").innerHTML = formDetailViewModel.elementDetails.Ancohorage;
                document.getElementById("Sectionning").innerHTML = formDetailViewModel.elementDetails.Sectionning;
                document.getElementById("SoilFound").innerHTML = formDetailViewModel.elementDetails.SoilFound;
                document.getElementById("AnchoragesKP").innerHTML = formDetailViewModel.elementDetails.AnchoragesKP;
                document.getElementById("TrackLayout").innerHTML = formDetailViewModel.elementDetails.TrackLayout;
                document.getElementById("Profile").innerHTML = formDetailViewModel.elementDetails.Profile;
                document.getElementById("KP").innerHTML = formDetailViewModel.elementDetails.KP;
                document.getElementById("Embankment").innerHTML = formDetailViewModel.elementDetails.Embankment;
                document.getElementById("AnchorageFoundation").innerHTML = formDetailViewModel.elementDetails.AnchorageFoundation;
                document.getElementById("Foundation").innerHTML = formDetailViewModel.elementDetails.Foundation;
                document.getElementById("DepthFound").innerHTML = formDetailViewModel.elementDetails.DepthFound;
                document.getElementById("SpanBefor").innerHTML = formDetailViewModel.elementDetails.SpanBefor;
                document.getElementById("SpanAfter").innerHTML = formDetailViewModel.elementDetails.SpanAfter;
                document.getElementById("DepthAnchor").innerHTML = formDetailViewModel.elementDetails.DepthAnchor;
            },
            showFormImage: function(num) {
                 var jsdoOptionsGallery = formDetailViewModel.get('_jsdoOptionsGallery'),
                        jsdoGallery = new progress.data.JSDO(jsdoOptionsGallery),
                        dataSourceOptionsGallery = formDetailViewModel.get('_dataSourceOptionsGallery');
                    dataSourceOptionsGallery.transport.jsdo = jsdoGallery;
                var dataSourceGallery = new kendo.data.DataSource(dataSourceOptionsGallery);
            
                if(num != 0) {
                    dataSourceGallery.filter({
                        logic: "and",
                        filters: [ 
                            { field: "R369676467", operator: "==", value: app.elementDetailView.elementDetailViewModel.currentItem.id },
                            { field: "R369888918", operator: "==", value: formDetailViewModel.formId }
                            ]});
                }
                else {
                    dataSourceGallery.filter({ field: "R369676467", operator: "==", value: app.elementDetailView.elementDetailViewModel.currentItem.id });
                }

                dataSourceGallery.sort({ field: "updatedAt", dir: "desc" });

                dataSourceGallery.fetch(function() {
                    var view = dataSourceGallery.data();
                    // console.log("view")
                    // console.log(view)
                    if(view[0] != undefined) {
                        // var imageObj = $.parseJSON(view[0].image);
                        // view[0].image = processImage(formDetailViewModel.get('_dataSourceOptionsGallery').transport.jsdo.url + imageObj.src);
                        
                        if(view[0].imageURL != "null") {
                            $("#addCapturePhoto").css("color", "red");
                            // var imageObj = $.parseJSON(view[0].image);
                            // view[0].image = processImage(formDetailViewModel.get('_dataSourceOptionsGallery').transport.jsdo.url + imageObj.src);
                                    
                            document.getElementById("addCapturePhotoImg").src = view[0].imageURL;
                            // document.getElementById("addCapturePhotoImg").setAttribute("src", view[0].image);
                        }
                        else {
                            $("#addCapturePhoto").css("color", "black");
                        }
                    }
                });
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
        currentCheck,
         onInitCoreData: function(e) {
               var $sigdiv = $("#signatureCore")
            $sigdiv.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                 //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget.
        },
        onInit: function(e) {
            app.mobileApp.showLoading();
             var $sigdiv = $("#signature")
            $sigdiv.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                'color': 'black',
                 //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget. 
                 var $sigdivNCR = $("#signatureNCR")
            $sigdivNCR.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                 //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget.
        },
        onShowCoreData: function(e) {
            app.mobileApp.showLoading();
            e.view.scroller.reset();
            this.pageScroller = e.view.scroller;

            $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv = $("#signatureCore");
            // after some doodling...
            // $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.
             $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv2 = $("#signatureNCR");
            // after some doodling...
            // $sigdiv2.jSignature("reset") // clears the canvas and rerenders the decor on it.


            var that = this,
                itemUid = e.view.params.uid,
                dataSource = formDetailViewModel.get('dataSourceCore'),
                itemData = dataSource.getByUid(itemUid),
                fixedData = formDetailViewModel.fixHierarchicalData(itemData);

            document.getElementById("form_name4").innerHTML = (formDetailViewModel.formName).toLowerCase();
            document.getElementById("element_name4").innerHTML = app.elementDetailView.elementDetailViewModel.currentItem.name;
            document.getElementById("step_name4").innerHTML = (app.elementDetailView.elementDetailViewModel.stepsNames[formDetailViewModel.stageNum].name).toLowerCase();
            if(itemData.name.length > 30) {
                document.getElementById("check_name4").innerHTML = (itemData.name).substring(0, 30) + "...";
            }
            else document.getElementById("check_name4").innerHTML = (itemData.name).substring(0, 30);
                
                var dataSource = formDetailViewModel.get('dataSourceCoreChecks');
                dataSource.filter({
                    logic: "and",
                    filters: [ 
                        { field: "R369425614", operator: "==", value: itemData.id }, //checkList
                        { field: "R369589302", operator: "==", value: formDetailViewModel.formId }, //dynamicForm
                        { field: "LastUpdate", operator: "==", value: true }
                        ]
                });

                dataSource.fetch(function() {
                    var view = dataSource.data();
                   
                    if(view[0] != undefined) {
                        var comments, data;

                        if(view[0].Comments != "null") {
                            comments = view[0].Comments;
                        }  
                        else {
                            comments = '';
                        }
                       
                       if(view[0].Data != "null") {
                            data = view[0].Data;
                        }  
                        else {
                            data = '';
                        }

                        if(view[0].signature != null) {
                            document.getElementById("checkCoreSignature").style.color = "red";
                        }
                        else {
                            document.getElementById("checkCoreSignature").style.color = "black";
                        }

                        if($("#signatureCore").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                             $sigdiv.jSignature("importData", view[0].signature);
                        }
                        
                        that.set('itemData', itemData);
                        that.set('addFormData', {
                            Comments: comments,
                            Data: data
                            /// start add form data init
                            /// end add form data init
                        });
                    }
                    else {
                         if($("#signatureCore").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                             document.getElementById("checkCoreSignature").style.color = "red";
                        }
                        that.set('itemData', itemData);
                        that.set('addFormData', {
                            Comments: '',
                            Data: ''
                            /// start add form data init
                            /// end add form data init
                        });
                    }
                });
                coreCheckName.innerHTML = formDetailViewModel.formName;
            app.mobileApp.hideLoading();
        },
        onShow: function(e) {
            app.mobileApp.showLoading();
            e.view.scroller.reset();
            formDetailViewModel.not_ok_flag = false;
            this.pageScroller = e.view.scroller;
            $("#checkNCR").hide();

            if(app.elementDetailView.elementDetailViewModel.surveyorFlag == true) {
                $("#checkStatus").hide();
            }
            else $("#checkStatus").show();

            $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv = $("#signature");
            // after some doodling...
            // $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.
            //    console.log("$('#signature').jSignature('getData')")
            // console.log($("#signature").jSignature("getData"))
            var $sigdivNCR = $("#signatureNCR")
            // after some doodling...
            $sigdivNCR.jSignature("reset") // clears the canvas and rerenders the decor on it.

             var that = this,
                itemUid = e.view.params.uid,
                dataSource = formDetailViewModel.get('dataSource'),
                itemData = dataSource.getByUid(itemUid),
                fixedData = formDetailViewModel.fixHierarchicalData(itemData);
                console.log("itemData")
                console.log(itemData)

            document.getElementById("form_name2").innerHTML = (formDetailViewModel.formName).toLowerCase();
            document.getElementById("element_name2").innerHTML = app.elementDetailView.elementDetailViewModel.currentItem.name;
            document.getElementById("step_name2").innerHTML = (app.elementDetailView.elementDetailViewModel.stepsNames[formDetailViewModel.stageNum].name).toLowerCase();
            document.getElementById("check_name").innerHTML = (itemData.name).substring(0, 30) + "...";

            if(itemData.Description == "null") {
                $("#description").hide();
            }
            else {
                $("#description").show();
            }
            
            var dataSource = formDetailViewModel.get('dataSourceChecks');
            dataSource.filter({
                logic: "and",
                filters: [ 
                    { field: "R365688751", operator: "==", value: itemData.id }, //checkList
                    { field: "R365596106", operator: "==", value: formDetailViewModel.formId }, //dynamicForm
                    { field: "LastUpdate", operator: "==", value: true }
                    ]
            });
            
                //dataSource.sort({ field: "Index", dir: "asc" });
                dataSource.fetch(function() {
                    var view = dataSource.data();
                    console.log("view##########")
                    console.log(view)
                    
                    if(view[0] != undefined) {
                        document.getElementById("status_ok").checked = false;
                        document.getElementById("status_not_ok").checked = false;
                        document.getElementById("status_NA").checked = false;
                     
                        var status = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_status().response.picklistData;
                     
                        for(var i=0; i < status.length; i++) {
                            if(view[0].status == status[i].id) {
                                switch(status[i].name) {
                                    case "Ok": document.getElementById("status_ok").checked = true;
                                           // $("#checkStatus").css('background-color', '#449d31');
                                             break;
                                    case "Not Ok": document.getElementById("status_not_ok").checked = true; 
                                                //$("#checkStatus").css('background-color', '#d12229');
                                                break;
                                    case "N/A": document.getElementById("status_NA").checked = true; break;
                                }
                            }
                        }

                        var commentsC, text1;
                        if(view[0].Comments != "null") {
                            commentsC = view[0].Comments;
                        }  
                        else {
                            commentsC = '';
                        }
                       
                        if(view[0].signature != null) {
                            document.getElementById("checkSignature").style.color = "red";
                        }
                        else {
                            document.getElementById("checkSignature").style.color = "black";
                        }
                        
                         if($("#signature").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                            $sigdiv.jSignature("importData", view[0].signature);
                        }
                      
                        if(view[0].R371573875 != null && view[0].R371573875 != "null") {
                            console.log("view[0].R371573875")
                            console.log(view[0].R371573875)
                            $("#checkNCR").show();
                        }

                        currentCheck = view[0];
                        that.set('itemData', itemData);
                        that.set('addFormData', {
                            comments: commentsC,
                            CreatedByText: view[0].CreatedByText
                            /// start add form data init
                            /// end add form data init
                        });
                    }
                    else {
                         if($("#signature").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                            document.getElementById("checkSignature").style.color = "red";
                        }

                        that.set('itemData', itemData);
                        that.set('addFormData', {
                            comments: '',
                            /// start add form data init
                            /// end add form data init
                        });
                    }
                    app.mobileApp.hideLoading();
                });
                app.mobileApp.hideLoading();
            /// start add form show
            checkName.innerHTML = formDetailViewModel.formName;
            /// end add form show
        },
        onCancel: function() {
            /// start add model cancel
            app.clearFormDomData('add-item-view');
            document.getElementById("status_not_ok").checked = false;
            document.getElementById("status_ok").checked = false;
            document.getElementById("status_NA").checked = false;
          
            $("#checkComments").val('');
          
            document.getElementById("checkSignature").style.color = "black";
            
            /// end add model cancel
        }, 
        checkNcrStatus: function() {
            var jsdoOptionsNCR = formDetailViewModel.get('_jsdoOptionsNCR'),
                jsdoNCR = new progress.data.JSDO(jsdoOptionsNCR),
                dataSourceOptionsNCR = formDetailViewModel.get('_dataSourceOptionsNCR');
            dataSourceOptionsNCR.transport.jsdo = jsdoNCR;
            var dataSourceNCR = new kendo.data.DataSource(dataSourceOptionsNCR);

            if(currentCheck != undefined) {
                // dataSourceNCR.filter({field: "R371573875", operator: '==', value: this.get('itemData').id});
                dataSourceNCR.filter({ field: "R371573875", operator: "==", value: currentCheck.id });
                dataSourceNCR.fetch(function() {
                    var ncr = dataSourceNCR.data();
                    if(ncr[0].Fixed == 0) {
                        return false;
                    }
                    //Fixed
                });
            }
        },
        openNCR: function(e) {
            document.getElementById("addCapturePhotoNCR").style.color = "black";
            var jsdoOptionsNCR = formDetailViewModel.get('_jsdoOptionsNCR'),
                jsdoNCR = new progress.data.JSDO(jsdoOptionsNCR),
                dataSourceOptionsNCR = formDetailViewModel.get('_dataSourceOptionsNCR');
            dataSourceOptionsNCR.transport.jsdo = jsdoNCR;
            var dataSourceNCR = new kendo.data.DataSource(dataSourceOptionsNCR);

            // dataSourceNCR.filter({field: "R371573875", operator: '==', value: this.get('itemData').id});
            dataSourceNCR.filter({ field: "R371573875", operator: "==", value: currentCheck.id });
            dataSourceNCR.fetch(function() {
                var ncr = dataSourceNCR.data();
               
                app.mobileApp.navigate('#components/impairmentDetailView/edit.html?id='+ncr[0].id);
            });

            // app.mobileApp.navigate('#components/impairmentDetailView/edit.html?checkDetailsFlag=true&checkId='+formDetailViewModel.currentItem.id);
        },
        goToElementPage3: function(e) {
            app.elementDetailView.elementDetailViewModel.change_Percent = true;
            app.mobileApp.navigate('#components/elementDetailView/details.html?uid=' + app.elementDetailView.elementDetailViewModel.currentItem.uid+'&breadFlag=true');
        },
        goToStepPage3: function(e) {
              app.elementDetailView.elementDetailViewModel.change_Percent = true;
            app.mobileApp.navigate('#components/elementDetailView/view.html?stageId=' + app.controlPanel.controlPanelModel.step_id);
        },
        openMap: function (num) {
            app.elementLocationMaps.elementLocationMapsModel.emapFlag = true;
            app.elementLocationMaps.elementLocationMapsModel.counter = 0;
            var jsdoOptions3 = app.elementDetailView.elementDetailViewModel.get('_jsdoOptions'),
                jsdo3 = new progress.data.JSDO(jsdoOptions3);
            dataSourceOptions.transport.jsdo = jsdo3;
            var dataSource3 = new kendo.data.DataSource(dataSourceOptions);

            dataSource3.filter({ field: "id", operator: "==", value: app.elementDetailView.elementDetailViewModel.currentItem.id });

            dataSource3.fetch(function() {
                var element = dataSource3.data();
                // app.elementDetailView.elementDetailViewModel.setCurrentItemByUid(element[0].uid);
                if(element[0] != undefined) 
                    app.elementDetailView.elementDetailViewModel.elementLocation = element[0];
                app.surveyorMarking.surveyorMarkingModel.mapFlag=true;
                if(num == 2)
                    app.mobileApp.navigate('#components/elementLocationMaps/view.html?detailsFlag=true');
                else app.mobileApp.navigate('#components/elementLocationMaps/view.html');
            });
        },
        openSignaturePopUp: function(e) {
            $("#signaturePopUp").kendoMobileModalView("open"); 
        },
        closeSignaturePopUp: function(e) {
            if($("#signature").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                document.getElementById("checkSignature").style.color = "red";
            }
            else document.getElementById("checkSignature").style.color = "black";
            $("#signaturePopUp").kendoMobileModalView("close"); 
        },
        openSignatureCorePopUp: function(e) {
            $("#signatureCorePopUp").kendoMobileModalView("open");
        },
        closeSignatureCorePopUp: function(e) {
            if($("#signatureCore").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                document.getElementById("checkCoreSignature").style.color = "red";
            }
            else document.getElementById("checkCoreSignature").style.color = "black";
            $("#signatureCorePopUp").kendoMobileModalView("close");
        },
        onSaveCoreClick: function(e) {
            var addFormData = this.get('addFormData'),
                filter = formDetailViewModel && formDetailViewModel.get('paramFilter'),
                dataSourceCoreChecks = formDetailViewModel.get('dataSourceCoreChecks'),
                itemData = this.get("itemData"),
                addModel = {};

                 function saveModel(data) {
                     if($("#signatureCore").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                        document.getElementById("warningPopUpText").innerHTML = app.formDetailView.get('strings').warningMessage.needSignature;//"Signature is missing";
                        $("#warningPopUp").kendoMobileModalView("open");
                        return;
                    }
                    /// start add form data save
                
                    addModel.Data = $("#text1input").val();
                    addModel.Comments = $("#coreCheckComments").val();
                    addModel.R369589302 = formDetailViewModel.formId;
                    addModel.R369425614 = itemData.id;
                    addModel.name = itemData.name;
                    addModel.locationId = sessionStorage.getItem("locationId");
                    addModel.LastUpdate = true;
                    addModel.signature = $("#signatureCore").jSignature("getData");
                    /// end add form data save
         
                    dataSourceCoreChecks.add(addModel);
                    dataSourceCoreChecks.one('change', function(e) {
                        app.elementDetailView.elementDetailViewModel.change_Percent = true;
                        app.elementDetailView.elementDetailViewModel.QC_click_flag = true;

                        document.getElementById("checkCoreSignature").style.color = "black";

                        $("#text1input").val('');
                        $("#coreCheckComments").val('');
                        window.plugins.toast.showWithOptions(
                        {
                            message: app.formDetailView.get('strings').toastsMessages.checkSuccess,//"The check has been successfully saved",
                            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                            position: "bottom",
                            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                        }); 
                        app.mobileApp.navigate('#:back');
                    });

                    dataSourceCoreChecks.sync();

                    app.clearFormDomData('add-item-view');
                };

                /// start add form save
                /// end add form save
                /// start add form save handler
                saveModel();
                /// end add form save handler
        },
        openSignatureNCRPopUp: function(e) {
            $("#signatureNCRPopUp").kendoMobileModalView("open");
        },
        closeSignatureNCRPopUp: function(e) {
            if($("#signatureNCR").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                    document.getElementById("NCRSignature").style.color = "red";
                }
                else {document.getElementById("NCRSignature").style.color = "black";}
            $("#signatureNCRPopUp").kendoMobileModalView("close");
        },
        cancelNCR: function(e) {
            $("#NCRPopUp").kendoMobileModalView("close");

             var $sigdiv2 = $("#signatureNCR");
            // after some doodling...
            $sigdiv2.jSignature("reset") // clears the canvas and rerenders the decor on it

            document.getElementById("NCRSignature").style.color = "black";
            // document.getElementById("addCapturePhotoNCR").style.color = "black";
            $("#ImpairmentDetails").val('');

            app.mobileApp.navigate('#:back');
        },
        saveNCR: function(e) {
            // $("#NCRPopUp").kendoMobileModalView("close");

            var newNCR;
            var jsdoOptionsNCR = formDetailViewModel.get('_jsdoOptionsNCR'),
                jsdoNCR = new progress.data.JSDO(jsdoOptionsNCR),
                dataSourceOptionsNCR = formDetailViewModel.get('_dataSourceOptionsNCR');
            dataSourceOptionsNCR.transport.jsdo = jsdoNCR;
            var dataSourceNCR = new kendo.data.DataSource(dataSourceOptionsNCR);

            if($("#signatureNCR").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                document.getElementById("warningPopUpText").innerHTML = app.formDetailView.get('strings').warningMessage.needSignature; //"Signature is missing";
                $("#warningPopUp").kendoMobileModalView("open");
                return;
            }
            if($("#ImpairmentDetails").val() == '') {
                document.getElementById("warningPopUpText").innerHTML = app.formDetailView.get('strings').warningMessage.needDescription//"Description is missing";
                $("#warningPopUp").kendoMobileModalView("open");
                return;
            }
            
            var date = moment($("#ImpairmentDestinationDate").val()).add(8,'h');
            console.log("date")
            console.log(date.toString())
            var d = new Date(date);
            
            newNCR = {
                R371573875: formDetailViewModel.currentCheckId.id, //check
                R371733782: app.elementDetailView.elementDetailViewModel.currentItem.id,
                name: formDetailViewModel.currentCheckId.name,
                signature: $("#signatureNCR").jSignature("getData"),
                Description: $("#ImpairmentDetails").val(),
                Latitude: app.elementDetailView.elementDetailViewModel.currentItem.Latitude,
                longitude: app.elementDetailView.elementDetailViewModel.currentItem.Longtitud,
                locationId: sessionStorage.getItem("locationId"),
                DestinationDate: d.setHours(d.getHours()+8),//date.toString(),
                Fixed: false,
                ElementName: app.elementDetailView.elementDetailViewModel.currentItem.name
            };

            $("#NCRPopUp").kendoMobileModalView("close");

            var jsrow = jsdoNCR.add(newNCR);
            var afterCreateFn;
             afterCreateFn = function (jsdoNCR, record, success, request) {
                 jsdoNCR.unsubscribeAll('afterCreate', afterCreateFn);
                    if (success == true) {
                         var $sigdiv2 = $("#signatureNCR");
                        // after some doodling...
                        $sigdiv2.jSignature("reset") // clears the canvas and rerenders the decor on it
                        document.getElementById("NCRSignature").style.color = "black";
                        document.getElementById("addCapturePhoto1NCR").style.color = "black";
                        document.getElementById("addCapturePhoto2NCR").style.color = "black";
                        $("#ImpairmentDetails").val('');
                        $("#ImpairmentDestinationDate").val('');
            
                         var imagefile1 = $('#addCapturePhoto1NCRImg').attr('src');
                         var imagefile2 = $('#addCapturePhoto2NCRImg').attr('src');
                        if(imagefile1) {
                            var options = new FileUploadOptions();
                            var imageObj1 = $.parseJSON(jsrow.data.image) 
                            options.fileKey = "fileContents";
                            options.fileName = "NCR_Check_image1";
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
                            var urlRB1 = formDetailViewModel._dataSourceOptionsNCR.transport.jsdo.url + imageObj1.src + "?objName=" + formDetailViewModel._jsdoOptionsNCR.name;

                            ft.upload(
                                imagefile1,
                                encodeURI(urlRB1),
                                onFileUploadSuccess1( ),
                                onFileTransferFail1,
                                options,
                                true);
                        }

                        if(imagefile2) {
                            var options = new FileUploadOptions();
                            var imageObj2 = $.parseJSON(jsrow.data.image2) 
                            options.fileKey = "fileContents";
                            options.fileName = "NCR_Check_image2";
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
                           
                            var urlRB2 = formDetailViewModel._dataSourceOptionsNCR.transport.jsdo.url + imageObj2.src + "?objName=" + formDetailViewModel._jsdoOptionsNCR.name;

                            ft.upload(
                                imagefile2,
                                encodeURI(urlRB2),
                                onFileUploadSuccess1( ),
                                onFileTransferFail1,
                                options,
                                true);
                        }
                    }
             };
             jsdoNCR.subscribe('afterCreate', afterCreateFn);
            jsdoNCR.saveChanges();
            
            // app.mobileApp.navigate('#:back');
            window.plugins.toast.showWithOptions(
            {
                message: app.formDetailView.get('strings').toastsMessages.NCRSuccess,
                duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                position: "bottom",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }); 
            app.mobileApp.navigate('#:back');
        },
        closeAddNCRPopUpImg1:function(e) {
            $("#addCapturePhoto1NCRPop").kendoMobileModalView("close");
        },
        closeAddNCRPopUpImg2:function(e) {
            $("#addCapturePhoto2NCRPop").kendoMobileModalView("close");
        },
        onSaveClick: function(e) {
            var addFormData = this.get('addFormData'),
                filter = formDetailViewModel && formDetailViewModel.get('paramFilter'),
                dataSourceChecks = formDetailViewModel.get('dataSourceChecks'),
                itemData = this.get("itemData"),
                addModel = {};
            
            function saveModel(data) {
                if($("#signature").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                    document.getElementById("warningPopUpText").innerHTML = app.formDetailView.get('strings').warningMessage.needSignature;//"Signature is missing";
                    $("#warningPopUp").kendoMobileModalView("open");
                    return;
                }

                /// start add form data save
                var listStatus = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_status().response.picklistData;
                var status_ok_flag = false,status_not_ok_flag = false;
                for(var i=0; i < listStatus.length; i++) {
                    if($("#status_ok").is(':checked')) {
                        if(listStatus[i].name == "Ok") {
                            addModel.status = listStatus[i].id;
                            status_ok_flag = true;
                            break;
                        }
                    }
                    else if($("#status_not_ok").is(':checked')) {
                        if(listStatus[i].name == "Not Ok") {
                            addModel.status = listStatus[i].id;
                            formDetailViewModel.not_ok_flag = true;
                            status_not_ok_flag = true;
                            break;
                        }
                    }
                    else if($("#status_NA").is(':checked')) {
                        if(listStatus[i].name == "N/A") {
                            addModel.status = listStatus[i].id;
                            break;
                        }
                    }
                }

                if(addModel.status == undefined) {
                    document.getElementById("warningPopUpText").innerHTML = app.formDetailView.get('strings').warningMessage.needSatus;//"Signature is missing";
                    $("#warningPopUp").kendoMobileModalView("open");
                    return;
                }
                
                addModel.Comments = $("#checkComments").val();
                addModel.signature = $("#signature").jSignature("getData");
                addModel.R365596106 = formDetailViewModel.formId;
                addModel.R365688751 = itemData.id;
                addModel.name = itemData.name;
                addModel.locationId = sessionStorage.getItem("locationId");
                addModel.LastUpdate = true;
                addModel.index = itemData.Index;
                //addModel.name = !!addFormData.checkbox7;
                /// end add form data save
         
                dataSourceChecks.add(addModel);
                dataSourceChecks.one('change', function(e) {
                    formDetailViewModel.currentCheckId = currentCheck;

                    document.getElementById("checkSignature").style.color = "black";

                    app.elementDetailView.elementDetailViewModel.change_Percent = true;
                    app.elementDetailView.elementDetailViewModel.QC_click_flag = true;

                    // document.getElementById("status_ok").checked = false;
                    // document.getElementById("status_not_ok").checked = false;
                    // document.getElementById("status_NA").checked = false;
                    // $("#checkComments").val('');

                    window.plugins.toast.showWithOptions(
                    {
                        message: app.formDetailView.get('strings').toastsMessages.checkSuccess,
                        duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                        position: "bottom",
                        addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                    }); 

                    if(formDetailViewModel.not_ok_flag == true) {
                        $("#NCRPopUp").kendoMobileModalView("open");
                    }
                    else if(status_ok_flag == true && status_not_ok_flag == false) {
                            var jsdoOptionsNCR = formDetailViewModel.get('_jsdoOptionsNCR'),
                            jsdoNCR = new progress.data.JSDO(jsdoOptionsNCR),
                            dataSourceOptionsNCR = formDetailViewModel.get('_dataSourceOptionsNCR');
                        dataSourceOptionsNCR.transport.jsdo = jsdoNCR;
                        var dataSourceNCR = new kendo.data.DataSource(dataSourceOptionsNCR);

                        if(currentCheck != undefined) {
                           dataSourceNCR.filter({ field: "R371573875", operator: "==", value: currentCheck.id });
                            dataSourceNCR.fetch(function() {
                                var ncr = dataSourceNCR.data();
                               if(ncr[0] != undefined && ncr[0].Fixed == 0) {
                                    document.getElementById("warningPopUpText").innerHTML = app.formDetailView.get('strings').warningMessage.notSaveStatus;
                                    $("#warningPopUp").kendoMobileModalView("open");
                                    // return;
                                }
                                else {
                                    document.getElementById("status_ok").checked = false;
                                    document.getElementById("status_not_ok").checked = false;
                                    document.getElementById("status_NA").checked = false;
                                    $("#checkComments").val('');
                                    app.mobileApp.navigate('#:back');
                                }
                                //Fixed
                            });
                         }
                    }
                    else {
                        document.getElementById("status_ok").checked = false;
                        document.getElementById("status_not_ok").checked = false;
                        document.getElementById("status_NA").checked = false;
                        $("#checkComments").val('');
                        app.mobileApp.navigate('#:back');
                    }
                });

                dataSourceChecks.sync();

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
             var $sigdiv = $("#signature")
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
            var $sigdiv = $("#signature");
            // after some doodling...
            // $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

            var that = this,
                itemUid = e.view.params.uid,
                dataSource = formDetailViewModel.get('dataSource'),
                itemData = dataSource.getByUid(itemUid),
                fixedData = formDetailViewModel.fixHierarchicalData(itemData);

            /// start edit form before itemData
            /// end edit form before itemData

            this.set('itemData', itemData);
            this.set('editFormData', {
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
                dataSource = formDetailViewModel.get('dataSource');

            /// edit properties
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
            parent.set('formDetailViewModel', formDetailViewModel);
            var param = parent.get('formDetailViewModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('formDetailViewModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('formDetailViewModel', formDetailViewModel);
    }

    parent.set('onShow', function(e) {
        e.view.scroller.reset();
        formDetailViewModel.elementDetails = app.elementDetailView.elementDetailViewModel.currentItem;
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = formDetailViewModel.get('_dataSourceOptions'),
            dataSourceOptionsChecks = formDetailViewModel.get('_dataSourceOptionsChecks'),
            dataSourceOptionsCore = formDetailViewModel.get('_dataSourceOptionsCore'),
            dataSourceOptionsCoreChecks = formDetailViewModel.get('_dataSourceOptionsCoreChecks'),
            dataSource, dataSourceChecks, dataSourceCore, dataSourceCoreChecks;

            formDetailViewModel.formId = e.view.params.formid;

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

        $("#addCapturePhoto").css("color", "black");
       formDetailViewModel.showElementDetails();
       formDetailViewModel.stageNum = e.view.params.stagenum;
       console.log("e.view.params")
       console.log(e.view.params)
       formDetailViewModel.showFormImage(e.view.params.stagenum);
       
       document.getElementById("element_name1").innerHTML = formDetailViewModel.elementDetails.name;
       console.log("app.elementDetailView.elementDetailViewModel.stepsNames[e.view.params.stagenum]")
       console.log(e.view.params.stagenum)
       console.log(app.elementDetailView.elementDetailViewModel.stepsNames[e.view.params.stagenum])
       document.getElementById("step_name1").innerHTML = (app.elementDetailView.elementDetailViewModel.stepsNames[e.view.params.stagenum].name).toLowerCase();
        if(e.view.params.stagenum == 5)
            document.getElementById("form_name1").innerHTML = "E&B";
        else document.getElementById("form_name1").innerHTML = (e.view.params.formname).toLowerCase();

       if(e.view.params.stagenum == 0) {
           $("#elementGeneralDetails").hide();
           $("#elemImg").hide();
       }
       else {
           $("#elementGeneralDetails").show();
           $("#elemImg").show();
       }
        
        $("#checkListTitle").hide();
        $("#coreDataTitle").hide();

        if(e.view.params.coreFlag == "true") {
            // formDetailViewModel.loadImage();
            $("#surveyor").hide();
            $("#formCheckList").hide();
            $("#coreCheckList").show();

            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = formDetailViewModel.get('_jsdoOptionsCore'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptionsCore.transport.jsdo = jsdo;
                dataSourceCore = new kendo.data.DataSource(dataSourceOptionsCore);
               
                if(app.elementDetailView.elementDetailViewModel.coreCheckListIds != null) {
                    // console.log("app.elementDetailView.elementDetailViewModel.coreCheckListIds")
                    // console.log(app.elementDetailView.elementDetailViewModel.coreCheckListIds)
                    var checkListFilters = [];
                    for(var i=0; i < app.elementDetailView.elementDetailViewModel.coreCheckListIds.length; i++) {
                        checkListFilters[i] = { field: "id", operator: "==", value: app.elementDetailView.elementDetailViewModel.coreCheckListIds[i] };
                    }
               
                    dataSourceCore.filter({
                        logic: "or",
                        filters: checkListFilters
                    });
                    formDetailViewModel.set('dataSourceCore', dataSourceCore);

                }
                else {
                    formDetailViewModel.set('dataSourceCore', '');
                }

                var jsdoOptionsCoreChecks = formDetailViewModel.get('_jsdoOptionsCoreChecks'),
                    jsdoCoreChecks = new progress.data.JSDO(jsdoOptionsCoreChecks);

                dataSourceOptionsCoreChecks.transport.jsdo = jsdoCoreChecks;
                dataSourceCoreChecks = new kendo.data.DataSource(dataSourceOptionsCoreChecks);
                formDetailViewModel.set('dataSourceCoreChecks', dataSourceCoreChecks);

                dataSourceCoreChecks.filter({
                    logic: "and",
                    filters: [
                        {field: "R369589302", operator: "==", value: formDetailViewModel.formId},
                        {field: "LastUpdate", operator: "==", value: true}
                        ]
                });

                dataSourceCoreChecks.read().then(function() {
                    var view = dataSourceCoreChecks.view();
                        var greenFlag = false;
                        for(var i=0; i<checklist.data.length; i++) {
                            greenFlag = false;
                            if(view.length == 0) {
                                document.getElementById(checklist.data[i].id).style.background = "#d12229";
                            }
                            for(var j=0; j<view.length; j++) {
                                if(checklist.data[i].id == view[j].R369425614) {
                                    checklist.data[i].status = "green";//checklist.data[i].id;
                                    document.getElementById(checklist.data[i].id).style.background = "#449d31";
                                    greenFlag = true;
                                    break;
                                }
                                if(greenFlag == false) {
                                    document.getElementById(checklist.data[i].id).style.background = "#d12229";
                                }
                            }
                        }
                });
           
                //fetchFilteredData(param);
                if(e.view.params.stagenum == 5) {
                    formDetailViewModel.formName = "E&B";
                    formNameCheckList.innerHTML = "E&B";
                }
                else { 
                    formDetailViewModel.formName = (e.view.params.formname).toLowerCase();
                    formNameCheckList.innerHTML = e.view.params.formname;
                } 
            });
        }
        else if(e.view.params.surveyorFlag == "true") {
            $("#formCheckList").show();
            $("#coreCheckList").show();
            $("#surveyor").show();
            $("#checkListTitle").show();
            $("#coreDataTitle").show();
            if(e.view.params.stagenum == 5) {
                formDetailViewModel.formName = "E&B";
                formNameCheckList.innerHTML = "E&B";
            }
            else { 
                formDetailViewModel.formName = (e.view.params.formname).toLowerCase();
                formNameCheckList.innerHTML = e.view.params.formname;
            } 
            // formDetailViewModel.formName = e.view.params.formname;
            // formNameCheckList.innerHTML = e.view.params.formname; 
             var jsdoOptions = formDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);
               
                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
               
                if(app.elementDetailView.elementDetailViewModel.formCheckListIds != null) {
                    var checkListFilters = [];
                    for(var i=0; i < app.elementDetailView.elementDetailViewModel.formCheckListIds.length; i++) {
                        checkListFilters[i] = { field: "id", operator: "==", value: app.elementDetailView.elementDetailViewModel.formCheckListIds[i] };
                    }

                    dataSource.filter({
                        logic: "or",
                        filters: checkListFilters
                    });
                    formDetailViewModel.set('dataSource', dataSource);

                }
                else {
                    formDetailViewModel.set('dataSource', '');
                }
               
                // formDetailViewModel.set('dataSource', dataSource);

                var jsdoOptionsChecks = formDetailViewModel.get('_jsdoOptionsChecks'),
                    jsdoChecks = new progress.data.JSDO(jsdoOptionsChecks);

                dataSourceOptionsChecks.transport.jsdo = jsdoChecks;
                dataSourceChecks = new kendo.data.DataSource(dataSourceOptionsChecks);
                formDetailViewModel.set('dataSourceChecks', dataSourceChecks);

                var jsdoOptionsCoreChecks = formDetailViewModel.get('_jsdoOptionsCoreChecks'),
                    jsdoCoreChecks = new progress.data.JSDO(jsdoOptionsCoreChecks);

                dataSourceOptionsCoreChecks.transport.jsdo = jsdoCoreChecks;
                dataSourceCoreChecks = new kendo.data.DataSource(dataSourceOptionsCoreChecks);
                formDetailViewModel.set('dataSourceCoreChecks', dataSourceCoreChecks);
        }
        else {
            // formDetailViewModel.loadImage();
            $("#formCheckList").show();
            $("#coreCheckList").hide();
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = formDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);
               
                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
               
                if(app.elementDetailView.elementDetailViewModel.formCheckListIds != null) {
                    var checkListFilters = [];
                    for(var i=0; i < app.elementDetailView.elementDetailViewModel.formCheckListIds.length; i++) {
                        checkListFilters[i] = { field: "id", operator: "==", value: app.elementDetailView.elementDetailViewModel.formCheckListIds[i] };
                    }

                    dataSource.filter({
                        logic: "or",
                        filters: checkListFilters
                    });

                    dataSource.sort({ field: "Index", dir: "asc" });
                    dataSource.fetch(function() {
                        console.log("view")
                        console.log(dataSource.data())
                    });
                    
                    formDetailViewModel.set('dataSource', dataSource);
                    
                }
                else {
                    formDetailViewModel.set('dataSource', '');
                }

                var jsdoOptionsChecks = formDetailViewModel.get('_jsdoOptionsChecks'),
                    jsdoChecks = new progress.data.JSDO(jsdoOptionsChecks);

                dataSourceOptionsChecks.transport.jsdo = jsdoChecks;
                dataSourceChecks = new kendo.data.DataSource(dataSourceOptionsChecks);
                formDetailViewModel.set('dataSourceChecks', dataSourceChecks);

                dataSourceChecks.filter({
                    logic: "and",
                    filters: [
                        {field: "R365596106", operator: "==", value: formDetailViewModel.formId},
                        {field: "LastUpdate", operator: "==", value: true}
                        ]
                });
                
                    dataSourceChecks.read().then(function() {
                        var view = dataSourceChecks.view();
                        var listStatusChecks = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_status().response.picklistData;
                        var notOkStatus;
                        for(var i=0; i<listStatusChecks.length; i++)
                            if(listStatusChecks[i].name == "Not Ok")
                                notOkStatus = listStatusChecks[i].id;
                        console.log("notOkStatus")
                        console.log(notOkStatus)

                        var greenFlag = false;
                        console.log("checklist")
                        console.log(checklist)
                        if(checklist != null) {
                            for(var i=0; i<checklist.data.length; i++) {
                                greenFlag = false;
                                if(view.length == 0) {
                                    document.getElementById(checklist.data[i].id).style.background = "#d12229";
                                }
                                $("#"+checklist.data[i].id+'checkNcr').hide();
                                for(var j=0; j<view.length; j++) {
                                    if(checklist.data[i].id == view[j].R365688751) {
                                        checklist.data[i].status = "green";//checklist.data[i].id;
                                        document.getElementById(checklist.data[i].id).style.background = "#449d31";
                                        console.log(view[j])
                                        if(view[j].status == notOkStatus) {
                                            checklist.data[i].status = "red";
                                            $("#"+checklist.data[i].id+'checkNcr').show();
                                            document.getElementById(checklist.data[i].id).style.background = "#d12229";
                                        }
                                        else { 
                                            $("#"+checklist.data[i].id+'checkNcr').show();
                                            document.getElementById(checklist.data[i].id).style.background = "#449d31";
                                        }
                                        greenFlag = true;
                                        break;
                                    }
                                    if(greenFlag == false) {
                                        document.getElementById(checklist.data[i].id).style.background = "#d12229";
                                        // document.getElementById("checkNcr").hide();
                                        $("#"+checklist.data[i].id+'checkNcr').hide();
                                    }
                                }
                            }
                        }
                    });
                    // checklist.data.includes(view.foreach(function(){}));
                    
                // }
                if(e.view.params.formname == "E") {
                    formDetailViewModel.formName = "E&B";
                    formNameCheckList.innerHTML = "E&B";    
                }
                else {
                    formDetailViewModel.formName = e.view.params.formname;
                    formNameCheckList.innerHTML = e.view.params.formname; 
                }

                 if(e.view.params.stagenum == 5) {
                    formDetailViewModel.formName = "E&B";
                    formNameCheckList.innerHTML = "E&B";
                }
              
                if(e.view.params.formname == "SURVEYOR MARKING") {
                    $("#surveyor").show();
                }
                else $("#surveyor").hide();
                
            });
        }
    });

function onFileUploadSuccess1() {
        console.log("onFileUploadSuccess")
        
        // app.mobileApp.navigate('#:back');

        window.plugins.toast.showWithOptions(
        {
            message: app.formDetailView.get('strings').toastsMessages.uploadImageSuccess,
            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
            position: "bottom",
            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
        });         
    }

function onFileTransferFail1(error) {
        console.log("FileTransfer Error:");
        console.log(error)
        console.log("Code: " + error.code);
        console.log("Body:" + error.body);
        console.log("Source: " + error.source);
        console.log("Target: " + error.target);
    }

function onFileUploadSuccess2() {
       // alert("onFileUploadSuccess2")
        console.log("onFileUploadSuccess2")
       
        $("#addCapturePhotoPop").kendoMobileModalView("close");
       
        window.plugins.toast.showWithOptions(
        {
            message: app.formDetailView.get('strings').toastsMessages.uploadImageSuccess,
            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
            position: "bottom",
            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
        });          
    }

function onFileTransferFail(error) {
        console.log("FileTransfer Error:");
        console.log(error)
        console.log("Code: " + error.code);
        console.log("Body:" + error.body);
        console.log("Source: " + error.source);
        console.log("Target: " + error.target);
    }
})(app.formDetailView);

// START_CUSTOM_CODE_formDetailViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.formDetailView.formDetailViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.formDetailView.formDetailViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_formDetailViewModel