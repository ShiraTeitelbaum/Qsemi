'use strict';

app.projectDetailView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('projectDetailView');

// START_CUSTOM_CODE_projectDetailView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_projectDetailView
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        processImage = function(img) {

            if (!img) {
                var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
                img = 'data:image/png;base64,' + empty1x1png;
            }

            return img;
        },

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('projectDetailViewModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('projectDetailViewModel_delayedFetch', paramFilter || null);
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
            name: 'OurUserLocationSEMI',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},
            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    dataItem['LocationImage_URLUrl'] =
                        processImage(dataItem['LocationImage_URL']);

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
                        'UserName': {
                            field: 'UserName',
                            defaultValue: ''
                        },
                        'LocationImage_URL': {
                            field: 'LocationImage_URL',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,

            serverSorting: true,
            sort: {
                field: 'LocationName',
                dir: 'asc'
            },

        },
        /// start data sources
        /// end data sources
        projectDetailViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
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
                var dataItem = e.dataItem || projectDetailViewModel.originalItem;

                var locationName = dataItem.LocationName;
                var locationId = dataItem.locationId;
                var userId = dataItem.UserId;
                var userRole = dataItem.UserRole;

                console.log("dataItem")
                console.log(dataItem)
                console.log("locationName")
                console.log(locationName)

                sessionStorage.setItem("locationName", locationName);
                sessionStorage.setItem("locationId", locationId);
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userRole", userRole);
                //sessionStorage.setItem("isActiveShow", "isHome");

                setTimeout(function () {
                    app.mobileApp.navigate('#components/controlPanel/view.html');
                }, 300);

                //app.mobileApp.navigate('#components/projectDetailView/details.html?uid=' + dataItem.uid);

            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = projectDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                projectDetailViewModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = projectDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.UserName) {
                    itemModel.UserName = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                projectDetailViewModel.set('originalItem', itemModel);
                projectDetailViewModel.set('currentItem',
                    projectDetailViewModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            /// start masterDetails view model functions
            /// end masterDetails view model functions
            currentItem: {}
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('projectDetailViewModel', projectDetailViewModel);
            var param = parent.get('projectDetailViewModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('projectDetailViewModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('projectDetailViewModel', projectDetailViewModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = projectDetailViewModel.get('_dataSourceOptions'),
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

        //if (!projectDetailViewModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = projectDetailViewModel.get('_jsdoOptions'),
                email = app.authenticationView.authenticationViewModel.get('email'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                dataSource.filter( { field: "LoginName", operator: "eq", value: email });
                projectDetailViewModel.set('dataSource', dataSource);

                //fetchFilteredData(param);
            });
        //} else {
            //fetchFilteredData(param);
        //}

    });

})(app.projectDetailView);

// START_CUSTOM_CODE_projectDetailViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.projectDetailView.projectDetailViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.projectDetailView.projectDetailViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_projectDetailViewModel