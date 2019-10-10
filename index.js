var express = require('express')
var app = express();

var totoro = require('totoro-node');

var controller = require('./Places/placesController');

app.use('/api', totoro.rain({
    v1: { // this is an API version definition
        active: true, // this parameter are optional but the default value is true when not specified
        deprecated: false, // this parameter are optional but the default value is false when not specified
        endpoints: [
            {
                route: "/test/endpoint",
                method: "GET",
                active: true, // this parameter are optional but the default value is true when not specified
                deprecated: false, // this parameter are optional but the default value is false when not specified
                implementation: controller.dummy
            },
            {
                route: "/another/test/endpoint",
                method: "POST",
                implementation: controller.dummy
            }
        ]
    },
    v2: {
        endpoints: [
            {
                route: "/test/endpoint",
                method: "GET",
                implementation: controller.dummy
            }
        ]
    }
}));
//Other routes here
app.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
 });
app.listen(3000);
//when uploading to cloud
//app.listen(port, [host], [backlog], [callback]])