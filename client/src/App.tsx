import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_KEY } from "./constants";

import CheckoutForm from "./components/check-out-form/CheckoutForm";
import { getSecret } from "./http";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(STRIPE_KEY);

function App() {
  const [secret, setSecret] = useState<string>("");

  useEffect(() => {
    const fetchSecret = async () => {
      const key = await getSecret({ amount: 20000, currency: "usd" });
      setSecret(key);
    };

    fetchSecret();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm secret={secret} />
    </Elements>
  );
}

export default App;
