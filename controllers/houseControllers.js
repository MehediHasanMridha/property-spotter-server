const House = require("../models/house");
const express = require('express');
const router = express.Router();
const houseAdd = async (houseData, image) => {
    try {
        const {
            spooterName,
            spooterEmail,
            status,
            bedroom,
            address,
            bathroom,
            sellTime,
            houseOwnerName,
            houseOwnerEmail,
            houseOwnerPhone,
            agency,
            propertyType
        } = houseData;
        const newHouse = new House({
            spooterName,
            spooterEmail,
            status,
            bedroom,
            address,
            bathroom,
            sellTime,
            image,
            houseOwnerName,
            houseOwnerEmail,
            houseOwnerPhone,
            agency,
            propertyType
        });
        const savedHouse = await newHouse.save();
        return savedHouse;
    } catch (error) {
        console.error("Error adding house:", error.message);
        throw error;
    }
};

const getHouse = async (req, res) => {
    const result = await House.find();
    res.send(result);
};


module.exports = { houseAdd, getHouse, router };
