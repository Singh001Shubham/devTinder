const express = require("express");
const premiumRouter = express.Router();

const { Authentication } = require("../middlewares/authMiddleware");
const {instance}  = require("../utils/razorpay");
const { Payment } = require("../models/paymentRequest");
const { User } = require("../models/user");
const {paymentType}  = require("../utils/constants");
var { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

premiumRouter.post("/premium/createOrder", Authentication , async (req,res)=>{
    try{
            const order = await instance.orders.create({
            amount: paymentType[req.body.memberShipType]*100, 
            currency: "INR",
            receipt: "order_rcptid_11",
            notes : {
                firstName : req.User.firstName,
                lastName :  req.User.lastName ? req.User.lastName : "Sirname",
                memberShipType : req.body.memberShipType
            }
            });
            
            const fromUserId = req.User._id.toString();
            const CreateOrder = new Payment({
                "fromUserId" : fromUserId,
                "OrderId" : order.id,
                "paymentId" : "",
                "amount" : order.amount,
                "status" : order.status,
                "receipt" : order.receipt,
                "notes" : order.notes,
                 "currency":order.currency

            })
             const p = await CreateOrder.save();
            res.json({...p.toJSON(),emailId:req.User.emailId,key:process.env.RAZORPAY_KEY_ID});
    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
})


premiumRouter.post("/premium/webhook", async(req,res)=>{
    try{
        console.log("ok")
       const webHookSignature = req.get('x-razorpay-signature');
        
       const isValidSignature = validateWebhookSignature(
            JSON.stringify(req.body),
            webHookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        )
        console.log(isValidSignature);
        if(!isValidSignature){
            return res.status(400).send("Invalid Signature");
        }
        // console.log("ok2");
        const OrderId = req.body.payload.payment.entity.order_id;

        const obj = await Payment.findOne({OrderId:OrderId});
        // console.log("ok3");
        // console.log({obj})
        obj.status = req.body.payload.payment.entity.status;

        await obj.save();

        const userId = obj.fromUserId.toString();

        const user = await  User.findOne({_id:userId});

        user.isPremium = true;
        await user.save();

        return res.status(200).send(isValidSignature)
    }catch(err){
        console.log(err.message);
        res.status(400).send("Error : "+err.message)
    }
})

premiumRouter.get("/premium/check",Authentication,async(req,res)=>{
    try{
       const { isPremium } = req.User;
       const userType = isPremium;
       res.json({userType})
    }catch(err){
        res.status(400).send("Error : "+err.message)
    }
})

module.exports = {
    premiumRouter
}