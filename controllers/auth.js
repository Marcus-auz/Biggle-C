const {validationResult}=require('express-validator/check');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
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

exports.login= (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    let loadedUser;
    User.findOne({email:email}).then(user=>{
        if(!user){
            const error=new Error('No user exist with this email');
            error.statusCode=401;
            throw error;
        }
        loadedUser=user;
        return bcrypt.compare(password,user.password);
    }).then(isEqual=>{
        if(!isEqual){
            const error=new Error("Wrong Password");
            error.statusCode=401;
            throw error;
        }
        const token=jwt.sign({
            email:loadedUser.email,
            userId:loadedUser._id.toSting()
        },'secret',{expiresIn:'1h'});
        res.status(200).json({token:token,userId:loadedUser._id.toSting()});
    })
    .catch(err=>{
          if(!err.statusCode){
            err.statusCode=500;
        }
        next(err); 
    });

};