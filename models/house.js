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
    propertyType:{
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
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
       
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
    agencyName: {
        type: String,
    },
    agencyEmail: {
        type: String,
    },
    agencyImage: {
        type: String,
    },
    agent: {
        type: String,
        required: true
    },
    agency: {
        type: [String],
        required: true
    },
    createDate: {
        type: String,
        required: true,
        default: new Date()
    }
});

// Create model
const House = mongoose.model('House', houseSchema);

module.exports = House;
