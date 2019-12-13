const express =require('express');
const bodyParser=require('body-parser');
const feedRoutes=require('./routes/feed');
const app=express();

app.use(bodyParser.json()); //url encoded is used when incoming data is from a from req type x-www-form-urlencoded
app.use('/feed',feedRoutes);
app.listen(5000);