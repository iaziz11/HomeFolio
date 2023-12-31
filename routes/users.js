const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const { isLoggedIn } = require("../utils");
const { validateUser, wrapAsync } = require("../middleware");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("users/login");
});
router.get("/resetPassword", (req, res) => {
  res.render("users/resetPassword");
});

router.get("/resetPassword/:id", wrapAsync(users.displayResetPassword));
router.post("/resetPassword/:id", wrapAsync(users.resetPassword));

router.post("/resetPassword", wrapAsync(users.sendResetPasswordRequest));
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/folios",
    failureFlash: "Username or password is incorrect",
  })
);
router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post("/register", validateUser, wrapAsync(users.registerUser));
router.get("/logout", isLoggedIn, users.logoutUser);

module.exports = router;
