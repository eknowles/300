import { getUserToken } from 'app/helpers/api';
import { NextApiRequest, NextApiResponse } from 'next';
import stripe from 'app/helpers/stripe';
import { client, q } from 'app/helpers/fauna-client';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = getUserToken(req);

  if (!token) {
    res.writeHead(302, {
      Location: `/api/oauth2/discord/login?redirect=/communities/${req.query.communityProfile}/admin`,
    });

    return res.end();
  }

  if (req.query.action === 'login') {
    const { communityProfileId } = req.query;
    const result = await client.query<{ stripeUserId: string | null }>(
      q.Let(
        {
          communityAccount: q.Get(
            q.Match(
              q.Index('community_account_by_community_profile'),
              q.Ref(q.Collection('community_profiles'), communityProfileId)
            )
          ),
          userOwnsCommunity: q.Equals(
            q.Identity(),
            q.Select(['data', 'ownerAccount'], q.Var('communityAccount'))
          ),
        },
        {
          stripeUserId: q.If(
            q.Var('userOwnsCommunity'),
            q.Select(['data', 'stripeAccountId'], q.Var('communityAccount')),
            null
          ),
        }
      ),
      {
        secret: token.key,
      }
    );

    if (!result.stripeUserId) {
      return res.json({ ok: false });
    }

    const { url } = await stripe.accounts.createLoginLink(result.stripeUserId, {
      redirect_url: `${process.env.ROOT_DOMAIN}/communities/${communityProfileId}/admin`,
    });

    res.writeHead(302, {
      Location: url,
    });

    return res.end();
  }

  return res.json({ ok: true });
};
