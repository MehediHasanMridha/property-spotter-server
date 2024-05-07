const House = require("../models/house");

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
        } = houseData;
        const newHouse = new House({
            spooterName,
            spooterEmail,
            status,
            bedroom,
            address,
            image: image,
            bathroom,
            sellTime,
            houseOwnerName,
            houseOwnerEmail,
            houseOwnerPhone,
            agency,
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
module.exports = { houseAdd, getHouse };
