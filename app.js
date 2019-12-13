const express =require('express');
const bodyParser=require('body-parser');
const feedRoutes=require('./routes/feed');
const app=express();

app.use(bodyParser.json()); //url encoded is used when incoming data is from a from req type x-www-form-urlencoded
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*'); //allowing access to all clients 
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});

app.use('/feed',feedRoutes);
app.listen(5000);