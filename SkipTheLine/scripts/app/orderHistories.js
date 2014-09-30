var app = app || {};

app.orderHistories = (function () {
    'use strict';

    var orderHistoriesViewModel = (function () {

        var orderHistoryModel = {
            id: 'Id',
            fields: {
                User: 'User',
                Place: 'Place',
                PlaceName: 'PlaceName',
                Price: 'Price',
                Status: 'Status',
                Items: 'Items',
                Picture: 'Picture'
            },
            createdAtFormatted: function () {
                return app.helper.formatDate(this.get('CreatedAt'));
            },
            pictureUrl: function () {
                var picUrl = app.helper.resolveImageUrl(this.get('Picture'));

                console.log(this.get('PlaceName') + ' - ' + picUrl);

                return picUrl;
            }
        };

        var orderHistoriesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: orderHistoryModel
            },
            transport: {
                typeName: 'Order'
            },
            sort: {
                field: 'CreatedAt', dir: 'desc'
            }
        });

        return {
            orderHistoriesDataSource: orderHistoriesDataSource
        };
    }());

    return orderHistoriesViewModel;
}());