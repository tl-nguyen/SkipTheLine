var app = app || {};

app.Items = (function () {
    'use strict';

    var itemsViewModel = (function () {
        var itemModel = {
            id: 'Id',
            fields: {
                Name: {
                    field: 'Name',
                    defaultValue: ''
                },
                Description: {
                    field: 'Description',
                    defaultValue: ''
                },
                Price: {
                    field: 'Price',
                    defaultValue: ''
                }
            }
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