// models/Area.js
const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
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

const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;