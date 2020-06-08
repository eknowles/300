import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

function getAuthedUser() {

}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return res.json(decoded);
}
