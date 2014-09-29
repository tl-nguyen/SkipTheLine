/**
 * Users model
 */

var app = app || {};

app.Users = (function () {
    'use strict';

    var usersModel = (function () {

        var currentUser = kendo.observable({ data: null });

        // Retrieve current user and all users data from Backend Services
        var loadUsers = function () {

            // Get the data about the currently logged in user
            return app.everlive.Users.currentUser()
            .then(function (data) {

                var currentUserData = data.result;

                currentUser.set('data', currentUserData);

                // Get the data about all registered users
                return app.everlive.Users.get();
            },function (err) {
                    app.showError(err.message);
            });
        };

        return {
            load: loadUsers,
            currentUser: currentUser
        };

    }());

    return usersModel;

}());
