const User = require("../models/user");
const PasswordResetRequest = require("../models/passwordResetRequest");
const { sendEmail } = require("../utils");

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

module.exports.sendResetPasswordRequest = async (req, res, next) => {
  const requestUser = await User.findByUsername(req.body.username);
  if (!requestUser) {
    req.flash("error", "User with that email does not exist.");
    return res.redirect("/resetPassword");
  }
  //check if user already has a request in place
  const checkUserRequest = await PasswordResetRequest.find({
    username: requestUser.username,
  });
  if (checkUserRequest.length) {
    req.flash("error", "You already have a request in progress");
    return res.redirect("/resetPassword");
  }
  const resetRequest = new PasswordResetRequest({
    username: req.body.username,
    completed: false,
    expires: Date.now() + 1000 * 60 * 30,
  });
  await resetRequest.save();
  await sendEmail(
    req.body.username,
    "Password Reset Request",
    `<p>Please click the link below:</p><a href=https://homefolio.up.railway.app/resetPassword/${resetRequest._id}><button>Password Reset</button></a>`
  );
  req.flash(
    "success",
    `Sent password reset request to ${req.body.username}. Please click the link in the email. The request will expire in 30 minutes.`
  );
  res.redirect("/login");
};

module.exports.displayResetPassword = async (req, res) => {
  const requestId = req.params.id;
  console.log(requestId);
  const foundRequest = await PasswordResetRequest.findById(requestId);
  console.log(foundRequest);
  if (!foundRequest) {
    req.flash("error", "Request not found");
    return res.redirect("/login");
  }
  res.render("users/resetPasswordConfirm", { requestId });
};

module.exports.resetPassword = async (req, res) => {
  const requestId = req.params.id;
  const newPassword = req.body.password;
  console.log(requestId);
  console.log(newPassword);
  const foundRequest = await PasswordResetRequest.findById(requestId);
  console.log(foundRequest);
  const user = await User.findByUsername(foundRequest.username);
  console.log(user);
  await user.setPassword(newPassword);
  await user.save();
  await PasswordResetRequest.findByIdAndDelete(foundRequest._id);
  req.flash("success", "Password successfully changed, please log in");
  res.redirect("/login");
};
