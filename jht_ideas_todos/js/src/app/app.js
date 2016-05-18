/**
 * Created by jer0dh on 5/11/16.
 */
var mainView = require('./views/mainView.js');
var ideasModel = require('./models/ideasModel.js');
var mainController = require('./controllers/mainController.js');

 //removeIf(production)
console.log('Initializing App');
 //endRemoveIf(production)


//removeIf(production)
console.log('Adding Main View');
//endRemoveIf(production)

jQuery('document').ready(function() {

    ideasModel = ideasModel(jQuery, jhtIdeas);  //initialize model with data from page
    
    mainController = mainController(ideasModel);

    mainView = mainView(ideasModel, mainController);

    mainView.init();
    
    //removeIf(production)
    window.ideasModel = ideasModel;
    //endRemoveIf(production)
});
