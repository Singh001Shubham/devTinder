const { mongoose } = require("mongoose");
const URI = "mongodb+srv://shubhamsingh9933_db_user:Sq65iuvp395OGiNx@devtinder.uxxasmo.mongodb.net/";
async function dbConnect(){
    await mongoose.connect(URI);
}

module.exports ={
    dbConnect
}



