const listing= require("../mondels/listing.js");
const user = require("../mondels/user.js")

module.exports.index =  async (req,res)=>{
  try{
    const allListings = await listing.find();
    let wishListIds =[];
  
    if( req.user){
      const userId = user.findById(req.user._id).populate('wishList');
      if(user && user.wishList){
        wishListIds = userId.wishList.map(item=>item._id.toString());
      }
      
    }
    res.render("./listing/index.ejs",{allListings,wishListIds});
  }
  catch(error){
   res.status(500).send("Something went wrong while loading listings");
  }
 
}

module.exports.searchListings = async(req,res)=>{
  let search = req.query.q;
  // spliting multiple keywords 
  const keywords = search.split(" ").filter((k)=> k.trim()!="");
  
  let fields = ["title","description","country","location"];
  let orCondition =[];

  // check for the field accounding to the each keyword.
  keywords.forEach(
    (word)=>{
      fields.forEach(
        (field)=>{
          orCondition.push({
            [field]:{$regex:word, $options:"i"}
          });
        }
      );
    }
  );

  let numFields=["price"];

  // for number field.
  if(!isNaN(search)){
    numFields.forEach(field=>{
      orCondition.push({[field]:Number(search)
      });
    })
  }

 try{
  let allListings = await listing.find({$or:orCondition});
  // console.log(allListings);
  res.render("./listing/index.ejs",{allListings});
 }
 catch (err){
   res.status(500).send(err.message);
 }
}

module.exports.newListingForm = (req,res)=>{
  console.log(res);
  res.render("./listing/new.ejs");
}

module.exports.newListingSave = async (req,res,next)=>{
 
  // if(!req.body.listing){
  //   throw new myError(400,"Send valid data for listing!");
  // }
    let url=  req.file.path;
    let filename = req.file.filename;
    console.log(url," ",filename);
    const newlisting =   new listing(req.body.listing);
    console.log(req.user);
    newlisting.owner= req.user._id;
    newlisting.image={ url ,filename }
    await newlisting.save();
    req.flash("success","New Listing Created!!");
    res.redirect("/listing");
  
  // console.log(req.body);
}

module.exports.showIdListing =async (req,res)=>{
  const {id} = req.params;
  const idInfo =  await listing.findById(id).populate({
    path:"reviews",
      populate:{
        path:"auther",
        model:"user",
        select:"username"
      }
  })
  .populate("owner");
  
  if(!idInfo){
    req.flash("error","Listing you requested, does not exit!");
    res.redirect("/listing")
  }else{
    res.render("./listing/showid.ejs",{idInfo});
  }

}


module.exports.updateListingForm = async(req,res)=>{
  let {id} = req.params;
  const idInfo =  await listing.findById(id);
  
     if(!idInfo){
        req.flash("error","Listing you requested, does not exit!");
        res.redirect("/listing")
      }else{
        let originalImgUrl= idInfo.image.url;
        originalImgUrl= originalImgUrl.replace("/upload","/upload/w_600");
          res.render("./listing/edit.ejs",{idInfo,originalImgUrl});
      }
  }

  module.exports.updateListingSave = async(req,res)=>{
    let {id}= req.params;
      // if(!req.body.listing){
      //   throw new myError(400,"Send valid data for listing!");
      // }
     
      let uplisting =  await listing.findByIdAndUpdate(id,
          {$set:{...req.body}},
          {runValidators:true,new:true},);
          console.log(req.body);
      
      if( typeof req.file !== "undefined")   {
        let url=  req.file.path;
      let filename = req.file.filename;
      uplisting.image = {url,filename};
      await uplisting.save();
      }
      
          req.flash("success","Listing Updated !!");
          res.redirect(`/listing/${id}`);
    }

    module.exports.deleteListing = async (req,res)=>{
      let {id} = req.params;
      await listing.findByIdAndDelete(id);
      req.flash("success","Listing Deleted!!")
      res.redirect("/listing");
      }