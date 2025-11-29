
const listing = require("./mondels/listing.js");
const review = require("./mondels/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const myError = require("./utilityRelatedfiles/expressError.js");
const { error } = require("console");

// joi defining in the form on middleware for listing 
const validateListing =(req,res,next)=>{
  const result =  listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
     let errMsg = error.details.mag((el)=>el.message).join(",");
    throw new myError(400,result.errMsg);
  }
  else {
    next();
  }
}

// joi defining in the form of middleware for review
const validateReview = (req,res,next)=>{
  const result = reviewSchema.validate(req.body);
  if(result.error){
   let errMsg = error.details.mag((el)=>el.message).join(",");
   console.log(result.error);
   throw new myError(400,result.errMsg);
  }
  else{
  next();
  }
}

// const passport = require("passport");
const isloggedIn = (req,res,next)=>{
 console.log("hee");
  if( !req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    console.log("hee2");
    req.flash("error","You must logged in beform creating a listing");
  
    return  res.redirect("/login");
  }
  console.log("hee3");
  next();
}

const saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    return  res.locals.redirectUrl= req.session.redirectUrl;
  }
  next();
}

const isOwner = async (req,res,next)=>{
  let {id} = req.params;
  let reqListing =  await listing.findById(id).populate("owner");
  if( ! res.locals.currentUser._id.equals(reqListing.owner._id)){
    req.flash("error","You are not the owner of this Listing");
    return res.redirect(`/listing/${id}`); 
  }
  next();
}
const isReviewAuther = async (req,res,next)=>{
  let {id,reviewId} = req.params;
  let reqReview =  await review.findById(reviewId).populate("auther");
  if( ! res.locals.currentUser._id.equals(reqReview.auther._id)){
    req.flash("error","You are not the owner of this review");
    return res.redirect(`/listing/${id}`); 
  }
  next();
}


module.exports = {isloggedIn,saveRedirectUrl,isOwner,isReviewAuther,validateListing,validateReview}
