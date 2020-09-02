const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
var models = require('../models');
let User = models.User;
const {signin,signup,signout} = require('../controllers/auth')
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator
} = require("../validators/auth.validator");
const {comparePassword} = require("../services/user.service");
const requireLogin = require('../middlewares/requireLogin');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tin.caotrong@gmail.com',
    pass: 'cttinLK1999@'
  }
});

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/signout",signout);
router.post("/reset-password",(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if (err){
      console.log(err)
    }
    const token = buffer.toString("hex")
    console.log("===========token-------",token)
    User.findOne({ where : {email: req.body.email}})
      .then(user=>{
        if (!user){
          return res.status(422).json({error:"User dont exists with that email"})
        }
        
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        console.log("=========user reset token=============", user)
        User.update({resetToken: token}, {where : {id : user.id} }).then(result=>{
          var mailOptions = {
            from: 'tin.caotrong@gmail.com',
            to: user.email,
            subject: 'Reset password email',
            text: 'That was easy!',
            html: `
            <p>You requested for password reset</p>
            <h5>click in this <a href="https://lemon-aid-cookbook.github.io/#/reset/${token}">link</a> to reset password</h5>
            `
          };
          transporter.sendMail(mailOptions,(err,info)=>{
            if (err){
              console.log(err)
            }else {
              res.json({message:"check your email", token: token})
            }
          })
        })
      })
  })
})

router.post('/new-password',requireLogin,(req,res)=>{
  const newPassword = req.body.newPassword
  const oldPassword = req.body.oldPassword
  const confirmPassword = req.body.confirmPassword
  const userId = req.body.userId
  const sentToken = req.body.token
  console.log("every thing", newPassword, oldPassword, confirmPassword, userId)
  if (newPassword!==confirmPassword){
    return res.json(400).json({
      message: "Confirm password does not match!!!"
    })
  }

  User.findOne({where : {id: userId}})
  .then(user=>{
      if(!user){
          return res.status(422).json({error:"Try again session expired"})
      }
      if(!comparePassword(oldPassword,user.password)){
        return res.status(400).json({
          err : "Old Password is wrong!!!"
        })
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined
         console.log("=============User================",user)
         User.update({password : hashedpassword}, {
           where : {id : userId}
         }).then((saveduser)=>{

             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})

router.post('/create-new-password',(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({where: {resetToken:sentToken}})
  .then(user=>{
      // if(!user){
      //     return res.status(422).json({error:"Try again session expired"})
      // }
      console.log("User=======",user)
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined,
         console.log("==========user after hash=====", user)
         User.update({password : hashedpassword}, {
          where : {id : user.id}
          }).then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})



module.exports = router;