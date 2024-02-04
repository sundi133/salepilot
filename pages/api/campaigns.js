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
    const campaignId = req.query.campaignId;
    try {
      let whereCondition = {};

      if (campaignId) {
        whereCondition = { orgId: orgId, id: parseInt(campaignId) };
      } else if (orgId) {
        whereCondition = { orgId: orgId };
      } else {
        res.status(400).json({ error: 'Missing required parameters' });
      }

      const campaigns = await prisma.campaign.findMany({
        where: whereCondition,
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          template: true
        }
      });

      res.status(200).json(campaigns);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
