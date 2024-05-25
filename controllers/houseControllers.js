const House = require("../models/house");
const express = require("express");
const userCollection = require("../models/users");
const router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const houseAdd = async (houseData, image) => {
    try {
        const newData = houseData;
        newData.image = image;
        const newHouse = new House(newData);
        const savedHouse = await newHouse.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_ADMIN,
            subject: `New House Added !`,
            text: `A new house has been added to Property Spotter
            Please review and take any necessary actions.
            
            Thank you,
            The Property Spotter Team
            `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        if (newData.agent) {

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: newData.agentEmail,
                subject: `A New House Assign to You !`,
                text: `A new house has been Assign to You
                Please review and take any necessary actions.
                
                Thank you,
                The Property Spotter Team
                `,
            };
    
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        }

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
    const name = req.params.name;
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
        const id = req.params.id;
        const upData = req.body;
        const agencyName = req.body.agencyName;
        const agencyDetails = await userCollection.findOne({
            name: agencyName,
            role: "agency",
        });
        upData.agencyEmail = agencyDetails.email;
        upData.agencyImage = agencyDetails.photoURL;
        const res = await House.findByIdAndUpdate(id, upData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_ADMIN,
            subject: `New House Updated !`,
            text: `A house has been updated to Property Spotter
            Please review and take any necessary actions.
            
            Thank you,
            The Property Spotter Team
            `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        if (upData.agent) {

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: upData.agentEmail,
                subject: `A New House Assign to You !`,
                text: `A new house has been Assign to You
                Please review and take any necessary actions.
                
                Thank you,
                The Property Spotter Team
                `,
            };
    
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        }

        if (upData.status === 'Sold, Spotter paid' || upData.status === 'approved') {

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: upData.agentEmail,
                subject: `A New House Sold By You !`,
                text: `A new house has been Sold By You
                Please review and take any necessary actions.
                
                Thank you,
                The Property Spotter Team
                `,
            };
    
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        }



        res.status(200).json(res);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

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
