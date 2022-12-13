var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');

const SearchImg= require('../models/searchs');
const User= require('../models/users');

router.get('/all',(req,res)=>{

    SearchImg.find({user_id:0}).populate('imageResult').then(data=>{
        res.json({result:true, Images: data  })
    })

})







module.exports= router;