const {getUserByUsername}= require('../services/user.service')
const {getPostsByUserId} = require('../services/post.service')
exports.getInfoUser = (req,res) =>{
  const username = req.params.username;
  getUserByUsername(username)
    .then(user=>{
      if (user){
        const userId = user.id;
        getPostsByUserId(userId)
          .then(posts=>{
            console.log(posts);
            res.status(200).json({
              user,
              posts : posts
            })
          })
      }
    })
}