module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('You are not logged in!')
        return res.redirect('/login');
    }
    next();
}

module.exports.isNotLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('You cannot be logged in!')
        return res.redirect('/items');
    }
    next();
}