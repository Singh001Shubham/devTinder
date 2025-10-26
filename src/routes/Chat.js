const express = require("express");
const chatRouter = express.Router();

const { Chat } = require("../models/Chat");
const { Authentication } = require("../middlewares/authMiddleware");

chatRouter.get("/chats/:targetUserId",Authentication,async( req , res)=>{
    try{
        let {targetUserId} = req.params;
        // targetUserId.Obj
        const userId = req.User._id.toString();
        console.log(userId);
        let chat = await Chat.findOne({
            participants : {
                $all : [userId,targetUserId]
            }
        }).populate({ path: 'messages.senderId', select: 'firstName lastName' })

        if(!chat){
            chat = await new Chat({
                participants : [userId,targetUserId],
                messages : []
            })
        }
        await chat.save();
        res.json({chat});
    }catch(err){
        console.log("Error : "+err.message);
    }
})

module.exports = {
    chatRouter
}


