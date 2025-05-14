// router.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/PaymentController');

//Create router links
router.get('/payments', controller.getPayments);
router.get('/selected-payment', controller.getSelectedPayment);
router.post('/create-payment', controller.addPayment);
router.post('/update-payment', controller.updatePayment);
router.post('/delete-payment', controller.deletePayment);
router.get('/getpay-maxid', controller.getPayMaxId);


module.exports = router;