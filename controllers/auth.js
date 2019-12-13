const {validationResult}=require('express-validator/check');
const bcrypt=require('bcryptjs');
const User=require('../models/user');

exports.signup=(req,res,next)=>{
    const errors=validationResult(req); //collect if any error in validation that is added in routes 
    if(!errors.isEmpty()){
        const error=new Error('Validation fialed');
        error.statusCode=422;
        error.data=errors.array();
        throw error;
    }
    const email=req.body.email;
    const name=req.body.name;
    const password=req.body.password;
    bcrypt.hash(password,5).then(hashedPw=>{
        const user=new User({
            email:email,
            name:name,
            password:hashedPw
        });
        return user.save()
    }).then(result=>{
        res.status(201).json({message:'User created',userId:result._id});
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err); 
    });
};