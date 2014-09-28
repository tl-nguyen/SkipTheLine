var app = app || {};

app.PlaceMenu = (function () {
    'use strict';

    var placeMenuViewModel = (function () {

        var placeId,
            items;

        var show = function (e) {

            placeId = e.view.params.id;

            app.Items.items.filter({
                field: 'Place',
                operator: 'eq',
                value: e.view.params.id
            });
        };

        return {
            show: show
        }

    }());

    return placeMenuViewModel;
}());