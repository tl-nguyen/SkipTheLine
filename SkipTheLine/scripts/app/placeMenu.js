var app = app || {};

app.PlaceMenu = (function () {
    'use strict';

    var placeMenuViewModel = (function () {

        var placeId;

        var show = function (e) {

            placeId = e.view.params.id;

            app.Items.items.filter({
                field: 'Place',
                operator: 'eq',
                value: placeId
            });
        };

        return {
            show: show
        }

    }());

    return placeMenuViewModel;
}());