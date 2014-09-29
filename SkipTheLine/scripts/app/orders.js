var app = app || {};

app.Orders = (function () {
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

                var ordersViewModel = kendo.observable({
                    ordersDataSource: ordersDataSource
                });

                kendo.bind(e.view.element, ordersViewModel);

            });
    }

    return {
        show: show
    }

}());