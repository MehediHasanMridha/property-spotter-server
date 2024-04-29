const House = require("../models/house");

const houseAdd = async (houseData) => {
    try {
        const { spooterName, bedroom, bathroom, sellTime, houseOwnerName, houseOwnerEmail, houseOwnerPhone, agency } = houseData;
        const newHouse = new House({
            spooterName,
            bedroom,
            bathroom,
            sellTime,
            houseOwnerName,
            houseOwnerEmail,
            houseOwnerPhone,
            agency
        });
        const savedHouse = await newHouse.save();
        return savedHouse;
    } catch (error) {
        console.error('Error adding house:', error.message);
        throw error;
    }
}

module.exports = { houseAdd }