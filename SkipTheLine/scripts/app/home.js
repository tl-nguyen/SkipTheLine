var app = app || {};

app.home = (function () {
    'use strict';

    return {
        description: 'Time is precious, skip the line ',
        path: './styles/images/logo.jpg',
        imageAlt: 'Skip the line logo',
        greeting: function () {
            return 'Hello ' + app.Users.currentUser.get('data').DisplayName;
        },
        onFindNearest: function () {
            //TODO: Create a view for filtered data
            app.helper.resolveCurrentLocation().then(function (position) {                
                var query = new Everlive.Query();
                query.where().nearSphere('Location', [position.coords.longitude, position.coords.latitude], 14440, 'km');
                var data = app.everlive.data('Place');
                data.get(query)
                    .then(function (data) {
                        console.log(data.result);                        
                        var ds = new kendo.data.DataSource({
                            data: data.result,
                        });
                        console.log(8888);
                        var template = kendo.template("<p>proba</p>");
                        $("#near-listview").append(template);
                        console.log(ds);
                        app.mobileApp.navigate('views/nearest.html');
                        },
                        function (error) {
                            alert(JSON.stringify(error));
                        });
            });


        }
    }
}());