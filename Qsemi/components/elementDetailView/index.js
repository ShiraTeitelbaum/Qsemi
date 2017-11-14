'use strict';

app.elementDetailView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('elementDetailView');

// START_CUSTOM_CODE_elementDetailView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_elementDetailView
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
            var model = parent.get('elementDetailViewModel'),
                dataSource, dataSourceElementForms;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('elementDetailViewModel_delayedFetch', paramFilter || null);
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
            name: 'element2',
            autoFill: false
        },
        jsdoOptionsElementsType = {
            name: 'Element_Type',
            autoFill: false
        },
        jsdoOptionsForms = {
            name: 'Forms1',
            autoFill: false
        },
        jsdoOptionsElementForms = {
            name: 'DynamicForms',
            autoFill: false
        },
        jsdoOptionsSteps = {
            name: 'Steps',
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
        elementDetailViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _dataSourceOptionsGallery: dataSourceOptionsGallery,
            _jsdoOptions: jsdoOptions,
            _jsdoOptionsElementsType: jsdoOptionsElementsType,
            _jsdoOptionsForms: jsdoOptionsForms,
            _jsdoOptionsElementForms: jsdoOptionsElementForms,
            _jsdoOptionsSteps: jsdoOptionsSteps,
            _jsdoOptionsGallery: jsdoOptionsGallery,
            marker: {},
            markers: [],
            dataSourceSteps: '',
            stepsNames: '',
            stepId: '',
            stageList: '',
            page_scroller: '',
            formCheckListIds: [],
            coreCheckListIds: [],
            QC_click_flag: false,
            change_Percent: false,
            surveyorFlag: false,
            elementLocation: {},
            searchChange: function(e) {
                var searchVal = e.target.value, searchFilterOr,
                    searchFilter = { logic: "and", filters: [] };

                searchFilter.filters.push({ field: "locationId", operator: "==", value: sessionStorage.getItem("locationId") }, { field: "R363890883", operator: "==", value: elementDetailViewModel.stepId });

                searchFilterOr = { 
                    logic: "or", 
                    filters: [
                        { field: "name", operator: "contains", value: searchVal },
                        // { field: "R363890883", operator: "==", value: elementDetailViewModel.stepId }
                    ] 
                };

                searchFilter.filters.push(searchFilterOr);
                fetchFilteredData(elementDetailViewModel.get('paramFilter'), searchFilter);
            },
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
            logoutClick: function() {
                app.mobileApp.navigate('#components/authenticationView/view.html?logout=true');
            },
            goToProjects: function() {
                app.mobileApp.navigate('#components/projectDetailView/view.html');
            },
            itemClick: function(e) {
                var dataItem = e.dataItem || elementDetailViewModel.originalItem;
                elementDetailViewModel.QC_click_flag = false;
                elementDetailViewModel.surveyorFlag = false;
                elementDetailViewModel.change_Percent = false;
                
                app.mobileApp.navigate('#components/elementDetailView/details.html?uid=' + dataItem.uid);

            },
            openGeotechnical: function(e) {
                app.mobileApp.navigate('#components/geotechnicalForm/edit.html?elementUid=' + elementDetailViewModel.currentItem.uid+'&elementId='+elementDetailViewModel.currentItem.id);
            },
            openCast: function(e) {
                // alert(444)
                app.mobileApp.navigate('#components/castingForm/edit.html?elementUid=' + elementDetailViewModel.currentItem.uid+'&elementId='+elementDetailViewModel.currentItem.id);
            },
            openLaboratory: function(e) {
                // alert(555)
                app.mobileApp.navigate('#components/laboratoryTestForm/add.html?elementUid=' + elementDetailViewModel.currentItem.uid+'&elementId='+elementDetailViewModel.currentItem.id);
            },
            elementNoStepClick: function () {
                alert("The current step is currently unavailable");
            },
            elementStepClick: function(id) {
                app.elementDetailView.elementDetailViewModel.surveyorFlag = false;
                
                app.mobileApp.navigate('#components/elementDetailView/stepFormList.html?stepid=' + id);
            },
            detailsShow: function(e) {
                this.page_scroller = e.view.scroller;
                elementDetaileDetailsTitle.innerHTML = sessionStorage.getItem("locationName");
                elementStep.innerHTML = 'Step: ' + sessionStorage.getItem("stageName");
                $("#saveGeneralDetailsButtom").hide();
                $("#spanBeforeEdit").hide();
                $("#spanAfterEdit").hide();
                if(e.view.params.mapFlag != undefined) {
                    var id = e.view.params.id,
                        stepnum = e.view.params.stepNum;
                    for(var i=0; i<elementDetailViewModel.stageList.length; i++) {
                        if(elementDetailViewModel.stageList[i].stageNum == stepnum) {
                            elementStep.innerHTML = 'Step: ' + elementDetailViewModel.stageList[i].name;
                            break;
                        }
                    }
                    
                        dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                            var jsdoOptions = elementDetailViewModel.get('_jsdoOptions'),
                                dataSourceOptions = elementDetailViewModel.get('_dataSourceOptions'),
                                jsdo = new progress.data.JSDO(jsdoOptions);

                            dataSourceOptions.transport.jsdo = jsdo;
                            dataSource = new kendo.data.DataSource(dataSourceOptions);
                            dataSource.filter({ field: "id", operator: "==", value: id });
                            elementDetailViewModel.set('dataSource', dataSource);
                            
                            dataSource.fetch(function() {
                                var view = dataSource.data();
                                elementDetailViewModel.setCurrentItemByUid(view[0].uid);
                               
                                document.getElementById("LastUpdateDateElem").innerHTML = kendo.toString(view[0].updatedAt, "dd/MM/yyyy");
                                if(this.QC_click_flag == true)
                                    document.getElementById("QC_Button").click();
                                else document.getElementById("defaultOpen").click();
                            });
                        });
                }
                else if(this.change_Percent == true) {
                    var jsdoOptions = elementDetailViewModel.get('_jsdoOptions'),
                        dataSourceOptions = elementDetailViewModel.get('_dataSourceOptions'),
                        jsdo = new progress.data.JSDO(jsdoOptions);

                    dataSourceOptions.transport.jsdo = jsdo;
                    dataSource = new kendo.data.DataSource(dataSourceOptions);
                    dataSource.filter({ field: "id", operator: "==", value: elementDetailViewModel.currentItem.id });
                    elementDetailViewModel.set('dataSource', dataSource);
                            
                    dataSource.fetch(function() {
                        var view = dataSource.data();
                       console.log("view")
                       console.log(view)
                        elementDetailViewModel.setCurrentItemByUid(view[0].uid);
                        document.getElementById("LastUpdateDateElem").innerHTML = kendo.toString(view[0].updatedAt, "dd/MM/yyyy");
                        if(elementDetailViewModel.QC_click_flag == true)
                            document.getElementById("QC_Button").click();
                        else document.getElementById("defaultOpen").click();
                    });
                }
                else {
                    var uid = e.view.params.uid,
                     dataSource = elementDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);
                    
                    elementDetailViewModel.setCurrentItemByUid(uid);
                    /// start detail form show
                    document.getElementById("LastUpdateDateElem").innerHTML = kendo.toString(itemModel.updatedAt, "dd/MM/yyyy");
                    if(elementDetailViewModel.QC_click_flag == true)
                        document.getElementById("QC_Button").click();
                    else document.getElementById("defaultOpen").click();
                    /// end detail form show
                }
            },
            openQC1: function () {
                this.QC_click_flag = true;
                var step0 = elementDetailViewModel.currentItem.Step0,
                    step1 = elementDetailViewModel.currentItem.Step1,
                     step2 = elementDetailViewModel.currentItem.Step2,
                     step3 = elementDetailViewModel.currentItem.Step3,
                     step4 = elementDetailViewModel.currentItem.Step4, 
                     step5 = elementDetailViewModel.currentItem.Step5, 
                     step6 = elementDetailViewModel.currentItem.Step6,
                     step7 = elementDetailViewModel.currentItem.Step7;
                     
                var steps_Names = [];

                var jsdoOptionsSteps = elementDetailViewModel.get('_jsdoOptionsSteps'),
                        jsdoSteps = new progress.data.JSDO(jsdoOptionsSteps);

                dataSourceOptions.transport.jsdo = jsdoSteps;
                var dataSourceSteps = new kendo.data.DataSource(dataSourceOptions);

                dataSourceSteps.fetch(function() {
                    var steps = dataSourceSteps.data();
                   
                    var step_0, step_1, step_2, step_3, step_4, step_5, step_6, step_7;
                                        
                    for(var i=0; i<steps.length; i++) {
                        if(step0 == 1) {
                            if(steps[i].stageNum == 0) {
                                step_0 = { id: steps[i].stageNum, name: steps[i].name, persent: elementDetailViewModel.currentItem.stage0Persent };
                            }
                        }
                        if(step1 == 1) {
                            if(steps[i].stageNum == 1) {
                                step_1 = { id: steps[i].stageNum, name: steps[i].name, persent: elementDetailViewModel.currentItem.stage1Persent };
                            }
                        }
                        if(step2 == 1) {
                            if(steps[i].stageNum == 2) {
                                step_2 = { id: steps[i].stageNum, name: steps[i].name, persent: elementDetailViewModel.currentItem.stage2Persent };
                            }
                        }
                        if(step3 == 1) {
                            if(steps[i].stageNum == 3) {
                                step_3 = { id: steps[i].stageNum, name: steps[i].name, persent: elementDetailViewModel.currentItem.stage3Persent };
                            }
                        }
                        if(step4 == 1) {
                            if(steps[i].stageNum == 4) {
                                step_4 = { id: steps[i].stageNum, name: steps[i].name, persent: elementDetailViewModel.currentItem.stage4Persent };
                            }
                        }
                        if(step5 == 1) {
                            if(steps[i].stageNum == 5) {
                                step_5 = { id: steps[i].stageNum, name: steps[i].name, persent: elementDetailViewModel.currentItem.stage5Persent  };
                            }
                        }
                        if(step6 == 1) {
                            if(steps[i].stageNum == 6) {
                                step_6 = { id: steps[i].stageNum, name: steps[i].name, persent: elementDetailViewModel.currentItem.stage6Persent };
                            }
                        }
                        if(step7 == 1) {
                            if(steps[i].stageNum == 7) {
                                step_7 = { id: steps[i].stageNum, name: steps[i].name, persent: elementDetailViewModel.currentItem.stage7Persent };
                            }
                        }
                    }
                   
                    var index=0;
                    if(step_0 != undefined) { steps_Names[index] = step_0; index++; }
                    if(step_1 != undefined) { steps_Names[index] = step_1; index++; }
                    if(step_2 != undefined) { steps_Names[index] = step_2; index++; }
                    if(step_3 != undefined) { steps_Names[index] = step_3; index++; }
                    if(step_4 != undefined) { steps_Names[index] = step_4; index++; }
                    if(step_5 != undefined) { steps_Names[index] = step_5; index++; }
                    if(step_6 != undefined) { steps_Names[index] = step_6; index++; }
                    if(step_7 != undefined) { steps_Names[index] = step_7; index++; }
                    
                    elementDetailViewModel.stepsNames = steps_Names;
                
                    var templateContent = $("#elementStepsTemplate").html();
                    var template = kendo.template(templateContent);
                    var result = kendo.render(template, steps_Names); //render the template
                    $("#elementSteps").html(result); //append the result to the page
                });

            },
            closeAddPopUpImg: function(e) {
                 $("#addCapturePhotoSPop").kendoMobileModalView("close");
            },
            saveAddPopUpImg: function(e) {
                var newElementGallery;
                 var jsdoOptionsGallery = elementDetailViewModel.get('_jsdoOptionsGallery'),
                        jsdoGallery = new progress.data.JSDO(jsdoOptionsGallery),
                        dataSourceOptionsGallery = elementDetailViewModel.get('_dataSourceOptionsGallery');
                    dataSourceOptionsGallery.transport.jsdo = jsdoGallery;
                var dataSourceGallery = new kendo.data.DataSource(dataSourceOptionsGallery);

                newElementGallery = {
                    R369676467: elementDetailViewModel.currentItem.id
                    //R369888918: //dynamic form 
                };
                var jsrow = jsdoGallery.add(newElementGallery);
                var afterCreateFn;
                afterCreateFn = function (jsdoGallery, record, success, request) {
                    jsdoGallery.unsubscribeAll('afterCreate', afterCreateFn);
                    if (success == true) {
                         var imagefile = $('#addCapturePhotoSImg').attr('src');
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
                            var urlRB = elementDetailViewModel._dataSourceOptionsGallery.transport.jsdo.url + imageObj.src + "?objName=" + elementDetailViewModel._jsdoOptionsGallery.name;
                            
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
            stepFormsListShow: function(e) {
                app.elementLocationMaps.elementLocationMapsModel.emapFlag = false;
                $("#coreDataTitle").hide();
                $("#stageCores").hide();
                $("#geotechnicalCheck").hide();
                $("#castCheck").hide();
                $("#laboratoryCheck").hide();
                
                var id = e.view.params.stepid;
                if(id == 0) {
                    $("#photo").show();
                    $("#surveyor").show();
                    $("#checkListTitle").hide();
                    $("#stageForms").hide();
                    
                    if(this.change_Percent == true || (elementDetailViewModel.currentItem.Latitude != "null" && elementDetailViewModel.currentItem.Longtitud != "null")) {
                        document.getElementById("ChooseLocationOnMap").style.color = "red";
                    }
                    else {
                        document.getElementById("ChooseLocationOnMap").style.color = "black";
                    }

                     var jsdoOptionsGallery = elementDetailViewModel.get('_jsdoOptionsGallery'),
                        jsdoGallery = new progress.data.JSDO(jsdoOptionsGallery),
                        dataSourceOptionsGallery = elementDetailViewModel.get('_dataSourceOptionsGallery');
                        dataSourceOptionsGallery.transport.jsdo = jsdoGallery;
                    var dataSourceGallery = new kendo.data.DataSource(dataSourceOptionsGallery);

                        dataSourceGallery.filter({ field: "R369676467", operator: '==', value: elementDetailViewModel.currentItem.id});
                        dataSourceGallery.sort({ field: "updatedAt", dir: "desc" });

                        dataSourceGallery.fetch(function() {
                            var view = dataSourceGallery.data();
                            console.log("view")
                            console.log(view)
                            if(view.length > 0 && view[0].R369888918 == "null") {
                                if(view[0].imageURL != "null") {
                                    document.getElementById("addCapturePhotoS").style.color = "red";
                                    // var imageObj = $.parseJSON(view[0].image);
                                    // view[0].image = processImage(elementDetailViewModel.get('_dataSourceOptionsGallery').transport.jsdo.url + imageObj.src);
                                    
                                    //$("#addCapturePhotoSImg").src = view[0].image;
                                    // console.log( view[1].imageURL)
                                    document.getElementById("addCapturePhotoSImg").src = view[0].imageURL;
                                }
                                else document.getElementById("addCapturePhotoS").style.color = "black";
                            }
                            else document.getElementById("addCapturePhotoS").style.color = "black";
                        });
                    var templateContent, template;
                    
                    templateContent = $("#formStageTemplate").html();
                    template = kendo.template(templateContent);
                                        
                    var dataSource = elementDetailViewModel.get('dataSourceElementForms')
                    dataSource.filter({
                        logic: "and",
                            filters: [
                                { field: "R365596097", operator: "==", value: elementDetailViewModel.currentItem.id },
                                { field: "stageNum", operator: "==", value: id }//,
                                ]
                    });
                    dataSource.sort({ field: "Index", dir: "desc" });
                    dataSource.fetch(function() {
                        var forms = dataSource.data();
                        var indexForm=0;
                        var formsNames=[];
                    
                        for(var i=0; i<forms.length; i++) {
                            formsNames[indexForm] = forms[i];
                            indexForm++;
                        }
                        var result = kendo.render(template, formsNames); //render the template
                        $("#stageForms").html(result); //append the result to the page
                        
                        elementDetailViewModel.set('dataSourceElementForms',dataSource);

                        if(forms.length > 0) {
                            $("#checkListTitle").show();
                            $("#stageForms").show();
                        }
                    });
                }
                else {
                    if(id == 1) {
                        $("#coreDataTitle").show();
                        $("#geotechnicalCheck").show();
                        $("#castCheck").show();
                        $("#laboratoryCheck").show();
                        $("#stageCores").show();
                    }
                    $("#photo").hide();
                    $("#checkListTitle").show();
                    $("#surveyor").hide();
                    $("#stageForms").show();

                    if(elementDetailViewModel.currentItem.R370259577 != "null") {
                        document.getElementById("geotechnicalFormStaus").style.background = "#449d31";
                    }
                    else { document.getElementById("geotechnicalFormStaus").style.background = "#d12229"; }
                    
                    if(elementDetailViewModel.currentItem.R370259600 != "null") {
                        document.getElementById("castingFormStatus").style.background = "#449d31";
                    }
                    else { document.getElementById("castingFormStatus").style.background = "#d12229"; }

                    if(elementDetailViewModel.currentItem.R370259589 != "null") {
                        document.getElementById("laboratoryFormStatus").style.background = "#449d31";
                    }
                    else { document.getElementById("laboratoryFormStatus").style.background = "#d12229"; }

                    var templateContent, template, templateContentCore, templateCore;
                    
                    templateContent = $("#formStageTemplate").html();
                    template = kendo.template(templateContent);
                    templateContentCore = $("#coreStageTemplate").html();
                    templateCore = kendo.template(templateContentCore);
                    
                    var dataSource = elementDetailViewModel.get('dataSourceElementForms')
                    dataSource.filter({
                        logic: "and",
                            filters: [
                                { field: "R365596097", operator: "==", value: elementDetailViewModel.currentItem.id },
                                { field: "stageNum", operator: "==", value: id }//,
                                // { field: "CoreData", operator: "!=", value: true }
                                ]
                    });
                    dataSource.sort({ field: "Index", dir: "desc" });
                    dataSource.fetch(function() {
                        var forms = dataSource.data();
                        var indexForm=0, indexCore=0;
                        var formsNames=[], coresNames=[];
                       
                        for(var i=0; i<forms.length; i++) {
                            if(forms[i].CoreData == 1) {
                                coresNames[indexCore] = forms[i];
                                indexCore++;
                            }
                            else {
                                formsNames[indexForm] = forms[i];
                                indexForm++;
                            }
                        }
                        var result = kendo.render(template, formsNames); //render the template
                        $("#stageForms").html(result); //append the result to the page
                        if(indexCore != 0){
                            var resultCores = kendo.render(templateCore, coresNames); //render the template
                            $("#stageCores").html(resultCores); //append the result to the page
                            $("#coreDataTitle").show();
                            $("#stageCores").show();
                        }
                        elementDetailViewModel.set('dataSourceElementForms',dataSource)
                    });
                }
                if(id != 7) {
                    element_step.innerHTML = elementDetailViewModel.stepsNames[id].name;
                }
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = elementDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                elementDetailViewModel.set('originalItem', itemModel);
                elementDetailViewModel.set('currentItem',
                    elementDetailViewModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            openCoreStage: function(uid) {
                var formUid = uid;

                var dataSource = elementDetailViewModel.get('dataSourceElementForms'),
                itemData = dataSource.getByUid(formUid),
                fixedData = elementDetailViewModel.fixHierarchicalData(itemData);
                
                 var jsdoOptionsElemForms = elementDetailViewModel.get('_jsdoOptionsElementForms'),
                        jsdoElemForms = new progress.data.JSDO(jsdoOptionsElemForms);
                    dataSourceOptions.transport.jsdo = jsdoElemForms;
                var dataSource = new kendo.data.DataSource(dataSourceOptions);

                dataSource.filter({ field: "id", operator: "==", value: itemData.id });
                dataSource.fetch(function() {
                    var view = dataSource.data();
                    
                    var jsrow = jsdoElemForms.findById(itemData.id);
                    var afterUpdateFn;

                    jsrow.assign(itemData);
                       
                    afterUpdateFn = function (jsdoElemForms, record, success, request) {
                        jsdoElemForms.unsubscribe('afterUpdate', afterUpdateFn);
                        if (success === true) {
                            elementDetailViewModel.coreCheckListIds = jsrow.data.R369426825;
                            app.mobileApp.navigate('#components/formDetailView/view.html?formid='+itemData.id+'&formname='+itemData.name+'&coreFlag=true');
                        } else {
                            alert("error")
                        }
                    };
                    jsdoElemForms.subscribe('afterUpdate', afterUpdateFn);
                    jsdoElemForms.saveChanges();
                });
            },
            openFormStage: function(uid) {
                var formUid = uid;

                var dataSource = elementDetailViewModel.get('dataSourceElementForms'),
                itemData = dataSource.getByUid(formUid),
                fixedData = elementDetailViewModel.fixHierarchicalData(itemData);
                
                 var jsdoOptionsElemForms = elementDetailViewModel.get('_jsdoOptionsElementForms'),
                        jsdoElemForms = new progress.data.JSDO(jsdoOptionsElemForms);
                    dataSourceOptions.transport.jsdo = jsdoElemForms;
                var dataSource = new kendo.data.DataSource(dataSourceOptions);

                dataSource.filter({ field: "id", operator: "==", value: itemData.id });
                dataSource.fetch(function() {
                    var view = dataSource.data();
                    
                    var jsrow = jsdoElemForms.findById(itemData.id);
                    var afterUpdateFn;

                    jsrow.assign(itemData);
                       
                    afterUpdateFn = function (jsdoElemForms, record, success, request) {
                        jsdoElemForms.unsubscribe('afterUpdate', afterUpdateFn);
                        if (success === true) {
                            elementDetailViewModel.formCheckListIds = jsrow.data.R365599694;
                            console.log("jsrow##")
                            console.log(jsrow)    
                            // console.log(itemData)
                            app.mobileApp.navigate('#components/formDetailView/view.html?formid='+itemData.id+'&formname='+itemData.name+'&stagenum='+itemData.stageNum+'&coreFlag=false');
                        } else {
                            alert("error")
                        }
                    };
                    jsdoElemForms.subscribe('afterUpdate', afterUpdateFn);
                    jsdoElemForms.saveChanges();
                });
            },
            /// start masterDetails view model functions
            /// end masterDetails view model functions
            currentItem: {}
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('elementDetailViewModel', elementDetailViewModel);
            var param = parent.get('elementDetailViewModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('elementDetailViewModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('elementDetailViewModel', elementDetailViewModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            stepId = parseInt(e.view.params.stageId),
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = elementDetailViewModel.get('_dataSourceOptions'),
            dataSource, dataSourceEleForms;
            
        elementDetailViewModel.stepId = parseInt(e.view.params.stageId);

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

        elementDetailViewTitle.innerHTML = sessionStorage.getItem("locationName");
        stageName.innerHTML = sessionStorage.getItem("stageName");
        $("#search").val('');

            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = elementDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);

                dataSource.filter({
                    logic: "and",
                    filters: [
                        {field: "R363890883", operator: "==", value: stepId},
                        {field: "locationId", operator: "==", value: sessionStorage.getItem("locationId")}
                        ]
                });            
          
                elementDetailViewModel.set('dataSource', dataSource);
                
                var jsdoOptionsElemForms = elementDetailViewModel.get('_jsdoOptionsElementForms'),
                    jsdoElemForms = new progress.data.JSDO(jsdoOptionsElemForms);

                dataSourceOptions.transport.jsdo = jsdoElemForms;
                dataSourceEleForms = new kendo.data.DataSource(dataSourceOptions);
                elementDetailViewModel.set('dataSourceElementForms', dataSourceEleForms);

            });
    });
function onFileUploadSuccess() {
        // alert("onFileUploadSuccess")
        console.log("onFileUploadSuccess")
        $("#addCapturePhotoSPop").kendoMobileModalView("close");

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
})(app.elementDetailView);

// START_CUSTOM_CODE_elementDetailViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.elementDetailView.elementDetailViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.elementDetailView.elementDetailViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_elementDetailViewModel