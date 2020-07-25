import { client, q } from 'app/helpers/fauna-client';
import Stripe from 'stripe';

// connect - customer.subscription.created
// this will add a subscription to the membership
const connectCustomerSubscriptionCreated = async (event: Stripe.Event) => {
  const object = event.data.object as Stripe.Subscription;

  const { membershipId } = object.metadata;

  // set subscription on membership
  await client.query(
    q.Update(q.Ref(q.Collection('memberships'), membershipId), {
      data: {}, // todo all hooks happen at once, we need to think of a way to enter into a queue at a time
    })
  );
};

export default connectCustomerSubscriptionCreated;
