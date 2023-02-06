var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');
const addressSchema= require('../models/address');
const  paymentTypeSchema= require('../models/payments');

// Grabbed from emailregex.com
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* GET CONNECTION. */
router.post('/signup',(req, res) =>{

  if (!checkBody(req.body, ['password','email'])) {
    return res.status(400).send({ result: false, error: 'Missing or empty fields' });
  }
  const {username, password, email}=req.body;

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).send({  result: false, error: 'Invalid email address' })
  }

  // { $or: [{ username:username }, { email:email }] } 
  User.findOne({ email:email }).then(data=>{
    if(data ===null) {     
      const hash = bcrypt.hashSync(password, 10);
      const newUser=new User({
        username: username, 
        password: hash,
        email: email,
        token: uid2(32),
        nbRequest:10, 
        wallet:''
      })

      newUser.save().then((newDoc)=>{
        res.json({result:true, token : newDoc.token});
      })

    } else {
      res.status(400).send({  result: false, error: 'User already exists' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })    
  })
  
})

router.post ('/signin',(req,res)=>{

  if (!checkBody(req.body, ['email','password'])) {    
    return res.status(400).send({ result: false, error: 'Missing or empty fields' })
  }  

  const {email, password}=req.body;
  // User.findOne({email : { $regex: new RegExp(userEmail, 'i') }}).then(data=>{
  User.findOne({email:email}).then(data=>{
    if (data && bcrypt.compareSync(password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      //User not found or wrong password
      res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })

})

router.get('/infos/:token',(req, res) =>{

  User.findOne({token : req.params.token}).then(data=>{
    if (data){
      res.json({result:true , user : {username:data.username,email:data.email,password:data.password}});
    }else {
      res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })

})

/* GET address listing. */
router.get('/addresses/:token', (req, res)=> {

  User.findOne({token : req.params.token}).then(data=>{
    if (data){
      res.json({result:true, addresses: data.address});
    }else {
      res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })

});

router.post('/addresses/',(req,res)=>{
  // const fields = ['addressName',
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
    return res.status(400).send({  result: false, error: 'Missing or empty fields' });
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

      // User.updateOne({token:req.body.token},{$push :{address:newAddress}}).then(data=>{
      //   res.json({result:true, addresses:data})
      // })

      data.address.push(newAddress);
      data.save().then(updateDoc=>{
        res.json({result:true, addresses:updateDoc.address})
      })

    }else{
      res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })



})

/* GET Payement Type listing. */
router.get('/paymenttype/:token',(req,res)=>{

  User.findOne({token : req.params.token}).then(data=>{
    if (data){
      res.json({result:true,paymentType: data.paymentType});
    }else {
      res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })

}) 

router.post('/paymenttype/',(req,res)=>{

  if (!checkBody(req.body, ['token','paymentType','fullName','expirationDate'])) {
    return res.status(400).send({  result: false, error: 'Missing or empty fields' });
  }
  User.findOne({token:req.body.token}).then(data=>{
    if (data){
      const newPaymentType={
          paymentType: req.body.paymentType,
          fullName: req.body.fullName, 
          expirationDate: req.body.expirationDate, 
          isDefault: req.body.isDefault, 
      }
      data.paymentType.push(newPaymentType);
      data.save().then(updateDoc=>{
        res.json({result:true, paymentType:data.paymentType})
      })

    }else{
      res.status(401).send({ result: false, error: 'User not found' })
    }
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })  

})

/* POST WALLET Type listing. */
router.post('/wallet',(req, res) =>{

  if (!checkBody(req.body, ['token', 'wallet'])) {
    return res.status(400).send({  result: false, error: 'Missing or empty fields' });
  }
  const {token, wallet}=req.body;
  User.updateOne({ token:token }, { wallet:wallet }).then(newDoc=>{
    console.log('Infos Wallet',token,wallet)
        res.json({result:true, token : newDoc.token});
  }).catch(error=>{
    res.status(500).send({ result: false, error: error.message })
  })

})

module.exports = router;
