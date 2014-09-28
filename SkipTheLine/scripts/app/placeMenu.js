var app = app || {};

app.PlaceMenu = (function () {
    'use strict';

    function show(e){
            var placeId = e.view.params.id;

            app.Items.itemsDataSource.filter({
                field: 'Place',
                operator: 'eq',
                value: placeId
            });

            var menuListViewModel = kendo.observable({
                menuDataSource: app.Items.itemsDataSource,
                itemSelected: function () {
                    console.log('selected');
                }
            });

            kendo.bind(e.view.element, menuListViewModel);
    }

    return {
        show: show
    };
}());