const express = require('express');
const router_U = express.Router();  
const controller_U = require('../controllers/FeedbackController');

router_U.post('/createmessage', controller_U.createMessage); 
router_U.get('/getmessage', controller_U.getMessage);
router_U.post('/updatemessage/:id', controller_U.updateMessage);
router_U.post('/deletemessage/:id', controller_U.deleteMessage);
router_U.post('/likefeedback', controller_U.likeFeedback);
router_U.get('/getallfeedback', controller_U.getAllFeedback);

module.exports = router_U;