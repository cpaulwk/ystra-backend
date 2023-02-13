const express  = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

router.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    //const customer = await stripe.customers.create();

    let myAmount=1099;
    const {amount,email}= req.body;
    myAmount=amount;

    const customer1 = await stripe.customers.search({
      query: 'name:\'titi\' AND email:\'toto@mimi.com\'',
    });

    console.log('customer1',customer1.data.id)


    const customer = await stripe.customers.create({
      description: 'My First Test Customer',
      email : 'popo@mimi.com',
      name: 'PoPO' 
    })

    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2022-11-15'}
    );



    const paymentIntent = await stripe.paymentIntents.create({
      amount: myAmount,
      currency: 'eur',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLEKEY
    });
  });


module.exports = router;