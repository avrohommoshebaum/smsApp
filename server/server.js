const express = require ('express'); 
const axios = require ('axios');
const cors = require ('cors'); 
const mongoose = require ('mongoose'); 
const twilio = require('twilio');
const { Body } = require('twilio/lib/twiml/MessagingResponse');
require('dotenv').config();
const { send } = require('process');
const fs = require ('fs'); 
const bodyParser = require ('body-parser'); 
const {isAuthenticated} = require('./utils/auth'); 
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const MongoStore = require('connect-mongo');
const User = require('./models/user'); 


const contactRoutes = require ('./routes/contactRoutes')
const smsRoutes = require ('./routes/smsRoutes'); 
const userRoutes = require ('./routes/userRoutes'); 


const app = express(); 

// Use express's built-in parser (recommended for modern apps)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

 

mongoose.connect (process.env.MONGODB_URI)
.then (()=>{
   console.log('database connected')
})
.catch (err => console.error('error connecting to database', err));

const corsOptions = {
    origin: 'http://localhost:5173', // Update this to match the origin of your React app
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
  };

app.use(
    cors(corsOptions)
)

//passport and session middleware 
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // Set to true in production when using HTTPS
      httpOnly: true,
      sameSite: 'lax', // Adjust based on your needs (None, Lax, Strict)
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // Session TTL (24 hours in milliseconds)
  },
  store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60, // Session TTL (optional)
      autoRemove: 'native' // Auto-remove expired sessions (optional)
  })
}));

//midlware to catch of there is a session error 
app.use((err, req, res, next) => {
  console.error('Session setup error:', err);
  // Handle the error or respond accordingly
  res.status(500).send('Session setup failed');
});

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// app.use((req, res, next) => {
//   const bypassRoutes = ['/api/sms', '/api/register', '/api/login']; // Add any routes you want to skip authentication
//   if (bypassRoutes.some(route => req.path.startsWith(route))) {
//     return next(); // Skip authentication for these routes
//   }
//   isAuthenticated(req, res, next);
// });




const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created!');
}


app.use('/api/sms', smsRoutes)
app.use ('/api/contacts', contactRoutes);
app.use('/api', userRoutes); 

const port = 3000; 

app.listen (port, 
    ()=> {console.log (`app is listening on port ${port}`)
}); 

