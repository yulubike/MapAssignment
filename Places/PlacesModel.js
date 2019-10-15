var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placesSchema =  new Schema({
    title: String,
    latitude: Number,
    longitude: Number,
    description: String
 }); 
module.exports = mongoose.model('places', placesSchema);