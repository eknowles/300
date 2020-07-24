import { client, q } from 'app/helpers/fauna-client';
import Stripe from 'stripe';

const connectCustomerSubscriptionDeleted = async (event: Stripe.Event) => {
  const object = event.data.object as Stripe.Subscription;
  const { membershipId } = object.metadata;
  const { addRole } = object.plan.metadata;

  // todo remove discord roles
  console.info(`[membership] stop premium ${membershipId}`);

  await client.query(
    q.Let(
      {
        membership: q.Get(q.Ref(q.Collection('memberships'), membershipId)),
        updatedMembership: q.Update(q.Select(['ref'], q.Var('membership')), {
          data: {
            isPremium: false,
            subscriptionId: null,
          },
        }),
      },
      {
        membership: q.Var('updatedMembership'),
      }
    )
  );
};

export default connectCustomerSubscriptionDeleted;
