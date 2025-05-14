// router.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/CustomerController');

//Create router links
router.get('/customers', controller.getCustomers);
router.get('/selected-customer', controller.getSelectedCustomer);
router.post('/create-customer', controller.addCustomer);
router.post('/update-customer', controller.updateCustomer);
router.post('/delete-customer', controller.deleteCustomer);
router.get('/getcus-maxid', controller.getCusMaxId);


module.exports = router;