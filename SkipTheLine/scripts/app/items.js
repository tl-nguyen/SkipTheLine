var app = app || {};

app.items = (function () {
    'use strict';

    var itemsViewModel = (function () {
        
        var itemModel = {
            id: 'Id',
            fields: {
                Name: 'Name',
                Description: 'Description',
                Price: 'Price',
                WaitTime:'WaitTime',
                Picture:'Picture',
            },
            PictureUrl: function () {
                    return app.helper.resolveImageUrl(this.get('Picture'));
            },
        };

        var itemsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: itemModel
            },
            transport: {
                typeName: 'Item'
            },
            sort: {
                field: 'Name', dir: 'desc'
            }
        });

        return {
            itemsDataSource: itemsDataSource
        };
    }());

    return itemsViewModel;
}());