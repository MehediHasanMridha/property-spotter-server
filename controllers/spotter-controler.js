const Spooter = require("../models/spooter-registration");

const registration = async (spotterData) => {
    try {
        const { name, email, password } = spotterData;
        const newSpotter = new Spooter({
            name, email, password
        });
        const spooter = await newSpotter.save();
        return spooter;
    } catch (error) {
        console.error('Error adding house:', error.message);
        throw error;
    }
}

module.exports = { registration }