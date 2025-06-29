const express=require("express");
const router=express.Router();
const { router: userRouter } = require("../routes/user");
const { router: accountsRouter } = require("../routes/accounts");

router.use("/user", userRouter);
router.use("/accounts", accountsRouter);




module.exports={
    router
}