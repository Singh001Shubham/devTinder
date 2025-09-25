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


module.exports = {
    validateSignupData : validateSignupData 
}