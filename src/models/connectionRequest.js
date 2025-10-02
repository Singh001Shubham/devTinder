const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    "fromUserId" : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true
    },
    "toUserId" : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    "status" : {
        type: String,
        required : true,
        enum : ["Interested","Ignored","Accepted","Rejected"],
        message : "{VALUE} is Incorrect of status type"
    },
},{timestamps:true})
connectionRequestSchema.index({firstName:1,lastName:1})
connectionRequestSchema.pre('save',function(next) { // this line
    const connectionRequestor = this
    if(connectionRequestor.fromUserId.toString() === connectionRequestor.toUserId.toString()){
         throw new Error("User cant send request to itself");
    }   
    next();
});



const ConnectionRequest =  mongoose.model('ConnectionRequest',connectionRequestSchema)
module.exports = {
    ConnectionRequest
}