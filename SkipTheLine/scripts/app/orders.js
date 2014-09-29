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
                        Status: 'Status',
                        Items: 'Items'
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

                calculateOrderTotalPrice();

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
                        calculateOrderTotalPrice();
                    }
                });

                $("#pay-btn").on('click', payOrder);

                kendo.bind(e.view.element, ordersViewModel);

                function calculateOrderTotalPrice() {
                    var totalPrice = 0;
                    for (var j = 0; j < app.currentOrder.length; j++) {
                        totalPrice += app.currentOrder[j].price;
                    }
                    $("#totalPrice").text("Total: " + totalPrice + "$");
                }

                function payOrder() {
                    if (app.currentOrder.length == 0) {
                        return;
                    }

                    var placesIds = getPlacesIds();

                    var data = app.everlive.data('Order');

                    for (var i =0; i < placesIds.length; i++)
                    {
                        var items = '';
                        var orderPrice = 0;

                        for (var j = 0; j < app.currentOrder.length; j++)
                        {
                            if (app.currentOrder[j].placeId == placesIds[i]) {
                                if (items == '') {
                                    items += app.currentOrder[j].name;
                                }
                                else {
                                    items += ', ' + app.currentOrder[j].name;
                                }
                                orderPrice += app.currentOrder[j].price;
                            }
                        }

                        data.create({
                            Place: placesIds[i],
                            Items: items,
                            Price: orderPrice,
                            User: userId
                        }).then(function (data) {
                            console.log(data);
                        });

                        ordersDataSource.read();
                    }

                    app.currentOrder = [];
                    calculateOrderTotalPrice();
                    currentOrderDataSource.read();

                    app.mobileApp.navigate("#successOrder");
                }

                function getPlacesIds() {
                    var placesIds = [];
                    for(var i = 0; i < app.currentOrder.length; i++)
                    {
                        var currentPlaceId = app.currentOrder[i].placeId;
                        var isExist = false;

                        for(var j = 0; j < placesIds.length; j++)
                        {
                            if (currentPlaceId == placesIds[j]) {
                                isExist = true;
                                break;
                            }
                        }

                        if (!isExist)
                        {
                            placesIds.push(app.currentOrder[i].placeId);
                        }
                    }
                    return placesIds;
                }
            });

        function addImage() {
            var success = function(data) {
                navigator.notification.alert("successful added image to order")
                console.log(data);
            };
            var error = function() {
                navigator.notification.alert("Unfortunately we could not add the image");
            };
            var config = {
                destinationType: Camera.DestinationType.DATA_URL,
                targetHeight: 400,
                targetWidth: 400
            };
            navigator.camera.getPicture(success, error, config);
        }

    }

    return {
        show: show
    }

}());