var express = require('express');
var router = express.Router();
const {checkBody} =require('../modules/checkBody');
const uniqid = require("uniqid");
var User = require('../models/users');
var Order= require('../models/orders');
const Address = require('../models/address');
const  Payment= require('../models/payments');

router.get('/all', (req, res)=>{
  Order.find().then(data=> {
    res.json({allOrders: data })
  });
});

router.get('/:token', (req, res)=>{
  // if (!checkBody(req.body, ["queryKey", "token"])) {
  //   res.json({ result: false, error: "Missing or empty fields" });
  //   return;
  // }
  User.findOne({token:req.params.token}).then(data=>{
    if (data){    
      Order.find({user:data._id}).then(data=> {
        res.json({allOrders: data })
      });
    }else{
      res.json({ result: false, error: 'User not found' });
    }
  });
});

router.post ('/new',(req,res)=>{
  console.log(req.body);
  const {token, basket,addressBilling,addressDelivery,paymentType,TotalPrice } = req.body;
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
      // User.address.push(newAddress);
      // User.save();
      
      const newOrder=new Order({
        user: data._id,
        orderNumber: `OD${uniqid()}`, 
        purchaseDate: Date.now(), 
        // orderItems : tab1,
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

      // const tabItems= basket.map(items=>{
      //   console.log('basket==>',items.product)
      //   return (
      //     {
      //       imageResult_id: items.imageResult_id,          
      //       price: items.price, 
      //       product: items.product,  
      //       quantity: items.quantity
      //     }
      //   )
      // });

      basket.forEach(element => {
        newOrder.orderItems.push(element);
      });

      //newOrder.orderItems.push([...tabItems]);
      // newOrder.orderItems=tabItems;
 
      newOrder.save().then((newDoc)=>{
        res.json({result:true, Order : newDoc});
      })

    }else{
        res.json({ result: false, error: 'User not found' });
    }
  })

});

module.exports=router;