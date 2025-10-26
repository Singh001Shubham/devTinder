const validator = require("validator");
const validateSignupData = (request) =>{

    const { firstName,lastName,emailId,password } = request.body;

    if(!firstName || !lastName){
        throw new Error("first name and last is required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }

     if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
}

const profileEditData = (request)=>{

    const editFields = ["firstName","lastName","age","photo_url","gender","skills"];
    // console.log({editFields});
    const updateProfile = request.body;
    // console.log({updateProfile});
    const isUpdateAllowed = Object.keys(updateProfile).every((keys)=>{
       return editFields.includes(keys);
    })
    //return isUpdateAllowed;

}


module.exports = {
    validateSignupData : validateSignupData ,
    profileEditData : profileEditData
}