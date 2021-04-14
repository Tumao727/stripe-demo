import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import CardSection from "../card-section/CardSection";
import "./CheckoutForm.css";

export default function CheckoutForm(props: { secret: string }) {
  const { secret } = props;
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    console.log("---- checkout form", secret);
    const result = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: "wang yan",
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.

        alert("pay success!!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button className="button" disabled={!stripe}>
        Confirm order
      </button>
    </form>
  );
}
