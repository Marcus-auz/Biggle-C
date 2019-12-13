const express =require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const feedRoutes=require('./routes/feed');
const app=express();

app.use(bodyParser.json()); //url encoded is used when incoming data is from a from req type x-www-form-urlencoded
//to handle cors error(different domain and try to exchange data)
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*'); //allowing access to all clients 
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});

app.use('/feed',feedRoutes);
mongoose.connect('URL')
        .then(result=>{
            app.listen(8080);
        })
        .catch(err=>console.log(err)); //use your mongoose atlas connection url

