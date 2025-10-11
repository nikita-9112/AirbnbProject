
const express = require("express");
const router = express.Router({mergeParams:true});
const user= require("../mondels/user.js");
const wrapAsync = require("../utilityRelatedfiles/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signUpForm)
.post( wrapAsync(userController.signUpDone));

router.route("/login")
.get(userController.loginForm)
.post(
saveRedirectUrl,
passport.authenticate("local",
{failureRedirect:"/login",failureFlash:true }),
wrapAsync(userController.loginDone));

router.get("/logout",userController.logOut);

module.exports = router;