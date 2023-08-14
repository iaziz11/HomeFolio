const User = require('../models/user');


module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log(`${username}: ${password}`)
        const newUser = new User({ username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            res.redirect('/reminders');
        })
    } catch (e) {
        res.send(e);
    }
}

module.exports.logoutUser = (req, res, next) => {
    console.log('what')
    req.logout((err) => {
        console.log('in logout')
        if (err) {
            console.log(err)
            return next(err);
        }
        console.log('redirecting')
        res.redirect('/login');
    });
}