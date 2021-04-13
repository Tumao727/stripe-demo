const express = require("express");
const router = express();

const Stripe = require("stripe");
// api key
const key = `sk_test_51IfcoqIBLhKjG75FxzLL4k1kiB2zCyt5uPgPkVk0OQPJfoX48br6QR2Vfsk8gH5Gx8n6kt1L25fzCHWh2KjQ0XhZ00YPkoScfe`;
const stripe = new Stripe(key, {
  apiVersion: "2020-08-27",
});

// create a payment intent
const getPaymentIntent = async (amount, currency) => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
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
    query: { amount, currency },
  } = req;
  const intent = await getPaymentIntent(amount, currency);
  res.json({ client_secret: intent.client_secret });
});

module.exports = router;
