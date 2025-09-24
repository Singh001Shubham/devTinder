const { dbConnect } = require("./config/database")
const express = require("express");

const { adminAuth,userAuth } = require("./middlewares/authMiddleware");
const { User } = require("./models/user");
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

app.post("/signup",async (req,res)=>{
     // console.log({req})
  const newUser = req.body;
  //newUser.time = new Date();
   //console.log(newUser);
   const insert = new User(newUser);
   const p = await insert.save();
   console.log(p);
   res.status(200).send("User Signeup Succcessfully");
})

app.get("/users", async (req,res)=>{
      const parameter = req.body.age;
      try{
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
