const Contact = require ('../../models/contact'); 
const axios  = require('axios')

const viewSingleContact = async (req, res)=>{
    try{
   const {Id} = req.params; 
   const contact = await Contact.findById(Id); 
   console.log(Id)
   res.json(contact); 
    } catch(error){
        console.error('error finding contact', error); 
    }
}

module.exports = viewSingleContact