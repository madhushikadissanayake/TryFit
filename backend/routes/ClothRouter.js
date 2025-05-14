// router.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/ClothController');

//Create router links
router.get('/cloths', controller.getCloths);
router.post('/createcloth', controller.addCloth);
router.post('/updatecloth', controller.updateCloth);
router.post('/deletecloth', controller.deleteCloth);
router.get('/getmaxid', controller.getMaxId);


module.exports = router;
