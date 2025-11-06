import express from "express";
const router=express.Router();
import User from "../models/user.js";
import passport from "passport";

router.get("/signUp",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signUp",async(req,res)=>{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","you are registered !");
    res.redirect("/");
});
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",passport.authenticate("local",{failureRedirect:'login',failureFlash:true}),async(req,res)=>{

})
export default router;