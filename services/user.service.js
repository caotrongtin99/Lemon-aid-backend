var models = require('../models');
let User = models.User;
const saltRounds = 10;
let bcrypt = require('bcryptjs');

exports.getUserByEmail = (email)=>{
  return User.findOne({
      where : {email : email} 
  })
};

exports.getUserByUsername = (username)=>{
  return User.findOne({
      where : {username : username} 
  })
};

exports.comparePassword = (password, hash) =>{
  return bcrypt.compareSync(password,hash)
  
}

exports.createUser = (user)=>{
  var salt = bcrypt.genSaltSync(saltRounds)
  user.password = bcrypt.hashSync(user.password,salt)
  return User.create(user)
}