const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken")
const zod=require("zod");
const { User, Accounts } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");


module.exports={
    router
}
//zod to validate inputs
const signUpSchema=zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string(),

})
router.post("/signup",async (req,res)=>{
    const userDetail=req.body
    const parsedUserDetails=signUpSchema.safeParse(userDetail);
    if(parsedUserDetails.success){
        //check if user already signed up
        const user=await User.findOne({
            username:userDetail.username
        })
        if(user){
            return res.json({
                error:"Email aready taken "
            })
        }
        
        const dbUser=await User.create(userDetail);
        //create an account for the user
        await Accounts.create({
            userId:dbUser._id,
            balance:Math.random()*1000
        })
        
        const token=jwt.sign({userId:dbUser._id},JWT_SECRET)
        res.json({
            msg:"User Signed up successfully",
            token:token
        })
    }else{
        res.status(411).json({
            msg:"OOPS! Wrong Inputs"
        })
    }
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({
        _id: req.userId
    },req.body )

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk",async(req,res)=>{
    const filter=req.query.filter || "";
    const users=await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})
const siginSchema=zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post("/signin",async (req,res)=>{
    const body=req.body;
    const parsedBody=siginSchema.safeParse(body);
    if(parsedBody.success){
        const user=await User.findOne({
            username:body.username,
            password:body.password
        })
        if(user){
            const token=jwt.sign({userId:user._id},JWT_SECRET);
            res.json({
                msg:"signed in successfully",
                token:token
            })
            return;
        }
    }else{
        res.json({
            msg:"Error while logging in"
        })
    }
})


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODYwMmFmZjE1ZjFlNGI2Yzc2NTI1YzkiLCJpYXQiOjE3NTExMzI5Mjd9.dzoS1J4M0QxYxhEfrLnzajANBvoarXhtRpKvLo1pHy4