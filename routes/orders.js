var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');
const uniqid = require("uniqid");
const User = require('../models/users');
const Order= require('../models/orders');
const Address = require('../models/address');
const  Payment= require('../models/payments');

router.get('/all/:token', (req, res)=>{

  User.findOne({token:req.params.token}).then(data=>{
    if (data){    
      Order.find({user:data._id}).then(data=> {
        res.json({allOrders: data })
      });
    }else{
      res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })

});

router.post ('/new',(req,res)=>{
  console.log(req.body);
  const {token, basket,addressBilling,addressDelivery,paymentType,totalPrice } = req.body;
  User.findOne({token:token}).then(data=>{
    if(data){

      console.log("token",token);
      const newPay=  {
        paymentType: 'CB',
        fullName: 'Chabani Boucif', 
        expirationDate: '15/03/2022', 
        isDefault: true, 
      };

      const newAddress={
        addressName: addressDelivery?.addressName || '',
        street: addressDelivery?.street || '', 
        zipCode:addressDelivery?.zipCode || '', 
        city: addressDelivery?.city || '', 
        state: addressDelivery?.state || '',
        country: addressDelivery?.country || '', 
        phoneNumber: addressDelivery?.phoneNumber || '',
        isForBilling: addressDelivery?.isForBilling || false,
        isForDelivery: addressDelivery?.isForDelivery || false,
        isDefault: addressDelivery?.isDefault || false,
        isDeleted: addressDelivery?.isDeleted || false,
      };
      
      const newOrder=new Order({
        user: data._id,
        orderNumber: `OD${uniqid()}`, 
        purchaseDate: Date.now(), 
        orderStatus: {               
                    status: 'Order',
                    statusDate : Date.now(),
                  }, 
        isCanceled: false,
        cancelDate: null,
        addressBilling:newAddress ,
        addressDelivery:newAddress,   /*[id, street, zipCode, city, state, country, phoneNumber, isForBilling, isForDelivery, isDefault, isDeleted,]*/
        paymentType: newPay , /*[payment]*/
        isPaid: true, 
        totalPrice:totalPrice,
        paidDate: Date.now(), 

      })

      basket.forEach(element => {
        newOrder.orderItems.push(element);
      });
 
      newOrder.save().then((newDoc)=>{
        res.json({result:true, Order : newDoc});
      })

    }else{
        res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })


});

module.exports=router;