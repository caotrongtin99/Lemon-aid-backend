const {getAllPosts, createPost, updatePost, removePost, getPostById} = require('../services/post.service')
const { createComment } = require('../services/user.service')
exports.getAllPosts = (req,res) =>{
  getAllPosts()
    .then(posts=>{
      if (posts){
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
  const {title, description, url, avatar,content, tag, userId, categories, ingredients} = req.body;
  const post = {title, description, url, avatar,content, tag, userId, categories, ingredients};
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
  const {id, title, description, url, avatar,content, tag, userId, categories, ingredients} = req.body;
  const post = {title, description, url, avatar,content, tag, userId, categories, ingredients};
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


