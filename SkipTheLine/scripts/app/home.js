var app = app || {};

app.home = (function () {
    'use strict';

    return {
        description: 'Time is precious, skip the line ',
        path: './styles/images/logo.jpg',
        imageAlt: 'Skip the line logo',
        nearestPlacesDataSource: null,
        greeting: function () {
            return 'Hello ' + app.Users.currentUser.get('data').DisplayName;
        },
        onFindNearest: function () {
            app.helper.resolveCurrentLocation()
                .then(function (position) {

                    var query = new Everlive.Query();
                    query.where().nearSphere('Location', [position.coords.longitude, position.coords.latitude], 5, 'km');

                    var data = app.everlive.data('Place');

                    data.get(query)
                        .then(function (data) {
                            var nearestPlaces = [];

                            for (var i = 0; i < data.result.length; i++)
                            {
                                var newPlace = {
                                    Name: data.result[i].Name,
                                    Id: data.result[i].Id
                                };

                                nearestPlaces.push(newPlace);
                            }

                            app.home.nearestPlacesDataSource = new kendo.data.DataSource({
                                data: nearestPlaces
                            });

                            app.mobileApp.navigate('views/nearest.html');
                        },
                        function (error) {
                            alert(JSON.stringify(error));
                        });
            });
        }
    }
}());