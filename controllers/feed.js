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
    //database will be added later
    //parsing data from the incoming request
    const title=req.body.title;
    const content=req.body.content; 
    res.status(201).json({
        message:'Post created',
        post:
        {
            _id:new Date().toISOString(),
            title:title,
            content:content,
            creator:{name:'Auz'},
            createdAt:new Date()
        }
    });
};