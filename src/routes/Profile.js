const express = require("express");
const profileRouter = express.Router();
const { User } = require("../models/user");
const { Authentication } = require("../middlewares/authMiddleware");
const { profileEditData } = require("../utils/validation");

profileRouter.get('/profile',Authentication, async(req,res)=>{
    try{
        const parameter = req.User._id.toString();
        console.log({parameter});
        const p = await User.findOne({_id:parameter})
         console.log({p});
        res.status(200).send(p);
    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
})


profileRouter.patch('/profile/edit',Authentication, async(req,res)=>{
    try{
        if(profileEditData(req)==false){
            throw new Error("Invalid update Request.")
        }
        const id = req.User._id.toString();
        console.log({id})
        Object.keys(req.body).forEach((key) => (req.User[key]=req.body[key]));
        //await req.User.save();
        const p =await User.findByIdAndUpdate(id,req.body,{runvalidators:true});//make validations fgor this api as any number of skills can be inserted here
        res.json({"message":"Profile update Succesfully.","data":p})
    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
})

profileRouter.get("/users", Authentication,async (req,res)=>{
     
      try{
            const parameter = req.body.userId;
            console.log({parameter})
            const p = await User.find({})//findOne
            console.log({p})
            res.status(200).send(p);
      }catch(err){
            res.status(400).send("Error : "+ err.message);
      }
      
})

profileRouter.delete("/delete", Authentication, async (req,res)=>{
      const parameter = req.body.userId;
      try{
            const p = await User.findByIdAndDelete(parameter)//findOne
            res.status(200).send("User Deleted Successfully.");
      }catch(err){
            res.status(400).send("something Went Wrong !");
      }
      
})

profileRouter.patch("/update", Authentication,async (req,res)=>{
      const parameter = req.body.userId;
      const data = req.body
      try{
            const p = await User.findByIdAndUpdate(parameter,data,{
                  runvalidators:true
            })//findOne
            res.status(200).send("User Updated Successfully.");
      }catch(err){
            res.status(400).send("something Went Wrong !");
      }
      
})


module.exports = {
    profileRouter
}