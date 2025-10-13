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
  let redirectUrl= res.locals.redirectUrl || "/listing";
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