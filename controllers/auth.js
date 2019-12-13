const {validationResult}=require('express-validator/check');
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
}