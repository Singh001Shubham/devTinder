const { User } = require("../models/user");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const token = "xyz";
const adminAuth = (req,res,next)=>{
    console.log("Admin Auth getting Checked",req.query);  
    const authChecked = token === "xyz";
    if(!authChecked){
        res.status(401).send("Authorization Issue");
    }else{
        next();
    }

}

const userAuth = (req,res,next)=>{
    console.log("!!!!!!!!!!!!!")
    console.log("User Auth getting Checked",req.query);  
    const authChecked = token === "xyz";
   console.log(authChecked);
    if(!authChecked){
        res.status(401).send("Authorization Issue");
    }else{
        console.log("control is here");
        next();
    }

}

const Authentication = async(req,res,next) =>{
try{
      const { token } = req.cookies;
      const decoded_token = await jwt.verify(token, '123');
      console.log({decoded_token});
      if(!decoded_token){
            throw new Error("Invalid Token")
      } 
      console.log({decoded_token});
            const user = await User.findOne({'_id':decoded_token._id});
            if(!user){
                  throw new Error("User Does not exist");
            }
            req.User = user;
            next();
      }catch(err){
            res.status(400).send("Error : "+ err.message);
      }
}

module.exports = {
    adminAuth,
    userAuth,
    Authentication
}