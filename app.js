if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


// console.log(process.env.SECRETE);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const myError = require("./utilityRelatedfiles/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const user = require("./mondels/user.js");


const ListingRoute = require("./routes/listing.js");
const ReviewRoute = require("./routes/review.js");
const UserRoute = require("./routes/user.js");
const wishListRoute = require("./routes/wishList.js");
const { number } = require("joi");
const { error } = require("console");

app.engine("ejs",engine);
app.set("views engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

// dataBase initialisation
const db_url = process.env.ATL_URL;



main()
.then(()=>{console.log("connection successful!!");})
.catch((err)=>{console.log(err);})

  async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonder");

  
}
// const store = MongoStore.create({
//   mongoUrl: db_url,
//   crypto:{
//     secret: process.env.SECRET,
//   },
//   touchAfter : 24*3600 , //in is given in seconds . it store the authantication information for that time.
// });
const sessionOptions = {
  // store:store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}
// store.on("error", ()=>{
//   console.log("Error in mongo session store",error);
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use( new localStrategy(user.authenticate()));


passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})


// app.get("/demo",async (req,res)=>{
//   let fakeUser = new user({
//     email:"fakeuser@gmail.com",
//     username:"delta-student",
//   });
//   let regUser= await user.register(fakeUser,"helloworld");
//   res.send(regUser);
// })

app.use("/listing",ListingRoute);
app.use("/listing/:id/review",ReviewRoute);
app.use("/",UserRoute);
app.use("/listing",wishListRoute);

// error handeling...
app.use((err,req,res,next)=>{
 let {status=500,message= "SOMETHING WENTS WRONG"}= err;
 res.render("./listing/err.ejs",{err});
 //  res.status(status).send(message);

})


app.listen(3000,()=>{
  console.log(`port is listeining on port 3000`);
})