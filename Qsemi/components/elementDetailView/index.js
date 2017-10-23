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
        /// start data sources
        /// end data sources
        elementDetailViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            _jsdoOptionsElementsType: jsdoOptionsElementsType,
            _jsdoOptionsForms: jsdoOptionsForms,
            _jsdoOptionsElementForms: jsdoOptionsElementForms,
            _jsdoOptionsSteps: jsdoOptionsSteps,
            marker: {},
            markers: [],
            dataSourceSteps: '',
            stepsNames: '',
            stepId: '',
            page_scroller: '',
            formCheckListIds: [],
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

                // if (searchVal) {
                //     searchFilter = {
                //         field: 'name',
                //         operator: 'contains',
                //         value: searchVal
                //     };
                // }
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
            itemClick: function(e) {
                var dataItem = e.dataItem || elementDetailViewModel.originalItem;
                elementDetailViewModel.QC_click_flag = false;
                elementDetailViewModel.surveyorFlag = false;
                elementDetailViewModel.change_Percent = false;
                app.mobileApp.navigate('#components/elementDetailView/details.html?uid=' + dataItem.uid);

            },
            elementStepClick: function(id) {
                app.elementDetailView.elementDetailViewModel.surveyorFlag = false;
                if(id == 0) {
                     var jsdoOptionsElemForms = elementDetailViewModel.get('_jsdoOptionsElementForms'),
                        jsdoElemForms = new progress.data.JSDO(jsdoOptionsElemForms);
                    dataSourceOptions.transport.jsdo = jsdoElemForms;
                    var dataSource = new kendo.data.DataSource(dataSourceOptions);

                    dataSource.filter({
                        logic: "and",
                        filters: [
                            { field: "R365596097", operator: "==", value: elementDetailViewModel.currentItem.id },
                            { field: "stageNum", operator: "==", value: 0 }
                        ]
                    });

                    dataSource.fetch(function() {
                        var dforms = dataSource.data();

                        var jsrow = jsdoElemForms.findById(dforms[0].id);
                        var afterUpdateFn;

                        jsrow.assign(dforms[0].id);
                            
                        afterUpdateFn = function (jsdoElemForms, record, success, request) {
                            jsdoElemForms.unsubscribe('afterUpdate', afterUpdateFn);
                            if (success === true) {
                                elementDetailViewModel.formCheckListIds = jsrow.data.R365599694;
                                
                                elementDetailViewModel.surveyorFlag = true;
                                                                        
                                //app.mobileApp.navigate('#components/surveyorMarking/edit.html?elementUid=' + elementDetailViewModel.currentItem.uid+'&elementId='+elementDetailViewModel.currentItem.id);
                                app.mobileApp.navigate('#components/formDetailView/view.html?formid='+dforms[0].id+'&formname='+dforms[0].name);
                            } else {
                                alert("error")
                            }
                        };
                        jsdoElemForms.subscribe('afterUpdate', afterUpdateFn);
                        jsdoElemForms.saveChanges();
                    }); 

                    // app.mobileApp.navigate('#components/surveyorMarking/edit.html?elementUid=' + this.currentItem.uid+'&elementId='+this.currentItem.id);
                }
                else
                    app.mobileApp.navigate('#components/elementDetailView/stepFormList.html?stepid=' + id);
            },
            detailsShow: function(e) {
                this.page_scroller = e.view.scroller;
                elementDetaileDetailsTitle.innerHTML = sessionStorage.getItem("locationName");
                elementStep.innerHTML = 'Step: ' + sessionStorage.getItem("stageName");
                if(e.view.params.mapFlag != undefined) {
                    var id = e.view.params.id;
                    //if (!elementDetailViewModel.get('dataSource')) {
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

                                if(this.QC_click_flag == true)
                                    document.getElementById("QC_Button").click();
                                else document.getElementById("defaultOpen").click();
                            });
                        });
                    //}
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
                       
                        elementDetailViewModel.setCurrentItemByUid(view[0].uid);
                        
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
                //dataSourceSteps.sort({ field: "stageNum", dir: "asc" });
                //dataSource.sort({ field: "age", dir: "desc" });

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
            /*stepFormsListInit: function(e) {
                console.log("stepFormsListInit e")
                console.log(e)
                var jsdoOptionsElemForm = elementDetailViewModel.get('_jsdoOptionsElementForms'),
                    dataSourceOptions = elementDetailViewModel.get('_dataSourceOptions'),
                    jsdoElemForm = new progress.data.JSDO(jsdoOptionsElemForm);

                    dataSourceOptions.transport.jsdo = jsdoElemForm;
                    var dataSourceElemForms = new kendo.data.DataSource(dataSourceOptions);
                    dataSourceElemForms.filter({
                        logic: "and",
                        filters: [
                            { field: "R365596097", operator: "==", value: elementDetailViewModel.currentItem.id },
                            { field: "stageNum", operator: "==", value: e.view.params.stepid }
                            ]
                    });
                    //elementDetailViewModel.set('dataSource', dataSource);
                    console.log("currentItem")
                    console.log(elementDetailViewModel.currentItem)
                    //dataSourceElemForms.filter({ field: "R365596097", operator: "==", value: elementDetailViewModel.currentItem.id });
                    //dataSourceElemForms.filter({ field: "stageNum", operator: "==", value: id });
                    dataSourceElemForms.fetch(function() {
                        console.log("element forms: ");
                        console.log(dataSourceElemForms.data())
                    });
            },*/
            stepFormsListShow: function(e) {
                var id = e.view.params.stepid;
                var templateContent, template;
                //var step_id = id.substr(0, id.lastIndexOf(")"));
                
                templateContent = $("#formStageTemplate").html();
                template = kendo.template(templateContent);
                
                var dataSource = elementDetailViewModel.get('dataSourceElementForms')
                dataSource.filter({
                     logic: "and",
                        filters: [
                            { field: "R365596097", operator: "==", value: elementDetailViewModel.currentItem.id },
                            { field: "stageNum", operator: "==", value: id }
                            ]
                });
                dataSource.fetch(function() {
                    var formsNames = dataSource.data();
                    // console.log("formsNames")
                    // console.log(formsNames)
                    var result = kendo.render(template, formsNames); //render the template
                    $("#stageForms").html(result); //append the result to the page
                });
                elementDetailViewModel.set('dataSourceElementForms',dataSource)

                //element_step.innerHTML = sessionStorage.getItem("stageName");
                if(id != 7) {
                    element_step.innerHTML = elementDetailViewModel.stepsNames[id].name;
                }

                /*var formsNames = [], tmp, tmp_id;
                var templateContent, template, result;*/
                
                /*templateContent = $("#formStageTemplate").html();
                template = kendo.template(templateContent);*/
                
                /*switch(step_id) {
                    case "1":
                        formsNames = elementDetailViewModel.currentItem.FormsStep1;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                                if(i == tmp.length-1)
                                    formsNames[i] = { id:((tmp[i]).split(' ').join('_')).substr(0, ((tmp[i]).split(' ').join('_')).length-1), name: (tmp[i]).substr(0, (tmp[i]).length-1) }
                            }
                            //console.log("formsNames")
                            //console.log(formsNames)
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "2": 
                        formsNames = elementDetailViewModel.currentItem.FormsStep2;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                                if(i == tmp.length-1)
                                    formsNames[i] = {id:((tmp[i]).split(' ').join('_')).substr(0, ((tmp[i]).split(' ').join('_')).length-1), name: (tmp[i]).substr(0, (tmp[i]).length-1) }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "3": formsNames = elementDetailViewModel.currentItem.FormsStep3;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                                if(i == tmp.length-1)
                                    formsNames[i] = { id:((tmp[i]).split(' ').join('_')).substr(0, ((tmp[i]).split(' ').join('_')).length-1), name: (tmp[i]).substr(0, (tmp[i]).length-1) }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "4": formsNames = elementDetailViewModel.currentItem.FormsStep4;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length; i++) {
                                formsNames[i] = { id:(tmp[i]).split(' ').join('_'), name: tmp[i] }
                                if(i == tmp.length-1)
                                    formsNames[i] = { id:((tmp[i]).split(' ').join('_')).substr(0, ((tmp[i]).split(' ').join('_')).length-1), name: (tmp[i]).substr(0, (tmp[i]).length-1) }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "5": formsNames = elementDetailViewModel.currentItem.FormsStep5;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length; i++) {
                                formsNames[i] = { id:(tmp[i]).substr(0,(tmp[i]).length-1), name: (tmp[i]).substr(0,(tmp[i]).length-1) }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                    case "6": formsNames = elementDetailViewModel.currentItem.FormsStep6;
                        if(formsNames != "null") {
                            tmp = formsNames.split(", ");
                            formsNames = [];
                            for(var i=0; i<tmp.length; i++) {
                                var str = (tmp[i]).split(' ').join('_')
                                formsNames[i] = { id: str.substr(0, str.length-1), name: (tmp[i]).substr(0, (tmp[i]).length-1) }
                            }
                            result = kendo.render(template, formsNames); //render the template
                            $("#stageForms").html(result); //append the result to the page
                        }
                        break;
                }*/
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
                                   
                            app.mobileApp.navigate('#components/formDetailView/view.html?formid='+itemData.id+'&formname='+itemData.name);
                        } else {
                            alert("error")
                        }
                    };
                    jsdoElemForms.subscribe('afterUpdate', afterUpdateFn);
                    jsdoElemForms.saveChanges();
                });

                //app.mobileApp.navigate('#components/formDetailView/view.html?formname='+formName);
                //alert(id)
                /*switch(id) {
                    case "SURVEYOR_MARKING":
                    case "surveyor_Marking": 
                        app.mobileApp.navigate('#components/surveyorMarking/edit.html?elementUid=' + this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "GENERAL_ADJUSTEMENT": 
                        app.mobileApp.navigate('#components/generalAdjustement2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "E&B": 
                        app.mobileApp.navigate('#components/eandB2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "DROPPERS":
                        app.mobileApp.navigate('#components/droppers2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CONTACT_WIRE_LAYING":
                        app.mobileApp.navigate('#components/contactWireLaying2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "MESSENGER_WIRE_LAYING":
                        app.mobileApp.navigate('#components/messengerWireLaying2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "RETURN_WIRE_LAYING_2":
                        app.mobileApp.navigate('#components/returnWireLaying22/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "RETURN_WIRE_LAYING_1":
                         app.mobileApp.navigate('#components/returnWireLaying12/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "Tie-Rods_Clamps'_Insulators_Cross-Bars_and":
                    case "Tie-Rods": 
                    case "Clamps'_Insulators":
                    case "Cross-Bars_and":
                        app.mobileApp.navigate('#components/tieRoadsClampsInsulatorsCrossBarAndMipd2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CANTILEVER_INSTALLATION":
                        app.mobileApp.navigate('#components/cantileverInstallation2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CANTILEVERS_MANUFACTURE":
                        app.mobileApp.navigate('#components/cantileverManufacture2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "COUNTERW_WEIGHT":
                        app.mobileApp.navigate('#components/counterwWeight2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "COUNTERW_PULLEY":
                         app.mobileApp.navigate('#components/counterwPulley2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "RETURN_WIRE_2_&SUPPORT&connection": 
                         app.mobileApp.navigate('#components/returnWire2AndSupportAndConnection2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CANTILEVER_SUPPORT_&_counterweights":
                        app.mobileApp.navigate('#components/cantileverSupportAndCounterWeight2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "PORTAL":
                        app.mobileApp.navigate('#components/portal2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "POLE":
                        app.mobileApp.navigate('#components/pole2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "POLE_SUPPORT_DRILLING_(IF)+TRANS_PLATES":
                        app.mobileApp.navigate('#components/poleSupportDrillingIfTransPlatesForm22/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "RETURN_WIRE_2_DRILLING":
                        app.mobileApp.navigate('#components/returnWire2Driliing2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CANT/COUNTERW_/ANCHORS_DRILLING":
                         app.mobileApp.navigate('#components/cantCounterwAnchorsDrilling2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "EXCAVATION":
                        app.mobileApp.navigate('#components/excavation2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "REINFORCEMENT":
                        app.mobileApp.navigate('#components/reinforcement2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                    case "CONCRETING": 
                        app.mobileApp.navigate('#components/concreting2/edit.html?elementUid='+this.currentItem.uid+'&elementId='+this.currentItem.id);
                        break;
                }*/
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
            //stepName = e.view.params.stageName,
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

        // if (!elementDetailViewModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = elementDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);

                //R363890883
                //dataSource.filter({ field: "locationId", operator: "==", value: sessionStorage.getItem("locationId") });
                //dataSource.filter({ field: "R363890883", operator: "==", value: stepId });
                dataSource.filter({
                    logic: "and",
                    filters: [
                        {field: "R363890883", operator: "==", value: stepId},
                        {field: "locationId", operator: "==", value: sessionStorage.getItem("locationId")}
                        ]
                });            
            //    dataSource.fetch(function() {
            //        var view=dataSource.data();
            //    });
                elementDetailViewModel.set('dataSource', dataSource);
                
                var jsdoOptionsElemForms = elementDetailViewModel.get('_jsdoOptionsElementForms'),
                    jsdoElemForms = new progress.data.JSDO(jsdoOptionsElemForms);

                dataSourceOptions.transport.jsdo = jsdoElemForms;
                dataSourceEleForms = new kendo.data.DataSource(dataSourceOptions);
                elementDetailViewModel.set('dataSourceElementForms', dataSourceEleForms);

                //fetchFilteredData(param);
            });
        // } else {
        //     var dataSource = elementDetailViewModel.get('dataSource');
        //      //dataSource.filter({ field: "R363890883", operator: "==", value: stepId });
        //      dataSource.filter({
        //             logic: "and",
        //             filters: [
        //                 {field: "R363890883", operator: "==", value: stepId},
        //                 {field: "locationId", operator: "==", value: sessionStorage.getItem("locationId")}
        //                 ]
        //         });
                
        //         elementDetailViewModel.set('dataSource', dataSource);

        //           var jsdoOptionsElemForms = elementDetailViewModel.get('_jsdoOptionsElementForms'),
        //             jsdoElemForms = new progress.data.JSDO(jsdoOptionsElemForms);

        //         dataSourceOptions.transport.jsdo = jsdoElemForms;
        //         dataSourceEleForms = new kendo.data.DataSource(dataSourceOptions);
        //         elementDetailViewModel.set('dataSourceElementForms', dataSourceEleForms);
        //     //fetchFilteredData(param);
        // }

    });

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