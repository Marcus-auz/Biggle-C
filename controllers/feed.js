const {validationResult}=require('express-validator/check');
const Post=require('../models/post');
const fs=require('fs');
const path=require('path');

exports.getPosts=(req,res,next)=>{
    const currentPage=req.query.page || 1;
    const perPage=2; //used bcz it was set in frontend u can use other logic too
    let totalItems;
    Post.find().countDocuments()
        .then(count=>{
            totalItems=count;
            return Post.find()
                .skip((currentPage-1)*perPage)
                .limit(perPage);
        }).then(posts=>{
            res.status(200).json({message:'Posts fetched ',posts:posts,totalItems});
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode=500;
            }
            next(err);    
        });
    
    //dummmy response is not deleted since database is connected
    /*res.status(200).json({
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
    });*/
};

exports.createPost=(req,res,next)=>{
    const error=validationResult(req);
    //response if validation fails
    if(!error.isEmpty()){
        const error=new Error('validation failed');
        error.statusCode=422;
        throw error;
    }
    if(!req.file){
        const error=new Error('No image');
        error.statusCode=422;
        throw error;
    }
    const imageUrl=req.file.path;
    //database will be added later
    //parsing data from the incoming request
    const title=req.body.title;
    const content=req.body.content; 
    const post=new Post({
        title:title,
        content:content,
        //imageUrl:'image/rwby.jgp',
        imageUrl:imageUrl,
        creator:{name:'Auz'}
            
    });
    post.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:'Post created',
            post:result
        });
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);    
        });
        
};

exports.getPost=(req,res,next)=>{
    const postId=req.params.postId;

    Post.findById(postId).then(post=>{
        if(!post){
            const error=new Error('Could not find');
            error.statusCode=404;
            throw error;
        }
        res.status(200).json({message:'Post fetched',post:post});
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err); 
    });
};

exports.updatePost=(req,res,next)=>{
    const postId=req.params.postId;
    const error=validationResult(req);
    //response if validation fails
    if(!error.isEmpty()){
        const error=new Error('validation failed');
        error.statusCode=422;
        throw error;
    }
    const title=req.body.title;
    const content=req.body.content;
    let imageUrl=req.body.image;
    if(req.file){
        imageUrl=req.file.path;
    }
    if(!imageUrl){
        const error=new Error('No file Selected');
        error.statusCode=422;
        throw error;
    }
    Post.findById(postId).then(post=>{
        if(!post){
            const error=new Error('Could not find');
            error.statusCode=404;
            throw error;
        }
        if(!imageUrl!==post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title=title;
        post.imageUrl=imageUrl;
        post.content=content;
        return post.save();
    }).then(result=>{
        res.status(200).json({message:'Post update',post:result});
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err); 
    });
};

exports.deletePost=(req,res,next)=>{
    const postId=req.params.postId;
    Post.findById(postId).then(post=>{
        if(!post){
            const error=new Error('Could not find');
            error.statusCode=404;
            throw error;
        }
        //check logged in user
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);
    }).then(result=>{
        console.log(result);
        res.status(200).json({message:'Deleted'});
    })  
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500;
        }
        next(err);
    });
};

const clearImage=filePath=>{
    filePath=path.join(__dirname,'..',filePath);
    fs.unlink(filePath,err=>console.log(err));
};