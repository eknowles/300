import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from 'antd';
import CardSection from '../card-section';

const StripeSetupIntentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const card = elements.getElement(CardElement);

    console.log(card);

    const result = await stripe.confirmCardSetup('{{CLIENT_SECRET}}', {
      payment_method: {
        card,
        billing_details: {
          name: 'Jenny Rosen',
        },
      },
    });

    if (result.error) {
      // Display result.error.message in your UI.
    } else {
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <Button
        htmlType="submit"
        size="large"
        block
        type="primary"
        disabled={!stripe}
      >
        Save Card
      </Button>
    </form>
  );
};

export default StripeSetupIntentForm;
