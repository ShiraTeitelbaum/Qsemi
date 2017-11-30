'use strict';

app.taskDetailView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('taskDetailView');

// START_CUSTOM_CODE_taskDetailView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_taskDetailView
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties
        currentTask, currentTaskTeam, currentTaskTeamLeader, currentTaskTools,
        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('taskDetailViewModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('taskDetailViewModel_delayedFetch', paramFilter || null);
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
        jsdoOptionsEquipments = {
            name: 'ToolsSEMI',
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
                // if(type == "read") {
                //     currentTaskTeam = response;
                //     console.log("response")
                //     console.log(response.data[0].name)
                //     // document.getElementById("taskTeamName").innerHTML = currentTaskTeam.data[0].name; 
                // }
                 if(type == "read")
                {
                    // currentTask = response;
                    // 
                }
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
        dataSourceOptionsEquipments = {
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
        taskDetailViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _dataSourceOptionsTeams: dataSourceOptionsTeams,
            _dataSourceOptionsEquipments: dataSourceOptionsEquipments,
            _dataSourceOptionsWorkers: dataSourceOptionsWorkers,
            _jsdoOptions: jsdoOptions,
            _jsdoOptionsTeams: jsdoOptionsTeams,
            _jsdoOptionsEquipments: jsdoOptionsEquipments,
            _jsdoOptionsWorkers: jsdoOptionsWorkers,
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
                var dataItem = e.dataItem || taskDetailViewModel.originalItem;

                app.mobileApp.navigate('#components/taskDetailView/edit.html?uid=' + dataItem.uid);

            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/taskDetailView/edit.html?uid=' + uid);
            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = taskDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                taskDetailViewModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = taskDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                taskDetailViewModel.set('originalItem', itemModel);
                taskDetailViewModel.set('currentItem',
                    taskDetailViewModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            saveWarningPopUp: function(e) {
                $("#warningPopUp").kendoMobileModalView("close");
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
        taskToolsList: [],
        onInit: function(e) {
            var $sigdiv = $("#signatureTask")
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
            $("#noEquipments").hide();
            document.getElementById("projectName1").innerHTML = sessionStorage.getItem("locationName");

            $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv = $("#signatureTask");
            // after some doodling...
            $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

            var dataSourceOptions = taskDetailViewModel.get('_dataSourceOptions'),
                dataSourceOptionsT = taskDetailViewModel.get('_dataSourceOptionsTeams'),
                dataSourceOptionsW = taskDetailViewModel.get('_dataSourceOptionsWorkers'),
                dataSourceOptionsE = taskDetailViewModel.get('_dataSourceOptionsEquipments'),
                dataSourceTasks, dataSourceTeams, dataSourceWorkers, dataSourceTools;

            var jsdoOptions = taskDetailViewModel.get('_jsdoOptions'),
                jsdo = new progress.data.JSDO(jsdoOptions);

            dataSourceOptions.transport.jsdo = jsdo;
            var dataSource = new kendo.data.DataSource(dataSourceOptions);
            taskDetailViewModel.set('dataSourceTasks', dataSource);

            var jsdoOptionsT = taskDetailViewModel.get('_jsdoOptionsTeams'),
                jsdo = new progress.data.JSDO(jsdoOptionsT);

            dataSourceOptionsT.transport.jsdo = jsdo;
            dataSourceTeams = new kendo.data.DataSource(dataSourceOptionsTeams);
            taskDetailViewModel.set('dataSourceTeams', dataSourceTeams);

            var jsdoOptionsW = taskDetailViewModel.get('_jsdoOptionsWorkers'),
                jsdo = new progress.data.JSDO(jsdoOptionsW);

            dataSourceOptionsW.transport.jsdo = jsdo;
            dataSourceWorkers = new kendo.data.DataSource(dataSourceOptionsWorkers);
            taskDetailViewModel.set('dataSourceWorkers', dataSourceWorkers);

            var jsdoOptionsE = taskDetailViewModel.get('_jsdoOptionsEquipments'),
                jsdo = new progress.data.JSDO(jsdoOptionsE);

            dataSourceOptionsE.transport.jsdo = jsdo;
            dataSourceTools = new kendo.data.DataSource(dataSourceOptionsEquipments);
            taskDetailViewModel.set('dataSourceTools', dataSourceTools);

            var dataSourceTeam = taskDetailViewModel.get('dataSourceTeams');
            var dataSourceTeamLeader = taskDetailViewModel.get('dataSourceWorkers');
            var dataSourceEquipment = taskDetailViewModel.get('dataSourceTools');
            var dataSourceTasks = taskDetailViewModel.get('dataSourceTasks');

            var that = this,
                itemid = e.view.params.id,
                dataSourceTasks = taskDetailViewModel.get('dataSourceTasks'),
                itemData, fixedData;

            var toolsListFilters = [];

            dataSourceTasks.filter({ field: "id", operator: "==", value: itemid });            
            dataSourceTasks.fetch(function() {
                var view = dataSourceTasks.data();
                itemData = view[0];
                fixedData = taskDetailViewModel.fixHierarchicalData(itemData);
                that.set('itemData', itemData);

                itemData.set("cb_dirty", true);  
                // itemData.set("TPEnd", new Date(moment(currentTask.TPEnd, "HH:mm")).getTime());                
                dataSourceTasks.sync();
                dataSourceTasks.one('sync', function(e) {
                    that.taskToolsList = currentTask.R371893922;
                    if(that.taskToolsList != null) {
                        for(var i=0; i<that.taskToolsList.length; i++) {
                            toolsListFilters[i] = { field: "id", operator: "==", value: that.taskToolsList[i] };
                        }
                        
                        dataSourceEquipment.filter({
                            logic: "or",
                            filters: toolsListFilters
                        });
                        taskDetailViewModel.set('dataSourceEquipment', dataSourceEquipment);
                        $("#eqiupmentsListView").show();
                        var listView= $("#eqiupmentsListView").kendoMobileListView({
                            dataSource: dataSourceEquipment ,
                            template: kendo.template($("#toolsTemplate").html())
                        });
                    }
                    else {
                        taskDetailViewModel.set('dataSourceEquipment', '');
                        $("#eqiupmentsListView").hide();
                        $("#noEquipments").show();
                    }
                });

                dataSourceTeam.filter({field: "id", operator: "==", value: itemData.R371893913});
                dataSourceTeam.read().then(function() {
                    document.getElementById("taskTeamName").innerHTML = currentTaskTeam.data[0].name;
                    dataSourceTeamLeader.filter({field: "id", operator: "==", value: currentTaskTeam.data[0].R363991813});
                    dataSourceTeamLeader.read().then(function() {
                        document.getElementById("teamLeaderName").innerHTML = currentTaskTeamLeader.data[0].name;
                    });
                });
                
                 if(itemData.signature != null && itemData.signature != "null") {
                    // $sigdiv.jSignature("importData", itemData.signature);
                    $sigdiv.jSignature("importData", itemData.signature);
                    document.getElementById("NCRSignatureClose").style.color = "red";
                }
                else document.getElementById("NCRSignatureClose").style.color = "black";

                 that.set('editFormData', {
                    name: itemData.name,
                    Date: kendo.toString(itemData.Date, "dd/MM/yyyy"),
                    TPStart: kendo.toString(itemData['TPStart'], "dd/MM/yyyy HH:mm"),
                    TPEnd: kendo.toString(itemData['TPEnd'], "dd/MM/yyyy HH:mm"),
                    KPstart: itemData.KPstart,
                    KPend: itemData.KPend,
                    WorkDescription: itemData.WorkDescription,
                    WorkDetails: itemData.WorkDetails != null?itemData.WorkDetails:' ',
                    CloserName: itemData.CloserName != null?itemData.CloserName:' ',
                    Material: itemData.Material != null?itemData.Material:' '
                    /// start edit form data init
                    /// end edit form data init
                });
            });
            /// start edit form show
            /// end edit form show
        },
        linkBind: function(linkString) {
            var linkChunks = linkString.split(':');
            return linkChunks[0] + ':' + this.get('itemData.' + linkChunks[1]);
        },
        openSignatureTaskPopUp: function(e) {
            $("#signatureTaskPopUp").kendoMobileModalView("open");
        },
        closeSignatureTaskPopUp: function(e) {
            $("#signatureTaskPopUp").kendoMobileModalView("close");
            if($("#signatureTask").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") { 
                document.getElementById("NCRSignatureClose").style.color = "red";
            }
            else document.getElementById("NCRSignatureClose").style.color = "black";
        },
        onSaveClick: function(e) {
            var that = this,
                editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = taskDetailViewModel.get('dataSourceTasks');
            
            if($("#signatureTask").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") { 
                document.getElementById("warningPopUpText").innerHTML = app.taskDetailView.get('strings').warningMessage.needSignature;//"Signature is missing";
                $("#warningPopUp").kendoMobileModalView("open");
                return;
            }
            if($("#closerName").val() == "") { 
                document.getElementById("warningPopUpText").innerHTML = app.taskDetailView.get('strings').warningMessage.needName;//"Signature is missing";
                $("#warningPopUp").kendoMobileModalView("open");
                return;
            }
            
            /// edit properties
            /// start edit form data save
            if($("#taskDone").is(":checked")) {
                // addModel.Done = true;
                itemData.set('Done', true);
            }
            else itemData.set('Done', false);// addModel.Done = false;
            
            itemData.set('WorkDetails', editFormData.WorkDetails);
            itemData.set('CloserName', editFormData.CloserName);
            itemData.set('Material', editFormData.Material);
            itemData.set('signature', $("#signatureTask").jSignature("getData"));
            /// end edit form data save

            function editModel(data) {
                /// start edit form data prepare
                /// end edit form data prepare
                dataSource.one('sync', function(e) {
                    /// start edit form data save success
                    /// end edit form data save success
                    $("#closerName").val('');
                    $("#workDetails").val('');
                    $("#workmaterials").val('');
                    window.plugins.toast.showWithOptions(
                    {
                        message: app.taskDetailView.get('strings').toastsMessages.tasksSuccess,//"The check has been successfully saved",
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
        },
        onCancel: function() {
            /// start edit form cancel
            /// end edit form cancel
        }
    }));

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('taskDetailViewModel', taskDetailViewModel);
            var param = parent.get('taskDetailViewModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('taskDetailViewModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('taskDetailViewModel', taskDetailViewModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = taskDetailViewModel.get('_dataSourceOptions'),
            dataSourceOptionsT = taskDetailViewModel.get('_dataSourceOptionsTeams'),
            dataSourceOptionsW = taskDetailViewModel.get('_dataSourceOptionsWorkers'),
            dataSourceOptionsE = taskDetailViewModel.get('_dataSourceOptionsEquipments'),
            dataSource, dataSourceTeams, dataSourceWorkers, dataSourceTools;

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

        if (!taskDetailViewModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = taskDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                taskDetailViewModel.set('dataSource', dataSource);

                var jsdoOptionsT = taskDetailViewModel.get('_jsdoOptionsTeams'),
                    jsdo = new progress.data.JSDO(jsdoOptionsT);

                dataSourceOptionsT.transport.jsdo = jsdo;
                dataSourceTeams = new kendo.data.DataSource(dataSourceOptionsTeams);
                taskDetailViewModel.set('dataSourceTeams', dataSourceTeams);

                 var jsdoOptionsW = taskDetailViewModel.get('_jsdoOptionsWorkers'),
                    jsdo = new progress.data.JSDO(jsdoOptionsW);

                dataSourceOptionsW.transport.jsdo = jsdo;
                dataSourceWorkers = new kendo.data.DataSource(dataSourceOptionsWorkers);
                taskDetailViewModel.set('dataSourceWorkers', dataSourceWorkers);

                 var jsdoOptionsE = taskDetailViewModel.get('_jsdoOptionsEquipments'),
                    jsdo = new progress.data.JSDO(jsdoOptionsE);

                dataSourceOptionsE.transport.jsdo = jsdo;
                dataSourceTools = new kendo.data.DataSource(dataSourceOptionsEquipments);
                taskDetailViewModel.set('dataSourceTools', dataSourceTools);


                fetchFilteredData(param);
            });
        } else {
            // fetchFilteredData(param);
        }

    });

})(app.taskDetailView);

// START_CUSTOM_CODE_taskDetailViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.taskDetailView.taskDetailViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.taskDetailView.taskDetailViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_taskDetailViewModel