const { mongoose, Schema } = require("mongoose");

const validator = require('validator');
const jwt = require('jsonwebtoken');
/*
const manyValidators = [
  { 
    validator: function(string) {
      // Custom validator to check for a minimum length
      return string && string.length >= 5;
    }, 
    message: 'Username must be at least 5 characters long.'
  },
  { 
    validator: function(string) {
      // Custom validator to allow only letters
      return /^[a-zA-Z]+$/.test(string);
    }, 
    message: 'Username can only contain letters.'
  }
];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: manyValidators // Pass the array of validator objects
  }
});
*/
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
            return validator.isEmail(v);
        },
        message: props => `${props.value} is not a valid email!`
        }
    },
    "password":{
        type : String,
        required:true,
        validate:{
            validator: function(v) {
            return validator.isStrongPassword(v);
        },
        message: props => `${props.value} is not a strong password`
        }   
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
},{timestamps:true});

userSchema.methods.getJwt = async function(){
  const user = this;
  const token = await jwt.sign({_id:this._id}, '123',{expiresIn: '1h'});

  return token;
}
const User = mongoose.model("User",userSchema);
module.exports =  {
    User
}