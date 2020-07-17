const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
var models = require('../models');
let User = models.User;
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {signin,signup,signout} = require('../controllers/auth')
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator
} = require("../validators/auth.validator");

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
    User.findOne({email: req.body.email})
      .then(user=>{
        if (!user){
          return res.status(422).json({error:"User dont exists with that email"})
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save().then(result=>{
          var mailOptions = {
            from: 'tin.caotrong@gmail.com',
            to: user.email,
            subject: 'Reset password email',
            text: 'That was easy!',
            html: `
            <p>You requested for password reset</p>
            <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
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

router.post('/new-password',(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
      if(!user){
          return res.status(422).json({error:"Try again session expired"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined
         user.save().then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})


module.exports = router;