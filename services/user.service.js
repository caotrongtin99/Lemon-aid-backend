var models = require('../models');
let User = models.User;
let Follower = models.Follower;
let PostLike = models.PostLike;
const saltRounds = 10;
let bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const Sequelize = require('sequelize')


exports.getUserByEmail = (email)=>{
  return User.findOne({
      where : {email : email} 
  })
};

exports.getFollowersOfUserByUserId = (userId) =>{
  return Follower.findAll({
    attributes: ['id'],
    where: {followerId : userId},
    include:[
      {
        attributes:['id','username','avatar'],
        model : models.User,
        as : 'user'
      }
    ]
  })
}

exports.updateUserInfo = (userData, userId) => {
  return User.update(userData,{
    where : {
      id : userId
    }
  })
}


exports.getUserByUsername = (username)=>{
  return User.findOne({
    attributes: ['id','username','avatar','email','password'],
    where : {username : username},
    include : [
      {
        model: models.Post
      },
      {
        attributes: ['id'],
        model: models.Follower,
        as : 'follower',
        include : {
          attributes:['id','username','avatar'],
          model : models.User,
          as : 'follower'
        }
      }
    ]
  })
};


exports.getUserById = (id)=>{
  return new Promise((resolve,reject)=>{
    let options = {
      attribute: ['id','username','avatar','email'],
      where: {
        id : id
      }
    }
    models.User
      .findOne(options)
      .then(data=>{resolve(data)})
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

exports.createFollow = (user1, user2) =>{
  const follower = {
    relation: "",
    userId : user1,
    followerId : user2
  }
  return Follower.create(follower)
}

exports.removeFollow = (user1, user2) =>{
  return Follower.destroy({
    where:{userId : user1, followerId: user2}
  })
}

exports.likePost = (userId, postId) =>{
  const postlike = {
    userId,
    number : 0,
    postId,
  }
  return PostLike.create(postlike);
}

exports.unlikePost = (userId, postId) =>{
  return PostLike.destroy({
    where:{userId , postId}
  });
}

exports.getFavoritePosts =  (userId) =>{
  return PostLike.findAll({
    where : {userId : userId},
    include : [
      {
        model : models.User,
        as : 'user'
      },
      {
        model: models.Post,
        as : 'post'
      }
    ]
  })
}

exports.createComment = (comment) => {
  return models.Comment.create(comment);
}

exports.deleteComment = (commentId) =>{
  return models.Comment.destroy({
    where : {
      [Op.or]:[
        {id: commentId},
        {parentCommentId: commentId}
      ]
    }
  })
}

exports.getActivityHistory = (userId) => {
  return models.User.findOne({
    where : {id : userId},
    include: [
      {
        model : models.PostLike,
        as : 'postlike'
      },
      {
        model : models.Comment
      },
      {
        model: models.Follower,
        as : 'user',
      },
      {
        model: models.Follower,
        as : 'follower',
      }
    ]
  })
}

exports.getTopUsers = () =>{
  return new Promise((resolve,reject)=>{
    models.Follower.findAll({
      group: ['followerId','follower.id'],
      attributes: ['followerId',[Sequelize.fn('COUNT','userId'),'count']],
      order: [[Sequelize.literal('count'),'DESC']],
      limit: 5,
      offset: 0,
      include: [
        {
          attributes: ['id','username','avatar'],
          model: models.User,
          as: 'follower'
        }
      ]
    })
    
  .then(data=>{
    console.log("=================data=============",data)
    return resolve(data)
  })
  .catch(err => reject(new Error(err)))
  })
}