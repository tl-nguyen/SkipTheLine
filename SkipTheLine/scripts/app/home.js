var app = app || {};

app.home = (function () {
    'use strict';

    return {
        description: 'Time is precious, skip the line ',
        path: './styles/images/logo.jpg',
        imageAlt: 'Skip the line logo',
        greeting: function () {
            return 'Hello ' + app.Users.currentUser.get('data').DisplayName;
        },
        onFindNearest: function () {
            //TODO: List all places in radius 1km
            alert('clicked');
        }
    }
}());