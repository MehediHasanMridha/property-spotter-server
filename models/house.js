const mongoose = require('mongoose');

// Define schema
const houseSchema = new mongoose.Schema({
    spooterName: {
        type: String,
        required: true
    },
    spooterEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    bedroom: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    bathroom: {
        type: String,
        required: true
    },
    sellTime: {
        type: String,
        required: true
    },
    houseOwnerName: {
        type: String,
        required: true
    },
    houseOwnerEmail: {
        type: String,
        required: true
    },
    houseOwnerPhone: {
        type: String,
        required: true
    },
    agency: {
        type: [String],
        required: true
    }
});

// Create model
const House = mongoose.model('House', houseSchema);

module.exports = House;
