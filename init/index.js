const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../mondels/listing.js");

main()
.then(()=>{console.log("connection successful!!");})
.catch((err)=>{console.log(err);})

async function main(params) {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonder")
}

const initDB = async ()=>{
   await  listing.deleteMany();
   initData.data= initData.data.map((obj)=>({...obj,owner:"6836fdb2d3f5ec9731d96180"}))
   await  listing.insertMany(initData.data);
   console.log(`data was initialised!!`);
}
initDB();