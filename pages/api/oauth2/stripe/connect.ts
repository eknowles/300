import { getUserToken } from 'app/helpers/api';
import { client, q } from 'app/helpers/fauna-client';
import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';
import jwt from 'jsonwebtoken';

import stripe from 'app/helpers/stripe';
import { IUserTokenJwt } from 'app/helpers/types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.code) {
    // exchange the code for a token from stripe
    let stripeTokenResponse;

    try {
      stripeTokenResponse = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code: req.query.code as string,
      });
    } catch (e) {
      res.writeHead(302, {
        Location: `/?error=invalid_stripe_token`,
      });

      return res.end();
    }

    let callbackStateDecodedJwt;

    // decode the state jwt to get the user and community account
    try {
      callbackStateDecodedJwt = jwt.verify(
        req.query.state,
        process.env.JWT_SECRET
      );
    } catch (e) {
      // jwt failed so we reject this
      // maybe we should mark this stripe account as fraud?
      return res.json({
        message: 'oauth state did not pass validation, please contact support',
        stripeAccountId: stripeTokenResponse.stripe_user_id,
      });
    }

    // store stripe tokens in db
    await client.query(
      q.Let(
        {
          createdStripeAccountToken: q.Create(
            q.Collection('stripe_account_tokens'),
            {
              data: stripeTokenResponse,
            }
          ),
          updatedCommunityAccount: q.Update(
            q.Ref(
              q.Collection('community_accounts'),
              callbackStateDecodedJwt.communityAccountId
            ),
            {
              data: {
                stripeAccountToken: q.Select(
                  ['ref'],
                  q.Var('createdStripeAccountToken')
                ),
                stripeAccountId: stripeTokenResponse.stripe_user_id,
              },
            }
          ),
        },
        {
          communityAccount: q.Var('updatedCommunityAccount'),
        }
      )
    );

    res.writeHead(302, {
      Location: `/communities/${callbackStateDecodedJwt.communityProfileId}/admin`,
    });

    return res.end();
  }

  const token = getUserToken(req);

  // if not logged in redirect user to login
  if (!token) {
    res.writeHead(302, {
      Location: `/api/oauth2/discord/login?redirect=/communities/${req.query.communityProfile}/admin`,
    });

    return res.end();
  }

  // decode token
  try {
    const {
      communityId,
      businessType,
      businessName,
      email,
      country,
      firstName,
      lastName,
      dobDay,
      dobMonth,
      dobYear,
    } = req.query;

    // check if user is owner of requested community profile
    // todo move this into a function
    const dbRes = await client.query(
      q.Let(
        {
          communityAccount: q.Get(
            q.Match(
              q.Index('community_account_by_community_profile'),
              q.Ref(q.Collection('community_profiles'), communityId)
            )
          ),
        },
        q.If(
          q.Equals(
            q.Identity(),
            q.Select(['data', 'ownerAccount'], q.Var('communityAccount'))
          ),
          q.Var('communityAccount'),
          null
        )
      ),
      {
        secret: token.key,
      }
    );

    if (dbRes === null) {
      // fraud request, trying to assume ownership of community
      res.writeHead(302, { Location: '/?error=invalid_token' });

      return res.end();
    }

    // prepare stripe oauth params
    const params: any = {
      redirect_uri: `${process.env.ROOT_DOMAIN}/api/oauth2/stripe/connect`,
      client_id: process.env.STRIPE_CONNECT_CLIENT_ID,
      state: jwt.sign(
        {
          userAccountId: token.userAccountId,
          communityAccountId: dbRes.ref.id,
          communityProfileId: communityId,
        },
        process.env.JWT_SECRET
      ),
      stripe_user: {
        email,
        url: `300.team/communitites/${communityId}/join`,
        business_type: businessType,
        business_name: businessName,
        country,
        first_name: firstName,
        last_name: lastName,
        dob_day: dobDay,
        dob_month: dobMonth,
        dob_year: dobYear,
      },
    };

    const url = `https://connect.stripe.com/express/oauth/authorize?${qs.stringify(
      params
    )}`;

    res.writeHead(302, { Location: url });
    return res.end();
  } catch (e) {
    // something went wrong
    res.writeHead(302, { Location: '/?error=unknown' });

    return res.end();
  }
};
