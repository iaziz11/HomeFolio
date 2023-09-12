const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const { isLoggedIn, isNotLoggedIn } = require("../utils");
const { validateUser, wrapAsync } = require("../middleware");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/items",
    failureFlash: "Username or password is incorrect",
  })
);
router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post("/register", validateUser, wrapAsync(users.registerUser));
router.get("/logout", isLoggedIn, users.logoutUser);

module.exports = router;
