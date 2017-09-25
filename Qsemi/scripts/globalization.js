
document.addEventListener("deviceready", onDeviceReady, false);
 
function id(element) {
    return document.getElementById(element);
}

function onDeviceReady() {
    
    navigator.splashscreen.hide();
   
    myLanguage = localStorage.getItem("currentLanguage");
                   
 var form = $('#kendoUiMobileApp');
            if(myLanguage)
            {
                switch (myLanguage) {
                    case "en-US":
                        app.localization.set('currentCulture', "en"); if (form.hasClass('k-rtl')) { form.removeClass('k-rtl')}
                        break;
                    case "fr-FR":
                        app.localization.set('currentCulture', "fr"); form.removeClass('k-rtl');
                        break;                                     
                    case "ru-RU":
                        app.localization.set('currentCulture', "ru");  form.removeClass('k-rtl'); 
                        break;
                    case "he-IL":
                    {
                        app.localization.set('currentCulture', "he"); 
                        form.addClass('k-rtl');
                        break;
                    }
                    case "ar-IL":
                        app.localization.set('currentCulture', "ar"); 
                        form.addClass('k-rtl');
                        break;
                        default:
                        app.localization.set('currentCulture', "he"); form.addClass('k-rtl');
                }
            }
            else{
                navigator.globalization.getLocaleName(
                        function (language) {
                            //alert('language: ' + language.value + '\n');
                       
                        switch (language.value) {
                                case "en-US":
                                    app.localization.set('currentCulture', "en"); if (form.hasClass('k-rtl')) { form.removeClass('k-rtl')} 
                                    break;
                                // case "es-US":
                                //     app.localization.set('currentCulture', "es"); if (form.hasClass('k-rtl')) { form.removeClass('k-rtl')} 
                                //     break;
                                case "fr-FR":
                                    app.localization.set('currentCulture', "fr"); form.removeClass('k-rtl'); 
                                    break;                                     
                                case "ru-RU":
                                    app.localization.set('currentCulture', "ru"); form.removeClass('k-rtl'); 
                                    break;
                                case "he-IL":
                                    app.localization.set('currentCulture', "he"); form.addClass('k-rtl');
                                    break;
                                case "ar-IL":
                                    app.localization.set('currentCulture', "ar"); form.addClass('k-rtl');
                                    break;
                                    default:
                                    app.localization.set('currentCulture', "he"); form.addClass('k-rtl');
                            }
                            //  if (language.value=="he-IL" || language.value=="ar-IL")
                            //     form.css({direction: 'rtl'});
                            // else
                            //     form.css({direction: 'ltr'});
      
                        },
                        function () {alert('Error getting language\n');}
                    );
                }
}