var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');

const SearchImg= require('../models/searchs');
const User= require('../models/users');

router.get('/all/:token',(req,res)=>{

    User.findOne({token:req.params.token}).then(data=>{
        if(data){
            SearchImg.find({user_id:data._id}).populate('imageResult').then(data=>{
                res.json({result:true, Images: data  })
            })
        }else{
            res.json({ result: false, error: 'User not found' });
        }
    })

})







module.exports= router;