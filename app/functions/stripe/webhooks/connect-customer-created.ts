import { client, q } from 'app/helpers/fauna-client';
import Stripe from 'stripe';

// connect - customer.created
// this will add a customerId to the membership object
const connectCustomerCreated = async (event: Stripe.Event) => {
  const object = event.data.object as Stripe.Customer;

  // we expect a customer to be created
  if (!object.subscriptions.data[0]) {
    return;
  }

  const sub = object.subscriptions.data[0];
  const { membershipId } = sub.metadata;

  await client.query(
    q.Let(
      {
        membership: q.Get(q.Ref(q.Collection('memberships'), membershipId)),
        updatedMembership: q.Update(q.Select(['ref'], q.Var('membership')), {
          data: { customerId: object.id },
        }),
      },
      {
        membershipObject: q.Var('updatedMembership'),
      }
    )
  );
};

export default connectCustomerCreated;
