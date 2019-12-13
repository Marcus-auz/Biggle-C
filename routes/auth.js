const express=require('express');
const {body}=require('express-validator/check');
const User=require('../models/user');
const authController=require('../controllers/auth');
const router=express.Router();

router.put('/signup',[
    body('email').isEmail().withMessage('Enter a email').custom((value,{req})=>{
        return User.findOne({email:value}).then(userDoc=>{
            if(userDoc){
                return Promise.reject('E-mail already exist');
            }
        });
    })
    .normalizeEmail(),
    body('password').trim().isLength({min:5}),
    body('name').trim().notEmpty()

],authController.signup);

router.post('/login',authController.login);

module.exports=router;