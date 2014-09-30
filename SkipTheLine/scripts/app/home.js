var app = app || {};

app.home = (function () {
    'use strict';
    var DEFAULT_DISTANCE = 5,
        DEFAULT_DISTANCE_MEASURE = 'km',
        DESCRIPTION_MESSAGE = 'Time is precious, skip the line ',
        DEFAULT_LOGO_PATH = './styles/images/logo.jpg',
        IMAGE_ALT = 'Skip the line logo';

    var greeting = function () {
        return 'Hello ' + app.Users.currentUser.get('data').DisplayName;
    };

    var onFindNearest = function () {
        app.helper.resolveCurrentLocation()
            .then(function (position) {

                var query = new Everlive.Query();
                query.where().nearSphere('Location', [position.coords.longitude, position.coords.latitude], DEFAULT_DISTANCE, DEFAULT_DISTANCE_MEASURE);

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
                        app.showError(JSON.stringify(error));
                    });
            });
    };

    return {
        description: DESCRIPTION_MESSAGE,
        path: DEFAULT_LOGO_PATH,
        imageAlt: IMAGE_ALT,
        nearestPlacesDataSource: null,
        greeting: greeting,
        onFindNearest: onFindNearest
    }
}());