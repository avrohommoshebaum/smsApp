const twilio = require('twilio');
const { Body } = require('twilio/lib/twiml/MessagingResponse');
require('dotenv').config();
const { send } = require('process');
const { Router } = require('express');
const { error } = require('console');
const axios = require ('axios')



const sendTestMessage = async (req, res)=>{
    try{
       const contacts =  await axios.get('http://localhost:3000/api/contacts'); 
       const cellNumbers = contacts.data.map(contact => contact.phone.cell); 
      console.log(cellNumbers);
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
for (const number of cellNumbers){
      const {messageBody} = req.body; 
      const message = client.messages.create({
        body: messageBody, 
        from: process.env.TWILIO_PHONE_NUMBER, 
        to: number
      })}
    } catch (error){
        console.error('error getting contacts', error)
    }
}


module.exports =  sendTestMessage