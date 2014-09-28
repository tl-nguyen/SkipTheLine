var app = app || {};

app.Orders = (function () {
    'use strict';

    return {
        title: 'Order',
        alert: function(e) {
            alert(e.data.name);
        }
    }
}());