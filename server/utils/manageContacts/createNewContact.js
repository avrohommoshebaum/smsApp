const Contact = require('../../models/contact')

const createNewContact = async (req, res)=>{
    try{
        const {name, phone ,email} = req.body; 
        const contact = new Contact({name, phone, email}); 
        await contact.save(); 
        console.log('contact saved')
        res.status(201).json(contact);
    }catch(error){
        console.error('error adding conatct', error); 
        res.status(500).json({error: 'Internal server error'}); 
    }
}

module.exports = createNewContact 