const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilityRelatedfiles/wrapAsync.js");
const listing  = require("../mondels/listing.js");
const multer = require("multer");
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

const {isloggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// to create new listing..
router.get("/new", isloggedIn ,listingController.newListingForm);

router.route("/")
// show all lilstings..
.get(wrapAsync(listingController.index))
// to extract data of new listing
// .post( upload.single("listing[image]"),(req,res)=>{
//   console.log(req.file);
//   res.send(`image uploaded successfully!
// <br><img src="${req.file.path}>`);
// })
.post(
isloggedIn,
validateListing,
upload.single("listing[image]"),
wrapAsync(listingController.newListingSave));

router.route("/search")
.get(listingController.searchListings);

router.route("/:id")
// to show individual listings...
.get(wrapAsync(listingController.showIdListing))
// update route for storing updated individual listing
.patch(
  isloggedIn,
  isOwner,
  upload.single("idInfo[image]"),
  // validateListing,
  wrapAsync(listingController.updateListingSave))

// update route
router.get("/:id/edit",isloggedIn,isOwner, wrapAsync(listingController.updateListingForm))

// Delete route..
router.get("/:id/delete",isloggedIn,isOwner, wrapAsync(listingController.deleteListing))

module.exports = router;