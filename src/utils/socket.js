const { Chat } = require("../models/Chat");
const socket = require("socket.io");
  const initialiseSocket = (server)=>{
        const io = socket(server, {
            cors: {
            origin: "http://localhost:5173",
            },
        });

        io.on("connection",(socket)=>{
          socket.on("joinChat",({targetUserId,userId})=>{
            const roomId = [targetUserId,userId].sort().join("_");
            console.log({roomId});
            socket.join(roomId);

          })

          socket.on("sendMessage",async({targetUserId,userId,newMessage,firstName})=>{
            try{
              const roomId = [targetUserId,userId].sort().join("_")
              console.log(firstName +" : "+newMessage+" : "+roomId)
              let chat = await Chat.findOne({
                participants : { $all : [targetUserId,userId]}
              })
              if(!chat){
                chat = await new Chat({
                  participants : [targetUserId,userId],
                  messages : []
                })
              }
              console.log({chat})
              chat.messages.push({
                "senderId" : userId,
                "text" : newMessage
              })
              await chat.save();
              io.to(roomId).emit("newMessageReceived",({targetUserId,firstName,newMessage}))
            }catch(err){
              console.log("Error : "+err.message)
            }
          }) 

          socket.on("disconnect",()=>{

          })
        })
  }


module.exports = {
  initialiseSocket
}


  