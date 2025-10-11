const user = require("../mondels/user");
module.exports.signUpForm = (req,res)=>{
  res.render("./users/signUp.ejs");
}

module.exports.signUpDone = async (req,res)=>{
  try{
    let {username,email,password}= req.body;
    console.log(req.body);
    const newUser = new user({email,username});
    console.log(newUser);
    const regUser= await user.register(newUser,password);
    console.log(regUser);
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