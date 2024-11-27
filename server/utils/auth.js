const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({ error: 'Unauthorized, please login'});
    }
  };
  
  module.exports= {isAuthenticated}