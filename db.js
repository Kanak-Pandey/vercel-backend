const mongoose=require("mongoose");
const { string, number } = require("zod");
mongoose.connect("mongodb+srv://admin:O6wLR1f5oeyM3wwz@cluster0.2hrvold.mongodb.net/paytm");

const userSchema=new mongoose.Schema({
    username:String,
    firstName:String,
    lastName:String,
    password:String

})

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,//reference to User model
        ref:'User',
        required:true

    },
    balance: {
  type: Number,
  required: true
}
})
const Accounts=mongoose.model("Accounts",accountSchema)
const User=mongoose.model("Users",userSchema);
module.exports={
    User,
    Accounts
}