import { NextApiRequest, NextApiResponse } from 'next';
import { client, q } from 'app/helpers/fauna-client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { profileId } = req.query;

  const { data } = await client.query(
    q.Get(q.Ref(q.Collection('profiles'), profileId))
  );

  return res.json(data);
};
