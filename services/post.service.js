var models = require('../models');
let Post = models.Post;

exports.getPostsByUserId = (userId) =>{
  return Post.findAll({
    where : {userId:userId}
  })
}

exports.getAllPosts = () =>{
  return Post.findAll({
    where: {}
  })
}