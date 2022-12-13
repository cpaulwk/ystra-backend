var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');
var User = require('../models/users');
var addressSchema= require('../models/address');
const  paymentTypeSchema= require('../models/payments');


/* GET users listing. */
router.get('/', function(req, res, next) {

  const adresss=  
    {
      addressName:"Lionel",
      street: '46 rue du monde', 
      zipCode: 'xcxc', 
      city: "1234", 
    }
  

  const newUser=new User({
    firstname: 'boucif',
    lastname: 'boucif', 
    username: 'boucif', 
    password: 'boucif', 
  })

  newUser.address.push(adresss);

  newUser.save().then(data=>{
    res.json({ result: true, user: newUser });
})       

});

module.exports = router;
