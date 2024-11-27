const express = require('express'); 
const router = express.Router(); 
const {isAuthenticated} = require('../utils/auth');  
const createNewContact = require ('../utils/manageContacts/createNewContact')
const viewContacts = require ('../utils/manageContacts/viewContacts')
const deleteContact = require ('../utils/manageContacts/deleteContact'); 
const viewSingleContact = require ('../utils/manageContacts/viewSingleContact'); 
const editContact = require ('../utils/manageContacts/editContact')
const xlsxFileUpload = require('../utils/xlsxFileUpload');
const uploadExcelContactList = require ('../utils/manageContacts/uploadExcelContactList')



router.post('/newcontact', createNewContact)

router.post('/upload', xlsxFileUpload.single('file'), uploadExcelContactList); 

router.get('/', viewContacts)

router.get('/:Id', viewSingleContact); 

router.put('/:Id', editContact); 

router.delete('/:Id', deleteContact); 

module.exports = router; 