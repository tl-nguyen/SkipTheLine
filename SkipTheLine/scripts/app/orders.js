var app = app || {};

app.orders = (function () {
    'use strict';

    function show(e) {
        app.helper.resolveCurrentUser()
            .then(function (user) {
                var userId = user.result.Id;

                app.orderHistories.orderHistoriesDataSource.filter({
                    field: 'User',
                    operator: 'eq',
                    value: userId
                });

                var currentOrderDataSource = new kendo.data.DataSource({
                    data: app.currentOrder
                });

                var ordersViewModel = kendo.observable({
                    ordersDataSource: app.orderHistories.orderHistoriesDataSource,
                    currentOrderDataSource: currentOrderDataSource,
                    removeItem: removeItem,
                    processOrder: processOrder
                });

                kendo.bind(e.view.element, ordersViewModel);

                calculateOrderTotalPrice();

                function processOrder() {
                    if (app.currentOrder.length == 0) {
                        app.showAlert("you must add stuffs to order first");
                        return;
                    }

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
                        app.showAlert("Unfortunately we could not add the image");
                    };
                    var config = {
                        destinationType: Camera.DestinationType.DATA_URL,
                        targetHeight: 200,
                        targetWidth: 200
                    };
                    navigator.camera.getPicture(success, error, config);
                }

                function payOrder(pictureId) {
                    var placesIds = getPlacesIds();

                    var data = app.everlive.data('Order');

                    for (var i =0; i < placesIds.length; i++)
                    {
                        var items = '',
                            orderPrice = 0,
                            placeName = '';

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

                        app.orderHistories.orderHistoriesDataSource.read();
                    }

                    app.currentOrder = [];
                    calculateOrderTotalPrice();
                    currentOrderDataSource.read();

                    app.mobileApp.navigate("views/successPayment.html");
                }

                function removeItem(e) {
                    var itemName = e.data.name,
                        i;

                    for(i = 0; i < app.currentOrder.length; i += 1)
                    {
                        if (app.currentOrder[i].name == itemName) break;
                    }

                    app.currentOrder.splice(i, 1);
                    currentOrderDataSource.read();
                    calculateOrderTotalPrice();
                }

                function calculateOrderTotalPrice() {
                    var totalPrice = 0,
                        j;
                    for (j = 0; j < app.currentOrder.length; j += 1) {
                        totalPrice += app.currentOrder[j].price;
                    }
                    $("#totalPrice").text("Total: " + totalPrice + "$");
                }

                function getPlacesIds() {
                    var placesIds = [],
                        i, j;
                    for(i = 0; i < app.currentOrder.length; i += 1)
                    {
                        var currentPlaceId = app.currentOrder[i].placeId;
                        var isExist = false;

                        for(j = 0; j < placesIds.length; j += 1)
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