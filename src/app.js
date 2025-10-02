const { dbConnect } = require("./config/database")
const express = require("express");

const { adminAuth,userAuth,Authentication } = require("./middlewares/authMiddleware");



const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

const { authRouter } = require('./routes/Auth');
const { profileRouter } = require("./routes/Profile");
const { conectionRouter } = require("./routes/Request");
const { userRouter } = require("./routes/User");




// app.use("/users",(req,res,next)=>{
//       //res.send("first Response!");
//       next();

// },(req,res)=>{
//       res.send("2nd Response!");
// })
// app.use("/users",userAuth , (req, res) => {
//       res.send('Welcome to response users!');
// });
app.use(express.json());
app.use(cookieParser());
app.use("/admin",adminAuth);
app.use("/users",userAuth);
// app.use("/users",userAuth,(req,res)=>{
//       res.send("Hi USers")
// });

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',conectionRouter);
app.use('/',userRouter);
// app.use("/request/review",conectionRouter);

app.get("/admin/test",(req, res) => {// you can remove userAuth from here as it is getting checked in line 15 and 16
      res.send('Welcome to the admin Page!');
}); 

app.get("/users/test",(req, res) => {// you can remove userAuth from here as it is getting checked in line 15 and 16
      res.send('Welcome to the users homepage!');
});// anything that matches after slash will come under this if you put it on top



dbConnect().
then((res)=>
{
      console.log("connection established");
      app.listen(3000,()=>{
      console.log("Server is succesfully listening on port 3000.");
      }); 
})
.catch((err)=>console.err);
// vaidation of data
//encrypt the password before storing it to database






