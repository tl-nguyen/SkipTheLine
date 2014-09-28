var app = app || {};

app.Home = (function () {
    'use strict';

    return {
        title: 'Home',
        description: 'Time is precious, skip the line ',
        path: './styles/images/logo.jpg',
        imageAlt: 'Skip the line logo',
        onFindNearest: function () {
            //TODO: List all places in radius 1km
            alert('clicked');
            console.log('fdsfdasfds');
        }
    }
}());