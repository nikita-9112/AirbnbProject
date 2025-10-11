const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");

const listingSchema = mongoose.Schema({
  title:{ type:String,require:true},
  description:{type:String},
  image:{
    type: Object,
    filename:String,
    defult:"ksdjk",
    set:(v)=>v===" "?"defult":v,
    require:false,
  },
  price:Number,
  location:String,
  country:String,
  reviews:[
    {
      type:Schema.Types.ObjectId,ref:"review",
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,ref:"user",
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id:{$in:listing.reviews}})
  }

});

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;