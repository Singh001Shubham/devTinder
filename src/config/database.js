const { mongoose } = require("mongoose");
const URI = "mongodb://localhost:27017/";

async function dbConnect(){
    await mongoose.connect(URI);
}

module.exports ={
    dbConnect
}



