'use strict';

app.controlPanel = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('controlPanel');

// START_CUSTOM_CODE_controlPanel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_controlPanel
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties
        currentTask, currentTaskTeam, currentTaskWorker, currentTaskTeamLeader,
        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('controlPanelModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('controlPanelModel_delayedFetch', paramFilter || null);
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
            name: 'Steps',
            autoFill: false
        },
        jsdoOptionsElements = {
            name: 'element2',
            autoFill: false
        },
        jsdoOptionsLocations = {
            name: 'QualityDashboard',
            autoFill: false
        },
        jsdoOptionsDefects = {
            name: 'QualityImpairment',
            autoFill: false
        },
        jsdoOptionsWork = {
            name: 'WorkArrangement',
            autoFill: false
        },
        jsdoOptionsTeams = {
            name: 'WorkTeamsSemi',
            autoFill: false
        },
        jsdoOptionsWorkers = {
            name: 'WorkerObjectSEMI',
            autoFill: false
        },
        dataSourceOptionsWork = {
            type: 'jsdo', 
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                // if(type == "read") {
                //     currentTaskTeam = response;
                //     console.log("response")
                //     console.log(response.data[0].name)
                //     // document.getElementById("taskTeamName").innerHTML = currentTaskTeam.data[0].name; 
                // }
                 if(type == "update")
                {
                    currentTask = response;
                   
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
        dataSourceOptionsDefects = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                // if(type == "read") {
                //     // console.log("response")
                //     // console.log(response)
                //     checklist = response;
                // }
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
        dataSourceOptionsTeams = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                if(type == "read") {
                    currentTaskTeam = response;
                    console.log("response")
                    console.log(response.data[0].name)
                    // document.getElementById("taskTeamName").innerHTML = currentTaskTeam.data[0].name; 
                }
                 if(type == "update")
                {
                    currentTaskTeam = response;
                   
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
        dataSourceOptionsWorkers = {
            type: 'jsdo',
            transport: {},
            requestEnd: function(e) {
                var response = e.response;
                var type = e.type;
                //console.log(type); // displays "read"
                //console.log(response);
                if(type == "read") {
                    currentTaskTeamLeader = response;
                    console.log("currentTaskTeamLeader response")
                    // console.log(response)
                     console.log(response.data[0].name)
                    // document.getElementById("taskTeamName").innerHTML = currentTaskTeam.data[0].name; 
                }
                 if(type == "update")
                {
                    currentTaskTeam = response;
                   
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
        controlPanelModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _dataSourceOptionsDefects: dataSourceOptionsDefects,
            _dataSourceOptionsWork: dataSourceOptionsWork,
            _dataSourceOptionsTeams: dataSourceOptionsTeams,
            _dataSourceOptionsWorkers: dataSourceOptionsWorkers,
            _jsdoOptions: jsdoOptions,
            _jsdoOptionsElements: jsdoOptionsElements,
            _jsdoOptionsLocations: jsdoOptionsLocations,
            _jsdoOptionsDefects: jsdoOptionsDefects,
            _jsdoOptionsWork: jsdoOptionsWork,
            _jsdoOptionsTeams: jsdoOptionsTeams,
            _jsdoOptionsWorkers: jsdoOptionsWorkers,
            stageList: [],
            step_id: '',
            page_scroller: '',
            qcTabFlag: false,
            taskTabFlag: false,
            ncrTabFlag: false,
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
                var dataItem = e.dataItem || controlPanelModel.originalItem;
                
                app.mobileApp.navigate('#components/elementDetailView/view.html?stageId=' + dataItem.id);
            },
            // itemClickTasks: function(e) {
            //     var dataItem = e.dataItem || controlPanelModel.originalItem;

            //     app.mobileApp.navigate('#components/taskDetailView/edit.html?uid=' + dataItem.uid);
            // },
            itemClickTasks: function(id) {
                // var dataItem = e.dataItem || taskDetailViewModel.originalItem;

                app.mobileApp.navigate('#components/taskDetailView/edit.html?id=' + id);
            },
            itemClickDefects: function(id) {
                // console.log("e")
                // console.log(e)
                // var dataItem = e.dataItem || controlPanelModel.originalItem;
                console.log("id")
                console.log(id)
                app.mobileApp.navigate('#components/impairmentDetailView/edit.html?id=' + id);
            },
            openStage: function(num) {
                var stepId,
                    dataSource = controlPanelModel.get('dataSource');
                    
                switch(num) {
                    case 0: sessionStorage.setItem("stageName", sessionStorage.getItem("stage0Name"));
                        break;
                    case 1: sessionStorage.setItem("stageName", sessionStorage.getItem("stage1Name"));
                        break;
                    case 2: sessionStorage.setItem("stageName", sessionStorage.getItem("stage2Name"));
                        break;
                    case 3: sessionStorage.setItem("stageName", sessionStorage.getItem("stage3Name"));
                        break;
                    case 4: sessionStorage.setItem("stageName", sessionStorage.getItem("stage4Name"));
                        break;
                    case 5: sessionStorage.setItem("stageName", sessionStorage.getItem("stage5Name"));
                        break;
                    case 6: sessionStorage.setItem("stageName", sessionStorage.getItem("stage6Name"));
                        break;
                    case 7: sessionStorage.setItem("stageName", sessionStorage.getItem("stage7Name"));
                        break;
                }
              
                dataSource.fetch(function() {
                    var steps = dataSource.data();
                    
                    for(var i=0; i< steps.length; i++) {
                        if(steps[i].stageNum == 0 && steps[i].stageNum == num) { stepId = steps[i].id; break; }
                        else if(steps[i].stageNum == 1 && steps[i].stageNum == num) { stepId = steps[i].id; break; }
                        else if(steps[i].stageNum == 2 && steps[i].stageNum == num) { stepId = steps[i].id; break; }
                        else if(steps[i].stageNum == 3 && steps[i].stageNum == num) { stepId = steps[i].id; break; }
                        else if(steps[i].stageNum == 4 && steps[i].stageNum == num) { stepId = steps[i].id; break; }
                        else if(steps[i].stageNum == 5 && steps[i].stageNum == num) { stepId = steps[i].id; break; }
                        else if(steps[i].stageNum == 6 && steps[i].stageNum == num) { stepId = steps[i].id; break; }
                        else if(steps[i].stageNum == 7 && steps[i].stageNum == num) { stepId = steps[i].id; break; }
                    }
                    controlPanelModel.step_id = stepId;
                    app.mobileApp.navigate('#components/elementDetailView/view.html?stageId=' + stepId+'&stageNum='+num);
                });

                
                // app.mobileApp.navigate('#components/elementDetailView/view.html?stageId=' + stepId);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = controlPanelModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                controlPanelModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = controlPanelModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                controlPanelModel.set('originalItem', itemModel);
                controlPanelModel.set('currentItem',
                    controlPanelModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            openGeneralMap: function() {
                // html2canvas(document.getElementById("container"), {
                //     onrendered: function (canvas) {
                //         var tempcanvas=document.createElement('canvas');
                //         tempcanvas.width=800;
                //         tempcanvas.height=800;
                //         var context=tempcanvas.getContext('2d');
                //         context.drawImage(canvas,-10,-120,300,550,0,0,600,600);
                //         var link=document.createElement("a");
                //         link.href=tempcanvas.toDataURL('image/jpg');   //function blocks CORS
                //         link.download = 'screenshot.jpg';
                //         link.click();
                //         console.log("link.href")
                //         console.log(link.href)
                //     }
                // });
                app.mobileApp.navigate('#components/generalMapView/view.html');
            },
            openImpairment: function() {
                app.mobileApp.navigate('#components/impairmentDetailView/view.html');
            },
            openDefectsTab1: function(e) {
                var jsdoOptions = controlPanelModel.get('_jsdoOptionsDefects'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                var dataSource = new kendo.data.DataSource(dataSourceOptions);
                // dataSource.filter({ field: "locationId", operator: "==", value: sessionStorage.getItem("locationId") });
                dataSource.filter({
                    logic: "and",
                    filters: [
                        { field: "locationId", operator: "==", value: sessionStorage.getItem("locationId") },
                        { field: "Fixed", operator: "!=", value: 1 }
                    ]
                });
             
                dataSource.sort({ field: "updatedAt", dir: "desc" });

                dataSource.fetch(function() {
                    console.log("dataSource.data()")
                    console.log(dataSource.data())
                    if(dataSource.data().length == 0) {
                        $("#noOpenImpairments").show();
                        controlPanelModel.set('dataSourceDefects', '');
                    }
                    // else controlPanelModel.set('dataSourceDefects', dataSource);
                });
               
                controlPanelModel.set('dataSourceDefects', dataSource);
            },
            openSearch: function(e) {
                app.mobileApp.navigate('#components/elementSearchView/view.html');
            },
            openQcTab1: function(e) {
            },
            openTaskTab1: function(e) {
                var dataSourceOptionsWo = controlPanelModel.get('_dataSourceOptionsWorkers'),
                    dataSourceOptionsWork = controlPanelModel.get('_dataSourceOptionsWork'),
                    dataSourceOptionsTe = controlPanelModel.get('_dataSourceOptionsTeams');

                console.log("currentTaskTeamLeader")
                console.log(currentTaskTeamLeader.data[0].R363991813)
                var jsdoOptionsW = controlPanelModel.get('_jsdoOptionsWork'),
                    jsdoW = new progress.data.JSDO(jsdoOptionsW);

                dataSourceOptionsWork.transport.jsdo = jsdoW;
                var dataSource = new kendo.data.DataSource(dataSourceOptionsWork);
                dataSource.filter({
                    logic: "and",
                        filters: [
                            { field: "locationId", operator: "==", value: sessionStorage.getItem("locationId") },
                            { field: "Done", operator: "!=", value: true },
                            { field: "R371893913", operator: "==", value: currentTaskTeamLeader.data[0].R363991813 }
                            ] 
                });
                controlPanelModel.set('dataSourceWork', dataSource);
                dataSource.fetch(function() {
                    console.log("tasks view")
                    console.log(dataSource.data())
                    if(dataSource.data().length == 0)
                        $("#noOpenTasks").show();
                });
            },
            /// start masterDetails view model functions
            /// end masterDetails view model functions
            currentItem: {}
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('controlPanelModel', controlPanelModel);
            var param = parent.get('controlPanelModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('controlPanelModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('controlPanelModel', controlPanelModel);
    }
 
    parent.set('onShow', function(e) {
        app.generalMapView.generalMapViewModel.gmapFlag = false;
        app.controlPanel.controlPanelModel.page_scroller = e.view.scroller;
        $("#noOpenImpairments").hide();
        $("#noOpenTasks").hide();
        // openQcTab();

        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = controlPanelModel.get('_dataSourceOptions'),
            dataSourceOptionsWork = controlPanelModel.get('_dataSourceOptionsWork'),
            dataSourceOptionsWorker = controlPanelModel.get('_dataSourceOptionsWorkers'),
            dataSource, dataSourceWork, dataSourceDefects, dataSourceWorker;

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

        var jsdoOptionsWo = controlPanelModel.get('_jsdoOptionsWorkers'),
            jsdoWor = new progress.data.JSDO(jsdoOptionsWo);

        dataSourceOptionsWorker.transport.jsdo = jsdoWor;
        dataSourceWorker = new kendo.data.DataSource(dataSourceOptionsWorker);
        if(app.authenticationView.authenticationViewModel.current_User.PersonalID != undefined)
            dataSourceWorker.filter({ field: "WorkerId", operator: "==", value: app.authenticationView.authenticationViewModel.current_User.PersonalID });
        //currentTaskTeamLeader

        $("#controlPanelTitle").innerHTML = sessionStorage.getItem("locationName");
         var stages = [{ "name": "SURVEYOR", "stageNum": 0 }, { "name": "FOUNDATION", "stageNum": 1 }, { "name": "ERECTION", "stageNum": 2 },
                    { "name": "EQUIPMENT & CANTILEVER", "stageNum": 3 }, { "name": "OCS WIRES", "stageNum": 4 }, { "name": "E&B", "stageNum": 5 },
                  { "name": "TEST", "stageNum": 6 }, { "name": "COMPLETED", "stageNum": 7 }];
        app.elementDetailView.elementDetailViewModel.stageList = stages;

        //if (!controlPanelModel.get('dataSource')) {
     
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = controlPanelModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                controlPanelModel.set('dataSource', dataSource);

                var jsdoOptionsW = controlPanelModel.get('_jsdoOptionsWork'),
                    jsdoW = new progress.data.JSDO(jsdoOptionsW);

                dataSourceOptionsWork.transport.jsdo = jsdoW;
                dataSourceWork = new kendo.data.DataSource(dataSourceOptionsWork);
                controlPanelModel.set('dataSourceWork', dataSourceWork);

                 var jsdoOptionsLocations = controlPanelModel.get('_jsdoOptionsLocations'),
                    jsdoLocations = new progress.data.JSDO(jsdoOptionsLocations);

                dataSourceOptions.transport.jsdo = jsdoLocations;
                var dataSourceLocations = new kendo.data.DataSource(dataSourceOptions);

                projectNameViewHome.innerHTML = sessionStorage.getItem("locationName");
                //app.generalMapView.generalMapViewModel.loadMap();

                fetchFilteredData(param);

                //  var jsdoOptionsElem = controlPanelModel.get('_jsdoOptionsElements'),
                //     jsdoElem = new progress.data.JSDO(jsdoOptionsElem);

                // dataSourceOptions.transport.jsdo = jsdoElem;
                // var dataSourceElem = new kendo.data.DataSource(dataSourceOptions);

                // dataSourceElem.filter({
                //     logic: "and",
                //     filters: [
                //         { field: "Latitude", operator: "neq", value: "NaN" },
                //         { field: "Latitude", operator: "neq", value: "null" },
                //         { field: "Longtitud", operator: "neq", value: "NaN" },
                //         { field: "Longtitud", operator: "neq", value: "null" },
                //         // { field: "elementStage", operator: "neq", value: "null" }, //**********
                //         { field: "locationId", operator:"==", value:sessionStorage.getItem("locationId") }
                //     ]
                // });
                
                if(app.controlPanel.controlPanelModel.taskTabFlag == true)
                    openTaskTab();
                else if(app.controlPanel.controlPanelModel.qcTabFlag == true)
                    openQcTab();
                else if(app.controlPanel.controlPanelModel.ncrTabFlag == true)
                    openDefectsTab();
                else openQcTab();


                  var jsdoOptionsLocations = controlPanelModel.get('_jsdoOptionsLocations'),
                    jsdoLocations = new progress.data.JSDO(jsdoOptionsLocations);

                dataSourceOptions.transport.jsdo = jsdoLocations;
                var dataSourceLocations = new kendo.data.DataSource(dataSourceOptions);
                dataSourceLocations.filter({ field: "locationId", operator:"==", value: sessionStorage.getItem("locationId") });

                app.mobileApp.showLoading();
                   dataSourceLocations.fetch(function() {
                        var location = dataSourceLocations.data();

                        if(location != undefined) {
                            document.getElementById("stage0Counter").innerHTML = location[0].stage0;
                            document.getElementById("stage1Counter").innerHTML = location[0].stage1;
                            document.getElementById("stage2Counter").innerHTML = location[0].stage2;
                            document.getElementById("stage3Counter").innerHTML = location[0].stage3;
                            document.getElementById("stage4Counter").innerHTML = location[0].stage4;
                            document.getElementById("stage5Counter").innerHTML = location[0].stage5;
                            document.getElementById("stage6Counter").innerHTML = location[0].stage6;
                            document.getElementById("stage7Counter").innerHTML = location[0].stage7;
                            
                                for(var i=0; i < stages.length; i++) {
                                    switch(stages[i].name) {
                                        case "SURVEYOR": sessionStorage.setItem("stage0Name", stages[i].name);
                                                    break;
                                        case "FOUNDATION": sessionStorage.setItem("stage1Name", stages[i].name);
                                                    break;
                                        case "ERECTION": sessionStorage.setItem("stage2Name", stages[i].name);
                                                    break;
                                        case "EQUIPMENT & CANTILEVER": sessionStorage.setItem("stage3Name", stages[i].name);
                                                    break;
                                        case "OCS WIRES": sessionStorage.setItem("stage4Name", stages[i].name);
                                                    break;
                                        case "E&B": sessionStorage.setItem("stage5Name", stages[i].name);
                                                    break;
                                        case "TEST": sessionStorage.setItem("stage6Name", stages[i].name);
                                                    break;
                                        case "COMPLETED": sessionStorage.setItem("stage7Name", stages[i].name);
                                                    break;
                                    }
                                }
                        }
                        else {
                            document.getElementById("stage0Counter").innerHTML = 0;
                            document.getElementById("stage1Counter").innerHTML = 0;
                            document.getElementById("stage2Counter").innerHTML = 0;
                            document.getElementById("stage3Counter").innerHTML = 0;
                            document.getElementById("stage4Counter").innerHTML = 0;
                            document.getElementById("stage5Counter").innerHTML = 0;
                            document.getElementById("stage6Counter").innerHTML = 0;
                            document.getElementById("stage7Counter").innerHTML = 0;
                        }
                        app.mobileApp.hideLoading();
                    }); 
                // dataSourceElem.fetch(function() {
                //     var elementsWithLocation = dataSourceElem.data();
                //     app.generalMapView.generalMapViewModel.elements = elementsWithLocation;
                // });
            });
    });

})(app.controlPanel);

// START_CUSTOM_CODE_controlPanelModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.controlPanel.controlPanelModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.controlPanel.controlPanelModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_controlPanelModel