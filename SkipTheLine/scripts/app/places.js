var app = app || {};

app.Places = (function () {
    'use strict';

    var placesListViewModel = kendo.data.ObservableObject.extend({
        placesDataSource: null,
        init: function () {
            var that = this;

            var placeModel = {
                id: 'Id',
                fields: {
                    Name: {
                        field: 'Name',
                        defaultValue: ''
                    }
                }
            };

            kendo.data.ObservableObject.fn.init.apply(that, []);

            var dataSource = new kendo.data.DataSource({
                type: 'everlive',
                schema: {
                    model: placeModel
                },
                transport: {
                    typeName: 'Place'
                },
                sort: {
                    field: 'Name', dir: 'desc'
                }
            });

            that.set("placesDataSource", dataSource);
        },

        placeSelected: function (e) {
            app.mobileApp.navigate('views/placeMenuView.html?id=' + e.data.id);

            app.helper.resolveCurrentLocation()
                .then(function(position) {
                console.log(position);
            });
        }
    });

    return {
        viewModel: new placesListViewModel()
    };
}());