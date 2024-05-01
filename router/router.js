const expres = require('express');
const { houseAdd } = require('../controllers/houseControllers');
const { registration } = require('../controllers/spotter-controler');
const { addAreas, upload, getAreas,deleteArea } = require('../controllers/areasControllers');
const { addAgency,getAgency,deleteAgency,updateAgencyData } = require('../controllers/agencyController');
const { addAgent,getAgent, deleteAgent, updateAgent } = require('../controllers/agentControllers');
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

// ---------area router-----------
router.post('/add-area', upload.single('image'), addAreas);
router.post('/add-agency', upload.single('image'), addAgency);
router.post('/add-agent', upload.single('image'), addAgent);
router.get('/AreasData', getAreas);
router.get('/agencyData', getAgency);
router.get('/agentData', getAgent);
router.delete('/delete/:id', deleteArea);
router.delete('/deleteAgency/:id', deleteAgency);
router.delete('/deleted/:id', deleteAgent);
router.patch('/update/:id', updateAgent)
router.patch('/:id', updateAgencyData)
module.exports = router;