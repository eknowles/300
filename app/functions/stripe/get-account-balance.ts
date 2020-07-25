import { client, q } from 'app/helpers/fauna-client';
import { IUserTokenJwt } from 'app/helpers/types';
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'app/helpers/stripe';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getAccountBalance = async (
  token: IUserTokenJwt,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { communityProfileId } = req.query;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  //
  const faunaResult = await client.query<any>(
    q.Let(
      {
        totalCount: q.Count(
          q.Match(
            q.Index('community_profile_membership_by_communityProfile'),
            q.Ref(q.Collection('community_profiles'), communityProfileId)
          )
        ),
        communityAccountRef: q.Match(
          q.Index('community_account_by_community_profile'),
          q.Ref(q.Collection('community_profiles'), communityProfileId)
        ),
        communityAccount: q.Get(q.Var('communityAccountRef')),
        isOwner: q.Equals(
          q.Select(['data', 'ownerAccount'], q.Var('communityAccount')),
          q.Identity()
        ),
      },
      {
        totalCount: q.Var('totalCount'),
        isOwner: q.Var('isOwner'),
        stripeAccount: q.Select(
          ['data', 'stripeAccountId'],
          q.Var('communityAccount')
        ),
      }
    ),
    {
      secret: token.key,
    }
  );

  const balance = await stripe.balance.retrieve({
    stripeAccount: faunaResult.stripeAccount,
  });

  const subscriptions = await stripe.subscriptions
    .list(
      { status: 'active' },
      {
        stripeAccount: faunaResult.stripeAccount,
      }
    )
    .autoPagingToArray({ limit: 50 });

  return res.json({
    balanceAvailable: balance.available[0],
    balancePending: balance.pending[0],
    totalMembers: faunaResult.totalCount,
    subscriptions,
  });
};

export default getAccountBalance;
