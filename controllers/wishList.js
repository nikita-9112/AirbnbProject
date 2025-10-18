
const e = require("connect-flash");
const listing  = require("../mondels/listing.js");
const review = require("../mondels/user.js");

module.exports.wishListAdd = async(req,res)=>{
  const userId = await user.findByIdd(req.user._id);
  const listingId = await req.params._id;

  const index = user.wishList.indexOf(listingId);
  let added = false;

  if(index === -1){
    user.wishList.push(listingId);
    added = true;
    req.flash("success","added successfully");
  }
  else{
    user.wishList.splice(index,1);
    req.flash("success","removed!!");

  }

  await user.save();
  res.json({added})
}