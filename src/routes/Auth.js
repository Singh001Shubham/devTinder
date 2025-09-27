const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const bcrypt = require('bcrypt');
const { User } = require("../models/user");


authRouter.post("/signup",async (req,res)=>{
      try{
            validateSignupData(req);
            const { firstName,lastName,emailId,password } = req.body;
            const hashPassword = await bcrypt.hash(password,10);
            
            const insert = new User({
                  firstName,
                  lastName,
                  emailId,
                  password : hashPassword
            });
            const p = await insert.save();
            console.log(p);
            res.status(200).send("User Signeup Succcessfully");
      }catch(err){
            res.status(400).send("Error : "+ err.message)
      }
     
})

authRouter.post("/login",async (req,res)=>{
      try{
           // validateSignupData(req);
            const { emailId,password } = req.body;
            const user = await User.findOne({
                  emailId : emailId
            })
            console.log({user})
            if(!user){
                  res.status(200).send("Email id is not present. Please Signup")
            }else{
                  hashPassword = user.password;
            }
            const isValidPassword = await bcrypt.compare(password,hashPassword);
            if(isValidPassword){
                  const  token = await user.getJwt();
                  console.log(token)
                  res.status(200).cookie('token',token).send("Login Successfully");

            }else{
                  res.status(400).send("In correct password!")
            }
            
      }catch(err){
            res.status(400).send("Error : "+ err.message)
      }
     
})

authRouter.post("/logout", async(req,res)=>{
    try{
        res.status(200).cookie('token',null,{expires:new Date()}).send("Logout Successfull");
    }catch(err){
        res.status(400).send("Something Went Wrong!")
    }
})


module.exports = {
    authRouter
}