import { getUserToken } from 'app/helpers/api';
import { client, q } from 'app/helpers/fauna-client';
import { NextApiRequest, NextApiResponse } from 'next';

const { Call, Function } = q;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = getUserToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  const { communityId } = req.query;
  const { userProfileId } = token;

  try {
    const dbRes = await client.query<any>(
      Call(Function('join_community'), [userProfileId, communityId])
    );

    return res.json({ membershipId: dbRes.ref.id });
  } catch (e) {
    return res.status(400).json({ message: e.description });
  }
};
