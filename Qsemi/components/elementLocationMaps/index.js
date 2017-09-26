'use strict';

app.elementLocationMaps = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('elementLocationMaps');

// START_CUSTOM_CODE_elementLocationMaps
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_elementLocationMaps
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('elementLocationMapsModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('elementLocationMapsModel_delayedFetch', paramFilter || null);
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

        getLocation = function(options) {
            var d = new $.Deferred();

            if (options === undefined) {
                options = {
                    enableHighAccuracy: true
                };
            }

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    d.resolve(position);
                },
                function(error) {
                    d.reject(error);
                },
                options);

            return d.promise();
        },
        defaultMapContainer = 'elementLocationMapsModelMap',
        setupMapView = function(container) {
            if (!elementLocationMapsModel.map) {
                if (typeof container !== 'string') {
                    container = defaultMapContainer;
                }
                elementLocationMapsModel.map = L.map(container);
                elementLocationMapsModel.markersLayer = new L.FeatureGroup();

                var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    id: 'mapbox.streets',
                    accessToken: 'your access token'
                });

                elementLocationMapsModel.map.addLayer(tileLayer);

                elementLocationMapsModel.map.addLayer(elementLocationMapsModel.markersLayer);
                elementLocationMapsModel.map.on('click', function(e) {
                    elementLocationMapsModel.set('itemDetailsVisible', false);
                });

                elementLocationMapsModel.markersLayer.on('click', function(e) {
                    var marker, newItem;

                    marker = e.layer;
                    if (marker.options.icon.options.className.indexOf('current-marker') >= 0) {
                        return;
                    }

                    newItem = elementLocationMapsModel.setCurrentItemByUid(marker.options.uid);
                    elementLocationMapsModel.set('itemDetailsVisible', true);
                });
                addMarkersView();
            }
        },
        addMarkersView = function() {
            getLocation()
                .then(function(userPosition) {
                    var marker,
                        currentMarker, currentMarkerIcon,
                        latLang,
                        position,
                        mapBounds,
                        data = elementLocationMapsModel.get('dataSource').data(),
                        userLatLang = L.latLng(userPosition.coords.latitude, userPosition.coords.longitude);

                    elementLocationMapsModel.map.setView(userLatLang, 15, {
                        animate: false
                    });
                    mapBounds = elementLocationMapsModel.map.getBounds();
                    elementLocationMapsModel.markersLayer.clearLayers();

                    for (var i = 0; i < data.length; i++) {

                        position = {
                            longitude: data[i].AnchorageFoundation,
                            latitude: data[i].AnchorageFoundation
                        };

                        if (position.hasOwnProperty('latitude') && position.hasOwnProperty('longitude')) {
                            latLang = [position.latitude, position.longitude];
                        } else if (position.hasOwnProperty('Latitude') && position.hasOwnProperty('Longitude')) {
                            latLang = [position.Latitude, position.Longitude];
                        } else if (position.length == 2) {
                            latLang = [position[0], position[1]];
                        }

                        if (latLang && latLang[0] && latLang[1] && latLang[0] !== undefined && latLang[1] !== undefined) {
                            marker = L.marker(latLang, {
                                uid: data[i].uid
                            });
                            mapBounds.extend(latLang);
                            elementLocationMapsModel.markersLayer.addLayer(marker);
                        }
                    }

                    currentMarkerIcon = L.divIcon({
                        className: 'current-marker',
                        iconSize: [20, 20],
                        iconAnchor: [20, 20]
                    });

                    currentMarker = L.marker(userLatLang, {
                        icon: currentMarkerIcon
                    });

                    elementLocationMapsModel.markersLayer.addLayer(currentMarker);

                    elementLocationMapsModel.set('mapVisble', true);
                    elementLocationMapsModel.map.invalidateSize({
                        reset: true
                    });
                    elementLocationMapsModel.map.fitBounds(mapBounds, {
                        padding: [20, 20]
                    });
                    app.mobileApp.pane.loader.hide();
                }, function _getLocationError(error) {
                    app.mobileApp.pane.loader.hide();
                    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                });
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
        elementLocationMapsModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            //map: '',
            counter: 0,
            //labels : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
            labelIndex : 0,
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
                var dataItem = e.dataItem || elementLocationMapsModel.originalItem;

                app.mobileApp.navigate('#components/elementLocationMaps/details.html?uid=' + dataItem.uid);

            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = elementLocationMapsModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                elementLocationMapsModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = elementLocationMapsModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                elementLocationMapsModel.set('originalItem', itemModel);
                elementLocationMapsModel.set('currentItem',
                    elementLocationMapsModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
             // Adds a marker to the map.
            //function addMarker(location, map) {
            addMarker: function(location, map) {
                // Add the marker at the clicked location, and add the next-available label
                // from the array of alphabetical characters.
                        
                        //alert(location);
                        if(elementLocationMapsModel.counter < 1) {
                            elementLocationMapsModel.counter = elementLocationMapsModel.counter+1;
                            app.elementDetailView.elementDetailViewModel = new google.maps.Marker({ //var marker = new google.maps.Marker({
                                position: location,
                                //label: elementLocationMapsModel.labels[elementLocationMapsModel.labelIndex++ % elementLocationMapsModel.labels.length],
                                map: map,
                                draggable: true,
                                animation: google.maps.Animation.DROP,
                                icon: 'images/addMapPin.png'
                            });
                        }
                },
            /// start masterDetails view model functions
            /// end masterDetails view model functions
            currentItem: {}
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('elementLocationMapsModel', elementLocationMapsModel);
            var param = parent.get('elementLocationMapsModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('elementLocationMapsModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('elementLocationMapsModel', elementLocationMapsModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = elementLocationMapsModel.get('_dataSourceOptions'),
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

        app.mobileApp.pane.loader.show();
        elementLocationMapsModel.set('mapVisble', false);
        elementLocationMapsModel.set('itemDetailsVisible', false);

        if (!elementLocationMapsModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = elementLocationMapsModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                elementLocationMapsModel.set('dataSource', dataSource);
                dataSource.one('change', setupMapView);
                fetchFilteredData(param);

                 var myOptions = {
                    maxZoom: 18,
                    minZoom: 17,
                    zoom: 18,
                    center: new google.maps.LatLng('32.84939', '35.061912'),//{ lat: 32.84939, lng: 35.061912 },
                    mapTypeControl: true, 
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.TOP_LEFT
                    },
                    scaleControl: true,

                    //gestureHandling: 'none',//'cooperative',
                    //zoomControl: false,
                    //draggable: false
                    };
                var mapElement = $("#elementLocationMapsModelMap");
                var container = e.view.content;

                 var map = new google.maps.Map(mapElement[0], myOptions);
                 var infoWindow = new google.maps.InfoWindow({map: this.map});
                //var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', labelIndex = 0; //, counter= 0;

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        var pos2 = {
                            lat: position.coords.latitude+0.50,
                            lng: position.coords.longitude+0.50
                        };


                        alert("pos2")
                        alert(JSON.stringify(pos2))

                        /*infoWindow.setPosition(pos);
                        infoWindow.setContent('Location found.');
                        map.setCenter(pos);*/
                        infoWindow.setPosition(pos);
                        infoWindow.setContent('<br/>'+ 'You Are Here'); //Location found.
                        infoWindow.open(map);
                        map.setCenter(pos);
                        
                        app.mobileApp.pane.loader.hide();
                    }, function() {
                        handleLocationError(true, infoWindow, map.getCenter());
                    });
                    
                    google.maps.event.addListener(map, 'click', function(event) {
                        elementLocationMapsModel.addMarker(event.latLng, map);
                     });
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, map.getCenter());
                    app.mobileApp.pane.loader.hide();
                }
                function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                    infoWindow.setPosition(pos);
                    infoWindow.setContent(browserHasGeolocation ?
                                        'Error: The Geolocation service failed.' :
                                        'Error: Your browser doesn\'t support geolocation.');
                    infoWindow.open(map);
                }
            });
        } else {
            fetchFilteredData(param);
        }
    });

    parent.set('onHide', function() {
        var dataSource = elementLocationMapsModel.get('dataSource');
        dataSource.unbind('change', setupMapView);
    });

})(app.elementLocationMaps);

// START_CUSTOM_CODE_elementLocationMapsModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.elementLocationMaps.elementLocationMapsModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.elementLocationMaps.elementLocationMapsModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_elementLocationMapsModel