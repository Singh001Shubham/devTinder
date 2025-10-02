const express = require("express");
const userRouter = express.Router();

const { Authentication } = require("../middlewares/authMiddleware");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");



userRouter.get("/user/pendingRequests", Authentication , async(req,res)=>{
    try{
        const loggedInUser = req.User._id.toString();
        //interested
        const data = await ConnectionRequest.find({
            status : "Interested",
            toUserId : loggedInUser 
        }).populate("fromUserId",["firstName","photo_url","skills"]);

        res.json({"data":data});
    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
})

userRouter.get("/user/connections", Authentication, async(req,res)=>{
    try{
        const loggedInUser = req.User._id.toString();
        const data = await ConnectionRequest.find({
            $or : [
                {status : "Accepted" , fromUserId : loggedInUser},
                {status : "Accepted" , toUserId : loggedInUser }
            ]
        }).populate("fromUserId",["firstName","photo_url","skills"]).populate("toUserId",["firstName","photo_url","skills"]);

        const finalData = data.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({"data" : finalData});
    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
})

userRouter.get("/feeds", Authentication , async(req,res)=>{
    try{

        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 50;
        const skip = (page-1)*limit;
        const loggedInUser = req.User._id.toString();
        const ids = await ConnectionRequest.find({
            $or : [
                { fromUserId : loggedInUser },
                { toUserId : loggedInUser }
            ]
        }).select("fromUserId toUserId");
        console.log({ids})
        const set = new Set([]);
        ids.forEach((id)=>{
            set.add(id.toUserId.toString());
            set.add(id.fromUserId.toString());
        })
        const connectionIds = Array.from(set);
        console.log({connectionIds});
        const feeds = await User.find({
            $and : [
                { _id :{$nin : connectionIds} },
                { _id : { $ne : loggedInUser}}
            ]
        }).select("firstName lastName age photo_url skills").skip(skip).limit(limit);
        res.json({'data': feeds});
    }catch(err){
        res.status(400).send("Error : "+ err.message);
    }
    
})

module.exports = {
    userRouter
}
