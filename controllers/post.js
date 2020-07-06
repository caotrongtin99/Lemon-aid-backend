const {getAllPosts} = require('../services/post.service')
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