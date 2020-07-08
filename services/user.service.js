var models = require('../models');
let User = models.User;
let Follower = models.Follower;
const saltRounds = 10;
let bcrypt = require('bcryptjs');

exports.getUserByEmail = (email)=>{
  return User.findOne({
      where : {email : email} 
  })
};

exports.getFollowersOfUserByUserId = (userId) =>{
  return Follower.findAll({
    where: {userId : userId},
    include:[
      {
        model : models.User,
        as : 'users'
      },
      {
        model : models.User,
        as : 'users1'
      }
    ]
  })
}

exports.getUserByUsername = (username)=>{
  return new Promise((resolve,reject)=>{
    let options = {
      attribute: ['id','username','avatar','email','name'],
      where: {
        username : username
      }
    }
    models.User
      .findOne(options)
      .then(data=>{console.log(data);resolve(data)})
      .catch(err => reject(Error(err)))
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