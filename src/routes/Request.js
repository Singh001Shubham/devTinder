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

         const userExist = await User.findOne({'_id':toUserId});
        // console.log({userExist});
        if(!userExist){
            return res.status(400).send("User is not on Dev Tinder");
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

conectionRouter.post("/request/review/:status/:connectionId",Authentication,async(req,res)=>{
    try{
        const status = req.params.status;
        const connectionId = req.params.connectionId;
        const loggedInId = req.User._id.toString();
        console.log(status,connectionId,loggedInId);
        const statusAllowed = ["Accepted","Rejected"];
        if(!statusAllowed.includes(status)){
            return res.status(400).send("status not allowed "+status)
        }
        const validOperation = await ConnectionRequest.findOne({
            status : 'Interested',
            toUserId : loggedInId,
            _id : connectionId

        })

        if(!validOperation){
            return res.status(400).send("Invalid Review "+connectionId);
        }

         ConnectionRequest.status = status;
         console.log(ConnectionRequest.status);
         const p = await ConnectionRequest.updateOne({_id:connectionId},{status:status});
        // console.log({validOperation})
        res.status(200).json({"message":"Requested "+status , "data" : p})
    }catch(err){
        res.status(400).send("Error : "+ err.message);
    }
})

module.exports = {
    conectionRouter
}