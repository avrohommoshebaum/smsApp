const passport = require ('passport'); 

const currentUser = async (req, res) => {
    res.json({ user: req.user });
}

module.exports = currentUser; 