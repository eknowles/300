import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const jwtCookie = serialize('token', '', {
    path: '/',
    sameSite: true,
    secure: !!process.env.IS_PROD,
  });

  // set cookie and redirect to dashboard
  res.writeHead(302, {
    'Set-Cookie': jwtCookie,
    Location: `/`,
  });

  return res.end();
};
