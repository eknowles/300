/* eslint-disable no-console */

import stripe from 'app/helpers/stripe';
import { NextApiRequest, NextApiResponse } from 'next';

// TODO this

// https://stripe.com/docs/connect/webhooks
// account.application.deauthorized - Occurs when a user disconnects from your account and can be used to trigger required cleanup on your server. Available for Standard accounts.
// account.updated - Allows you to monitor changes to connected account requirements and status changes. Available for Express and Custom accounts.
// person.updated - If you use the Persons API, allows you to monitor changes to requirements and status changes for individuals. Available for Express and Custom accounts.
// payment_intent.succeeded - Occurs when a payment intent results in a successful charge. Available for all payments, including destination and direct charges
// balance.available - Occurs when your Stripe balance has been updated (e.g., when funds you've added from your bank account are available for transfer to your connected account).
// account.external_account.updated - Occurs when a bank account or debit card attached to a connected account is updated, which can impact payouts. Available for Express and Custom accounts.
// payout.failed - 	Occurs when a payout fails. When a payout fails, the external account involved will be disabled, and no automatic or manual payouts can go through until the external account is updated. Available for Express and Custom accounts.

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.isProd && !req.body.livemode) {
    // ignore test cases on prod
    return res.json({ received: true });
  }

  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      JSON.stringify(req.body, null, 2),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event);

  return res.json({ received: true });

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(event);
      // Unexpected event type
      return res.json({ received: true });
    // return res.status(400).end();
  }

  // Return a response to acknowledge receipt of the event
  return res.json({ received: true });
};
