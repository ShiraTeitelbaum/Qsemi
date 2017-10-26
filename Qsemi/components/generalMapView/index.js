'use strict';

app.generalMapView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('generalMapView');

// START_CUSTOM_CODE_generalMapView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_generalMapView
(function(parent) {
    var dataProvider = app.data.qcsemidataProvider,
        /// start global model properties

        /// end global model properties
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('generalMapViewModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('generalMapViewModel_delayedFetch', paramFilter || null);
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
        defaultMapContainer = 'generalMapViewModelMap',
        setupMapView = function(container) {
            // if (!generalMapViewModel.map) {
            //     if (typeof container !== 'string') {
            //         container = defaultMapContainer;
            //     }
            //     generalMapViewModel.map = L.map(container);
            //     generalMapViewModel.markersLayer = new L.FeatureGroup();

            //     var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            //         attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            //         id: 'mapbox.streets',
            //         accessToken: 'your access token'
            //     });

            //     generalMapViewModel.map.addLayer(tileLayer);

            //     generalMapViewModel.map.addLayer(generalMapViewModel.markersLayer);
            //     generalMapViewModel.map.on('click', function(e) {
            //         generalMapViewModel.set('itemDetailsVisible', false);
            //     });

            //     generalMapViewModel.markersLayer.on('click', function(e) {
            //         var marker, newItem;

            //         marker = e.layer;
            //         if (marker.options.icon.options.className.indexOf('current-marker') >= 0) {
            //             return;
            //         }

            //         newItem = generalMapViewModel.setCurrentItemByUid(marker.options.uid);
            //         generalMapViewModel.set('itemDetailsVisible', true);
            //     });
            //     addMarkersView();
            // }
        },
        addMarkersView = function() {
            // getLocation()
            //     .then(function(userPosition) {
            //         var marker,
            //             currentMarker, currentMarkerIcon,
            //             latLang,
            //             position,
            //             mapBounds,
            //             data = generalMapViewModel.get('dataSource').data(),
            //             userLatLang = L.latLng(userPosition.coords.latitude, userPosition.coords.longitude);

            //         generalMapViewModel.map.setView(userLatLang, 15, {
            //             animate: false
            //         });
            //         mapBounds = generalMapViewModel.map.getBounds();
            //         generalMapViewModel.markersLayer.clearLayers();

            //         for (var i = 0; i < data.length; i++) {

            //             position = {
            //                 longitude: data[i].Longtitud,
            //                 latitude: data[i].Latitude
            //             };

            //             if (position.hasOwnProperty('latitude') && position.hasOwnProperty('longitude')) {
            //                 latLang = [position.latitude, position.longitude];
            //             } else if (position.hasOwnProperty('Latitude') && position.hasOwnProperty('Longitude')) {
            //                 latLang = [position.Latitude, position.Longitude];
            //             } else if (position.length == 2) {
            //                 latLang = [position[0], position[1]];
            //             }

            //             if (latLang && latLang[0] && latLang[1] && latLang[0] !== undefined && latLang[1] !== undefined) {
            //                 marker = L.marker(latLang, {
            //                     uid: data[i].uid
            //                 });
            //                 mapBounds.extend(latLang);
            //                 generalMapViewModel.markersLayer.addLayer(marker);
            //             }
            //         }

            //         currentMarkerIcon = L.divIcon({
            //             className: 'current-marker',
            //             iconSize: [20, 20],
            //             iconAnchor: [20, 20]
            //         });

            //         currentMarker = L.marker(userLatLang, {
            //             icon: currentMarkerIcon
            //         });

            //         generalMapViewModel.markersLayer.addLayer(currentMarker);

            //         generalMapViewModel.set('mapVisble', true);
            //         generalMapViewModel.map.invalidateSize({
            //             reset: true
            //         });
            //         generalMapViewModel.map.fitBounds(mapBounds, {
            //             padding: [20, 20]
            //         });
            //         app.mobileApp.pane.loader.hide();
            //     }, function _getLocationError(error) {
            //         app.mobileApp.pane.loader.hide();
            //         alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
            //     });
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
                        'AnchorageFoundation': {
                            field: 'AnchorageFoundation',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,

        },
        /// start data sources
        /// end data sources
        generalMapViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            myOptions: '',
            mapElement: '',
            container: '',
            map: '',
            infoWindow: '',
            pos: '',
            elements: [],
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
                var dataItem = e.dataItem || generalMapViewModel.originalItem;

                app.mobileApp.navigate('#components/generalMapView/details.html?uid=' + dataItem.uid);

            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = generalMapViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                generalMapViewModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = generalMapViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.AnchorageFoundation) {
                    itemModel.AnchorageFoundation = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                generalMapViewModel.set('originalItem', itemModel);
                generalMapViewModel.set('currentItem',
                    generalMapViewModel.fixHierarchicalData(itemModel));

                return itemModel;
            },
            linkBind: function(linkString) {
                var linkChunks = linkString.split('|');
                if (linkChunks[0].length === 0) {
                    return this.get('currentItem.' + linkChunks[1]);
                }
                return linkChunks[0] + this.get('currentItem.' + linkChunks[1]);
            },
            loadMap: function() {
                // app.mobileApp.pane.loader.show();
                //     generalMapViewModel.pos = {
                //         lat: 31.77173,
                //         lng: 35.18869
                //   };
                    this.myOptions = {
                        // center: generalMapViewModel.pos,
                        zoom: 18,
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
                    };
                    this.mapElement = $("#generalMapViewModelMap");
                    //this.container = e.view.content;
                    this.container = $("#generalMapViewScreen").content;

                    this.map = new google.maps.Map(this.mapElement[0], this.myOptions);
                    this.infoWindow = new google.maps.InfoWindow({map: this.map});

                    generalMapViewModel.infoWindow.setPosition(generalMapViewModel.pos);
                    generalMapViewModel.infoWindow.setContent('<br/>'+ 'You Are Here'); //Location found.
                    // generalMapViewModel.infoWindow.open(generalMapViewModel.map);
                    generalMapViewModel.map.setCenter(generalMapViewModel.pos);

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            generalMapViewModel.pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };

                        //     generalMapViewModel.pos = {
                        //         lat: 31.7660014,
                        //         lng: 35.1908773
                        //   };

                            /*infoWindow.setPosition(pos);
                            infoWindow.setContent('Location found.');
                            map.setCenter(pos);*/
                            generalMapViewModel.infoWindow.setPosition(generalMapViewModel.pos);
                            generalMapViewModel.infoWindow.setContent('<br/>'+ 'You Are Here'); //Location found.
                            // generalMapViewModel.infoWindow.open(generalMapViewModel.map);
                            generalMapViewModel.map.setCenter(generalMapViewModel.pos);

                            app.mobileApp.pane.loader.hide();
                        }, function() {
                            handleLocationError(true, generalMapViewModel.infoWindow, generalMapViewModel.map.getCenter());
                        });
                    } else {
                        // Browser doesn't support Geolocation
                        handleLocationError(false, generalMapViewModel.infoWindow, generalMapViewModel.map.getCenter());
                        app.mobileApp.pane.loader.hide();
                    }
                    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                        
                        infoWindow.setPosition(this.pos);
                        infoWindow.setContent(browserHasGeolocation ?
                                            'Error: The Geolocation service failed.' :
                                            'Error: Your browser doesn\'t support geolocation.');
                        infoWindow.open(this.map);
                    }
                    this.showElements();
            },
            showElements: function() {
                var elementLocation;
                // console.log("this.elements")
                // console.log(this.elements)
                if(this.elements.length > 0) {
                    var i;
                    for(i=0; i<this.elements.length; i++) {
                        switch(this.elements[i].elementStage) {
                            // case 0: 
                            case 1: 
                                generalMapViewModel.addMarker(this.elements[i], this.map, 1);
                                break;
                            case 2: 
                                generalMapViewModel.addMarker(this.elements[i],this.map, 2);
                                break;
                            case 3: 
                                generalMapViewModel.addMarker(this.elements[i], this.map, 3);
                                break;
                            case 4:  
                                generalMapViewModel.addMarker(this.elements[i], this.map, 4);
                                break;
                            case 5: 
                                generalMapViewModel.addMarker(this.elements[i], this.map, 5);
                                break;
                            case 6: 
                                generalMapViewModel.addMarker(this.elements[i], this.map, 6);
                                break;
                            case 7: 
                                generalMapViewModel.addMarker(this.elements[i], this.map, 7);
                                break;
                        }
                    }
                    // console.log("I")
                    // console.log(i)
                }
            },
            attachMessage: function(marker, element) {
                //this.elements
                var contentString = '<div id="content">' + 
                    '<p><b>' + element.name + '</b></p>' +
                    '<div id="bodyContent">' +
                     '<p><b>Stage: </b>' + element.elementStage + '</p>' +
                     '<p> <a href="#components/elementDetailView/details.html?mapFlag=true&id=' + element.id+'&stepNum='+ element.elementStage +'">' +
                    'To Element page</a> '
                     '</div>' +
                    '</div>';


                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                marker.addListener('click', function () {
                    infowindow.open(marker.get('map'), marker);
                });
            },
             // Adds a marker to the map.
            //function addMarker(location, map) {
            addMarker: function(element, map, num) {
                // Add the marker at the clicked location, and add the next-available label
                // from the array of alphabetical characters.
                var iconURL;
                switch(num) {
                    case 1: iconURL = 'images/addMapPinRed.png';
                        break;
                    case 2: iconURL = 'images/addMapPinOrange.png';
                        break;
                    case 3: iconURL = 'images/addMapPinYellow.png';
                        break;
                    case 4: iconURL = 'images/addMapPinGreen.png';
                        break;
                    case 5: iconURL = 'images/addMapPinBlue.png';
                        break;
                    case 6: iconURL = 'images/addMapPinPurple.png';
                        break;
                    case 7: iconURL = 'images/addMapPinGrey.png';
                        break;
                }
                var location = new google.maps.LatLng(element.Latitude, element.Longtitud);
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    icon: iconURL//iconURL//'images/addMapPinRed.png'
                    });
                    this.attachMessage(marker, element);
                },
            /// start masterDetails view model functions
            /// end masterDetails view model functions
            currentItem: {}
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('generalMapViewModel', generalMapViewModel);
            var param = parent.get('generalMapViewModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('generalMapViewModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('generalMapViewModel', generalMapViewModel);
    }
//   function calldialog() {
                    
//                     document.addEventListener("deviceready",function(){
//                         //default dialog
//                         cordova.dialogGPS("Your GPS is Disabled, this app needs to be enable to works.",//message
//                             "Use GPS, with wifi or 3G.",//description
//                             function(buttonIndex){//callback
//                             switch(buttonIndex) {
//                                 case 0: break;//cancel
//                                 case 1: break;//neutro option
//                                 case 2: break;//user go to configuration
//                             }},
//                             "Please Turn on GPS",//title
//                             ["Cancel","Later","Go"]);//buttons
//                     });
//                 }

    function dialog() {
       cordova.plugins.diagnostic.isLocationAvailable(function(available){
            alert("Location is " + (available ? "available" : "not available"));
            if(available == false) {
                cordova.plugins.diagnostic.switchToLocationSettings();
            }
            // else if(available == true) {
                generalMapViewModel.loadMap();
            // }
        }, function(error){
            alert("The following error occurred: "+error);
        });
    }
    
    parent.set('onShow', function(e) {
        //  navigator.geolocation.getCurrentPosition(function(position){generalMapViewModel.loadMap();}, dialog());
        dialog();
                
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = generalMapViewModel.get('_dataSourceOptions'),
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

        //app.mobileApp.pane.loader.show();
        // generalMapViewModel.set('mapVisble', false);
        // generalMapViewModel.set('itemDetailsVisible', false);

        //if (!generalMapViewModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = generalMapViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                generalMapViewModel.set('dataSource', dataSource);
                dataSource.one('change', setupMapView);
                fetchFilteredData(param);
                // alert(111)
                // generalMapViewModel.loadMap();

                /*app.mobileApp.pane.loader.show();
                var myOptions = {
                    zoom: 18,
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
                };
                var mapElement = $("#generalMapViewModelMap");
                var container = e.view.content;

                 var map = new google.maps.Map(mapElement[0], myOptions);
                 var infoWindow = new google.maps.InfoWindow({map: this.map});*/

                /*if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        //var pos = {
                            //lat: position.coords.latitude,
                            //lng: position.coords.longitude
                        //};
                        var pos = {
                            lat: 31.7660014,
                            lng: 35.1908773
                        };

                        //infoWindow.setPosition(pos);
                        //infoWindow.setContent('Location found.');
                        //map.setCenter(pos);
                        //infoWindow.setPosition(pos);
                        //infoWindow.setContent('<br/>'+ 'You Are Here'); //Location found.
                        infoWindow.open(map);
                        map.setCenter(pos);
                        
                        //app.mobileApp.pane.loader.hide();
                    }, function() {
                        handleLocationError(true, infoWindow, map.getCenter());
                    });*/

                    /*dataSource.fetch(function() {
                        var elements = dataSource.data();
                        console.log("elements")
                        console.log(elements)
                        var elementLocation;
                        for(var i=0; i<elements.length; i++) {
                            if(elements[i].Latitude != "NaN" && elements[i].Longtitud != "NaN" && elements[i].elementStage != "null") {
                                console.log("element")
                                console.log(elements[i].elementStage)
                                switch(elements[i].elementStage) {
                                    case 1: console.log("1");  elementLocation = new google.maps.LatLng(elements[i].Latitude, elements[i].Longtitud);
                                        generalMapViewModel.addMarker(elementLocation, this.map, 1);
                                        break;
                                    case 2: console.log("2");  elementLocation = new google.maps.LatLng(elements[i].Latitude, elements[i].Longtitud);
                                        generalMapViewModel.addMarker(elementLocation,this.mapmap, 2);
                                        break;
                                    case 3: console.log("3"); elementLocation = new google.maps.LatLng(elements[i].Latitude, elements[i].Longtitud);
                                        generalMapViewModel.addMarker(elementLocation, this.map, 3);
                                        break;
                                    case 4:  console.log("4"); elementLocation = new google.maps.LatLng(elements[i].Latitude, elements[i].Longtitud);
                                        generalMapViewModel.addMarker(elementLocation, this.map, 4);
                                        break;
                                    case 5: console.log("5"); elementLocation = new google.maps.LatLng(elements[i].Latitude, elements[i].Longtitud);
                                        generalMapViewModel.addMarker(elementLocation, this.map, 5);
                                        break;
                                    case 6: console.log("6"); elementLocation = new google.maps.LatLng(elements[i].Latitude, elements[i].Longtitud);
                                        generalMapViewModel.addMarker(elementLocation, this.map, 6);
                                        break;
                                }
                            }
                        }
                    });*/
                /*} else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, map.getCenter());
                    //app.mobileApp.pane.loader.hide();
                }
                function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                    infoWindow.setPosition(pos);
                    infoWindow.setContent(browserHasGeolocation ?
                                        'Error: The Geolocation service failed.' :
                                        'Error: Your browser doesn\'t support geolocation.');
                    infoWindow.open(map);
                }*/
            });
            //app.mobileApp.pane.loader.hide();
        /*} else {
            fetchFilteredData(param);
            generalMapViewModel.loadMap();
        }*/

    });

    parent.set('onHide', function() {
        var dataSource = generalMapViewModel.get('dataSource');
        dataSource.unbind('change', setupMapView);
    });

})(app.generalMapView);

// START_CUSTOM_CODE_generalMapViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.generalMapView.generalMapViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.generalMapView.generalMapViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_generalMapViewModel