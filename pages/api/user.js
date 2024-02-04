import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';

export default async function handler(req, res) {
  const { userId, orgId, orgRole, orgSlug } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await clerkClient.users.getUser(userId);
  const creatorEmail = user.emailAddresses[0].emailAddress;
  const name = user.firstName + ' ' + user.lastName;
  if (req.method === 'GET') {
    try {
      res.status(200).json({
        name: name,
        email: creatorEmail,
        orgId: orgId,
        orgRole: orgRole,
        orgSlug: orgSlug
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
