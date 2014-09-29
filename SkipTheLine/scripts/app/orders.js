var app = app || {};

app.orders = (function () {
    'use strict';

    function show(e) {
        app.helper.resolveCurrentUser()
            .then(function (user) {
                var userId = user.result.Id;

                var ordersModel = {
                    id: 'Id',
                    fields: {
                        User: 'User',
                        Place: 'Place',
                        Price: 'Price',
                        Status: 'Status'
                    },
                    CreatedAtFormatted: function () {
                        return app.helper.formatDate(this.get('CreatedAt'));
                    }
                };

                var ordersDataSource = new kendo.data.DataSource({
                    type: 'everlive',
                    schema: {
                        model: ordersModel
                    },
                    transport: {
                        typeName: 'Order'
                    },
                    sort: {
                        field: 'CreatedAt', dir: 'desc'
                    },
                    filter: {
                        field: 'User',
                        operator: 'eq',
                        value: userId
                    }
                });

                var currentOrderDataSource = new kendo.data.DataSource({
                    data: app.currentOrder
                });

                var ordersViewModel = kendo.observable({
                    ordersDataSource: ordersDataSource,
                    currentOrderDataSource: currentOrderDataSource,
                    removeItem: function (e) {
                        var itemName = e.data.name;

                        for(var i = 0; i < app.currentOrder.length; i++)
                        {
                            if (app.currentOrder[i].name == itemName) break;
                        }

                        app.currentOrder.splice(i, 1);
                        currentOrderDataSource.read();
                    }
                });

                kendo.bind(e.view.element, ordersViewModel);
            });
    }

    return {
        show: show
    }

}());