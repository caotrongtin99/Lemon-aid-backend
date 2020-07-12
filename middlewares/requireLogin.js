const jwt = require('jsonwebtoken')
require("dotenv").config();
var models =require('../models');
const { getUserById } = require('../services/user.service');

module.exports = (req,res,next) => {
  const {authorization} = req.headers;
  if(!authorization){
     return res.status(401).json({error:"you must be logged in"})
  }
  const token = authorization.replace("Bearer ","")
  jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
      if(err){
       return   res.status(401).json({error:"you must be logged in"})
      }
      console.log("=========================payload",payload)
      const {id} = payload
      getUserById(id).then(userdata=>{
          req.user = userdata
          next()
      })
  })
}
