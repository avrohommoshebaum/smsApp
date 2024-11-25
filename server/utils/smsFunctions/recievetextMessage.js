
const { twiml: { MessagingResponse } } = require('twilio');
const Contact = require('../../models/contact');
const axios = require ('axios'); 


const recieveTextMessage = async  (req, res) => {
  const twiml = new MessagingResponse();

  // Extract the message and sender info from the request
  const incomingMessage = req.body.Body; // SMS content
  const senderNumber = req.body.From;   // Sender's phone number

  console.log(`Message from ${senderNumber}: ${incomingMessage}`);

  const adminNumber = '+1 7325514480'; 
  const sendPrefix = 'Send:'; 

    if (incomingMessage.startsWith(sendPrefix)){
        const messageToSend = incomingMessage.slice(sendPrefix.length).trim()
        try{
            const contacts = await axios.get('/contacts'); 
            const cellNumbers = contacts.data.map(contact => contact.phone.cell).filter(cell => cell); 

            for (const number of cellNumbers){
                await Client.message.create({
                    body: messageToSend, 
                    from: process.env.TWILIO_PHONE_NUMBER, 
                    to: number
                })
            }
            twiml.message(`The following message has been sent to your contacts: "${messageToSend}"`);
        } catch (error){
            console.error('there was an issue sending message from admin phone', error); 
            twiml.message('Your message failed to send, please try again')
        }
    }

  // Respond to the sender
  twiml.message('Thank you for your message! We will get back to you soon.');

  // Set the appropriate response headers and return the TwiML response
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}; 

module.exports = recieveTextMessage; 


