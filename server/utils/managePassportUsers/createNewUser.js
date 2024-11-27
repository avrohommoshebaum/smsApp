const User = require ('../../models/user');

const createNewUser = async ( req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        res.status(201).json({ message: 'User registered successfully', user: registeredUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = createNewUser