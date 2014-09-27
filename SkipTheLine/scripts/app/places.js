var app = app || {};

app.Places = (function () {
    'use strict';
    
    var placesModel = (function () {
        
        var placeModel = {
            id: 'Id',
            fields: {
                Name: {
                    field: 'Text',
                    defaultValue: ''
                }
            }
        }
        
        var placesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: placeModel
            },
            transport: {
                typeName: 'Place'
            },
            change: function (e) {
                console.log('fdsfdsafdsafs');
                if (e.items && e.items.length > 0) {
                    console.log('there are some places');
                } else {
                    console.log('there are no places');
                }
            },
            sort: { 
                field: 'Name', dir: 'desc' 
            }
        });
        
        return {
            places: placesDataSource
        };
    }());
    
    var placesViewModel = (function () {
        
        var placeSelected = function () {
            
        };
       
        
        return {
            places: placesModel.places,
            placeSelected: placeSelected,
            //logout: logout
        };
    }());
    
    return placesViewModel;
});