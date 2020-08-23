var models = require('../models');
//const { Model } = require('sequelize/types');
let Post = models.Post;
const Sequelize = require('sequelize')
exports.getPostsByUserId = (userId,limit,page) =>{
  return new Promise((resolve,reject)=>{
    let options = {
      limit : limit,
      offset: limit * (page -1),
      where: {
        userId : userId
      },
      include: [
        {
          model : models.PostLike,
          as : 'postlike'
        },
        {
          attributes: ['id','username','avatar'],
          model: models.User
        }
      ]
    }
    models.Post
      .findAll(options)
      .then(data=>{resolve(data)})
      .catch(err => reject(Error(err)))
  })
}

exports.getAllPosts = (limit,page) =>{
  return Post.findAll({
    limit: limit,
    offset: limit*(page-1),
    where: {},
    include: [
      {
        model : models.PostLike,
        as : 'postlike',
        include : [
          {
            attributes: ['id','username','avatar'],
            model: models.User,
            as : 'postlike'
          }
        ]
      },
      {
        model: models.Step
      },
      {
        attributes: ['id','username','avatar'],
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

exports.getPostsFromFollowings = (userid,limit,page) =>{
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
            limit : limit,
            offset: limit * (page -1),
            model : models.Post,
            include: [
              {
                attributes: ['id','username','avatar'],
                model: models.User
              },
              {
                attributes: ['id'],
                model : models.PostLike,
                as : 'postlike'
              }
            ]
          }
        ]
      }
    ]
  })
}

exports.getPostsFromFollowingsWithoutPagination = (userid) =>{
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
            model : models.Post,
            include: [
              {
                attributes: ['id','username','avatar'],
                model: models.User
              }
            ]
          }
        ]
      }
    ]
  })
}




// exports.getPostsByUserId = (userid,limit,page) =>{
//   return models.Post.findAll({
//     limit : limit,
//     offset: limit * (page -1),
//     where: {
//       userId : userid
//     },
//     include: [
//       {
//         attributes: ['id','username','avatar'],
//         model: models.User
//       }
//     ]
//   })
// }

exports.getPostsByUserIdWithoutPagination = (userid) =>{
  return models.Post.findAll({
    where: {
      userId : userid
    },
    include: [
      {
        attributes: ['id','username','avatar'],
        model: models.User
      }
    ]
  })
}

exports.getFavoritePostsByUserId = (userid,limit,page) =>{
  return models.PostLike.findAll({
    limit : limit,
    offset: limit * (page -1),
    where: {
      userId : userid
    },
    include : [
      {
        model : models.Post,
        as : 'post',
        include: [
          {
            attributes: ['id','username','avatar'],
            model: models.User
          },
          {
            attributes: ['id'],
            model : models.PostLike,
            as : 'postlike'
          }
        ]
      },
    ]
  })
}

exports.getFavoritePostsByUserIdWithoutPagination = (userid) =>{
  return models.PostLike.findAll({
    where: {
      userId : userid
    },
    include : [
      {
        model : models.Post,
        as : 'post',
        include: [
          {
            attributes: ['id','username','avatar'],
            model: models.User
          }
        ]
      },
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
      limit: query.limit,
      offset: query.limit*(query.page - 1),
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
          ['createdAt','desc']
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