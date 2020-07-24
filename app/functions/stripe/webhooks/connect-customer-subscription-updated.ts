import { client, q } from 'app/helpers/fauna-client';
import Stripe from 'stripe';

const connectCustomerSubscriptionUpdated = async (event: Stripe.Event) => {
  const object = event.data.object as Stripe.Subscription;
  const { membershipId } = object.metadata;
  const { addRole } = object.plan.metadata;
  const dataToUpdate: any = {};
  const oldStatus = (event.data.previous_attributes as Stripe.Subscription)
    ?.status;

  if (oldStatus) {
    if (object.status === 'active' && addRole) {
      // this event has a status change to active, so we can now start the setup process.
      // eslint-disable-next-line no-console
      console.info(`[membership] start premium ${membershipId}`);
      const roles = addRole.split(',');
      // todo add discord guild roles to users discord

      // set membership to premium
      dataToUpdate.isPremium = true;
      dataToUpdate.subscriptionId = object.id;
    }
  }

  // set subscription on membership
  // @link https://stripe.com/docs/billing/subscriptions/overview#subscription-statuses
  await client.query(
    q.Let(
      {
        membership: q.Get(q.Ref(q.Collection('memberships'), membershipId)),
        updatedMembership: q.Update(q.Select(['ref'], q.Var('membership')), {
          data: { ...dataToUpdate },
        }),
      },
      {
        membership: q.Var('updatedMembership'),
      }
    )
  );
};

export default connectCustomerSubscriptionUpdated;
