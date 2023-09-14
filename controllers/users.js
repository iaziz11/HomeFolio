const User = require("../models/user");

module.exports.registerUser = async (req, res, next) => {
  const { fullName, username, password } = req.body;
  const newUser = new User({ fullName, username });
  let registeredUser = undefined;
  try {
    registeredUser = await User.register(newUser, password);
  } catch (e) {
    req.flash("error", "Email is already taken, please try another or log in");
    return res.redirect("/register");
  }
  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/items");
  });
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.redirect("/login");
  });
};
