var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');

const Order =require ('../models/orders');

router.get('/all', (req, res)=>{
  Order.find().then(data=> {
    res.json({allOrders: data })
  });
});

module.exports=router;