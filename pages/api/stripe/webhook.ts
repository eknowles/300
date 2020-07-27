/* eslint-disable no-console */
import stripe from 'app/helpers/stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import {
  connectCustomerCreated,
  connectCustomerSubscriptionCreated,
  connectCustomerSubscriptionUpdated,
  connectCustomerSubscriptionDeleted,
} from 'app/functions/stripe/webhooks';

// https://stripe.com/docs/connect/webhooks
// account.application.deauthorized - Occurs when a user disconnects from your account and can be used to trigger required cleanup on your server. Available for Standard accounts.
// account.updated - Allows you to monitor changes to connected account requirements and status changes. Available for Express and Custom accounts.
// person.updated - If you use the Persons API, allows you to monitor changes to requirements and status changes for individuals. Available for Express and Custom accounts.
// payment_intent.succeeded - Occurs when a payment intent results in a successful charge. Available for all payments, including destination and direct charges
// balance.available - Occurs when your Stripe balance has been updated (e.g., when funds you've added from your bank account are available for transfer to your connected account).
// account.external_account.updated - Occurs when a bank account or debit card attached to a connected account is updated, which can impact payouts. Available for Express and Custom accounts.
// payout.failed - 	Occurs when a payout fails. When a payout fails, the external account involved will be disabled, and no automatic or manual payouts can go through until the external account is updated. Available for Express and Custom accounts.

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.isProd && !req.body.livemode) {
    // ignore test cases on prod
    return res.json({ received: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sig = req.headers['stripe-signature']!;
  const buf = await buffer(req);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.created':
      await connectCustomerCreated(event);
      break;
    case 'customer.subscription.created':
      await connectCustomerSubscriptionCreated(event);
      break;
    case 'customer.subscription.updated':
      await connectCustomerSubscriptionUpdated(event);
      break;
    case 'customer.subscription.deleted':
      await connectCustomerSubscriptionDeleted(event);
      break;
    default:
      // Unexpected event type
      return res.json({ received: true });
  }

  // Return a response to acknowledge receipt of the event
  return res.json({ received: true });
};

export default cors(webhookHandler as any);
