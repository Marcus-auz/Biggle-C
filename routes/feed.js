const express=require('express');
const {body}=require('express-validator/check');
const feedController=require('../controllers/feed');
const isAuth=require('../middleware/isAuth');
const router=express.Router();

// GET /feed/posts
router.get('/posts',isAuth,feedController.getPosts); 
//POST /feed/post
router.post('/post',isAuth,[
    body('title').trim().isLength({min:12}),
    body('content').trim().isLength({min:250})],
    feedController.createPost
);

router.get('/post/:postId',isAuth,feedController.getPost);
router.put('/post/:postId',isAuth,[
    body('title').trim().isLength({min:12}),
    body('content').trim().isLength({min:250})],feedController.updatePost
);
router.delete('/post/:postId',isAuth,feedController.deletePost);

module.exports=router;

