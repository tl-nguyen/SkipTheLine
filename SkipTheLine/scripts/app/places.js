(function(global) {
    
    var app = global.app = global.app || {};
    
   var PlacesListViewModel = kendo.data.ObservableObject.extend({
        placesDataSource: null,
        init: function () {
            var that = this;
            
            kendo.data.ObservableObject.fn.init.apply(that, []);
            var places = app.everlive.data('Place');
            var dataSource = new kendo.data.DataSource({
                data:places,
            });            
            that.set("placesDataSource", dataSource);
        },
        showItems: function (e) {
            var that = new PlacesListViewModel();
            
            var data = that.get("placesDataSource");
            
            data.fetch(function() {
                var id = e.view.params.uid;
                var model = data.at(parseInt(id) - 1);
                kendo.bind(e.view.element, model, kendo.mobile.ui);
            });
        },
    });
    
    app.exercises = {
        viewModel: new ExercisesListViewModel(),
    };
    
})(window);