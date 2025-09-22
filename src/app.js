const express = require("express");
const { adminAuth,userAuth } = require("./middlewares/authMiddleware");
const app = express();

// app.use("/users",(req,res,next)=>{
//       //res.send("first Response!");
//       next();

// },(req,res)=>{
//       res.send("2nd Response!");
// })
// app.use("/users",userAuth , (req, res) => {
//       res.send('Welcome to response users!');
// });
app.use("/admin",adminAuth);
app.use("/users",userAuth);
// app.use("/users",userAuth,(req,res)=>{
//       res.send("Hi USers")
// });



app.get("/admin/test", adminAuth,(req, res) => {// you can remove userAuth from here as it is getting checked in line 15 and 16
      res.send('Welcome to the admin Page!');
}); 

app.get("/users/test",userAuth,(req, res) => {// you can remove userAuth from here as it is getting checked in line 15 and 16
      res.send('Welcome to the users homepage!');
});// anything that matches after slash will come under this if you put it on top


app.listen(3000,()=>{
    console.log("Server is succesfully listening on port 3000.");
});