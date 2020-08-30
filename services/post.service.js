var models = require('../models');
const querystring = require('querystring');
 
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

exports.searchsPosts = (limit,page,search) =>{
  return Post.findAll({
    limit: limit,
    offset: limit*(page-1),
    where: {
    },
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


exports.searchPostsWithoutPagination = (query) => {
  if (query.sort==="common"){
    let whereClauses = {};
    let categories = [];

    if (query.level === ''){
      whereClauses={ 
        [Sequelize.Op.or] : [
        {difficultLevel : 1},
        {difficultLevel : 2},
        {difficultLevel : 3},
      ]}
    }
    if (query.level !== ''){
      if (query.level.length===3){
        whereClauses={ 
          [Sequelize.Op.or] : [
          {difficultLevel : 1},
          {difficultLevel : 2},
        ]}
      }
      else if (query.level.length === 2){
        if (query.level.includes('easy') && query.level.includes('normal')){
          whereClauses={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 1},
            {difficultLevel : 2},
          ]}
        } else if (query.level.includes('easy') && query.level.includes('hard')){
          whereClauses={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 1},
            {difficultLevel : 3},
          ]}
        } else if (query.level.includes('normal') && query.level.includes('hard')){
          whereClauses={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 2},
            {difficultLevel : 3},
          ]}
        }
      } else {
        if (query.level === "easy"){
          whereClauses.difficultLevel = 1;
        } else if (query.level === "normal"){
          whereClauses.difficultLevel = 2;
        } else if (query.level === "hard"){
          whereClauses.difficultLevel = 3;
        }
      }
    }
    if (query.category.includes('vietfood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Việt%`})
    }
    if (query.category.includes('thaifood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Thái%`})
    }
    if (query.category.includes('koreafood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Hàn%`})
    }
    if (query.category.includes('chinafood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Trung%`})
    }
    if (query.category.includes('japanfood')){
      categories.push({[Sequelize.Op.iLike] : `%Món Nhật%`})
    }
    if (query.category.includes('eurofood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Âu%`})
    }
    if (query.category.includes('drink')){
      categories.push({ [Sequelize.Op.iLike] : `%Đồ uống%`})
    }
    if (query.category.includes('dessert')){
      categories.push({[Sequelize.Op.iLike] : `%Tráng miệng%`})
    }
    if (query.category===''){
      categories=[
        {[Sequelize.Op.iLike] : `%Món Việt%`},
        {[Sequelize.Op.iLike] : `%Món Thái%`},
        { [Sequelize.Op.iLike] : `%Món Hàn%`},
        { [Sequelize.Op.iLike] : `%Món Trung%`},
        { [Sequelize.Op.iLike] : `%Món Âu%`},
        {[Sequelize.Op.iLike] : `%Món Nhật%`},
        { [Sequelize.Op.iLike] : `%Đồ uống%`},
        { [Sequelize.Op.iLike] : `%Tráng miệng%`},
        { [Sequelize.Op.iLike] : `%%`}
      ]
    }
    whereClauses.categories = {
      [Sequelize.Op.or]: categories
    }
    whereClauses.cookingTime = {
        [Sequelize.Op.between]:[query.mintime,query.maxtime]
    }

    whereClauses.title = {
      [Sequelize.Op.iLike]: `%${query.search}%`
    };
    return new Promise((resolve,reject)=>{
      models.PostLike.findAll({
        group:['postId','post.id','post->User.id'],
        attributes: ['postId',[Sequelize.fn('COUNT','userId'),'count']],
        order: [[Sequelize.literal('count'),'DESC']],
        include: [
          {
            model: models.Post,
            as: 'post',
            where : whereClauses,
            include: [
              {
                attributes:['id','username','avatar'],
                model: models.User
              }
            ]
          }
        ]
      })
      
    .then(data=>{
      const formatData = data.map(e=>{
        e.dataValues.post.dataValues.numberOfLikes = e.dataValues.count;
        return e.dataValues.post.dataValues;
      })
      return resolve(formatData)
    })
    .catch(err => reject(new Error(err)))
    })
  }
  return new Promise((resolve,reject)=>{
    let options = {
      where : {

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
          attributes:['id','username','avatar'],
          model: models.User
        }
      ]
    }


    if (query.level === ''){
      options.where={ 
        [Sequelize.Op.or] : [
        {difficultLevel : 1},
        {difficultLevel : 2},
        {difficultLevel : 3},
      ]}
    }
    if (query.level !== ''){
      if (query.level.length===3){
        options.where={ 
          [Sequelize.Op.or] : [
          {difficultLevel : 1},
          {difficultLevel : 2},
        ]}
      }
      else if (query.level.length === 2){
        if (query.level.includes('easy') && query.level.includes('normal')){
          options.where={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 1},
            {difficultLevel : 2},
          ]}
        } else if (query.level.includes('easy') && query.level.includes('hard')){
          options.where={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 1},
            {difficultLevel : 3},
          ]}
        } else if (query.level.includes('normal') && query.level.includes('hard')){
          options.where={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 2},
            {difficultLevel : 3},
          ]}
        }
      } else {
        if (query.level === "easy"){
          options.where.difficultLevel = 1;
        } else if (query.level === "normal"){
          options.where.difficultLevel = 2;
        } else if (query.level === "hard"){
          options.where.difficultLevel = 3;
        }
      }
    }
    options.where.cookingTime = {
        [Sequelize.Op.between]:[query.mintime,query.maxtime]
    }
    let categories = [];
    if (query.category.includes('vietfood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Việt%`})
    }
    if (query.category.includes('thaifood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Thái%`})
    }
    if (query.category.includes('koreafood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Hàn%`})
    }
    if (query.category.includes('chinafood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Trung%`})
    }
    if (query.category.includes('japanfood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Nhật%`})
    }
    if (query.category.includes('eurofood')){
      categories.push({[Sequelize.Op.iLike] : `%Món Âu%`})
    }
    if (query.category.includes('drink')){
      categories.push({ [Sequelize.Op.iLike] : `%Đồ uống%`})
    }
    if (query.category.includes('dessert')){
      categories.push({[Sequelize.Op.iLike] : `%Tráng miệng%`})
    }
    if (query.category===''){
      categories=[
        { [Sequelize.Op.iLike] : `%Món Việt%`},
        { [Sequelize.Op.iLike] : `%Món Thái%`},
        { [Sequelize.Op.iLike] : `%Món Hàn%`},
        { [Sequelize.Op.iLike] : `%Món Trung%`},
        { [Sequelize.Op.iLike] : `%Món Âu%`},
        { [Sequelize.Op.iLike] : `%Món Nhật%`},
        { [Sequelize.Op.iLike] : `%Đồ uống%`},
        { [Sequelize.Op.iLike] : `%Tráng miệng%`},
        { [Sequelize.Op.iLike] : `%%`},
      ]
    }
    options.where.categories = {
      [Sequelize.Op.or]: categories
    }
    // console.log("--------------req=========",query)
    options.where.title = {
        [Sequelize.Op.iLike] : `%${query.search}%`
    }
    if (query.sort !== ''){
      if (query.sort == 'latest'){
        options.order = [
          ['createdAt','desc']
        ]
      }
    }


    models.Post
      .findAll(options)
      .then(data=>{
        const formatData = data.map(element=>{
          //element.dataValues.numberOfLikes = element.dataValues.postlike.length;
          //delete element.dataValues.postlike;
          return element.dataValues;
        })
        resolve(formatData)
      })
      .catch(err => reject(new Error(err)))
  })
}


exports.searchPosts = (query) => {
  if (query.sort==="common"){
    console.log("===========common=================");
    let whereClauses = {};
    let categories = [];

    if (query.level === ''){
      whereClauses={ 
        [Sequelize.Op.or] : [
        {difficultLevel : 1},
        {difficultLevel : 2},
        {difficultLevel : 3},
      ]}
    }
    if (query.level !== ''){
      if (query.level.length===3){
        whereClauses={ 
          [Sequelize.Op.or] : [
          {difficultLevel : 1},
          {difficultLevel : 2},
        ]}
      }
      else if (query.level.length === 2){
        if (query.level.includes('easy') && query.level.includes('normal')){
          whereClauses={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 1},
            {difficultLevel : 2},
          ]}
        } else if (query.level.includes('easy') && query.level.includes('hard')){
          whereClauses={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 1},
            {difficultLevel : 3},
          ]}
        } else if (query.level.includes('normal') && query.level.includes('hard')){
          whereClauses={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 2},
            {difficultLevel : 3},
          ]}
        }
      } else {
        if (query.level === "easy"){
          whereClauses.difficultLevel = 1;
        } else if (query.level === "normal"){
          whereClauses.difficultLevel = 2;
        } else if (query.level === "hard"){
          whereClauses.difficultLevel = 3;
        }
      }
    }
    if (query.category.includes('vietfood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Việt%`})
    }
    if (query.category.includes('thaifood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Thái%`})
    }
    if (query.category.includes('koreafood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Hàn%`})
    }
    if (query.category.includes('chinafood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Trung%`})
    }
    if (query.category.includes('japanfood')){
      categories.push({[Sequelize.Op.iLike] : `%Món Nhật%`})
    }
    if (query.category.includes('eurofood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Âu%`})
    }
    if (query.category.includes('drink')){
      categories.push({ [Sequelize.Op.iLike] : `%Đồ uống%`})
    }
    if (query.category.includes('dessert')){
      categories.push({[Sequelize.Op.iLike] : `%Tráng miệng%`})
    }
    if (query.category===''){
      categories=[
        {[Sequelize.Op.iLike] : `%Món Việt%`},
        {[Sequelize.Op.iLike] : `%Món Thái%`},
        { [Sequelize.Op.iLike] : `%Món Hàn%`},
        { [Sequelize.Op.iLike] : `%Món Trung%`},
        { [Sequelize.Op.iLike] : `%Món Âu%`},
        {[Sequelize.Op.iLike] : `%Món Nhật%`},
        { [Sequelize.Op.iLike] : `%Đồ uống%`},
        { [Sequelize.Op.iLike] : `%Tráng miệng%`},
        { [Sequelize.Op.iLike] : `%%`}
      ]
    }
    whereClauses.categories = {
      [Sequelize.Op.or]: categories
    }
    whereClauses.cookingTime = {
        [Sequelize.Op.between]:[query.mintime,query.maxtime]
    }
    whereClauses.title = {
    [Sequelize.Op.iLike]: `%${query.search}%`
    };

    
    return new Promise((resolve,reject)=>{
      models.PostLike.findAll({
        group:['postId','post.id','post->User.id'],
        attributes: ['postId',[Sequelize.fn('COUNT','userId'),'count']],
        order: [[Sequelize.literal('count'),'DESC']],
        limit: query.limit,
        offset: query.limit*(query.page-1), 
        include: [
          {
            model: models.Post,
            as: 'post',
            where : whereClauses,
            include: [
              {
                attributes:['id','username','avatar'],
                model: models.User
              }
            ]
          }
        ]
      })
      
    .then(data=>{
      const formatData = data.map(e=>{
        e.dataValues.post.dataValues.numberOfLikes = e.dataValues.count;
        return e.dataValues.post.dataValues;
      })
      return resolve(formatData)
    })
    .catch(err => reject(new Error(err)))
    })
  }else{
  return new Promise((resolve,reject)=>{
    console.log("====================latest")
    let options = {
      limit: query.limit,
      offset: query.limit*(query.page - 1),
      where : {

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
          attributes:['id','username','avatar'],
          model: models.User
        }
      ]
    }

    if (query.level === ''){
      options.where={ 
        [Sequelize.Op.or] : [
        {difficultLevel : 1},
        {difficultLevel : 2},
        {difficultLevel : 3},
      ]}
    }
    if (query.level !== ''){
      if (query.level.length===3){
        options.where={ 
          [Sequelize.Op.or] : [
          {difficultLevel : 1},
          {difficultLevel : 2},
        ]}
      }
      else if (query.level.length === 2){
        if (query.level.includes('easy') && query.level.includes('normal')){
          options.where={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 1},
            {difficultLevel : 2},
          ]}
        } else if (query.level.includes('easy') && query.level.includes('hard')){
          options.where={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 1},
            {difficultLevel : 3},
          ]}
        } else if (query.level.includes('normal') && query.level.includes('hard')){
          options.where={ 
            [Sequelize.Op.or] : [
            {difficultLevel : 2},
            {difficultLevel : 3},
          ]}
        }
      } else {
        if (query.level === "easy"){
          options.where.difficultLevel = 1;
        } else if (query.level === "normal"){
          options.where.difficultLevel = 2;
        } else if (query.level === "hard"){
          options.where.difficultLevel = 3;
        }
      }
    }
    options.where.cookingTime = {
        [Sequelize.Op.between]:[query.mintime,query.maxtime]
    }
    let categories = [];
    if (query.category.includes('vietfood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Việt%`})
    }
    if (query.category.includes('thaifood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Thái%`})
    }
    if (query.category.includes('koreafood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Hàn%`})
    }
    if (query.category.includes('chinafood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Trung%`})
    }
    if (query.category.includes('japanfood')){
      categories.push({ [Sequelize.Op.iLike] : `%Món Nhật%`})
    }
    if (query.category.includes('eurofood')){
      categories.push({[Sequelize.Op.iLike] : `%Món Âu%`})
    }
    if (query.category.includes('drink')){
      categories.push({ [Sequelize.Op.iLike] : `%Đồ uống%`})
    }
    if (query.category.includes('dessert')){
      categories.push({[Sequelize.Op.iLike] : `%Tráng miệng%`})
    }
    if (query.category===''){
      categories=[
        { [Sequelize.Op.iLike] : `%Món Việt%`},
        { [Sequelize.Op.iLike] : `%Món Thái%`},
        { [Sequelize.Op.iLike] : `%Món Hàn%`},
        { [Sequelize.Op.iLike] : `%Món Trung%`},
        { [Sequelize.Op.iLike] : `%Món Âu%`},
        { [Sequelize.Op.iLike] : `%Món Nhật%`},
        { [Sequelize.Op.iLike] : `%Đồ uống%`},
        { [Sequelize.Op.iLike] : `%Tráng miệng%`},
        { [Sequelize.Op.iLike] : `%%`},
      ]
    }
    options.where.categories = {
      [Sequelize.Op.or]: categories
    }
    // console.log("--------------req=========",query)
    options.where.title = {
        [Sequelize.Op.iLike] : `%${query.search}%`
    }
    if (query.sort !== ''){
      if (query.sort == 'latest'){
        options.order = [
          ['createdAt','desc']
        ]
      }
    }

    models.Post
      .findAll(options)
      .then(data=>{
        const formatData = data.map(element=>{
          element.dataValues.numberOfLikes = element.dataValues.postlike.length;
          delete element.dataValues.postlike;
          return element.dataValues;
        })
        resolve(formatData)
      })
      .catch(err => reject(new Error(err)))
  })
  }
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