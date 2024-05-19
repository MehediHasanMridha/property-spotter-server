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
    room: {
        type: String,
    },
    parking: {
        type: Boolean,
    },
    bedroom: {
        type: String,
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
    },
    agentEmail: {
        type: String,
    },
    agentImage: {
        type: String,
    },
    agency: {
        type: [String],
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
