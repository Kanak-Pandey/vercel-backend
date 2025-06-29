const express = require('express');
const { authMiddleware } = require('../middleware');
const { Accounts} = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Accounts.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();

    session.startTransaction();
    const {amount,to}=req.body;
    //fetch the account within th transaction
    const account=await Accounts.findOne({
        userId:req.userId
    }).session(session) //Attaches a MongoDB session to this query
    if(!account || account.balance <amount){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"Insufficient Balance"
        })
    }

    const toAccount=await Accounts.findOne({
        userId:to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"Invalid account"
        })
    }

    await Accounts.updateOne({userId:req.userId},
        {$inc:{balance:-amount}}
    ).session(session)
    await Accounts.updateOne({userId:to},
        {$inc:{balance:+amount}}
    ).session(session)

    //commit transaction
    await session.commitTransaction();
    res.json({
        msg:"Transfer successful!"
    })

})



module.exports={
    router
}