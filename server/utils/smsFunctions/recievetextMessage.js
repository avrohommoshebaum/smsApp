const twilio = require('twilio');
const { twiml: { MessagingResponse } } = require('twilio');
require('dotenv').config();
const Contact = require('../../models/contact');
const axios = require('axios');

const recieveTextMessage = async (req, res) => {
  const twiml = new MessagingResponse();

  // Extract the message and sender info from the request
  const incomingMessage = req.body.Body; // SMS content
  const senderNumber = req.body.From.replace(/\D/g, ''); // Sanitize sender's phone number
  console.log(senderNumber); 

  console.log(`Message from ${senderNumber}: ${incomingMessage}`);

  try {
    // Fetch the contact based on the sender's phone number
    const senderContact = await Contact.findOne({ 'phone.cell': senderNumber });

    if (!senderContact) {
      twiml.message('Your number is not registered in our system.');
    } else if (senderContact.isAdmin) {
      const sendPrefix = 'Send:';
      if (incomingMessage.startsWith(sendPrefix)) {
        const messageToSend = incomingMessage.slice(sendPrefix.length).trim();
        try {
          const contacts = await axios.get('https://smsapp-nt34.onrender.com/api/contacts');
          const cellNumbers = contacts.data
            .map(contact => contact.phone.cell)
            .filter(cell => cell);

          const accountSid = process.env.TWILIO_ACCOUNT_SID;
          const authToken = process.env.TWILIO_AUTH_TOKEN;
          const client = twilio(accountSid, authToken);

          // Send messages to all contacts
          for (const number of cellNumbers) {
            await client.messages.create({
              body: messageToSend,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: number,
            });
          }
          twiml.message(`The following message has been sent to your contacts: "${messageToSend}"`);
        } catch (error) {
          console.error('There was an issue sending the message:', error);
          twiml.message('Your message failed to send, please try again.');
        }
      } else {
        twiml.message('Invalid command. Please start your message with "Send:" to broadcast.');
      }
    } else {
      twiml.message('You do not have admin privileges to perform this action.');
    }
  } catch (error) {
    console.error('Error processing incoming message:', error);
    twiml.message('An error occurred while processing your request. Please try again.');
  }

  // Set the appropriate response headers and return the TwiML response
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};

module.exports = recieveTextMessage;
