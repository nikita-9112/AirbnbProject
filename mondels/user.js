
const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
  email:{
    type:String,
    require:true,
    unique:true,
  },
  username:{
    type:String,
    require:true,
    unique:true,
  },
  wishList:[{
    type:mongoose.Schema.Types.ObjectId,ref:"listing"
  }]
});
userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("user",userSchema);