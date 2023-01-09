var express = require('express');
var router = express.Router();

const SearchImg= require('../models/searchs');
const User= require('../models/users');

router.get('/all/:token',(req,res)=>{

    User.findOne({token:req.params.token}).then(data=>{
        if(data){
            SearchImg.find({user_id:data._id}).populate('imageResult').then(data=>{
                res.json({result:true, Images: data  })
            })
        }else{
            res.status(401).send({ result: false, error: 'User not found' })
        }
    }).catch(error=>{
        res.status(500).send({ result: false, error: error.message })
    })

})

module.exports= router;