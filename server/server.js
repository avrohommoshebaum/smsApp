const express = require ('express'); 
const axios = require ('axios');
const cors = require ('cors'); 
const mongoose = require ('mongoose'); 
const twilio = require('twilio');
const { Body } = require('twilio/lib/twiml/MessagingResponse');
require('dotenv').config();
const { send } = require('process');
const contactRoutes = require ('./routes/contactRoutes')
const smsRoutes = require ('./routes/smsRoutes'); 
const fs = require ('fs'); 
const bodyParser = require ('body-parser'); 

const app = express(); 
 

mongoose.connect (process.env.MONGODB_URI)
.then (()=>{
   console.log('database connected')
})
.catch (err => console.error('error connecting to database', err));

const corsOptions = {
    origin: 'http://localhost:5173', // Update this to match the origin of your React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

app.use(
    cors(corsOptions)
)

app.use(express.json())

// Middleware to parse incoming POST request data
app.use(bodyParser.urlencoded({ extended: false }));

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created!');
}


app.use('/api/sms', smsRoutes)
app.use ('/api/contacts', contactRoutes);

const port = 3000; 

app.listen (port, 
    ()=> {console.log (`app is listening on port ${port}`)
}); 

