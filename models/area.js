// models/Area.js
const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
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
