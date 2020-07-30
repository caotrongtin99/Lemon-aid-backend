const {getAllPosts, createPost, updatePost, removePost, getPostById, createStep, removeStep} = require('../services/post.service')
const { createComment } = require('../services/user.service')
const { post } = require('../routes/post.route')
exports.getAllPosts = (req,res) =>{
  getAllPosts()
    .then(posts=>{
      if (posts){
        for (let i = 0 ; i< posts.length; i++){
          posts[i].dataValues.author = posts[i].dataValues.User;
          posts[i].dataValues.content = JSON.parse(posts[i].dataValues.content)
          delete posts[i].dataValues.User
        }
        res.status(200).json({
          posts
        })
      }
    })
    .catch(err=>{
      res.status(400).json({
        err
      })
    })
}

exports.createPost = (req,res) => {
  const {id,title, description, url, avatar,steps, hashtags, userId, categories, ingredients, ration, cookingTime} = req.body;
  const content = JSON.stringify(steps);
  const post = {id,title, description, url, avatar, content, hashtags, userId, categories, ingredients, ration, cookingTime};
  console.log("================post=====",post)
  createPost(post)
    .then(post=>{
      res.status(200).json({
        message: "Post successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

exports.updatePost = (req,res) => {
  const {id, title, description, url, avatar,content, hashtags, userId, categories, ingredients} = req.body;
  const post = {title, description, url, avatar,content, hashtags, userId, categories, ingredients};
  updatePost(post,id)
    .then(post=>{
      res.status(200).json({
        message: "Update post successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

exports.removePost = (req,res) => {
  const {id} = req.body;
  removePost(id)
    .then(result=>{
      res.status(200).json({
        message: "remove post successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

exports.getPostById = (req,res)=>{
  const {postid}  = req.params;
  getPostById(postid)
    .then(post=>{
      res.status(200).json({
        post
      })
    })
}

exports.createStep = (req,res) => {
  const {stt, content, image, postId} = req.body;
  const step = {stt, content, image, postId};
  createStep(step)
    .then(step=>{
      res.status(200).json({
        message: "Create Step successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

exports.removeStep = (req,res) => {
  const {id} = req.body;
  removeStep(id)
    .then(result=>{
      res.status(200).json({
        message: "remove step successfully!!"
      });
    })
    .catch(err=>{
      res.status(400).json({
        err : err
      })
    })
}

