const passport = require('passport'); 
const localStrategy = require ('passport-local'); 

const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    
        req.login(user, (err) => {
          if (err) return next(err);
          res.json({ user });
        });
      })(req, res, next);
}; 

module.exports = login 