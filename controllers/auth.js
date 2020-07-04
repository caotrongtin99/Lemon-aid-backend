const {getUserByEmail,getUserByUsername,createUser, comparePassword} = require('../services/user.service');
const User = require('../models/3-user');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();
exports.signup = (req,res) =>{
  const {username, name, email, password,confirmPassword} = req.body;
  let addedUser = {
    username,
    email,
    password,
    name
  }
  let errs = [];
  if (password != confirmPassword){
    errs.push({message:"Passswords do not match"})  
  }

  if (!confirmPassword){
    errs.push({message:"Please fill confirm password"});
  }

  if (errs.length > 0){
    res.status(400).json({
      error : errs
    })
  } else {
    getUserByEmail(email)
      .then(user=>{
        if (user){
          return res.status(400).json({
            message : "User exists!!"
          })
        }
        createUser(addedUser)
          .then(user=>{
            res.status(200).json({
              message: "Sign up success! Please signin"
            });
          })
          .catch(err=>{
            res.status(400).json({
              err : err
            })
          })
        
      })
      
  }

}

exports.signin= (req,res) =>{
  console.log("hello")
  const {username,password} = req.body;

  getUserByUsername(username)
    .then(user=>{
      if (user){
        if(!comparePassword(password,user.password)){
          return res.status(400).json({
            err : "Password is wrong!!!"
          })
        }
        console.log(user)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1d"
        });
        res.cookie("token", token, { expiresIn: "1d" });
        const { id, username, name, email } = user;
        return res.status(200).json({
          token,
          user: { id, username, name, email }
        });

      }
    })
}

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success"
  });
};


