import { getSession, getUserSession } from 'next-auth/react';

async function authMiddleware(req, res, next) {
  res.status(200).json({ user: await getSession({ req }) });
}

export default authMiddleware;
