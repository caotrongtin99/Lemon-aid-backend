const express = require('express');
const router = express.Router();
const {getAllPosts,createPost,updatePost,removePost, getPostById} = require('../controllers/post')
router.get("/post", getAllPosts);
router.get("/post/getpost/:postid",getPostById);
router.post("/post/create",createPost);
router.post("/post/update",updatePost);
router.post("/post/remove",removePost);
module.exports = router;