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
                    app.showAlert('You Have Inserted ' + e.data.Type + ' item "' + e.data.Name + '" in the order', 'Greate Choice');

                    navigator.notification.vibrate();

                    var newItem = {
                        name: e.data.Name,
                        price: e.data.Price,
                        placeId: placeId
                    };

                    app.helper.resolvePlaceById(placeId)
                        .then(function (place) {
                            newItem.place = place.result.Name;
                            app.currentOrder.push(newItem);
                        });
                }
            });

            kendo.bind(e.view.element, menuListViewModel);
    }

    return {
        show: show
    };
}());