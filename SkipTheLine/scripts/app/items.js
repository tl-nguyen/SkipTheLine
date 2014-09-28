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
            autoSync: true,
            type: 'everlive',
            schema: {
                model: itemModel
            },
            transport: {
                typeName: 'Item'
            },
            change: function (e) {
                if (e.items && e.items.length > 0) {
                    $('#items-listview').kendoMobileListView({
                        dataSource: e.items,
                        template: kendo.template($('#placeMenuTemplate').html())
                    });
                } else {
                    $('#items-listview').empty();
                }
            },
            sort: {
                field: 'Name', dir: 'desc'
            }
        });

        return {
            items: itemsDataSource
        };

    }());

    return itemsViewModel;

}());