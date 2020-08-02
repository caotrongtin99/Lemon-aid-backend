var models = require('../models');
//const { Model } = require('sequelize/types');
let Post = models.Post;

exports.getPostsByUserId = (userId) =>{
  return new Promise((resolve,reject)=>{
    let options = {
      where: {
        userId : userId
      },
      include: [
        {
          model : models.PostLike,
          as : 'postlike'
        },
        {
          model: models.User
        },
        {
          model: models.Comment
        }
      ]
    }
    models.Post
      .findAll(options)
      .then(data=>{resolve(data)})
      .catch(err => reject(Error(err)))
  })
}

exports.getAllPosts = () =>{
  return Post.findAll({
    where: {},
    include: [
      {
        model : models.PostLike,
        as : 'postlike',
        include : [
          {
            model: models.User,
            as : 'postlike'
          }
        ]
      },
      {
        model: models.Step
      },
      {
        model: models.User
      },
      {
        model: models.Comment,
        include : [
          {
          model : models.Comment,
          as : 'SubComment'
          }
        ]
      }
    ]
  })
}

exports.getPostsFromFollowings = (userid) =>{
  return models.Follower.findAll({
    where: {
      userId : userid
    },
    include : [
      {
        model: models.User,
        as :'follower',
        include: [
          {
            model : models.Post
          }
        ]
      }
    ]
  })
}


exports.getPostsByUserId = (userid) =>{
  return models.Post.findAll({
    where: {
      userId : userid
    }
  })
}

exports.getFavoritePostsByUserId = (userid) =>{
  return models.PostLike.findAll({
    where: {
      userId : userid
    },
    include : [
      {
        model : models.Post,
        as : 'post'
      }
    ]
  })
}

exports.createPost = (post) =>{
  return Post.create(post);
}

exports.updatePost = (post, id) =>{
  return Post.update(post,{
    where : {id : id}
  })
}

exports.removePost = (id) => {
  return Post.destroy({
    where: {id : id}
  })
}

exports.getPostById = (id)=>{
  return new Promise((resolve,reject)=>{
    let options = {
      where: {
        id :id
      },
      include: [
        {
          model : models.PostLike,
          as : 'postlike',
          include : [
            {
              model: models.User,
              as : 'postlike'
            }
          ]
        },
        {
          model: models.Step
        },
        {
          model: models.User
        },
        {
          model: models.Comment,
          include : [
            {
            model : models.Comment,
            as : 'SubComment'
            }
          ]
        }
      ]
    }
    models.Post
      .findOne(options)
      .then(data=>{resolve(data)})
      .catch(err => reject(Error(err)))
  })
};

exports.createStep = (step) =>{
  return models.Step.create(step);
}


exports.removeStep = (id) => {
  return models.Step.destroy({
    where: {id : id}
  })
}