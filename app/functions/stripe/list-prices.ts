import { client, q } from 'app/helpers/fauna-client';
import stripe from 'app/helpers/stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { IPremiumPrice, IUserTokenJwt } from 'app/helpers/types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const listPrices = async (
  token: IUserTokenJwt,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { communityProfileId } = req.query;
  let dbResult;

  // get stripe account for a community profile id
  try {
    dbResult = await client.query<any>(
      q.Let(
        {
          communityAccount: q.Get(
            q.Match(
              q.Index('community_account_by_community_profile'),
              q.Ref(q.Collection('community_profiles'), communityProfileId)
            )
          ),
          membershipSet: q.Match(
            q.Index('community_user_membership'),
            q.Ref(
              q.Collection('user_profiles'),
              (token && token.userProfileId) || '0'
            ),
            q.Ref(q.Collection('community_profiles'), communityProfileId)
          ),
        },
        {
          stripeAccountId: q.Select(
            ['data', 'stripeAccountId'],
            q.Var('communityAccount'),
            null
          ),
          membership: q.If(
            q.Exists(q.Var('membershipSet')),
            q.Get(q.Var('membershipSet')),
            null
          ),
        }
      )
    );
  } catch (e) {
    // index was not found so we return a 404
    return res.status(404).json({ message: 'Community not found' });
  }

  const { stripeAccountId, membership } = dbResult;

  // account has not setup stripe connect account yet
  if (!stripeAccountId) {
    return res.json([]);
  }

  if (membership && membership.data.customerId) {
    // user is a member... not sure what to do here...
    // todo make this better
    // return res.status(400).json({ message: 'Already a member' });
  }

  // fetch prices from stripe (only fetch recurring)
  const list = await stripe.prices
    .list(
      { active: true, type: 'recurring' },
      { stripeAccount: stripeAccountId }
    )
    .autoPagingToArray({ limit: 10 });

  // format list
  const formattedList: IPremiumPrice[] = list.map((price) => ({
    id: price.id,
    name: price.nickname,
    currency: price.currency,
    product: price.product as string,
    unitAmount: price.unit_amount,
    metadata: price.metadata,
    interval: price.recurring.interval,
    intervalCount: price.recurring.interval_count,
  }));

  return res.json(formattedList);
};

export default listPrices;
