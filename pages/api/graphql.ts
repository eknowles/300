import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const FAUNA_GRAPHQL_URL = 'https://graphql.fauna.com/graphql';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let key = process.env.FAUNADB_PUBLIC_KEY;
  const { token } = req.cookies;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { key: userKey } = decoded;
      if (userKey) {
        key = userKey;
      }
    } catch (e) {
      // token is either invalid or out of date
    }
  }

  const config = {
    method: 'post' as any,
    url: FAUNA_GRAPHQL_URL,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    data: req.body,
  };

  try {
    const response = await axios(config);

    return res.json(response.data);
  } catch (e) {
    return res.json(e.message);
  }
};
