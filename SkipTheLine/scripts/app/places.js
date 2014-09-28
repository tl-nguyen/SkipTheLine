var app = app || {};

app.Places = (function () {
    'use strict';

    var placesModel = (function () {

        var placeModel = {
            id: 'Id',
            fields: {
                Name: {
                    field: 'Name',
                    defaultValue: ''
                }
            }
        };

        var placesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: placeModel
            },
            transport: {
                typeName: 'Place'
            },
            change: function (e) {
                if (e.items && e.items.length > 0) {
                    console.log('there are some places');
                } else {
                    console.log('there are no places');
                }
            },
            sort: {
                field: 'Name', dir: 'desc'
            }
        });

        return {
            places: placesDataSource
        };
    }());

    var placesViewModel = (function () {

        var placeSelected = function (e) {
            app.mobileApp.navigate('views/placeMenuView.html?id=' + e.data.id);
        };


        return {
            places: placesModel.places,
            placeSelected: placeSelected,
            //logout: logout
        };
    }());

    return placesViewModel;
}());