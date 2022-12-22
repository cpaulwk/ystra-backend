var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const { checkBody } = require('../modules/checkBody');
var User = require('../models/users');
var addressSchema= require('../models/address');
const  paymentTypeSchema= require('../models/payments');


/* GET CONNECTION. */
router.post('/signup',(req, res) =>{
  if (!checkBody(req.body, ['username', 'password','email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  const {username, password,email}=req.body;
  User.findOne({ $or: [{ username:username }, { email:email }] }).then(data=>{
    if(data ===null) {     
      const hash = bcrypt.hashSync(password, 10);
      const newUser=new User({
        username: username, 
        password: hash,
        email: email,
        token: uid2(32),
        nbRequest:10 
      })

      newUser.save().then((newDoc)=>{
        res.json({result:true, token : newDoc.token});
      })
    } else {
      res.json({ result: false, error: 'User already exists' });
    }
  })

})

router.post ('/signin',(req,res)=>{
  if (!checkBody(req.body, ['username','password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const {username, password}=req.body;
  User.findOne({username:username}).then(data=>{
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  })
})
router.get('/:token',(req, res) =>{
  User.findOne({token : req.params.token}).then(data=>{
    if (data){
      res.json({result:true , user : {username:data.username,email:data.email,password:data.password}});
    }else {
      res.json({ result: false, error: 'User not found' });
    }
  })

})

/* GET address listing. */
router.get('/addresses/:token', (req, res)=> {
  User.findOne({token : req.params.token}).then(data=>{
    if (data){
      res.json({addresses: data.address});
    }else {
      res.json({ result: false, error: 'User not found' });
    }
  })

});

router.post('/addresses/',(req,res)=>{
  // ['addressName',
  //   'street', 
  //   'zipCode', 
  //   'city', 
  //   'state',
  //   'country', 
  //   'phoneNumber',
  //   'isForBilling',
  //   'isForDelivery',
  //   'isDefault',
  //   'isDeleted',]
  if (!checkBody(req.body, ['token','addressName','street'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({token:req.body.token}).then(data=>{
    if (data){
      const newAddress = {
        addressName: req.body.addressName,
        street: req.body.street, 
        zipCode: req.body.zipCode, 
        city: req.body.city, 
        state: req.body.state,
        country: req.body.country, 
        phoneNumber: req.body.phoneNumber,
        isForBilling: req.body.isForBilling,
        isForDelivery: req.body.isForDelivery,
        isDefault: req.body.isDefault,
      };

      data.address.push(newAddress);
      data.save().then(updateDoc=>{
        res.json({result:true, addresses:data.address})
      })

    }else{
      res.json({ result: false, error: 'User not found' });
    }
  })


})

/* GET Payement Type listing. */
router.get('/payamenttype/:token',(req,res)=>{
  User.findOne({token : req.params.token}).then(data=>{
    if (data){
      res.json({paymentType: data.paymentType});
    }else {
      res.json({ result: false, error: 'User not found' });
    }
  })
}) 

router.post('/payamenttype/',(req,res)=>{
  if (!checkBody(req.body, ['token','paymentType','fullName','expirationDate'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  User.findOne({token:req.body.token}).then(data=>{
    if (data){
      const newPayementType={
          paymentType: req.body.paymentType,
          fullName: req.body.fullName, 
          expirationDate: req.body.expirationDate, 
          isDefault: req.body.isDefault, 
      }
      data.paymentType.push(newPayementType);
      data.save().then(updateDoc=>{
        res.json({result:true, paymentType:data.paymentType})
      })

    }else{
      res.json({ result: false, error: 'User not found' });
    }
  })  
})

module.exports = router;
