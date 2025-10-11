const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utilityRelatedfiles/wrapAsync.js");


const {validateReview,isloggedIn,isReviewAuther} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


// reviews
router.post("/",isloggedIn,validateReview,wrapAsync(reviewController.reviewCreation))

// review delete route
router.delete("/:reviewId",isloggedIn,isReviewAuther,wrapAsync(reviewController.reviewDeletion))

module.exports= router;