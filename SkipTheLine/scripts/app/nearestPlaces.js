var app = app || {};

app.nearestPlaces = (function () {
    'use strict';

    function show(e){

        var nearestPlacesList = kendo.observable({
            nearestPlacesDataSource: app.home.nearestPlacesDataSource,
            placeSelected: function (e) {
                app.mobileApp.navigate('views/placeMenu.html?id=' + e.data.Id);
            }
        });

        kendo.bind(e.view.element, nearestPlacesList);
    }

    return {
        show: show
    };
}());