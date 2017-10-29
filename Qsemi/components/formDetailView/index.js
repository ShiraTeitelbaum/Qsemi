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
        dataSourceOptionsChecks = {
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
        dataSourceOptionsCoreChecks = {
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
        dataSourceOptionsCore = {
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
        /// start data sources
        /// end data sources
        formDetailViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _dataSourceOptionsChecks: dataSourceOptionsChecks,
            _dataSourceOptionsCore: dataSourceOptionsCore,
            _dataSourceOptionsCoreChecks: dataSourceOptionsCoreChecks,
            _dataSourceOptionsGallery: dataSourceOptionsGallery,
            _jsdoOptions: jsdoOptions,
            _jsdoOptionsChecks: jsdoOptionsChecks,
            _jsdoOptionsCore: jsdoOptionsCore,
            _jsdoOptionsCoreChecks: jsdoOptionsCoreChecks,
            _jsdoOptionsGallery: jsdoOptionsGallery,
            formName: '',
            formId: '',
            pageScroller: '',
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
                //app.mobileApp.navigate('#components/formDetailView/details.html?uid=' + dataItem.uid);
                app.mobileApp.navigate('#components/formDetailView/addCoreData.html?uid=' + dataItem.uid);
            },
            itemClick: function(e) {
                var dataItem = e.dataItem || formDetailViewModel.originalItem;
                //app.mobileApp.navigate('#components/formDetailView/details.html?uid=' + dataItem.uid);
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
                alerT(111)
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
                                onFileUploadSuccess( ),
                                onFileTransferFail,
                                options,
                                true);
                        }
                    }
                };
                jsdoGallery.subscribe('afterCreate', afterCreateFn);
                jsdoGallery.saveChanges();
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
        },
        onShowCoreData: function(e) {
            app.mobileApp.showLoading();
            e.view.scroller.reset();
            this.pageScroller = e.view.scroller;

            var that = this,
                itemUid = e.view.params.uid,
                dataSource = formDetailViewModel.get('dataSourceCore'),
                itemData = dataSource.getByUid(itemUid),
                fixedData = formDetailViewModel.fixHierarchicalData(itemData);
                
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
                    // console.log("view")
                    // console.log(view)
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

                        that.set('itemData', itemData);
                        that.set('addFormData', {
                            Comments: comments,
                            Data: data
                            /// start add form data init
                            /// end add form data init
                        });
                    }
                    else {
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
            this.pageScroller = e.view.scroller;

            // $("#processControlTitle").hide();
            // $("#processControlImage").hide();
            // $("#processControlChecks").hide();
            // $("#processControlImage").hide();
            // $("#text1").hide(); $("#text2").hide(); $("#text3").hide(); $("#text4").hide(); $("#text5").hide();
            // $("#Text1").hide(); $("#Text2").hide(); $("#Text3").hide(); $("#Text4").hide(); $("#Text5").hide();
            // $("#number1").hide(); $("#number2").hide(); $("#number3").hide(); $("#number4").hide(); $("#number5").hide();
            // $("#Number1").hide(); $("#Number2").hide(); $("#Number3").hide(); $("#Number4").hide(); $("#Number5").hide();
            // $("#pcOkNotOkTitle").hide(); $("#pcOkNotOk").hide(); $("#pcNormalNotNormalTitle").hide(); $("#pcNormalNotNormal").hide(); 

            if(app.elementDetailView.elementDetailViewModel.surveyorFlag == true) {
                $("#checkStatus").hide();
            }
            else $("#checkStatus").show();

            $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv = $("#signature");
            // after some doodling...
            $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

             var that = this,
                itemUid = e.view.params.uid,
                dataSource = formDetailViewModel.get('dataSource'),
                itemData = dataSource.getByUid(itemUid),
                fixedData = formDetailViewModel.fixHierarchicalData(itemData);
            
            // if(itemData.ShowNum1 == true || itemData.ShowNum2 == true || itemData.ShowNum3 == true || itemData.ShowNum4 == true || itemData.ShowNum5 == true ||
            //     itemData.ShowText1 == true || itemData.ShowText2 == true || itemData.ShowText3 == true || itemData.ShowText4 == true || itemData.ShowText5 == true ||
            //     itemData.ShowOkNotOk1 == true || itemData.ShowNormal1 == true) {
            //         if(app.elementDetailView.elementDetailViewModel.surveyorFlag == true) {
            //             $("#processControlTitle").show();
            //         }
            //         else $("#processControlTitle").hide(); 
                    
            //         if(itemData.ShowText1 == true) {
            //             document.getElementById("text1inputTitle").innerHTML = itemData.TitleText1 + ':';
            //             $("#text1").show();
            //             $("#Text1").show();
            //         }
            //         if(itemData.ShowText2 == true) {
            //             document.getElementById("text2inputTitle").innerHTML = itemData.TitleText2 + ':';
            //             $("#text2").show();
            //             $("#Text2").show();
            //         }
            //         if(itemData.ShowText3 == true) {
            //             document.getElementById("text3inputTitle").innerHTML = itemData.TitleText3 + ':';
            //             $("#text3").show();
            //             $("#Text3").show();
            //         }
            //         if(itemData.ShowText4 == true) {
            //             document.getElementById("text4inputTitle").innerHTML = itemData.TitleText4 + ':';
            //             $("#text4").show();
            //             $("#Text4").show();
            //         }
            //         if(itemData.ShowText5 == true) {
            //             document.getElementById("text5inputTitle").innerHTML = itemData.TitleText5 + ':';
            //             $("#text5").show();
            //             $("#Text5").show();
            //         }

            //         if(itemData.ShowNum1 == true) {
            //             document.getElementById("number1inputTitle").innerHTML = itemData.TitleNum1 + ':';
            //             $("#number1").show();
            //             $("#Number1").show();
            //         }
            //         if(itemData.ShowNum2 == true) {
            //             document.getElementById("number2inputTitle").innerHTML = itemData.TitleNum2 + ':';
            //             $("#number2").show();
            //             $("#Number2").show();
            //         }
            //         if(itemData.ShowNum3 == true) {
            //             document.getElementById("number3inputTitle").innerHTML = itemData.TitleNum3 + ':';
            //             $("#number3").show();
            //             $("#Number3").show();
            //         }
            //         if(itemData.ShowNum4 == true) {
            //             document.getElementById("number4inputTitle").innerHTML = itemData.TitleNum4 + ':';
            //             $("#number4").show();
            //             $("#Number4").show();
            //         }
            //         if(itemData.ShowNum5 == true) {
            //             document.getElementById("number5inputTitle").innerHTML = itemData.TitleNum5 + ':';
            //             $("#number5").show();
            //             $("#Number5").show();
            //         }
                    
            //         if(itemData.image == true) {
            //             $("#processControlImage").show();
            //         }

            //         // console.log("itemData")
            //         // console.log(itemData)
            //         if(itemData.ShowOkNotOk1 == true) {
            //             // var listOkNotOK1 = app.formDetailView.formDetailViewModel._dataSourceOptions.transport.jsdo.getPicklist_OKNotOK1().response.picklistData;
            //             // console.log("list")
            //             // console.log(listOkNotOK1)

            //             document.getElementById("okNotOkTitle").innerHTML = itemData.TitleOkNotOk1 + ':';
            //             // document.getElementById("pc_ok_label").innerHTML = itemData.TitleOkNotOk1 + ':';
            //             // document.getElementById("pc_not_ok_label").innerHTML = itemData.TitleOkNotOk1 + ':';
                       
            //             $("#pcOkNotOkTitle").show();
            //             $("#pcOkNotOk").show(); 
            //         }

            //         if(itemData.ShowNormal1 == true) {
            //             document.getElementById("normalNotNormalTitle").innerHTML = itemData.TitleNormal1 + ':';
            //             $("#pcNormalNotNormalTitle").show();
            //             $("#pcNormalNotNormal").show(); 
            //         }
            //     }

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
                    
                    if(view[0] != undefined) {
                        document.getElementById("status_ok").checked = false;
                        document.getElementById("status_not_ok").checked = false;
                        document.getElementById("status_NA").checked = false;
                        // document.getElementById("pc_ok").checked = false;
                        // document.getElementById("pc_not_ok").checked = false;
                        // document.getElementById("pc_normal").checked = false;
                        // document.getElementById("pc_not_normal").checked = false;

                        var status = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_status().response.picklistData;
                        // var OkNotOK1 = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_OkNotOK1().response.picklistData;
                        // var Normal1 = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_Normal1().response.picklistData;
                     
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

                        // if(view[0].OkNotOK1 != null) {
                        //     for(var i=0; i < OkNotOK1.length; i++) {
                        //         if(view[0].OkNotOK1 == OkNotOK1[i].id) {
                        //             switch(OkNotOK1[i].name) {
                        //                 case "OK": document.getElementById("pc_ok").checked = true;
                        //                     // $("#checkStatus").css('background-color', '#449d31');
                        //                         break;
                        //                 case "Not OK": document.getElementById("pc_not_ok").checked = true; 
                        //                             //$("#checkStatus").css('background-color', '#d12229');
                        //                             break;
                        //             }
                        //         }
                        //     }
                        // }

                        // if(view[0].Normal1 != null) {
                        //     for(var i=0; i < Normal1.length; i++) {
                        //         if(view[0].Normal1 == Normal1[i].id) {
                        //             switch(Normal1[i].name) {
                        //                 case "Normal": document.getElementById("pc_normal").checked = true;
                        //                     // $("#checkStatus").css('background-color', '#449d31');
                        //                         break;
                        //                 case "Not Normal": document.getElementById("pc_not_normal").checked = true; 
                        //                             //$("#checkStatus").css('background-color', '#d12229');
                        //                             break;
                        //             }
                        //         }
                        //     }
                        // }

                        // var imageObj = $.parseJSON(view[0].image);
                        // view[0].image = processImage(formDetailViewModel.get('_dataSourceOptionsChecks').transport.jsdo.url + imageObj.src);
                        // if(view[0].imageURL != "null") {
                        //     $("#addCapturePhotoForm").css("color", "red");
                        //     // $("#addCapturePhotoFormImg").src = view[0].image; //view[0].imageURL
                        //     document.getElementById("addCapturePhotoFormImg").setAttribute("src", view[0].image);
                        //     // document.getElementById("addCapturePhotoFormImg").setAttribute("href", view[0].imageURL);
                        // }
                        
                        var commentsC, text1;
                        if(view[0].Comments != "null") {
                            commentsC = view[0].Comments;
                        }  
                        else {
                            commentsC = '';
                        }
                       
                        // if(view[0].Text1 != null && view[0].Text1 != "null") { $("#text1input").val(view[0].Text1); } else { $("#text1input").val(''); }
                        // if(view[0].Text2 != null && view[0].Text2 != "null") { $("#text2input").val(view[0].Text2); } else { $("#text2input").val(''); }
                        // if(view[0].Text3 != null && view[0].Text3 != "null") { $("#text3input").val(view[0].Text3); } else { $("#text3input").val(''); }
                        // if(view[0].Text4 != null && view[0].Text4 != "null") { $("#text4input").val(view[0].Text4); } else { $("#text4input").val(''); }
                        // if(view[0].Text5 != null && view[0].Text5 != "null") { $("#text5input").val(view[0].Text5); } else { $("#text5input").val(''); }

                        // if(view[0].Num1 != null && view[0].Num1 != "null") { $("#number1input").val(view[0].Num1); } else { $("#number1input").val(''); }
                        // if(view[0].Num2 != null && view[0].Num2 != "null") { $("#number2input").val(view[0].Num2); } else { $("#number2input").val(''); }
                        // if(view[0].Num3 != null && view[0].Num3 != "null") { $("#number3input").val(view[0].Num3); } else { $("#number3input").val(''); }
                        // if(view[0].Num4 != null && view[0].Num4 != "null") { $("#number4input").val(view[0].Num4); } else { $("#number4input").val(''); }
                        // if(view[0].Num5 != null && view[0].Num5 != "null") { $("#number5input").val(view[0].Num5); } else { $("#number5input").val(''); }

                        $sigdiv.jSignature("importData", view[0].signature);

                        that.set('itemData', itemData);
                        that.set('addFormData', {
                            comments: commentsC,
                            /// start add form data init
                            /// end add form data init
                        });
                    }
                    else {
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
            // document.getElementById("pc_ok").checked = false;
            // document.getElementById("pc_not_ok").checked = false;
            // document.getElementById("pc_normal").checked = false;
            // document.getElementById("pc_not_normal").checked = false;
            $("#checkComments").val('');
            // $("#addCapturePhotoForm").css("color", "black");
            $('#signature').jSignature('clear');
            // app.mobileApp.navigate('#:back');
            /// end add model cancel
        }, 
        openMap: function () {
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
                app.mobileApp.navigate('#components/elementLocationMaps/view.html');
            });
            // app.surveyorMarking.surveyorMarkingModel.mapFlag=true;
            // app.mobileApp.navigate('#components/elementLocationMaps/view.html');
        },
        // closeAddPopUpImgForm: function (e) {
        //      $("#addCapturePhotoFormPop").kendoMobileModalView("close"); 
        // },
        openSignaturePopUp: function(e) {
            $("#signaturePopUp").kendoMobileModalView("open"); 
        },
        closeSignaturePopUp: function(e) {
            $("#signaturePopUp").kendoMobileModalView("close"); 
        },
        onSaveCoreClick: function(e) {
            var addFormData = this.get('addFormData'),
                filter = formDetailViewModel && formDetailViewModel.get('paramFilter'),
                //dataSource = formDetailViewModel.get('dataSource'),
                dataSourceCoreChecks = formDetailViewModel.get('dataSourceCoreChecks'),
                itemData = this.get("itemData"),
                addModel = {};

                 function saveModel(data) {
                    /// start add form data save
                
                    addModel.Data = $("#text1input").val();
                    addModel.Comments = $("#coreCheckComments").val();
                    addModel.R369589302 = formDetailViewModel.formId;
                    addModel.R369425614 = itemData.id;
                    addModel.name = itemData.name;
                    addModel.locationId = sessionStorage.getItem("locationId");
                    addModel.LastUpdate = true;
                    /// end add form data save
         
                    //dataSource.add(addModel);
                    //dataSource.one('change', function(e) {
                    dataSourceCoreChecks.add(addModel);
                    dataSourceCoreChecks.one('change', function(e) {
                        app.elementDetailView.elementDetailViewModel.change_Percent = true;
                        app.elementDetailView.elementDetailViewModel.QC_click_flag = true;

                        $("#text1input").val('');
                        $("#coreCheckComments").val('');
                        alert("The check has been successfully saved");
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
        onSaveClick: function(e) {
            var addFormData = this.get('addFormData'),
                filter = formDetailViewModel && formDetailViewModel.get('paramFilter'),
                //dataSource = formDetailViewModel.get('dataSource'),
                dataSourceChecks = formDetailViewModel.get('dataSourceChecks'),
                itemData = this.get("itemData"),
                addModel = {};
            
            function saveModel(data) {
                /// start add form data save
                var listStatus = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_status().response.picklistData;
                // var listOkNotOK1 = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_OkNotOK1().response.picklistData;
                // var listNormal1 = app.formDetailView.formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.getPicklist_Normal1().response.picklistData;
                
                for(var i=0; i < listStatus.length; i++) {
                    if($("#status_ok").is(':checked')) {
                        if(listStatus[i].name == "Ok") {
                            addModel.status = listStatus[i].id;
                            break;
                        }
                    }
                    else if($("#status_not_ok").is(':checked')) {
                        if(listStatus[i].name == "Not Ok") {
                            addModel.status = listStatus[i].id;
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

                // if(itemData.ShowText1 == true) { addModel.Text1 = $("#text1input").val(); }
                // if(itemData.ShowText2 == true) { addModel.Text2 = $("#text2input").val(); }
                // if(itemData.ShowText3 == true) { addModel.Text3 = $("#text3input").val(); }
                // if(itemData.ShowText4 == true) { addModel.Text4 = $("#text4input").val(); }
                // if(itemData.ShowText5 == true) { addModel.Text5 = $("#text5input").val(); }

                // if($("#number1input").val() > 9999999999 || $("#number2input").val() > 9999999999 || $("#number3input").val() > 9999999999 ||
                // $("#number4input").val() > 9999999999 || $("#number5input").val() > 9999999999) {
                //     alert("Invalid Number");
                // }

                // if(itemData.ShowNum1 == true) { addModel.Num1 = $("#number1input").val(); }
                // if(itemData.ShowNum2 == true) { addModel.Num2 = $("#number2input").val(); }
                // if(itemData.ShowNum3 == true) { addModel.Num3 = $("#number3input").val(); }
                // if(itemData.ShowNum4 == true) { addModel.Num4 = $("#number4input").val(); }
                // if(itemData.ShowNum5 == true) { addModel.Num5 = $("#number5input").val(); }

                // if(itemData.ShowOkNotOk1 == true) {
                //     for(var i=0; i < listOkNotOK1.length; i++) {
                //         if($("#pc_ok").is(':checked')) {
                //             if(listOkNotOK1[i].name == "OK") {
                //                 addModel.OkNotOK1 = listOkNotOK1[i].id;
                //                 break;
                //             }
                //         }
                //         else if($("#pc_not_ok").is(':checked')) {
                //             if(listOkNotOK1[i].name == "Not OK") {
                //                 addModel.OkNotOK1 = listOkNotOK1[i].id;
                //                 break;
                //             }
                //         }
                //     }
                // }

                // if(itemData.ShowNormal1 == true) {
                //     for(var i=0; i < listNormal1.length; i++) {
                //         if($("#pc_normal").is(':checked')) {
                //             if(listNormal1[i].name == "Normal") {
                //                 addModel.Normal1 = listNormal1[i].id;
                //                 break;
                //             }
                //         }
                //         else if($("#pc_not_normal").is(':checked')) {
                //             if(listNormal1[i].name == "Not Normal") {
                //                 addModel.Normal1 = listNormal1[i].id;
                //                 break;
                //             }
                //         }
                //     }
                // }

                addModel.Comments = $("#checkComments").val();
                addModel.signature = $("#signature").jSignature("getData");
                addModel.R365596106 = formDetailViewModel.formId;
                addModel.R365688751 = itemData.id;
                addModel.name = itemData.name;
                addModel.locationId = sessionStorage.getItem("locationId");
                addModel.LastUpdate = true;
                //addModel.name = !!addFormData.checkbox7;
                /// end add form data save
         
                //dataSource.add(addModel);
                //dataSource.one('change', function(e) {
                dataSourceChecks.add(addModel);
                dataSourceChecks.one('change', function(e) {
                    // var imagefile = $('#addCapturePhotoFormImg').attr('src');
                    // if(imagefile) {
                    //      var options = new FileUploadOptions();
                    //     var imageObj = $.parseJSON(current.image) 
                    //     options.fileKey = "fileContents";
                    //     options.fileName = "image";
                    //     if (cordova.platformId == "android") {
                    //         options.fileName += ".jpeg"
                    //     }
                    //     options.mimeType = "image/jpeg";
                    //     options.params = {};  // if we need to send parameters to the server request 
                    //     options.headers = {
                    //         Connection: "Close"
                    //     };
                    //     options.chunkedMode = false;
                    //     var ft = new FileTransfer();
                    //     var urlRB = formDetailViewModel._dataSourceOptionsChecks.transport.jsdo.url + imageObj.src + "?objName=" + formDetailViewModel._jsdoOptionsChecks.name;
                    
                    //     ft.upload(
                    //         imagefile,
                    //         encodeURI(urlRB),
                    //         onFileUploadSuccess( ),
                    //         onFileTransferFail,
                    //         options,
                    //         true);
                    // }

                    document.getElementById("status_ok").checked = false;
                    document.getElementById("status_not_ok").checked = false;
                    document.getElementById("status_NA").checked = false;

                    // document.getElementById("pc_ok").checked = false;
                    // document.getElementById("pc_not_ok").checked = false;
                    // document.getElementById("pc_normal").checked = false;
                    // document.getElementById("pc_not_normal").checked = false;

                    // $("#addCapturePhotoForm").css("color", "black");

                    app.elementDetailView.elementDetailViewModel.change_Percent = true;
                    app.elementDetailView.elementDetailViewModel.QC_click_flag = true;

                    $("#checkComments").val('');
                    alert("The check has been successfully saved");
                    app.mobileApp.navigate('#:back');
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
            $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

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
        // console.log("e.view.params.coreFlag")
        // console.log(e.view.params)
        $("#checkListTitle").hide();
        $("#coreDataTitle").hide();
        if(e.view.params.coreFlag == "true") {
            $("#surveyor").hide();
            $("#formCheckList").hide();
            $("#coreCheckList").show();
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = formDetailViewModel.get('_jsdoOptionsCore'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptionsCore.transport.jsdo = jsdo;
                dataSourceCore = new kendo.data.DataSource(dataSourceOptionsCore);
               
                //dataSource.filter({ field: "R365599694", operator: "==", value: e.view.params.formid });
                if(app.elementDetailView.elementDetailViewModel.coreCheckListIds != null) {
                    var checkListFilters = [];
                    for(var i=0; i < app.elementDetailView.elementDetailViewModel.coreCheckListIds.length; i++) {
                        checkListFilters[i] = { field: "id", operator: "==", value: app.elementDetailView.elementDetailViewModel.coreCheckListIds[i] };
                    }
                    // console.log("checkListFilters")
                    // console.log(checkListFilters)
                    dataSourceCore.filter({
                        logic: "or",
                        filters: checkListFilters
                    });
                    formDetailViewModel.set('dataSourceCore', dataSourceCore);

                }
                // dataSourceCore.fetch(function() {
                //     console.log("check list form")
                //     console.log(dataSourceCore.data())
                // });
                formDetailViewModel.set('dataSourceCore', dataSourceCore);

                var jsdoOptionsCoreChecks = formDetailViewModel.get('_jsdoOptionsCoreChecks'),
                    jsdoCoreChecks = new progress.data.JSDO(jsdoOptionsCoreChecks);

                dataSourceOptionsCoreChecks.transport.jsdo = jsdoCoreChecks;
                dataSourceCoreChecks = new kendo.data.DataSource(dataSourceOptionsCoreChecks);
                formDetailViewModel.set('dataSourceCoreChecks', dataSourceCoreChecks);

                //fetchFilteredData(param);
                formDetailViewModel.formName = e.view.params.formname;
                formNameCheckList.innerHTML = e.view.params.formname; 
            });
        }
        else if(e.view.params.surveyorFlag == "true") {
            // alert("surveyorFlag")
            $("#formCheckList").show();
            $("#coreCheckList").show();
            $("#surveyor").show();
            $("#checkListTitle").show();
            $("#coreDataTitle").show();
            formDetailViewModel.formName = e.view.params.formname;
            formNameCheckList.innerHTML = e.view.params.formname; 
             var jsdoOptions = formDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);
               
                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
               
                //dataSource.filter({ field: "R365599694", operator: "==", value: e.view.params.formid });
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
                // dataSource.fetch(function() {
                //     console.log("check list form")
                //     console.log(dataSource.data())
                // });
                formDetailViewModel.set('dataSource', dataSource);

                var jsdoOptionsChecks = formDetailViewModel.get('_jsdoOptionsChecks'),
                    jsdoChecks = new progress.data.JSDO(jsdoOptionsChecks);

                dataSourceOptionsChecks.transport.jsdo = jsdoChecks;
                dataSourceChecks = new kendo.data.DataSource(dataSourceOptionsChecks);
                formDetailViewModel.set('dataSourceChecks', dataSourceChecks);

            //     var jsdoOptionsCore = formDetailViewModel.get('_jsdoOptionsCore'),
            //         jsdoCore = new progress.data.JSDO(jsdoOptionsCore);

            //     dataSourceOptionsCore.transport.jsdo = jsdoCore;
            //     dataSourceCore = new kendo.data.DataSource(dataSourceOptionsCore);
               
            //    console.log("app.elementDetailView.elementDetailViewModel.coreCheckListIds")
            //         console.log(app.elementDetailView.elementDetailViewModel.coreCheckListIds)
            //     //dataSource.filter({ field: "R365599694", operator: "==", value: e.view.params.formid });
            //     if(app.elementDetailView.elementDetailViewModel.coreCheckListIds != null) {
            //         var coreListFilters = [];
                    
            //         for(var i=0; i < app.elementDetailView.elementDetailViewModel.coreCheckListIds.length; i++) {
            //             coreListFilters[i] = { field: "id", operator: "==", value: app.elementDetailView.elementDetailViewModel.coreCheckListIds[i] };
            //         }
            //         console.log("coreListFilters")
            //         console.log(coreListFilters)
            //         // dataSourceCore.filter({
            //         //     logic: "or",
            //         //     filters: coreListFilters
            //         // });
            //         formDetailViewModel.set('dataSourceCore', dataSourceCore);

            //     }
            //     dataSourceCore.fetch(function() {
            //         console.log("core list form")
            //         console.log(dataSourceCore.data())
            //     });
            //     formDetailViewModel.set('dataSourceCore', dataSourceCore);

                var jsdoOptionsCoreChecks = formDetailViewModel.get('_jsdoOptionsCoreChecks'),
                    jsdoCoreChecks = new progress.data.JSDO(jsdoOptionsCoreChecks);

                dataSourceOptionsCoreChecks.transport.jsdo = jsdoCoreChecks;
                dataSourceCoreChecks = new kendo.data.DataSource(dataSourceOptionsCoreChecks);
                formDetailViewModel.set('dataSourceCoreChecks', dataSourceCoreChecks);
        }
        else {
            //if (!formDetailViewModel.get('dataSource')) {
            $("#formCheckList").show();
            $("#coreCheckList").hide();
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = formDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);
               
                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
               
                //dataSource.filter({ field: "R365599694", operator: "==", value: e.view.params.formid });
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
                /*dataSource.fetch(function() {
                    console.log("check list form")
                    console.log(dataSource.data())
                });*/
                formDetailViewModel.set('dataSource', dataSource);

                var jsdoOptionsChecks = formDetailViewModel.get('_jsdoOptionsChecks'),
                    jsdoChecks = new progress.data.JSDO(jsdoOptionsChecks);

                dataSourceOptionsChecks.transport.jsdo = jsdoChecks;
                dataSourceChecks = new kendo.data.DataSource(dataSourceOptionsChecks);
                formDetailViewModel.set('dataSourceChecks', dataSourceChecks);

                //fetchFilteredData(param);
                if(e.view.params.formname == "E") {
                    formDetailViewModel.formName = "E&B";
                    formNameCheckList.innerHTML = "E&B";    
                }
                else {
                    formDetailViewModel.formName = e.view.params.formname;
                    formNameCheckList.innerHTML = e.view.params.formname; 
                }
              
                if(e.view.params.formname == "SURVEYOR MARKING") {
                    $("#surveyor").show();
                }
                else $("#surveyor").hide();
                
            });
            //} else {
                //fetchFilteredData(param);
            //}
        }
    });

function onFileUploadSuccess() {
        // alert("onFileUploadSuccess")
        console.log("onFileUploadSuccess")
         $("#addCapturePhoto").css("color", "black");
        document.getElementById("addCapturePhotoImg").setAttribute("src", "");
        $("#addCapturePhotoPop").kendoMobileModalView("close");
    // sessionStorage.setItem("fileToUpload", "null");
    // localStorage.setItem("fileName", "null");
        /*window.plugins.toast.showWithOptions(
            {
            message: "התמונה עלתה בהצלחה",
            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
            position: "bottom",
            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            }
        );*/         
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