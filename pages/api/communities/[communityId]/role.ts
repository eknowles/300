import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { client, q } from 'app/helpers/fauna-client';

const { Exists, Match, Index, Ref, Collection, Let, If, Var, Select, Get } = q;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ role: null, authenticated: false });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { communityId } = req.query;
  const { userProfileId } = decoded;

  const role = await client.query(
    Let(
      {
        membership: Match(Index('community_user_membership'), [
          Ref(Collection('user_profiles'), userProfileId),
          Ref(Collection('community_profiles'), communityId),
        ]),
      },
      If(
        Exists(Var('membership')),
        Select(['data', 'role'], Get(Var('membership'))),
        null
      )
    )
  );

  return res.json({ role, authenticated: true });
};
