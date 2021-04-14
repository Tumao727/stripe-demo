const express = require("express");
const router = express();

const Stripe = require("stripe");
// api key
const key = `sk_test_51IfcoqIBLhKjG75FxzLL4k1kiB2zCyt5uPgPkVk0OQPJfoX48br6QR2Vfsk8gH5Gx8n6kt1L25fzCHWh2KjQ0XhZ00YPkoScfe`;
const stripe = new Stripe(key, {
  apiVersion: "2020-08-27",
});

const domain = "http://172.16.20.151:3000";

// create a payment intent
const getPaymentIntent = async (amount, currency, email) => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    // in live mode, email will be sended automatically after successful payments
    receipt_email: email,
    payment_method_types: ["card"],
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: "accept_a_payment" },
  });
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/secret", async (req, res) => {
  const {
    query: { amount, currency, email },
  } = req;
  const intent = await getPaymentIntent(amount, currency, email);
  res.json({ client_secret: intent.client_secret });
});

router.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "cat",
            images: [
              "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592298909.jpg",
            ],
          },
          unit_amount: 2000,
        },
        quantity: 2,
      },
    ],
    mode: "payment",
    success_url: `${domain}?success=true`,
    cancel_url: `${domain}?canceled=true`,
  });

  res.json({ id: session.id });
});

module.exports = router;
