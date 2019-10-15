var Place = require('./PlacesModel');
var dbConnection = require('../DatabaseConnection/dbConnection');

function getAllPlaces(apiVersion, req, res, next) {
    Place.find(function(err, response){
        if (!err)
            res.status(200).send(response);
        else
            res.status(400).send({"error":"Failed to save, check data type" + err});
     });
    
}

function getPlaceWithId(apiVersion, req, res, next) {
    Place.findById(req.params.id, function(err, response){
        if (!err)
            res.status(200).send(response);
        else
            res.status(400).send({"error":"Failed to save, check data type" + err});
     });
}

function createPlace(apiVersion, req, res, next) {
    var placesInfo = req.body; //Get the parsed information
    if(!placesInfo.title || !placesInfo.latitude || !placesInfo.longitude){
        res.status(400).send({"error":"Params Missing"});
     } else {
        var place = new Place({
           title: placesInfo.title,
           latitude: placesInfo.latitude,
           longitude: placesInfo.longitude,
           description: placesInfo.description
        });
        if (!dbConnection.createObject(place, Place)) {
            res.status(200).send(place);
        } else {
            res.status(400).send({"error":"Failed to save, check data type"});
        }
    }
}

function updatePlaceWithId(apiVersion, req, res, next) {
    Place.findByIdAndUpdate(req.params.id, req.body, 
        function(err, response){
            if (!err)
                res.status(200).send(response);
            else
                res.status(400).send({"error":"Failed to save, check data type" + err});
    });
}
module.exports = {
    getAllPlaces,
    getPlaceWithId,
    createPlace,
    updatePlaceWithId
}