const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const express = require("express");
const conectionRouter = express.Router();
const { Authentication } = require("../middlewares/authMiddleware");

conectionRouter.post("/request/:status/:toUserId",Authentication,async(req,res)=>{
    const fromUserId = req.User._id.toString();
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    console.log(fromUserId,toUserId,status);
    
   try{  
        const sendStatus = ["Interested","Ignored"];
        if(!(sendStatus.includes(status))){
           return res.status(400).send("Status not Alowed");
        }

         const userExist = await User.findOne({toUserId})
        if(userExist){
            return res.status(400).send("User is noty on Dev Tinder");
        }
        const isPresent = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(isPresent){
            return res.status(400).send("Connection Request already Sent.");
        }
        const manageRequest = new ConnectionRequest({
                  fromUserId,
                  toUserId,
                  status
            });
            const p = await manageRequest.save();
            res.status(200).send("Connection Established Successfully");
   }catch(err){
        res.status(400).send("Error : "+ err.message)
  }
})

module.exports = {
    conectionRouter
}