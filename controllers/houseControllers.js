const House = require("../models/house");
const express = require("express");
const userCollection = require("../models/users");
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
            description,
            houseOwnerName,
            houseOwnerEmail,
            houseOwnerPhone,
            agency,
            propertyType,
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
            description,
            houseOwnerName,
            houseOwnerEmail,
            houseOwnerPhone,
            agency,
            propertyType,
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
const getSpottedList = async (req, res) => {
    const email = req.params.email;
    const result = await House.find({ spooterEmail: email });
    res.send(result);
};
const getSpottedListSuccess = async (req, res) => {
    const email = req.params.email;
    const result = await House.find({
        $and: [{ spooterEmail: email }, { status: "sold" }],
    });
    res.send(result);
};
const getSpottedListUnsuccess = async (req, res) => {
    const email = req.params.email;
    const result = await House.find({
        $and: [{ spooterEmail: email }, { status: "pending" }],
    });
    res.send(result);
};
const listingsByAgencyAgent = async (req, res) => {
    const name = req.params.name;
    const result = await House.find({ agency: { $in: [name] } });
    res.send(result);
};

const singleHouseDetails = async (req, res) => {
    const id = req.params.id;
    const houseData = await House.findById(id);
    const agencyName = await houseData.agency[0];

    const agencyDetails = await userCollection.findOne({ name: agencyName });
    
    const result = houseData
    result.agencyName = agencyDetails.name
    result.agencyEmail = agencyDetails.email
    result.agencyImage = agencyDetails.photoURL
    
    console.log(result);
    res.send(result);
};

module.exports = {
    houseAdd,
    getHouse,
    getSpottedList,
    getSpottedListSuccess,
    getSpottedListUnsuccess,
    singleHouseDetails,
    listingsByAgencyAgent,
    router,
};
