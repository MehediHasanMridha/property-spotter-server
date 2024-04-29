// models/Area.js
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
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

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;
