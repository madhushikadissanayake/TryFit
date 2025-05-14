// router.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/TailoringController');

//Create router links
router.get('/tailorings', controller.getTailorings);
router.post('/createtailoring', controller.addTailoring);
router.post('/updatetailoring', controller.updateTailoring);
router.post('/deletetailoring', controller.deleteTailoring);
router.get('/getmaxidt', controller.getMaxId);

module.exports = router;
