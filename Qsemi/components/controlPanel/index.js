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
        controlPanelModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            _jsdoOptionsElements: jsdoOptionsElements,
            _jsdoOptionsLocations: jsdoOptionsLocations,
            stageList: [],
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
                var dataItem = e.dataItem || controlPanelModel.originalItem;
                
                app.mobileApp.navigate('#components/elementDetailView/view.html?stageId=' + dataItem.id);
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
                        // switch(steps[i].stageNum) {
                        //     case 0: alert(0); stepId = steps[i].id;
                        //         break;
                        //     case 1: alert(1);stepId = steps[i].id;
                        //         break;
                        //     case 2: alert(2);stepId = steps[i].id;
                        //         break;
                        //     case 3: alert(3);stepId = steps[i].id;
                        //         break;
                        //     case 4: alert(4);stepId = steps[i].id;
                        //         break;
                        //     case 5: alert(5);stepId = steps[i].id;
                        //         break;
                        //     case 6: alert(6);stepId = steps[i].id;
                        //         break;
                        //     case 7: alert(7);stepId = steps[i].id;
                        //         break;
                        // }
                    }
                    
                    app.mobileApp.navigate('#components/elementDetailView/view.html?stageId=' + stepId);
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
               app.mobileApp.navigate('#components/generalMapView/view.html');
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
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = controlPanelModel.get('_dataSourceOptions'),
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

        $("#controlPanelTitle").innerHTML = sessionStorage.getItem("locationName");
        
        //if (!controlPanelModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = controlPanelModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                controlPanelModel.set('dataSource', dataSource);

                 var jsdoOptionsLocations = controlPanelModel.get('_jsdoOptionsLocations'),
                    jsdoLocations = new progress.data.JSDO(jsdoOptionsLocations);

                dataSourceOptions.transport.jsdo = jsdoLocations;
                var dataSourceLocations = new kendo.data.DataSource(dataSourceOptions);

                projectNameViewHome.innerHTML = sessionStorage.getItem("locationName");
                //app.generalMapView.generalMapViewModel.loadMap();

                fetchFilteredData(param);

                 var jsdoOptionsElem = controlPanelModel.get('_jsdoOptionsElements'),
                    jsdoElem = new progress.data.JSDO(jsdoOptionsElem);

                dataSourceOptions.transport.jsdo = jsdoElem;
                var dataSourceElem = new kendo.data.DataSource(dataSourceOptions);

                dataSourceElem.filter({
                    logic: "and",
                    filters: [
                        { field: "Latitude", operator: "neq", value: "NaN" },
                        { field: "Latitude", operator: "neq", value: "null" },
                        { field: "Longtitud", operator: "neq", value: "NaN" },
                        { field: "Longtitud", operator: "neq", value: "null" },
                        // { field: "elementStage", operator: "neq", value: "null" }, //**********
                        { field: "locationId", operator:"==", value:sessionStorage.getItem("locationId") }
                    ]
                });
                
                  var jsdoOptionsLocations = controlPanelModel.get('_jsdoOptionsLocations'),
                    jsdoLocations = new progress.data.JSDO(jsdoOptionsLocations);

                dataSourceOptions.transport.jsdo = jsdoLocations;
                var dataSourceLocations = new kendo.data.DataSource(dataSourceOptions);
                dataSourceLocations.filter({ field: "locationId", operator:"==", value:sessionStorage.getItem("locationId") });

                //dataSourceLocations.filter({ field: "locationId", operator:"==", value:sessionStorage.getItem("locationId") });
                app.mobileApp.showLoading();
                dataSourceElem.fetch(function() {
                    //app.mobileApp.showLoading();
                    var elementsWithLocation = dataSourceElem.data();
                    // console.log("elementsWithLocation")
                    // console.log(elementsWithLocation)
                    app.generalMapView.generalMapViewModel.elements = elementsWithLocation;
                    
                    dataSourceLocations.fetch(function() {
                        var location = dataSourceLocations.data();
                        // console.log("location")
                        // console.log(location)
                        // console.log(location[0].stage1)
                        document.getElementById("stage0Counter").innerHTML = location[0].stage0;
                        document.getElementById("stage1Counter").innerHTML = location[0].stage1;
                        document.getElementById("stage2Counter").innerHTML = location[0].stage2;
                        document.getElementById("stage3Counter").innerHTML = location[0].stage3;
                        document.getElementById("stage4Counter").innerHTML = location[0].stage4;
                        document.getElementById("stage5Counter").innerHTML = location[0].stage5;
                        document.getElementById("stage6Counter").innerHTML = location[0].stage6;
                        document.getElementById("stage7Counter").innerHTML = location[0].stage7;
                        
                        dataSource.fetch(function() {
                        //     //app.mobileApp.showLoading();
                            var stages = dataSource.data();
                            // console.log("stages")
                            // console.log(stages)
                            //controlPanelModel.stageList = stages;

                        //     var list='', tmp, step0, step1, step2, step3, step4, step5, step6, step7;
                            for(var i=0; i < stages.length; i++) {
                                controlPanelModel.stageList[i] = stages[i];
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
                        //     list=step0;
                        //         list+=step1;
                        //         list+=step2;
                        //         list+=step3;
                        //         list+=step4;
                        //         list+=step5;
                        //         list+=step6;
                        //         list+=step7;

                        //         document.getElementById("controlPanelStagesList").innerHTML = list;
                        //         app.mobileApp.hideLoading();
                        });
                        app.mobileApp.hideLoading();
                    });        
                });
            });
        /*} else {
            fetchFilteredData(param);
            
            var jsdoOptionsElem = controlPanelModel.get('_jsdoOptionsElements'),
                    jsdoElem = new progress.data.JSDO(jsdoOptionsElem);

                dataSourceOptions.transport.jsdo = jsdoElem;
                var dataSourceElem = new kendo.data.DataSource(dataSourceOptions);

                 var jsdoOptionsLocations = controlPanelModel.get('_jsdoOptionsLocations'),
                    jsdoLocations = new progress.data.JSDO(jsdoOptionsLocations);

                dataSourceOptions.transport.jsdo = jsdoLocations;
                var dataSourceLocations = new kendo.data.DataSource(dataSourceOptions);

                dataSourceLocations.filter({ field: "locationId", operator:"==", value:sessionStorage.getItem("locationId") });

                dataSourceElem.filter({
                    logic: "and",
                    filters: [
                        { field: "Latitude", operator: "neq", value: "NaN" },
                        { field: "Latitude", operator: "neq", value: "null" },
                        { field: "Longtitud", operator: "neq", value: "NaN" },
                        { field: "Longtitud", operator: "neq", value: "null" },
                        { field: "elementStage", operator: "neq", value: "null" } //**********
                    ]
                });
                
                dataSourceElem.fetch(function() {
                    var elementsWithLocation = dataSourceElem.data();

                    app.generalMapView.generalMapViewModel.elements = elementsWithLocation;

                    dataSourceLocations.fetch(function() {
                        var locations = dataSourceLocations.data();
                        console.log("locations2")
                        console.log(locations)
                    });
                });
        }*/

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