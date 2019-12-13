const express =require('express');
const path=require('path');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const multer=require('multer');
const feedRoutes=require('./routes/feed');
const authRoutes=require('./routes/auth');
const app=express();

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+'-'+file.originalname);
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
};

app.use(bodyParser.json()); //url encoded is used when incoming data is from a from req type x-www-form-urlencoded
app.use(
    multer({storage:fileStorage,fileFilter:fileFilter}).single('image')
);
//to handle cors error(different domain and try to exchange data)
app.use('/images',express.static(path.join(__dirname,'images')));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*'); //allowing access to all clients 
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});

app.use('/feed',feedRoutes);
app.use('/auth',authRoutes);
app.use((error,res,req,next)=>{
    console.log(error);
    const status=error.statusCode || 500;
    const message=error.message;
    const data=error.data;
    res.status(status).json({message:message,data:data});
})
mongoose.connect('URL')
        .then(result=>{
            app.listen(8080);
        })
        .catch(err=>console.log(err)); //use your mongoose atlas connection url

