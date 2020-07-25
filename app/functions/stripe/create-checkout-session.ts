import { client, q } from 'app/helpers/fauna-client';
import stripe from 'app/helpers/stripe';
import { IUserTokenJwt } from 'app/helpers/types';
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createCheckoutSession = async (
  token: IUserTokenJwt,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { priceId, communityProfileId } = req.query;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const stripeIds = await client.query<{
    user: string;
    account: string;
    email: string;
    publishableKey: string;
    membership: any;
    isOwner: boolean;
  }>(
    q.Let(
      {
        membership: q.Call(q.Function('join_community'), [
          token.userProfileId,
          communityProfileId,
        ]),
        userAccount: q.Get(
          q.Ref(q.Collection('user_accounts'), token.userAccountId)
        ),
        communityAccount: q.Get(
          q.Match(
            q.Index('community_account_by_community_profile'),
            q.Ref(q.Collection('community_profiles'), communityProfileId)
          )
        ),
        stripeCustomerId: q.Select(
          ['data', 'stripeCustomerId'],
          q.Var('userAccount')
        ),
        userEmail: q.Select(['data', 'email'], q.Var('userAccount')),
        stripeAccountId: q.Select(
          ['data', 'stripeAccountId'],
          q.Var('communityAccount')
        ),
        stripePublishableKey: q.Select(
          ['data', 'stripe_publishable_key'],
          q.Get(
            q.Select(['data', 'stripeAccountToken'], q.Var('communityAccount'))
          )
        ),
      },
      {
        membership: q.Var('membership'),
        publishableKey: q.Var('stripePublishableKey'),
        email: q.Var('userEmail'),
        user: q.Var('stripeCustomerId'),
        account: q.Var('stripeAccountId'),
        isOwner: q.Equals(
          q.Ref(q.Collection('user_accounts'), token.userAccountId),
          q.Select(['data', 'ownerAccount'], q.Var('communityAccount'))
        ),
      }
    )
  );

  if (stripeIds.isOwner) {
    return res
      .status(400)
      .json({ message: 'Community Owners can not purchase premium.' });
  }

  const communityUrl = `${process.env.ROOT_DOMAIN}/communities/${communityProfileId}`;

  let customerParams = {};

  // if membership has been found use customerId
  if (stripeIds.membership.data.customerId) {
    // if user is already a premium member, they should not be able to buy a new subscription
    if (stripeIds.membership.data.isPremium) {
      return res
        .status(400)
        .json({ message: 'You already have a Premium membership' });
    }

    // update session to use existing customer
    customerParams = {
      customer: stripeIds.membership.data.customerId,
    };
  } else {
    // user does not have a previous customer with this account so pass the email to the checkout
    customerParams = {
      customer_email: stripeIds.email,
    };
  }

  const session = await stripe.checkout.sessions.create(
    {
      ...customerParams,
      client_reference_id: token.userAccountId,
      payment_method_types: ['card'],
      mode: 'subscription',
      subscription_data: {
        application_fee_percent: 10,
        metadata: {
          membershipId: stripeIds.membership.ref.id,
          userDiscordId: token.discordId,
          userProfileId: token.userProfileId,
          communityProfileId: communityProfileId as string,
        },
      },
      line_items: [
        {
          price: priceId as string,
          quantity: 1,
        },
      ],
      success_url: `${communityUrl}?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${communityUrl}?subscription=cancelled`,
    },
    {
      stripeAccount: stripeIds.account,
    }
  );

  return res.json({ id: session.id, publishableKey: stripeIds.publishableKey });
};

export default createCheckoutSession;
