'use strict';

app.impairmentDetailView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('impairmentDetailView');

// START_CUSTOM_CODE_impairmentDetailView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_impairmentDetailView
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
            var model = parent.get('impairmentDetailViewModel'),
                dataSource;

            if (model) {
                dataSource = model.get('dataSource');
            } else {
                parent.set('impairmentDetailViewModel_delayedFetch', paramFilter || null);
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
            name: 'QualityImpairment',
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
        /// start data sources
        /// end data sources
        impairmentDetailViewModel = kendo.observable({
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            currentImpairment: {},
            myOptions: '',
            mapElement: '',
            container: '',
            map: '',
            infoWindow: '',
            pos: '',
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
                var dataItem = e.dataItem || impairmentDetailViewModel.originalItem;

                // app.mobileApp.navigate('#components/impairmentDetailView/details.html?uid=' + dataItem.uid);
                app.mobileApp.navigate('#components/impairmentDetailView/edit.html?uid=' + dataItem.uid);

            },
            editClick: function() {
                var uid = this.originalItem.uid;
                app.mobileApp.navigate('#components/impairmentDetailView/edit.html?uid=' + uid);
            },
       
            detailsInit: function(e) {

            },
            detailsShow: function(e) {
                var uid = e.view.params.uid,
                    dataSource = impairmentDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(uid);

                impairmentDetailViewModel.setCurrentItemByUid(uid);

                /// start detail form show
                /// end detail form show
            },
            setCurrentItemByUid: function(uid) {
                var item = uid,
                    dataSource = impairmentDetailViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.name) {
                    itemModel.name = String.fromCharCode(160);
                }

                /// start detail form initialization
                /// end detail form initialization

                impairmentDetailViewModel.set('originalItem', itemModel);
                impairmentDetailViewModel.set('currentItem',
                    impairmentDetailViewModel.fixHierarchicalData(itemModel));

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

    parent.set('editItemViewModel', kendo.observable({
        /// start edit model properties
        /// end edit model properties
        /// start edit model functions
        /// end edit model functions
        editFormData: {},
        onInit: function(e) {
            // app.mobileApp.showLoading();
             var $sigdiv = $("#signatureOpenNCR")
            $sigdiv.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                'color': 'black',
                 //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget. 

            var $sigdiv2 = $("#signatureCloseNCR")
            $sigdiv2.jSignature({
                'background-color': 'transparent',
                'decor-color': 'transparent',
                'color': 'black',
                 //'height':'8em'
                'width': '300',
                'height': '110'
                }) // inits the jSignature widget. 
        },
        onShow: function(e) {
            $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv = $("#signatureOpenNCR");
            // after some doodling...
            $sigdiv.jSignature("reset") // clears the canvas and rerenders the decor on it.

            $(".km-scroll-container").css("overflow", "hidden");
            var $sigdiv2 = $("#signatureCloseNCR");
            // after some doodling...
            $sigdiv2.jSignature("reset") // clears the canvas and rerenders the decor on it.

            var that = this,
                itemUid = e.view.params.uid,
                dataSource = impairmentDetailViewModel.get('dataSource'),
                itemData = dataSource.getByUid(itemUid),
                fixedData = impairmentDetailViewModel.fixHierarchicalData(itemData);

            /// start edit form before itemData
            /// end edit form before itemData

            this.set('itemData', itemData);
            impairmentDetailViewModel.currentImpairment = itemData;
            
            var fixed_description;
            if(itemData.Fixdescription != "null")
                fixed_description = itemData.Fixdescription;
            else fixed_description = '';

            this.set('editFormData', {
                name: itemData.name,
                DestinationDate: itemData.DestinationDate,
                FixDate: itemData.FixDate,
                longitude: itemData.longitude,
                Latitude: itemData.Latitude,
                image: itemData.image,
                image2: itemData.image2,
                Description: itemData.Description,
                Fixdescription: fixed_description,
                signature: itemData.signature,
                signatureClose: itemData.signatureClose
                /// start edit form data init
                /// end edit form data init
            });

            if(itemData.longitude != null && itemData.Latitude != null)
                document.getElementById("ncrElementLocation").style.color = "red";

            if(itemData.Fixed == 1) {
                document.getElementById("tookCare").checked = true;
                talkbubble.hidden = false;
            }
            else {
                document.getElementById("tookCare").checked = false;
                talkbubble.hidden = true;
            }

             if(itemData.signature != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") { 
                $sigdiv.jSignature("importData", itemData.signature);
                document.getElementById("NCRSignatureopen").style.color = "red";
             }
             else document.getElementById("NCRSignatureopen").style.color = "black";
  
             document.getElementById("NCRSignatureClose").style.color = "black";

            document.getElementById("dateImpairtment").innerHTML = kendo.toString(itemData.updatedAt, "dd/MM/yyyy HH:mm");
            // document.getElementById("nameElementImpairtment").innerHTML = 

            if(itemData.fixed != 1)
                document.getElementById("statusImpairtment").innerHTML = "open impairtment";
            else document.getElementById("statusImpairtment").innerHTML = "close impairtment";

            document.getElementById("impaiDate").innerHTML = kendo.toString(itemData.DestinationDate, "dd/MM/yyyy");

            if(itemData.imageURL != null && itemData.imageURL != "null" && itemData.imageURL != '') {
                document.getElementById("addCapturePhoto1Lik").style.color = "red";
                // var imageObj = $.parseJSON(itemData.image);
                // itemData.image = processImage(impairmentDetailViewModel.get('_dataSourceOptions').transport.jsdo.url + imageObj.src);

                document.getElementById("addCapturePhoto1ncrImg").src = itemData.imageURL;
            }
            else document.getElementById("addCapturePhoto1Lik").style.color = "black";
           
            if(itemData.imageURL1 != null && itemData.imageURL1 != "null" && itemData.imageURL1 != '') {
                document.getElementById("addCapturePhoto2Lik").style.color = "red";
                // var imageObj2 = $.parseJSON(itemData.image2);
                // itemData.image2 = processImage(impairmentDetailViewModel.get('_dataSourceOptions').transport.jsdo.url + imageObj2.src);
                document.getElementById("addCapturePhoto2ncrImg").src = itemData.imageURL1;
            }
            else document.getElementById("addCapturePhoto2Lik").style.color = "black";

            document.getElementById("addCapturePhotoCorrect").style.color = "black";

            /// start edit form show
            /// end edit form show
        },
        linkBind: function(linkString) {
            var linkChunks = linkString.split(':');
            return linkChunks[0] + ':' + this.get('itemData.' + linkChunks[1]);
        },
        openNCRMap: function(e) {
            if(impairmentDetailViewModel.currentImpairment.longitude == null && impairmentDetailViewModel.currentImpairment.Latitude == null) {
                // alert("The is no loaction for this impairment")
                document.getElementById("warningPopUpTextNcr").innerHTML = app.impairmentDetailView.get('strings').warningMessage.noLocations;
                $("#warningPopUpClosrNcr").kendoMobileModalView("open");
            }
            else {
                impairmentDetailViewModel.myOptions = {
                    //maxZoom: 18,
                    //minZoom: 17,
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
                impairmentDetailViewModel.mapElement = $("#impairment_map");
                impairmentDetailViewModel.map = new google.maps.Map(impairmentDetailViewModel.mapElement[0], impairmentDetailViewModel.myOptions);
                impairmentDetailViewModel.infoWindow = new google.maps.InfoWindow({map: impairmentDetailViewModel.map});

                //  impairmentDetailViewModel.pos = {
                //     lat: position.coords.latitude,
                //     lng: position.coords.longitude
                // };
                var elementLat = impairmentDetailViewModel.currentImpairment.Latitude;
                var elementLng = impairmentDetailViewModel.currentImpairment.longitude;
                impairmentDetailViewModel.pos =  new google.maps.LatLng(elementLat, elementLng);
                // impairmentDetailViewModel.infoWindow.setContent('<br/>'+ 'You Are Here'); //Location found.
                impairmentDetailViewModel.infoWindow.open(impairmentDetailViewModel.map);
                impairmentDetailViewModel.map.setCenter(impairmentDetailViewModel.pos);
                
                this.addMarker(impairmentDetailViewModel.pos, impairmentDetailViewModel.map);

                $("#impairmentLocationPopUp").kendoMobileModalView("open");
            }
        },
        addMarker: function(location, map) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        //alert(elementLocationMapsModel.counter)
             var marker = new google.maps.Marker({ //var marker = new google.maps.Marker({
                position: location,
                //label: elementLocationMapsModel.labels[elementLocationMapsModel.labelIndex++ % elementLocationMapsModel.labels.length],
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP
            });
        },
        closeimpairmentLocationPopUp: function(e) {
            $("#impairmentLocationPopUp").kendoMobileModalView("close");
        },
        openSignatureCloseNCRPopUp: function(e) {
            $("#signatureCloseNcrPopUp").kendoMobileModalView("open");
        },
        openSignatureopenNCRPopUp: function(e) {
            $("#signatureOpenNcrPopUp").kendoMobileModalView("open");
        },
        closeSignatureOpenNCRPopUp: function(e) {
            $("#signatureOpenNcrPopUp").kendoMobileModalView("close");
        },
        closeSignatureCloseNCRPopUp: function(e) {
            $("#signatureCloseNcrPopUp").kendoMobileModalView("close");
            if($("#signatureCloseNCR").jSignature("getData") != "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                // document.getElementById("warningPopUpText").innerHTML = app.formDetailView.get('strings').warningMessage.needSignature;
                // $("#warningPopUpClosrNcr").kendoMobileModalView("open");
                // alert("need signature");
                document.getElementById("NCRSignatureClose").style.color = "red";
                // return;
            }
            else document.getElementById("NCRSignatureClose").style.color = "black";
        },
        closeAddNCRPopUpImg1: function(e) {
            $("#addCapturePhoto1ncrPop").kendoMobileModalView("close");
        },
        closeAddNCRPopUpImg2: function(e) {
            $("#addCapturePhoto2ncrPop").kendoMobileModalView("close");
        },
        closeAddNCRPopUpImgCorrect: function(e) {
            $("#addCapturePhotoCorrectPop").kendoMobileModalView("close");
        },
        openAddNCRPopUpImg1: function(e) {
            $("#addCapturePhoto1ncrPop").kendoMobileModalView("open");
        },
        openAddNCRPopUpImg2: function(e) {
            $("#addCapturePhoto2ncrPop").kendoMobileModalView("open");
        },
        closeWarningPopUpCloseNcr: function(e) {
            $("#warningPopUpClosrNcr").kendoMobileModalView("close");
        },
        onSaveClick: function(e) {
            var that = this,
                editFormData = this.get('editFormData'),
                itemData = this.get('itemData'),
                dataSource = impairmentDetailViewModel.get('dataSource');
            
            if($("#tookCare").is(':checked')) {
                itemData.set('Fixed', true);
                if($("#correctImpairmentDetails").val() == '') {
                    // alert("need correct description")
                    document.getElementById("warningPopUpTextNcr").innerHTML = app.impairmentDetailView.get('strings').warningMessage.needDescription;
                    $("#warningPopUpClosrNcr").kendoMobileModalView("open");
                    return;
                }
                if($("#correctImpairmentDate").val() == '') {
                    // alert("need correct date")
                    document.getElementById("warningPopUpTextNcr").innerHTML = app.impairmentDetailView.get('strings').warningMessage.needDate;
                    $("#warningPopUpClosrNcr").kendoMobileModalView("open");
                    return;
                }
                console.log("document.getElementById('addCapturePhotoCorrectImg').src")
                console.log(document.getElementById("addCapturePhotoCorrectImg").src)
                if(document.getElementById("addCapturePhotoCorrectImg").src == "") {
                    // alert("need correct date")
                    document.getElementById("warningPopUpTextNcr").innerHTML = app.impairmentDetailView.get('strings').warningMessage.needImage;
                    $("#warningPopUpClosrNcr").kendoMobileModalView("open");
                    return;
                }
                if($("#signatureCloseNCR").jSignature("getData") == "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABuCAYAAACdmi6mAAADPUlEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEHjrtgBvYgNGNQAAAABJRU5ErkJggg==") {
                    document.getElementById("warningPopUpTextNcr").innerHTML = app.formDetailView.get('strings').warningMessage.needSignature;
                    $("#warningPopUpClosrNcr").kendoMobileModalView("open");
                    // alert("need signature");
                    return;
                }
            }
            else itemData.set('Fixed', false);
            /// edit properties
            
            itemData.set('Fixdescription', $("#correctImpairmentDetails").val());
            itemData.set('signatureClose', $("#signatureCloseNCR").jSignature("getData"));

            var date = moment($("#correctImpairmentDate").val()).add(8,'h');
            itemData.set('FixDate', date.toString());
            /// start edit form data save
            /// end edit form data save

            function editModel(data) {
                /// start edit form data prepare
                /// end edit form data prepare
                dataSource.one('sync', function(e) {
                      window.plugins.toast.showWithOptions(
                    {
                        message: app.impairmentDetailView.get('strings').toastsMessages.NCRSuccess,
                        duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                        position: "bottom",
                        addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                    }); 
                    /// start edit form data save success
                     var imagefile = $('#addCapturePhotoCorrectImg').attr('src');
                     
                    if(imagefile) {
                        var options = new FileUploadOptions();
                        var imageObj = $.parseJSON(current.CorrectImage) 
                        options.fileKey = "fileContents";
                        options.fileName = "NCR_Correct_image";
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
                        var urlRB = impairmentDetailViewModel._dataSourceOptions.transport.jsdo.url + imageObj.src + "?objName=" + impairmentDetailViewModel._jsdoOptions.name;

                        ft.upload(
                            imagefile,
                            encodeURI(urlRB),
                            onFileUploadSuccess3( ),
                            onFileTransferFail3,
                            options,
                            true);
                    }
                    /// end edit form data save success
                   
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
            parent.set('impairmentDetailViewModel', impairmentDetailViewModel);
            var param = parent.get('impairmentDetailViewModel_delayedFetch');
            if (typeof param !== 'undefined') {
                parent.set('impairmentDetailViewModel_delayedFetch', undefined);
                fetchFilteredData(param);
            }
        });
    } else {
        parent.set('impairmentDetailViewModel', impairmentDetailViewModel);
    }

    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null,
            isListmenu = false,
            backbutton = e.view.element && e.view.element.find('header [data-role="navbar"] .backButtonWrapper'),
            dataSourceOptions = impairmentDetailViewModel.get('_dataSourceOptions'),
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

        $("#noOpenImpairments").hide();
        // if (!impairmentDetailViewModel.get('dataSource')) {
            dataProvider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = impairmentDetailViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions);

                dataSourceOptions.transport.jsdo = jsdo;
                dataSource = new kendo.data.DataSource(dataSourceOptions);
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
                    if(dataSource.data().length == 0) {
                        $("#noOpenImpairments").show();
                        impairmentDetailViewModel.set('dataSource', '');
                    }
                });
               
                impairmentDetailViewModel.set('dataSource', dataSource);

                // fetchFilteredData(param);
            });
        // } else {
        //     fetchFilteredData(param);
        // }

    });
function onFileUploadSuccess3() {
       // alert("onFileUploadSuccess2")
        console.log("onFileUploadSuccess2")
       
        // $("#addCapturePhotoPop").kendoMobileModalView("close");
       
        window.plugins.toast.showWithOptions(
        {
            message: app.impairmentDetailView.get('strings').toastsMessages.uploadImageSuccess,
            duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
            position: "bottom",
            addPixelsY: -40  // added a negative value to move it up a bit (default 0)
        });          
    }

function onFileTransferFail3(error) {
        console.log("FileTransfer Error:");
        console.log(error)
        console.log("Code: " + error.code);
        console.log("Body:" + error.body);
        console.log("Source: " + error.source);
        console.log("Target: " + error.target);
    }
})(app.impairmentDetailView);

// START_CUSTOM_CODE_impairmentDetailViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.impairmentDetailView.impairmentDetailViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.impairmentDetailView.impairmentDetailViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_impairmentDetailViewModel