const express = require('express');
const Area = require("../models/area");
const multer = require("multer");
const path = require("path");
const Agency = require('../models/agency');
const UPLOAD_FOLDER = "./public/image/agency";

//----------------------- Multer -----------------//
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        if (file) {
            const fileExt = path.extname(file.originalname);
            const fileName =
                file.originalname
                    .replace(fileExt, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") +
                "-" +
                Date.now();
            console.log("🚀 ~ fileName:", fileName);
            cb(null, fileName + fileExt);
        }
    },
});

const upload = multer({ storage: storage });

const addAgency = async (req, res, next) => {
    try {
        console.log('hit this route bro');
        const { name, city, country } = req.body;
        console.log(name, city, country);
        const newAgency = new Agency({
            name,
            city,
            country,
            image: req.file.filename,
        });
        const agency = await newAgency.save();
        res.status(201).json(agency);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getAgency =async(req, res, next)=>{
    try {
        const areas = await Agency.find();
        res.json(areas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteAgency= async (req, res, next) => {
    try {
        const {id} = req.params;
        // console.log(id);

        const deletedArea = await Agency.findByIdAndDelete(id);
        if (!deletedArea) {
            return res.status(404).json({ error: 'Agency not found' });
        }
        res.json({ message: 'Agency deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { addAgency,getAgency,deleteAgency, upload }