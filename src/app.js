const { dbConnect } = require("./config/database")
const express = require("express");

const { adminAuth,userAuth,Authentication } = require("./middlewares/authMiddleware");
const { User } = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
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
app.use(express.json());
app.use(cookieParser());
app.use("/admin",adminAuth);
app.use("/users",userAuth);
// app.use("/users",userAuth,(req,res)=>{
//       res.send("Hi USers")
// });



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

app.post("/signup",async (req,res)=>{
      try{
            validateSignupData(req);
            const { firstName,lastName,emailId,password } = req.body;
            const hashPassword = await bcrypt.hash(password,10);
            
            const insert = new User({
                  firstName,
                  lastName,
                  emailId,
                  password : hashPassword
            });
            const p = await insert.save();
            console.log(p);
            res.status(200).send("User Signeup Succcessfully");
      }catch(err){
            res.status(400).send("Error : "+ err.message)
      }
     
})

app.post("/login",async (req,res)=>{
      try{
           // validateSignupData(req);
            const { emailId,password } = req.body;
            const user = await User.findOne({
                  emailId : emailId
            })
            console.log({user})
            if(!user){
                  res.status(200).send("Email id is not present. Please Signup")
            }else{
                  hashPassword = user.password;
            }
            const isValidPassword = await bcrypt.compare(password,hashPassword);
            if(isValidPassword){
                  const  token = await user.getJwt();
                  console.log(token)
                  res.status(200).cookie('token',token).send("Login Successfully");

            }else{
                  res.status(400).send("In correct password!")
            }
            
      }catch(err){
            res.status(400).send("Error : "+ err.message)
      }
     
})

app.get("/users", Authentication,async (req,res)=>{
     
      try{
            const parameter = req.body.age;
            const p = await User.find({age:parameter})//findOne
            res.status(200).send(p);
      }catch(err){
            res.status(400).send("something Went Wrong !");
      }
      
})

app.delete("/delete", async (req,res)=>{
      const parameter = req.body.userId;
      try{
            const p = await User.findByIdAndDelete(parameter)//findOne
            res.status(200).send("User Deleted Successfully.");
      }catch(err){
            res.status(400).send("something Went Wrong !");
      }
      
})

app.patch("/update", async (req,res)=>{
      const parameter = req.body.userId;
      const data = req.body
      try{
            const p = await User.findByIdAndUpdate(parameter,data,{
                  runvalidators:true
            })//findOne
            res.status(200).send("User Updated Successfully.");
      }catch(err){
            res.status(400).send("something Went Wrong !");
      }
      
})
