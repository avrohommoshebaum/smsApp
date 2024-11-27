const express = require ('express'); 
const router = express.Router(); 
const sendTestMessage = require('../utils/smsFunctions/sendTestMessage'); 
const recieveTextMessage = require ('../utils/smsFunctions/recievetextMessage'); 



router.post('/send-test-message', sendTestMessage); 

router.post('/recieveTextMessage', recieveTextMessage); 

module.exports = router; 
