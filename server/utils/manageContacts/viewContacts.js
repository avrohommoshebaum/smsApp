const Contact = require ('../../models/contact')
const lodash = require ('lodash')



const viewContacts = async(req, res)=>{
            try{
               const contacts =  await Contact.find({}); 
             const sortedContacts = lodash.sortBy(contacts, ['contact', 'name.last'])
               ; 
                res.json(sortedContacts)
                } catch(error){
                    console.error('failed to get contacts', error); 
                    res.status(500).json({error: 'Internal server error.'})
                }
}

module.exports = viewContacts 