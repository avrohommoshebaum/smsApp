const Contact = require ('../../models/contact'); 


const deleteContact = async (req, res)=> {
    try{
    const {Id} = req.params
    const deletedContact = await Contact.findByIdAndDelete(Id); 
    if (deletedContact) {
    res.json({Message: "Contact deleted succesfully"}); 
} else {
    res.json({message:'Sorry, errror deleting contact'}); 
}
    }catch (error){
        console.error('Error deleting student', error); 
    }
}

module.exports = deleteContact