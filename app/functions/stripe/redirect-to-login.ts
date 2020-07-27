import { client, q } from 'app/helpers/fauna-client';
import stripe from 'app/helpers/stripe';
import { IUserTokenJwt } from 'app/helpers/types';
import { NextApiRequest, NextApiResponse } from 'next';

const redirectToLogin = async (
  token: IUserTokenJwt,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // everything below needs to be logged in
  if (!token) {
    res.writeHead(302, {
      Location: `/api/oauth2/discord/login?redirect=/communities/${req.query.communityProfileId}`,
    });

    return res.end();
  }

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
};

export default redirectToLogin;
