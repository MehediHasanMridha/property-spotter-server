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
            agent,
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
            agent,
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
const getAvailableHouse = async (req, res) => {
    const result = await House.find({ status: "available" });
    res.send(result);
};

const getHouseDataByAgency = async (req, res) => {
    const name = req.params.name
    console.log(name);
    const result = await House.find({ agency: { $in: [name] } });
    console.log(result);
    res.send(result);
};
const getHouseListByAdmin = async (req, res) => {
    const result = await House.find({ agency: { $in: ["admin"] } });
    res.send(result);
};
const getHouseListByAgent = async (req, res) => {
    const name = req.params.name;
    const result = await House.find({ agent: name });
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
    const houseData = await House.findOne({ _id: id });
    res.send(houseData);
};
const updateHouseDataByAgent = async (req, res) => {
    try {
        const id = req.params.id
        const upData = req.body
        const agencyName = req.body.agencyName
        const agencyDetails = await userCollection.findOne({name: agencyName, role: "agency"})
        upData.agencyEmail = agencyDetails.email
        upData.agencyImage = agencyDetails.photoURL
        const res = await House.findByIdAndUpdate(id, upData)
        console.log('agency update', res);
        res.status(200).json(res);
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    houseAdd,
    getHouse,
    getAvailableHouse,
    getSpottedList,
    getSpottedListSuccess,
    getSpottedListUnsuccess,
    updateHouseDataByAgent,
    singleHouseDetails,
    getHouseDataByAgency,
    getHouseListByAgent,
    listingsByAgencyAgent,
    getHouseListByAdmin,
    router,
};
