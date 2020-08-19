var models = require('../models');
//const { Model } = require('sequelize/types');
let Post = models.Post;
const Sequelize = require('sequelize')
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
          attributes:['id'],
          model : models.PostLike,
          as : 'postlike',
          include : [
            {
              attributes:['id','username','avatar'],
              model: models.User,
              as : 'postlike'
            }
          ]
        },
        {
          model: models.Step
        },
        {
          attributes:['id','username','avatar'],
          model: models.User
        },
        {
          attributes:['id','message','userId','parentCommentId'],
          model: models.Comment,
          include : [
            {
              attributes:['id','message','userId'],
              model : models.Comment,
              as : 'SubComment',
              include: [
                {
                  attributes:['id','username','avatar'],
                  model: models.User
                }
              ]
            },
            {
              attributes:['id','username','avatar'],
              model: models.User
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

exports.searchPosts = (query) => {
  return new Promise((resolve,reject)=>{
    let options = {
      where : {

      }
    }

    if (query.search !== ''){
      options.where = {
        title : {	
          [Sequelize.Op.iLike] : `%${query.search}%`
        }
      }
    }

    if (query.level !== ''){
      switch (query.level){
				case 'easy': 
					options.where = {
            [Sequelize.Op.or] : [
              {difficultLevel : 1},
              {difficultLevel : 2},
              {difficultLevel : 3},
            ]
          }
					break;
				case 'normal':
          options.where = {
            [Sequelize.Op.or] : [
              {difficultLevel : 4},
              {difficultLevel : 5},
              {difficultLevel : 6},
              {difficultLevel : 7},
            ]
          }
					break;
				default:
          options.where = {
            [Sequelize.Op.or] : [
              {difficultLevel : 8},
              {difficultLevel : 9},
              {difficultLevel : 10},
            ]
          }
		
			}
    }

    if (query.sort !== ''){
      if (query.sort == 'latest'){
        options.order = [
          ['createdAt','DESC']
        ]
      }
    }

    models.Post
      .findAndCountAll(options)
      .then(data=>resolve(data))
      .catch(err => reject(new Error(err)))
  })
}

exports.countLikesOfPost = (postId) =>{
  models.PostLike.findAll(
    {
        attributes: ['PostLike.postId', [sequelize.fn('COUNT', sequelize.col('PostLike.postId')), 'CountLike']],
        group: ['PostLike.postId'],
        raw:true
    }
  ).then(function (numLikes) {
    return numLikes;
});
}