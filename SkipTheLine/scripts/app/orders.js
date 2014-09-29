var app = app || {};

app.orders = (function () {
    'use strict';

    function show(e) {
        app.helper.resolveCurrentUser()
            .then(function (user) {
                var userId = user.result.Id;
                var pictureId = '';

                var ordersModel = {
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
                    CreatedAtFormatted: function () {
                        return app.helper.formatDate(this.get('CreatedAt'));
                    },
                    PictureUrl: function () {
                        return app.helper.resolveImageUrl(this.get('Picture'));
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
                    removeItem: removeItem,
                    processOrder: processOrder
                });

                kendo.bind(e.view.element, ordersViewModel);

                function processOrder() {
                    var success = function(data) {
                        app.everlive.Files.create({
                            Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
                            ContentType: "image/jpeg",
                            base64: data
                        }).then(function (picture) {
                            payOrder(picture.result.Id);
                        });
                    };
                    var error = function() {
                        navigator.notification.alert("Unfortunately we could not add the image");
                    };
                    var config = {
                        destinationType: Camera.DestinationType.DATA_URL,
                        targetHeight: 200,
                        targetWidth: 200
                    };
                    navigator.camera.getPicture(success, error, config);
                }

                function removeItem(e) {
                    var itemName = e.data.name;

                    for(var i = 0; i < app.currentOrder.length; i++)
                    {
                        if (app.currentOrder[i].name == itemName) break;
                    }

                    app.currentOrder.splice(i, 1);
                    currentOrderDataSource.read();
                    calculateOrderTotalPrice();
                }

                function calculateOrderTotalPrice() {
                    var totalPrice = 0;
                    for (var j = 0; j < app.currentOrder.length; j++) {
                        totalPrice += app.currentOrder[j].price;
                    }
                    $("#totalPrice").text("Total: " + totalPrice + "$");
                }

                function payOrder(pictureId) {
                    if (app.currentOrder.length == 0) {
                        return;
                    }

                    var placesIds = getPlacesIds();

                    var data = app.everlive.data('Order');

                    for (var i =0; i < placesIds.length; i++)
                    {
                        var items = '';
                        var orderPrice = 0;
                        var placeName = '';

                        for (var j = 0; j < app.currentOrder.length; j++)
                        {
                            if (app.currentOrder[j].placeId == placesIds[i]) {
                                placeName = app.currentOrder[j].place;
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
                            PlaceName: placeName,
                            Items: items,
                            Price: orderPrice,
                            User: userId,
                            Status: 'Pending',
                            Picture: pictureId
                        }).then(function (data) {
                            console.log(data);
                        });

                        ordersDataSource.read();
                    }

                    app.currentOrder = [];
                    calculateOrderTotalPrice();
                    currentOrderDataSource.read();

                    app.mobileApp.navigate("views/successPayment.html");
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
    }

    return {
        show: show
    }

}());