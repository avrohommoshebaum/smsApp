
const { twiml: { MessagingResponse } } = require('twilio');



const recieveTextMessage = async  (req, res) => {
  const twiml = new MessagingResponse();

  // Extract the message and sender info from the request
  const incomingMessage = req.body.Body; // SMS content
  const senderNumber = req.body.From;   // Sender's phone number

  console.log(`Message from ${senderNumber}: ${incomingMessage}`);

  // Respond to the sender
  twiml.message('Thank you for your message! We will get back to you soon.');

  // Set the appropriate response headers and return the TwiML response
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}; 

module.exports = recieveTextMessage; 


