const expres = require('express');
const { houseAdd } = require('../controllers/houseControllers');
const { registration } = require('../controllers/spotter-controler');
const router = expres.Router();

// Importing houseAdd function from controller
router.post('/add', async (req, res) => {
    try {
        const savedHouse = await houseAdd(req.body);
        console.log(savedHouse);
        res.status(201).json(savedHouse);
    } catch (error) {
        console.error('Error adding house:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/registration', async (req, res) => {
    try {
        const spoReg = await registration(req.body);
        console.log(spoReg);
        res.status(201).json(spoReg);
    } catch (error) {
        console.error('Error adding house:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;