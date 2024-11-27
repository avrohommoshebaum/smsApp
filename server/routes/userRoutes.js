const express = require ('express'); 
const router = express.Router(); 
const {isAuthenticated} = require('../utils/auth'); 
const createNewUser = require ('../utils/managePassportUsers/createNewUser');
const login = require ('../utils/managePassportUsers/login'); 
const currentUser = require ('../utils/managePassportUsers/currentUser'); 
const logout = require ('../utils/managePassportUsers/logout'); 


router.post('/register', createNewUser); 

router.post('/login', login); 

router.get('/currentUser', currentUser); 

router.post('loout', logout); 

module.exports = router; 