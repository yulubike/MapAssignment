var Place = require('./PlacesModel');
var dbConnection = require('../DatabaseConnection/dbConnection');
var serialize = require('express-serializer');
var placeSerializer = require('./placesSerializer');
var fs = require('fs');

function getAllPlaces(apiVersion, req, res, next) {
    Place.find(function (err, response) {
        if (!err)
            serialize(req, response, placeSerializer.serializePlaceShort).then(json => {
                res.status(200).send(json);
            }).catch(next);
        else
            res.status(400).send({ "error": "Failed to fetch data from db" + err });
    });

}

function getPlaceWithId(apiVersion, req, res, next) {
    Place.findById(req.params.id, function (err, response) {
        if (!err)
            serialize(req, response, placeSerializer.serializePlace).then(json => {
                res.status(200).send(json);
            }).catch(next);
        else
            res.status(400).send({ "error": "Failed to fetch data from db" + err });
    });
}

async function createPlace(apiVersion, req, res, next) {
    var placesInfo = req.body; //Get the parsed information
    var image = req.files;
    var savingName;
    if (image) {
        if (image.image.mimetype != 'image/jpeg')
            return res.status(400).send({ "error": "File should be image jepg" });
        if (image.image.size > 500000)
            return res.status(400).send({ "error": "File should be lesser than 500kb" });

        try {
            savingName = await moveFile(image, makeid(16));
        } catch (e) {
            return res.status(500).send(e);
        }
    }
    if (!placesInfo.title || !placesInfo.latitude || !placesInfo.longitude)
        return res.status(400).send({ "error": "Params Missing" });
    else if (placesInfo.latitude > 90 || placesInfo.latitude < -90 || placesInfo.longitude > 180 || placesInfo.longitude < -180)
        return res.status(400).send({ "error": "Lat & long are outside range" });
    else {
        var place = new Place({
            title: placesInfo.title,
            latitude: placesInfo.latitude,
            longitude: placesInfo.longitude,
            description: placesInfo.description
        });
        if (savingName)
            place.image = savingName;
        if (!dbConnection.createObject(place, Place)) {
            serialize(req, place, placeSerializer.serializePlace).then(json => {
                return res.status(200).send(json);
            }).catch(next);
        } else {
            return res.status(400).send({ "error": "Failed to save, check data type" });
        }
    }
}

async function updatePlaceWithId(apiVersion, req, res, next) {
    var image = req.files;
    var savingName;
    if (image) {
        if (image.image.mimetype != 'image/jpeg')
            return res.status(400).send({ "error": "File should be image jepg" });
        if (image.image.size > 500000)
            return res.status(400).send({ "error": "File should be lesser than 500kb" });

        try {
            savingName = await moveFile(image, makeid(16));
        } catch (e) {
            return res.status(500).send(e);
        }
    }
    if (savingName)
        req.body.image = savingName;
    Place.findByIdAndUpdate(req.params.id, req.body,
        function (err, response) {
            if (!err)
                serialize(req, response, placeSerializer.serializePlace).then(json => {
                    res.status(200).send(json);
                }).catch(next);
            else
                res.status(400).send({ "error": "Failed to save, check data type" + err });
        });
}

function getImage(apiVersion, req, res, next) {
    return res.sendFile('/Users/deep/Development/UploadedImages/' + req.params.file_name + '.jpg');
}


function moveFile(file, savingName) {
    return new Promise((res, rej) => {
        file.image.mv('/Users/deep/Development/UploadedImages/' + savingName + '.jpg', function (err) {
            if (err)
                rej(err);
            else
                res(savingName);
        });
    })
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



module.exports = {
    getAllPlaces,
    getPlaceWithId,
    createPlace,
    updatePlaceWithId,
    getImage
}