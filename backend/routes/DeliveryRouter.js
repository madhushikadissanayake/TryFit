// router.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/DeliveryController');

//Create router links
router.get('/deliveries', controller.getDeliverys);
router.get('/selected-delivery', controller.getSelectedDelivery);
router.get('/selected-delivery-customer', controller.getSelectedCustomer);
router.post('/create-delivery', controller.addDelivery);
router.post('/update-delivery', controller.updateDelivery);
router.post('/delete-delivery', controller.deleteDelivery);
router.get('/getdelivery-maxid', controller.getDeliveryMaxId);


module.exports = router;