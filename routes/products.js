var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');

const Product = require('../models/products');
const User = require('../models/users');


router.get('/all/:token',(req,res)=>{
    User.findOne({token:req.params.token}).then(data=>{
        if(data){
            Product.find().then(data=>{
                res.json({result:true, Products: data})
            })
        }else{
            res.json({ result: false, error: 'User not found' });
        }

    })
    


})



module.exports=router;