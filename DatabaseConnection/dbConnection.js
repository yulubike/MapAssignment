var mongoose = require('mongoose');

function connectdb() {
    mongoose.connect('mongodb://localhost/my_db');
}


function createObject(modelObject, type) {
    modelObject.save(function (err, type) {
        if (err) {
            return { message: "Database error", type: "error" };
        }
        else
            return null
    });
}

module.exports = {
    connectdb,
    createObject
}