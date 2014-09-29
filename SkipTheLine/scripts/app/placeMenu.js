var app = app || {};

app.placeMenu = (function () {
    'use strict';

    function show(e){
            var placeId = e.view.params.id;

            app.items.itemsDataSource.filter({
                field: 'Place',
                operator: 'eq',
                value: placeId
            });

            var menuListViewModel = kendo.observable({
                menuDataSource: app.items.itemsDataSource,
                itemSelected: function (e) {

                    console.log(e.data);
                }
            });

            kendo.bind(e.view.element, menuListViewModel);
    }

    return {
        show: show
    };
}());