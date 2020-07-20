const express = require('express');
const router = express.Router();
const {getAllPosts,createPost,updatePost,removePost, getPostById, createStep, removeStep} = require('../controllers/post');
const requireLogin = require('../middlewares/requireLogin');
const { createComment } = require('../services/user.service');
router.get("/post", getAllPosts);
router.get("/post/getpost/:postid",getPostById);
router.post("/post/create",requireLogin,createPost);
router.post("/post/update",requireLogin,updatePost);
router.post("/post/remove",requireLogin,removePost);


router.post("/step/create",requireLogin,createStep);
router.post("/step/remove",requireLogin,removeStep);
module.exports = router;