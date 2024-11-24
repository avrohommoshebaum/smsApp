const Contact = require ('../../models/contact'); 

const editContact = async (req, res)=>{
    try{
        const {Id} = req.params; 
        const {name, phone ,email} = req.body; 
        const updatedContact = await Contact.findByIdAndUpdate(Id, {name, phone, email}); 
        res.json(updatedContact); 
    } catch (error){
        console.error('Error updateding contact', error); 
    }
}

module.exports = editContact