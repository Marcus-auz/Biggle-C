const {validationResult}=require('express-validator/check');
const Post=require('../models/post');

exports.getPosts=(req,res,next)=>{
    res.status(200).json({
        posts:[
            {
                _id:'1',
                title:'Post' ,
                content:'Posted for the first time!',
                imageUrl:'images/rwby.jpg',
                creator:{
                    name:'Auz'
                },
                createdAt :new Date()
            }
        ]
    });
};

exports.createPost=(req,res,next)=>{
    const error=validationResult(req);
    //response if validation fails
    if(!error.isEmpty()){
        return res.status(422).json({message:'Validation failed',error:error.array()});
    }
    //database will be added later
    //parsing data from the incoming request
    const title=req.body.title;
    const content=req.body.content; 
    const post=new Post({
        title:title,
        content:content,
        imageUrl:'image/rwby.jgp',
        creator:{name:'Auz'}
            
    });
    post.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Post created',
            post:result
        });
    }).catch(err=>{console.log(err)});
        
};