const express = require('express');
const Area = require("../models/area");
const multer = require("multer");
const path = require("path");
const UPLOAD_FOLDER = "./public/image/areas";

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

const addAreas = async (req, res, next) => {
    try {
        console.log('hit this route bro');
        const { city, country } = req.body;
        console.log( city, country);
        const newArea = new Area({
            city,
            country,
            image: req.file.filename,
        });
        const savedArea = await newArea.save();
        res.status(201).json(savedArea);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAreas =async(req, res, next)=>{
    try {
        const areas = await Area.find();
        res.json(areas);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteArea = async (req, res, next) => {
    try {
        const {id} = req.params;
        // console.log(id);

        const deletedArea = await Area.findByIdAndDelete(id);
        if (!deletedArea) {
            return res.status(404).json({ error: 'Area not found' });
        }
        res.json({ message: 'Area deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = { addAreas, getAreas, deleteArea, upload }