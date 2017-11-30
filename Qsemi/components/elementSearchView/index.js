'use strict';

app.elementSearchView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('elementSearchView');

// START_CUSTOM_CODE_elementSearchView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_elementSearchView
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('elementSearchViewModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('elementSearchViewModel_delayedFetch', paramFilter || null);
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
        elementSearchViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            searchChange: function(e) {
                var searchVal = e.target.value, searchFilterOr,
                    searchFilter = { logic: "and", filters: [] };

                searchFilter.filters.push({ field: "locationId", operator: "==", value: sessionStorage.getItem("locationId") });

                searchFilterOr = { 
                    logic: "or", 
                    filters: [
                        { field: "name", operator: "contains", value: searchVal },
                        // { field: "R363890883", operator: "==", value: elementDetailViewModel.stepId }
                    ] 
                };

                searchFilter.filters.push(searchFilterOr);
                fetchFilteredData(elementSearchViewModel.get('paramFilter'), searchFilter);

                // var searchVal = e.target.value,
                //     searchFilter;

                // if (searchVal) {
                //     searchFilter = {
                //         field: 'name',
                //         operator: 'contains',
                //         value: searchVal
                //     };
                // }
                // fetchFilteredData(elementSearchViewModel.get('paramFilter'), searchFilter);
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
            itemClick: function(id) {
                // var dataItem = e.dataItem || elementSearchViewModel.originalItem;

                app.mobileApp.navigate('#components/elementDetailView/details.html?id=' + id+'&searchFlag=true');

            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = elementSearchViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                elementSearchViewModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = elementSearchViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                elementSearchViewModel.set('originalItem', itemModel);
                elementSearchViewModel.set('currentItem',
                    elementSearchViewModel.fixHierarchicalData(itemModel));

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
            parent.set('elementSearchViewModel', elementSearchViewModel);
            var param = parent.get('elementSearchViewModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('elementSearchViewModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('elementSearchViewModel', elementSearchViewModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = elementSearchViewModel.get('_dataSourceOptions'),
            dataSource;
        
        elementDetailViewTitle1.innerHTML = sessionStorage.getItem("locationName");
        $("#search").val('');

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

        // if (!elementSearchViewModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = elementSearchViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                dataSource.filter({ field: "locationId", operator: "==", value: sessionStorage.getItem("locationId") }); 
                elementSearchViewModel.set('dataSource', dataSource);

                // fetchFilteredData(param);
            });
        // } else {
        //     fetchFilteredData(param);
        // }

    });

})(app.elementSearchView);

// START_CUSTOM_CODE_elementSearchViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.elementSearchView.elementSearchViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.elementSearchView.elementSearchViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_elementSearchViewModel