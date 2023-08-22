const User = require('../models/user');

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            res.redirect('/items');
        })
    } catch (e) {
        res.send(e);
    }
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.log(err)
            return next(err);
        }
        res.redirect('/login');
    });
}