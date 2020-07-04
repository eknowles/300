import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { client, q } from 'app/helpers/fauna-client';

const { Call, Function } = q;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { communityId } = req.query;
  const { userProfileId } = decoded;

  try {
    const dbRes = await client.query<any>(
      Call(Function('join_community'), [userProfileId, communityId])
    );

    return res.json({ membershipId: dbRes.ref.id });
  } catch (e) {
    return res.status(400).json({ message: e.description });
  }
};
