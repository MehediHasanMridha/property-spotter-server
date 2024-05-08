const expres = require('express');
const { houseAdd, getHouse } = require('../controllers/houseControllers');
const { registration } = require('../controllers/spotter-controler');
const { addAreas, upload, getAreas,deleteArea } = require('../controllers/areasControllers');
const { addAgency,getAgency,deleteAgency,updateAgencyData } = require('../controllers/agencyController');
const { addAgent, getAgent, deleteAgent, updateAgent } = require('../controllers/agentControllers');
const House = require('../models/house');
const router = expres.Router();

router.post('/add', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const image = req.file.filename;
        const savedHouse = await houseAdd(req.body, image);
        console.log(savedHouse);
        res.status(201).json(savedHouse);
    } catch (error) {
        console.error('Error adding house:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id
        const upData = req.body
        console.log(id);
        const res = await House.findByIdAndUpdate(id, upData)
        console.log(res);
        res.status(201).json(id);
    } catch (error) {
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
router.get('/houseData',getHouse)
module.exports = router;