const express = require('express');
const router_U = express.Router();  
const controller = require('../controllers/CartController');

router_U.post('/createcart', controller.createCart); 
router_U.get('/getcart', controller.getCart);
router_U.post('/updatecart', controller.updateCart);
router_U.post('/deletecart', controller.deleteCart);

module.exports = router_U;