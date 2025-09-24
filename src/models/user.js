const { mongoose, Schema } = require("mongoose");

const userSchema = new mongoose.Schema({

    "firstName":{
        type : String,
        required:true
    },
    "lasttName":{
        type : String
    },
    "emailId":{
        type : String,
        required : true,
        unique : true,
        minlength:6,
        maxlength:30,
        validate: {
        validator: function(v) {
            return v.includes("@");;
        },
        message: props => `${props.value} is not a valid email!`
        }
    },
    "password":{
        type : String,
        required:true,
        lowercase:true   
    },
    
    "age":{
        type : Number
    },
    "gender": {
        type : String,
        enum: ['M', 'F','others'],
    },
    "photo_url": {
        type : String,
        default:"https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
    },
     "skills": {
        type : [String]
    }
},{timestamps:true})
const User = mongoose.model("User",userSchema);
module.exports =  {
    User
}