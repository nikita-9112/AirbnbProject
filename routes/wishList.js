
const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utilityRelatedfiles/wrapAsync.js");


const {isloggedIn} = require("../middleware.js");
const wishListController = require("../controllers/wishList.js");

router.post("/",isloggedIn,wrapAsync(wishListController.wishListAdd));

module.exports= router;