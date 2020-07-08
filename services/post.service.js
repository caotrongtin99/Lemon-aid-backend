var models = require('../models');
let Post = models.Post;

exports.getPostsByUserId = (userId) =>{
  return new Promise((resolve,reject)=>{
    let options = {
      attribute: ['id','avatar','content','title'],
      where: {
        userId : userId
      },
      include : [
        {
          model: models.PostIngredient,
          as: 'postingredients',
          include:[
            {
              model: models.Ingredient,
              as : 'ingredients'
            }
          ]
        },
        {
          model: models.PostCategory,
          as: 'postcategories'
        },
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
        model: models.User
      },
      {
        model: models.PostIngredient,
        as : 'postingredients'
      },
      {
        model : models.PostCategory,
        as : 'postcategories'
      }
    ]
  })
}