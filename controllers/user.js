const user = require("../mondels/user");
module.exports.signUpForm = (req,res)=>{
  res.render("./users/signUp.ejs");
}

module.exports.signUpDone = async (req,res)=>{
  try{
    let {username,email,password}= req.body;
    // check for the given username or email is already register or not.
    const existUser= await user.findOne({$or: [{email},{username}]});
    if(existUser){
      if(existUser.email === email){
        req.flash("error","This email is already taken !");
      }else{
        req.flash("error","This username is already taken !");
      }
      return res.redirect("/signup")
    }
  //  for strong password which contain a-z 0-9 and special symbols
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\=-\[\]{}:;'"\\,.<>\/?]).{8,}$/;
    if(!passRegex.test(password)){
      req.flash("error","Password must be at least 8 characters long and include [a-z][A-Z][0-9][!@#$%^&.,]");
      return res.redirect("/signup");
    }
    //creation of new user.
    const newUser = new user({email,username});
   
    const regUser= await user.register(newUser,password);
  
    req.login(regUser,(err)=>{
      if(err){
        return next(err);
      }
      else{
        req.flash("success"," Welcome to wanderlasst");
        res.redirect("/listing");
      }
    })
    
  }
  catch(e){
    req.flash("error",e.message);
    res.redirect("/signUp")
  }
  
}

module.exports.loginForm = (req,res)=>{
  res.render("./users/login.ejs");
}

module.exports.loginDone = async(req,res)=>{

  req.flash("success","Welcome back to WanderLast");
  let redirectUrl= res.locals.redirectUrl ||  "/listing";
  console.log("in post login");
console.log(redirectUrl);
  res.redirect(redirectUrl);

}

module.exports.logOut = (req,res)=>{
  req.logout((err)=>{
    if(err){
     return next(err);
    }
    else{
      req.flash("success","you are logged out successfully!!");
      res.redirect("/listing");
    }
  })
}