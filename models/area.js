// models/Area.js
const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

const Area = mongoose.model('Area', areaSchema);

module.exports = Area;
