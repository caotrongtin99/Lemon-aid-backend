const express = require('express');
const router = express.Router();
const {getAllPosts,createPost,updatePost,removePost, getPostById, createStep, removeStep, getPostsByTabs, searchPosts} = require('../controllers/post');
const requireLogin = require('../middlewares/requireLogin');
router.get("/post", requireLogin, getAllPosts);
router.get("/post/getPostsByTabs",requireLogin,getPostsByTabs)
router.get("/post/getpost/:postid",requireLogin,getPostById);
router.post("/post/create",requireLogin,createPost);
router.post("/post/remove",requireLogin,removePost);
router.put("/post/update/:postid",requireLogin,updatePost);
router.post("/step/create",createStep);
router.post("/step/remove",removeStep);
router.get("/post/search",searchPosts);
module.exports = router;