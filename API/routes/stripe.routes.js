const express = require("express")
const router = express.Router()
const stripeController = require("../controllers/stripe.controller")

router.post("/create-payment-intent", stripeController.paymentIntent)
router.patch("/update-payment-intent",stripeController.updatePaymentIntent)


// router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     const endpointSecret = 'your-webhook-secret'; // Set in Stripe Dashboard
  
//     let event;
  
//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
  
//     // Handle the event
//     if (event.type === 'payment_intent.succeeded') {
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Optionally, update database records here
//     }
  
//     res.json({ received: true });
  
// });
  
module.exports = router;
