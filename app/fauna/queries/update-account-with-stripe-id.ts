import { client, q } from 'app/helpers/fauna-client';

const { Update, Collection, Ref } = q;

const UpdateAccountWithStripeId = (accountId, stripeCustomerId) =>
  client.query(
    Update(Ref(Collection('accounts'), accountId), {
      data: { stripeCustomerId },
    })
  );

export default UpdateAccountWithStripeId;
