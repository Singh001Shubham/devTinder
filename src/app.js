const express = require("express");

const app = express();


app.use("/test",(req, res) => {
      res.send('Welcome to the test Page!');
}); 

app.use("/",(req, res) => {
      res.send('Welcome to the homepage!');
});


app.listen(3000,()=>{
    console.log("Server is succesfully listening on port 3000.");
});