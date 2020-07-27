import { client, q } from 'app/helpers/fauna-client';
import { IUserTokenJwt } from 'app/helpers/types';
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'app/helpers/stripe';

interface IBalance {
  amount: number;
  currency: string;
}

export interface IGetAccountBalanceResult {
  balanceAvailable: IBalance;
  balancePending: IBalance;
  totalMembers: number;
  totalPremium: number;
}

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
        totalMembers: q.Count(
          q.Match(
            q.Index('community_profile_membership_by_communityProfile'),
            q.Ref(q.Collection('community_profiles'), communityProfileId)
          )
        ),
        totalPremium: q.Count(
          q.Match(q.Index('community_premium_membership'), [
            q.Ref(q.Collection('community_profiles'), communityProfileId),
            true,
          ])
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
        totalMembers: q.Var('totalMembers'),
        totalPremium: q.Var('totalPremium'),
        isOwner: q.Var('isOwner'),
        stripeAccount: q.Select(
          ['data', 'stripeAccountId'],
          q.Var('communityAccount'),
          null
        ),
      }
    ),
    {
      secret: token.key,
    }
  );

  let balance = {
    available: [{ currency: 'gbp', amount: 0 }],
    pending: [{ currency: 'gbp', amount: 0 }],
  };

  if (faunaResult.stripeAccount) {
    balance = await stripe.balance.retrieve({
      stripeAccount: faunaResult.stripeAccount,
    });
  }

  return res.json({
    balanceAvailable: balance.available[0],
    balancePending: balance.pending[0],
    totalMembers: faunaResult.totalMembers,
    totalPremium: faunaResult.totalPremium,
  });
};

export default getAccountBalance;
