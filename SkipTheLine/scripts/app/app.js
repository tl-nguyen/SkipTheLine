var app = (function (window) {
    'use strict';

    // Global error handling
    var showAlert = function (message, title, callback) {
        navigator.notification.alert(message, callback || function () {}, title, 'OK');
    };

    var showError = function (message) {
        showAlert(message, 'Error occured');
    };

    window.addEventListener('error', function (e) {
        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        showAlert(message, 'Error occured');

        return true;
    });

    // Global confirm dialog
    var showConfirm = function (message, title, callback) {
        navigator.notification.confirm(message, callback || function () {}, title, ['OK', 'Cancel']);
    };

    var isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };

    // Handle device back button tap
    var onBackKeyDown = function (e) {
        e.preventDefault();

        app.showConfirm('Do you really want to exit?', 'Exit', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {
                app.helper.logout().then(exit, exit);
            }
        }, 'Exit', ['OK', 'Cancel']);
    };

    function checkConnection() {
        var networkState = navigator.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';

        if(states[networkState] == 'No network connection'){
            app.mobileApp.navigate('views/noConnection.html', 'fade');
        }
    }

    var onDeviceReady = function () {
        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);

        checkConnection();
        
        navigator.splashscreen.hide();
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

    // Initialize Everlive SDK
    var el = new Everlive({
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    });

    var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
        transition: 'slide',
        statusBarStyle: statusBarStyle,
        skin: 'flat'
    });
    var appHelper = {
        resolveImageUrl: function (id) {
            if (id) {
                return el.Files.getDownloadUrl(id);
            } else {
                return '';
            }
        },
        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {
            return kendo.toString(new Date(dateString), 'dddd dd MMM, yyyy hh:mmtt');
        },

        resolveCurrentUser: function () {
            return el.Users.currentUser();
        },
        resolvePlaceById: function (id) {
            return el.data('Place').getById(id);
        },
        resolveCurrentLocation: function () {
            var deferred = new $.Deferred();

            var onSuccess = function (position) {
                deferred.resolve(position);
            };

            var onError = function (error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            };

            navigator.geolocation.getCurrentPosition(onSuccess, onError);

            return deferred.promise();
        },

        // Current user logout
        logout: function () {
            return el.Users.logout();
        }
    };

    return {
        showAlert: showAlert,
        showError: showError,
        showConfirm: showConfirm,
        isKeySet: isKeySet,
        mobileApp: mobileApp,
        everlive: el,
        helper: appHelper,
        currentOrder: []
    };
}(window));