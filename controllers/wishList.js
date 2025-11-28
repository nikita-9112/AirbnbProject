
const e = require("connect-flash");
const listing  = require("../mondels/listing.js");
const review = require("../mondels/user.js");
const user = require("../mondels/user.js");

module.exports.wishListAdd = async(req,res)=>{
try{
  if(!req.user){
    return res.status(401).json({message:"please login to continue"});
  }
  const userId = await user.findById(req.user._id);
  const listingId = await req.params._id;
  const alreadyAdded = userId.wishList.some(
    (id)=>id.toString() === listingId.toString()
   
  );
  if( alreadyAdded){
    userId.wishList = userId.wishList.filter(
      (id)=> id.toString() !== listingId.toString()
    );
    await userId.save();
    return res.json({added:false});
  }else{
    userId.wishList.push(listingId);
    await userId.save();
    return res.json({added : true});
  }
}catch(error){
  console.log('Error toggleing wishList:',error);
  res.status(500).json({message:"Serve error"});
}
};
