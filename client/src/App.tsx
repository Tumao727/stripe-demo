import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISH_KEY } from "./constants";

import CheckoutForm from "./components/check-out-form/CheckoutForm";
import { createCheckoutSession, getSecret } from "./http";
import "./App.css";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);

function App() {
  const [secret, setSecret] = useState<string>("");
  const [amount, setAmount] = useState<number>(10000);
  const [email, setEmail] = useState<string>("");

  const currency = "usd";

  useEffect(() => {
    if (amount && email) {
      const fetchSecret = async () => {
        const res = await getSecret({ amount, currency, email });
        const key = res && res.client_secret;
        setSecret(key);
      };

      fetchSecret();
    }
  }, [amount, email]);

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    if (value) {
      setAmount(value);
    }
  };

  const handleEmailChange = (event: any) => {
    const value = event?.target.value;
    if (value) {
      setEmail(value);
    }
  };

  const handleClick = async () => {
    const stripe = await stripePromise;

    const res = await createCheckoutSession();

    console.log("------ res", res);

    const { id } = res;
    const result = await stripe!.redirectToCheckout({
      sessionId: id,
    });
    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      alert(result.error.message);
    }
  };

  return (
    <section className="wrapper">
      <div className="input-wrapper">
        <label className="label">email</label>
        <input type="text" onBlur={handleEmailChange} />
      </div>
      <div className="input-wrapper">
        <label className="label">amount</label>
        <input type="number" defaultValue={amount} onBlur={handleInputChange} />
      </div>

      <div>
        <Elements stripe={stripePromise}>
          <CheckoutForm secret={secret} />
        </Elements>

        <div className="checkout-wrapper">
          <div className="product">
            <img
              src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592298909.jpg"
              alt="cat"
            />
            <div className="description">
              <h3>Cat</h3>
              <p>$20.00</p>
            </div>
          </div>
          <button
            className="button"
            type="button"
            role="link"
            onClick={handleClick}
          >
            Checkout
          </button>
        </div>
      </div>
    </section>
  );
}

export default App;
