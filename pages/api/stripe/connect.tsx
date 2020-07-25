import createCheckoutSession from 'app/functions/stripe/create-checkout-session';
import listPrices from 'app/functions/stripe/list-prices';
import redirectToLogin from 'app/functions/stripe/redirect-to-login';
import { getUserToken } from 'app/helpers/api';
import { NextApiRequest, NextApiResponse } from 'next';
import openBillingPortal from 'app/functions/stripe/open-billing-portal';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // anything that needs a token
  const token = getUserToken(req);

  if (req.query.action === 'openBillingPortal') {
    return openBillingPortal(token, req, res);
  }

  if (req.query.action === 'prices') {
    return listPrices(token, req, res);
  }

  if (req.query.action === 'checkout') {
    return createCheckoutSession(token, req, res);
  }

  if (req.query.action === 'login') {
    return redirectToLogin(token, req, res);
  }

  return res.json({ ok: true });
};
