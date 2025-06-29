const {JWT_SECRET} =require("./config");
const jwt=require("jsonwebtoken");

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    // 1. Check if the header is present and starts with 'Bearer'
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({
            error:"Unauthorized"
        });
    }
    // 2. Extract the token from the header
    const token=authHeader.split(" ")[1];
    try{
        // 3. Verify the token using JWT_SECRET
        const decoded=jwt.verify(token,JWT_SECRET);
        // 4. Attach userId to the request for later use
        if(decoded.userId){
            req.userId=decoded.userId;
            next();
        }else{
            return res.json({
                error:"user not verified"
            })
        }
    }catch(err){
        return res.status(403).json({});
    }

    }
module.exports={
    authMiddleware
}