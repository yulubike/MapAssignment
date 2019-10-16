var express = require('express')
var app = express();

var totoro = require('totoro-node');
var bodyParser = require('body-parser')

var controller = require('./Places/placesController');
var dbConnection = require('./DatabaseConnection/dbConnection');
var fileUpload = require('express-fileupload');

dbConnection.connectdb()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/'
  }));

app.use('/api', totoro.rain({
    v1: { // this is an API version definition
        active: true, // this parameter are optional but the default value is true when not specified
        deprecated: false, // this parameter are optional but the default value is false when not specified
        endpoints: [
            {
                route: "/places",
                method: "GET",
                active: true, // this parameter are optional but the default value is true when not specified
                deprecated: false, // this parameter are optional but the default value is false when not specified
                implementation: controller.getAllPlaces
            },
            {
                route: "/places/:id",
                method: "GET",
                active: true, // this parameter are optional but the default value is true when not specified
                deprecated: false, // this parameter are optional but the default value is false when not specified
                implementation: controller.getPlaceWithId
            },
            {
                route: "/places",
                method: "POST",
                active: true, // this parameter are optional but the default value is true when not specified
                deprecated: false, // this parameter are optional but the default value is false when not specified
                implementation: controller.createPlace
            },
            {
                route: "/places/:id",
                method: "PUT",
                active: true, // this parameter are optional but the default value is true when not specified
                deprecated: false, // this parameter are optional but the default value is false when not specified
                implementation: controller.updatePlaceWithId
            },
            {
                route: "/image/:file_name",
                method: "GET",
                active: true, // this parameter are optional but the default value is true when not specified
                deprecated: false, // this parameter are optional but the default value is false when not specified
                implementation: controller.getImage
            }
        ]
    }
}));
//Other routes here
app.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
 });
app.listen(80);
//when uploading to cloud
//app.listen(port, [host], [backlog], [callback]])