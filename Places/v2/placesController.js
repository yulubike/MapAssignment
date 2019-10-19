var Place = require('../PlacesModel');
var serialize = require('express-serializer');
var placeSerializer = require('../placesSerializer');

function getAllPlaces(apiVersion, req, res, next) {
    if (!req.query.pageSize || !req.query.pageNumber)
        return res.status(400).send({ "error": "Params Missing" });
    var pageSize = parseInt(req.query.pageSize, 10);
    var pageNumber = parseInt(req.query.pageNumber, 10);
    Place.count(
        function (err, count) {
            if (!err) {
                Place.find().skip(pageNumber * pageSize).limit(pageSize).sort( '-createdOn' ).exec(function (err, response) {
                    if (!err)
                        serialize(req, response, placeSerializer.serializePlaceShort).then(json => {
                            var response = {
                                total_count: count,
                                page_size: parseInt(req.query.pageSize, 10),
                                page_number: parseInt(req.query.pageNumber, 10),
                                places: json
                            }
                            res.status(200).send(response);
                        }).catch(next);
                    else
                        res.status(400).send({ "error": "Failed to fetch data from db" + err });
                });
            }
            else
                res.status(400).send({ "error": "Failed to fetch data from db" + err });
        }
    );
}

module.exports = {
    getAllPlaces
}