exports.getPosts=(req,res,next)=>{
    res.status(200).json({
        posts:[{title:'Post' ,content:'Posted for the first time!'}]
    });
};

exports.createPost=(req,res,next)=>{
    //database will be added later
    //parsing data from the incoming request
    const title=req.body.title;
    const content=req.body.content; 
    res.status(201).json({
        message:'Post created',
        post:{id:new Date().toISOString(),title:title,content:content}
    });
};