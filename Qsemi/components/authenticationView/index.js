'use strict';

app.authenticationView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('authenticationView');

// START_CUSTOM_CODE_authenticationView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_authenticationView
(function(parent) {
    var provider = app.data.qcsemidataProvider,
        currentUser, currentWorker,
        jsdoOptions = {
             name: 'OurUserLocationSEMI',
             //name: 'OurUserLocation',
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
                 if(type == "read")
                {
                    currentUser = response.data[0];
                    authenticationViewModel.current_User = response.data[0];
                   console.log("currentUser")
                   console.log(currentUser)
                }
            },
             schema: {
                 model: {
                     fields: {
                         'name': {
                             field: 'name',
                             defaultValue: ''
                         },
                         'id': {
                             field: 'id',
                             defaultValue: ''
                         },
                     }
                 }
             }, serverFiltering: true,
         },
        
        dataSource = new kendo.data.DataSource({
            pageSize: 50
        }),

        signinRedirect = 'projectDetailView',
        rememberKey = 'qcsemidataProvider_authData_authenticationViewModel',
        init = function(error, result) {
            $('.status').text('');

            if (error) {
                if (error.message) {
                    $('.status').text(error.message);
                }
                try {
                    var err = '';
                    if (result === progress.data.Session.AUTHENTICATION_FAILURE) {
                        err = 'Login failed. Authentication error.';
                    } else if (result === progress.data.Session.GENERAL_FAILURE) {
                        err = 'Login failed. Unspecified error.';
                    }

                    $('.status').text(err);
                } catch (e) {}

                return false;
            }

            var activeView = '.signin-view',
                model = parent.authenticationViewModel;

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.signin-view', 'signup-view').hide();
                $('.offline').show();
            } else {
                $('.offline').hide();

                $(activeView).show();
            }

            if (model && model.set) {
                model.set('logout', null);
            }

            var rememberedData = localStorage ? JSON.parse(localStorage.getItem(rememberKey)) : app[rememberKey];
            if (rememberedData && rememberedData.email && rememberedData.password) {

                parent.authenticationViewModel.set('email', rememberedData.email);
                parent.authenticationViewModel.set('password', rememberedData.password);
                parent.authenticationViewModel.signin();
            }
        },
        successHandler = function(data) {
            var redirect = signinRedirect,
                model = parent.authenticationViewModel || {},
                logout = model.logout;

             provider.loadCatalogs().then(function _catalogsLoaded() {
                var jsdoOptions = authenticationViewModel.get('_jsdoOptions'),
                    jsdo = new progress.data.JSDO(jsdoOptions),
                    dataSourceOptions = authenticationViewModel.get('_dataSourceOptions'),
                    dataSource;

                dataSourceOptions.transport.jsdo = jsdo;

                dataSource = new kendo.data.DataSource(dataSourceOptions);

                dataSource.filter({
                    field: "LoginName",
                    operator: "==",
                    value: localStorage.getItem("name")
                });
             });

            if (logout) {
                model.set('logout', null);
            }
            if (data) {
                if (logout) {
                    provider.Users.logout(init, init);
                    return;
                }
                var rememberedData = {
                    email: model.email,
                    password: model.password
                };
                if (model.rememberme && rememberedData.email && rememberedData.password) {
                    if (localStorage) {
                        localStorage.setItem(rememberKey, JSON.stringify(rememberedData));
                    } else {
                        app[rememberKey] = rememberedData;
                    }
                }

                setTimeout(function() {
                    app.mobileApp.navigate('components/' + redirect + '/view.html');
                }, 0);
            } else {
                init();
            }
        },
        authenticationViewModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            errorMessage: '',
            current_User: '',
            current_Worker: '',
            _jsdoOptions: jsdoOptions,
            _dataSourceOptions: dataSourceOptions,
            validateData: function(data) {
                var model = authenticationViewModel;

                if (!data.email && !data.password) {
                    model.set('errorMessage', app.authenticationView.get('strings').authenticationView.MissingCredentials);//'Missing credentials.');
                    return false;
                }

                if (!data.email) {
                    model.set('errorMessage', app.authenticationView.get('strings').authenticationView.MissingUsernameOrEmail);//'Missing username or email.');
                    return false;
                }

                if (!data.password) {
                    model.set('errorMessage', app.authenticationView.get('strings').authenticationView.MissingPassword);// 'Missing password.');
                    return false;
                }

                return true;
            },
            signin: function() {
                var model = authenticationViewModel,
                    email = model.email.toLowerCase(),
                    password = model.password;
                
                localStorage.setItem("name", email);

                if (!model.validateData(model)) {
                    return false;
                }

                provider.Users.login(email, password, successHandler, init);
            }
        });

    parent.set('authenticationViewModel', authenticationViewModel);
    parent.set('afterShow', function(e) {
        if (e && e.view && e.view.params && e.view.params.logout) {
            if (localStorage) {
                localStorage.setItem(rememberKey, null);
            } else {
                app[rememberKey] = null;
            }
            authenticationViewModel.set('logout', true);
        }
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.authenticationView);

// START_CUSTOM_CODE_authenticationViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_authenticationViewModel