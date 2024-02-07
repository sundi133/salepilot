import prisma from '../../components/prisma-client';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';

export default async function handler(req, res) {
  const { userId, orgId, orgRole, orgSlug } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    const contactId = req.query.contactId;

    try {
      let whereCondition = {};

      if (contactId) {
        whereCondition = { orgId: orgId, id: parseInt(contactId) };
      } else if (orgId) {
        whereCondition = { orgId: orgId };
      } else {
        res.status(400).json({ error: 'Missing required parameters' });
      }

      const contacts = await prisma.contact.findMany({
        where: whereCondition,
        orderBy: {
          updatedAt: 'desc'
        }
      });

      res.status(200).json(contacts);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
