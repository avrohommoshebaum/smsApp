const passport = require ('passport'); 
const passportLocal = require ('passport-local'); 

const logout = async (re, res) => {
    req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
      });
}; 

module.exports = logout 
