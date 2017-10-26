document.addEventListener("deviceready", onDeviceReady, false);

function id(element) {
    return document.getElementById(element);
}

function onDeviceReady() {

    navigator.splashscreen.hide();

    cameraApp = new cameraApp();

    cameraApp.run();
}

var lastImg;
function cameraApp() { }

cameraApp.prototype = {
    _pictureSource: null,

    _destinationType: null,

    _sourceType: null,

    run: function () {
        var that = this;
       
        that._pictureSource = navigator.camera.PictureSourceType;
        that._destinationType = navigator.camera.DestinationType;
        that._sourceType = navigator.camera.PictureSourceType;
     
        $('body').on('click', ".capturePhotoButtonClass", function () {
            addEventListener("click", that._capturePhoto.apply(that, arguments, myid = $(this).attr('id')));
        });
    },
    _scan: function () {
        var that = this;
        alert("scan my function");
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function (success) {
            alert("encode success: " + success);
        }, function (fail) {
            alert("encoding failed: " + fail);
        }
        );

    },
 
    _capturePhoto: function () {
        var that = this;
        var capturedPhoto = myid;
        //change photo
        if (capturedPhoto.endsWith("_")) {
            navigator.camera.getPicture(function () {
                that._onPhotoDataSuccess.apply(that, arguments, myid);
            }, function () {
                that._onFail.apply(that, arguments, myid);
            }, {
                    quality: 50,
                    //allowEdit: true,
                    destinationType: that._destinationType.DATA_URL,
                    saveToPhotoAlbum: false,
                    //encodingType: Camera.EncodingType.png,
                    //sourceType: that._sourceType.PHOTOLIBRARY
                });
        }

        else if (document.getElementById(capturedPhoto).style.color != "red") {
            navigator.camera.getPicture(function () {
            var popImg = "#" + capturedPhoto + "Pop";
            document.getElementById(capturedPhoto).style.color = "red";
            that._onPhotoDataSuccess.apply(that, arguments, myid);
            }, function () {
                that._onFail.apply(that, arguments, myid);
            }, {
                    quality: 50,
                    //allowEdit: true,
                    destinationType: that._destinationType.DATA_URL,
                    //encodingType: Camera.EncodingType.png,
                    saveToPhotoAlbum: false,
                    //sourceType: that._sourceType.PHOTOLIBRARY
                });
        }
        else if (document.getElementById(capturedPhoto).style.color == "red") {
            var popImg = "#" + capturedPhoto + "Pop";
            // if(cordova.platformId == "android") {
            //     alert("android")
            //     document.getElementById(capturedPhoto + "Img").css("transform","rotate(90deg)");
            // }
            $(popImg).kendoMobileModalView("open");
        }
    },
    _onPhotoDataSuccess: function (imageData) {
        var capturedPhoto = myid.toString();
        if (capturedPhoto.endsWith("_")) {
            var n = capturedPhoto.length;
            capturedPhoto = capturedPhoto.slice(0, n - 1);
        }

        var imageURI = "data:image/jpeg;base64," + imageData;
       
        // else{
            var addPhoto = document.getElementById(capturedPhoto + 'Img');
            addPhoto.src = imageURI;
        // }
        //crane operation photo edit
        if (document.getElementById(myid).style.color != "red") {
            var text = $('#file' + capturedPhoto);
            text.val(imageURI);
        }
    },
    
    _capturePhotoEdit: function () {
        var that = this;
        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string. 
        // The allowEdit property has no effect on Android devices.
        navigator.camera.getPicture(function () {
            that._onPhotoDataSuccess.apply(that, arguments);
        }, function () {
            that._onFail.apply(that, arguments);
        }, {
                quality: 20,
                //allowEdit: true,
                destinationType: cameraApp._destinationType.FILE_URI,
                saveToPhotoAlbum: false,
                encodingType: Camera.EncodingType.JPEG,
                //sourceType: that._sourceType.PHOTOLIBRARY
            });
    },

    _getPhotoFromLibrary: function () {
        var that = this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.PHOTOLIBRARY);
    },

    _getPhotoFromAlbum: function () {
        var that = this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },

    _getPhoto: function (source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function () {
            that._onPhotoURISuccess.apply(that, arguments);
        }, function () {
            cameraApp._onFail.apply(that, arguments);
        }, {
                quality: 50,
                destinationType: cameraApp._destinationType.FILE_URI,
                saveToPhotoAlbum: false,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: source
            });
    },


    _onPhotoURISuccess: function (imageURI) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';

        // Show the captured photo.
        smallImage.src = imageURI;
    },

    _onFail: function (message) {
        alert(message);
    },


}