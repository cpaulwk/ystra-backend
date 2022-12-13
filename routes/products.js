var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');

const Product = require('../models/products');


router.get('/all',(req,res)=>{

    Product.find().then(data=>{
        res.json({result:true, Products: data})
    })

})



module.exports=router;