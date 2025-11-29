
const e = require("connect-flash");
const listing  = require("../mondels/listing.js");

const User = require("../mondels/user.js");

module.exports.wishListAdd = async(req,res)=>{
try{

  console.log("hi9");
  // console.log(req.user);
  // console.log(req.params._id);

 

  // const userId = await User.findById(req.user._id);
  // const listingId = req.params._id;
 

  // const alreadyAdded = userId.wishList.some(

  //   (id)=>{
  //     if(id !== null){
  //       id.toString() === listingId.toString()
  //     }
      
  //   }
   
  // );
  // if( alreadyAdded){
  //   userId.wishList = userId.wishList.filter(
  //     (id)=> {
  //       if(id !== null){
  //         id.toString() !== listingId.toString() 
  //       }
        
  //     }
  //   );
  //   await userId.save();
  //   return res.json({added:false});
  // }else{
  //   await userId.wishList.push({listingId});
  //   await userId.save();
  //   console.log("added");
  //   return res.json({added : true});
  // }
}catch(error){
  console.log('Error toggleing wishList:',error);
  res.status(500).json({message:"Serve error"});
}
};
