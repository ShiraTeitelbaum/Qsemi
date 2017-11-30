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
            myOptions: '',
            mapElement: '',
            container: '',
            map: '',
            infoWindow: '',
            pos: '',
            counter: 0,
            labelIndex : 0,
            emapFlag: false,
            backFlag: false,
            elementDetailsFalg:false,
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
            saveWarningPopUp: function() {
                $("#warningPopUpL").kendoMobileModalView("close");
            },
            saveElementLocation: function(e) {
                var jsdoOptions3 = app.elementDetailView.elementDetailViewModel.get('_jsdoOptions'),
                    jsdo3 = new progress.data.JSDO(jsdoOptions3);
                dataSourceOptions.transport.jsdo = jsdo3;
                var dataSource3 = new kendo.data.DataSource(dataSourceOptions);

                dataSource3.filter({ field: "id", operator: "==", value: app.elementDetailView.elementDetailViewModel.currentItem.id });

                dataSource3.fetch(function() {
                    var element = dataSource3.data();
                    
                    var tmp = (app.elementDetailView.elementDetailViewModel.marker.position).toString().split(",");
                    var lat = parseFloat((tmp[0]).substr(1, tmp[0].length)).toFixed(8);
                    var lng = parseFloat((tmp[1]).substr(1, tmp[1].length-2)).toFixed(8);

                    if(element[0].Latitude != lat && element[0].Longtitud != lng && element[0].Latitude != undefined && element[0].Longtitud != undefined) {
                        document.getElementById("warningPopUpTextL").innerHTML = app.elementLocationMaps.get('strings').warningMessage.noteLocaion;//"Signature is missing";
                        $("#warningPopUpL").kendoMobileModalView("open");
                        // return;
                    }
                    var elementLocation = {
                        Latitude: lat,
                        Longtitud: lng
                    };
                                    
                    var jsrow = jsdo3.findById(element[0].id);
                                    
                    var afterUpdateFn;
                    jsrow.assign(elementLocation);
                    afterUpdateFn = function(jsdo3, record, success, request) {
                        jsdo3.unsubscribe('afterUpdate', afterUpdateFn);
                        if(success === true) {
                            //URL of Google Static Maps.
                            var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";
                    
                            //Set the Google Map Center.
                            // staticMapUrl += "?center=" + elementLocationMapsModel.myOptions.center.lat() + "," + elementLocationMapsModel.myOptions.center.lng();
                            staticMapUrl += "?center=" + elementLocation.Latitude + "," + elementLocation.Longtitud;
                    
                            //Set the Google Map Size.
                            staticMapUrl += "&size=220x350";
                    
                            //Set the Google Map Zoom.
                            staticMapUrl += "&zoom=" + 16;//elementLocationMapsModel.myOptions.zoom;
                    
                            //Set the Google Map Type.
                            staticMapUrl += "&maptype=" + elementLocationMapsModel.myOptions.mapTypeId;
                    
                            //Loop and add Markers.
                             staticMapUrl += "&markers=color:red|" + app.elementDetailView.elementDetailViewModel.marker.position.lat() + "," + app.elementDetailView.elementDetailViewModel.marker.position.lng();
                            // for (var i = 0; i < markers.length; i++) {
                            //     staticMapUrl += "&markers=color:red|" + markers[i].lat + "," + markers[i].lng;
                            // }
                            // Display the Image of Google Map.
                           
                            var imgMap = document.getElementById("elementLocationMapsModelMap");
                            imgMap.src = staticMapUrl;
                            // imgMap.style.display = "block";
                            var a = document.createElement("a");
                            // document.body.appendChild(a);
                            a.style = "display: none";
                            a.href = staticMapUrl;
                            a.download = name;
                            a.click();

                             var image = new Image();
                             image.crossOrigin = 'anonymous';

                            // create an empty canvas element
                            var canvas = document.createElement("canvas"),
                                canvasContext = canvas.getContext("2d");

                            image.onload = function () {
                                //Set canvas size is same as the picture
                                canvas.width = image.width;
                                canvas.height = image.height;
                            
                                // draw image into canvas element
                                canvasContext.drawImage(image, 0, 0, image.width, image.height);
                            
                                // get canvas contents as a data URL (returns png format by default)
                                var dataURL = canvas.toDataURL("image/jpeg");

                                    var imagefile = dataURL;
                                    if(imagefile) {
                                         var options = new FileUploadOptions();
                                        var imageObj = $.parseJSON(jsrow.data.StaticMap) 
                                        options.fileKey = "fileContents";
                                        options.fileName = "element_map_image";
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
                                        var urlRB = app.elementDetailView.elementDetailViewModel._dataSourceOptions.transport.jsdo.url + imageObj.src + "?objName=" + app.elementDetailView.elementDetailViewModel._jsdoOptions.name;

                                        ft.upload(
                                            dataURL,
                                            encodeURI(urlRB),
                                            onFileUploadSuccess( ),
                                            onFileTransferFail,
                                            options,
                                            true);
                                     }
                                };

                            image.src = staticMapUrl;

                            app.elementDetailView.elementDetailViewModel.change_Percent = true;
                           if(document.getElementById("ChooseLocationOnMap") != null) {
                                document.getElementById("ChooseLocationOnMap").style.color = "red";
                                // alert("Location successfully approved");
                                window.plugins.toast.showWithOptions(
                                {
                                    message: app.elementLocationMaps.get('strings').toastsMessages.locationSuccessAproved,
                                    duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                                    position: "bottom",
                                    addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                                }); 
                           }
                            app.mobileApp.navigate('#:back');
                        }
                    };
                    jsdo3.subscribe('afterUpdate', afterUpdateFn);
                    jsdo3.saveChanges();
                });
            },
            onCancel: function(e) {
                app.surveyorMarking.surveyorMarkingModel.mapFlag=false;
                var cuur = app.elementDetailView.elementDetailViewModel.currentItem;
                //app.mobileApp.navigate('#components/surveyorMarking/edit.html?elementUid=' + cuur.uid+'&elementId='+cuur.id);
                app.mobileApp.navigate('#:back');
            },
            getMapCenter: function() {
                elementLocationMapsModel.infoWindow.setPosition(elementLocationMapsModel.pos);
               
                elementLocationMapsModel.map.setCenter(elementLocationMapsModel.pos);
            },
            loadMap: function() {
                 this.myOptions = {
                    //maxZoom: 18,
                    //minZoom: 17,
                    zoom: 18,
                    center: new google.maps.LatLng(31.77173, 35.18869),//{ lat: 32.84939, lng: 35.061912 },
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
                this.mapElement = $("#elementLocationMapsModelMap");
                //this.container = e.view.content;

                 this.map = new google.maps.Map(this.mapElement[0], this.myOptions);
                 this.infoWindow = new google.maps.InfoWindow({map: this.map});

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var elementLat = app.elementDetailView.elementDetailViewModel.elementLocation.Latitude;
                        var elementLng = app.elementDetailView.elementDetailViewModel.elementLocation.Longtitud;

                         if(elementLat != "NaN" && elementLat != "null" && elementLng != "NaN" && elementLng != "null") {
                            
                            elementLocationMapsModel.pos =  new google.maps.LatLng(elementLat, elementLng);
                           
                         }
                         else {
                             elementLocationMapsModel.pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                         }
                         if(elementLat != "NaN" && elementLat != "null" && elementLng != "NaN" && elementLng != "null") {
                           
                            elementLocationMapsModel.addMarker(elementLocationMapsModel.pos, elementLocationMapsModel.map);
                         }
                          elementLocationMapsModel.infoWindow.setContent('<br/>'+ 'You Are Here'); //Location found.
                        elementLocationMapsModel.infoWindow.open(elementLocationMapsModel.map);
                        elementLocationMapsModel.map.setCenter(elementLocationMapsModel.pos);
                        
                    }, function() {
                        handleLocationError(true, elementLocationMapsModel.infoWindow, elementLocationMapsModel.map.getCenter());
                    });
                    
                    google.maps.event.addListener(elementLocationMapsModel.map, 'click', function(event) {
                        elementLocationMapsModel.addMarker(event.latLng, elementLocationMapsModel.map);
                     });
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, map.getCenter());
                }
                function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                    infoWindow.setPosition(pos);
                    infoWindow.setContent(browserHasGeolocation ?
                                        'Error: The Geolocation service failed.' :
                                        'Error: Your browser doesn\'t support geolocation.');
                    infoWindow.open(map);
                }
            },
             // Adds a marker to the map.
            //function addMarker(location, map) {
            addMarker: function(location, map) {
                // Add the marker at the clicked location, and add the next-available label
                // from the array of alphabetical characters.
                //alert(elementLocationMapsModel.counter)
                    if(elementLocationMapsModel.elementDetailsFalg == true) {
                        if(elementLocationMapsModel.counter < 1) {
                            elementLocationMapsModel.counter = elementLocationMapsModel.counter+1;
                            app.elementDetailView.elementDetailViewModel.marker = new google.maps.Marker({ //var marker = new google.maps.Marker({
                                position: location,
                                //label: elementLocationMapsModel.labels[elementLocationMapsModel.labelIndex++ % elementLocationMapsModel.labels.length],
                                map: map,
                                draggable: false,
                                animation: google.maps.Animation.DROP,
                                icon: 'images/addMapPinRed.png'
                            });
                        }
                    }
                    else {
                        if(elementLocationMapsModel.counter < 1) {
                            elementLocationMapsModel.counter = elementLocationMapsModel.counter+1;
                            app.elementDetailView.elementDetailViewModel.marker = new google.maps.Marker({ //var marker = new google.maps.Marker({
                                position: location,
                                //label: elementLocationMapsModel.labels[elementLocationMapsModel.labelIndex++ % elementLocationMapsModel.labels.length],
                                map: map,
                                draggable: true,
                                animation: google.maps.Animation.DROP,
                                icon: 'images/addMapPinRed.png'
                            });
                        }
                    }
                },
                closeNeedGPSElement: function(e) {
                    // elementLocationMapsModel.backFlag = true;
                    $("#needGPSElementPopUp").kendoMobileModalView("close");
                    app.elementLocationMaps.elementLocationMapsModel.emapFlag = false;
                    var id = 0;
                    app.mobileApp.navigate('#components/elementDetailView/stepFormList.html?stepid=' + id);
                },
                openSettingsNeedGPSElement: function(e) {
                    $("#needGPSElementPopUp").kendoMobileModalView("close");
                    cordova.plugins.diagnostic.switchToLocationSettings();
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

    function dialog() {
       cordova.plugins.diagnostic.isLocationAvailable(function(available){
            // alert("Location is " + (available ? "available" : "not available"));
            if(available == false) {
                // alert("Location is not available");
                $("#needGPSElementPopUp").kendoMobileModalView("open");
                // cordova.plugins.diagnostic.switchToLocationSettings();
            }
            // else if(available == true) {
                elementLocationMapsModel.loadMap();
            // }
        }, function(error){
            alert("The following error occurred: "+error);
        });
    }
    parent.set('onShow', function(e) {
        elementLocationMapsModel.emapFlag = true;
        //  navigator.geolocation.getCurrentPosition(function(position){},calldialog());
        dialog();
        
        if(e.view.params.detailsFlag != undefined)
            elementLocationMapsModel.elementDetailsFalg = true;

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

        //app.mobileApp.pane.loader.show();
        elementLocationMapsModel.set('mapVisble', false);
        elementLocationMapsModel.set('itemDetailsVisible', false);

        //if (!elementLocationMapsModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = elementLocationMapsModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
                elementLocationMapsModel.set('dataSource', dataSource);
                dataSource.one('change', setupMapView);
                fetchFilteredData(param);

                // elementLocationMapsModel.loadMap();
            });
        /*} else {
            fetchFilteredData(param);
        }*/
    });

    parent.set('onHide', function() {
        var dataSource = elementLocationMapsModel.get('dataSource');
        dataSource.unbind('change', setupMapView);
    });

function onFileUploadSuccess() {
        // alert("onFileUploadSuccess")
        console.log("onFileUploadSuccess")
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