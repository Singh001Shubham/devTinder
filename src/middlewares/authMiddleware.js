const token = "xyz";
const adminAuth = (err,req,res,next)=>{
    console.log("Admin Auth getting Checked",req.query);  
    const authChecked = token === req.query.token;
    if(!authChecked){
        res.status(401).send("Authorization Issue");
    }else{
        next();
    }

}

const userAuth = (err,req,res,next)=>{
    console.log("User Auth getting Checked",req.query);  
    const authChecked = token === req.query.token;
   console.log(authChecked);
    if(!authChecked){
        res.status(401).send("Authorization Issue");
    }else{
        console.log("control is here");
        next();
    }

}

module.exports = {
    adminAuth,
    userAuth
}