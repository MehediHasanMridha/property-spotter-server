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
        const { name, city, country } = req.body;
        console.log(name, city, country);
        const newArea = new Area({
            name,
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


module.exports = { addAreas, upload }