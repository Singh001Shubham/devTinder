const token = "xyz";
const adminAuth = (req,res,next)=>{
    console.log("Admin Auth getting Checked",req.query);  
    const authChecked = token === "xyz";
    if(!authChecked){
        res.status(401).send("Authorization Issue");
    }else{
        next();
    }

}

const userAuth = (req,res,next)=>{
    console.log("!!!!!!!!!!!!!")
    console.log("User Auth getting Checked",req.query);  
    const authChecked = token === "xyz";
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