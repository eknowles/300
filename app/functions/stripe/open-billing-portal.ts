import { client, q } from 'app/helpers/fauna-client';
import stripe from 'app/helpers/stripe';
import { IUserTokenJwt } from 'app/helpers/types';
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const openBillingPortal = async (
  token: IUserTokenJwt,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const customer = await client.query<string>(
    q.Select(['data', 'stripeCustomerId'], q.Get(q.Identity())),
    {
      secret: token.key,
    }
  );

  const { url } = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${process.env.ROOT_DOMAIN}/dashboard`,
  });

  res.writeHead(302, {
    Location: url,
  });

  return res.end();
};

export default openBillingPortal;
