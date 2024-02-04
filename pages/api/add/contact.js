import { addContact } from '../../../components/prismaService';
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
  if (!orgId) {
    res.status(401).json({
      error: 'Please create a organization to proceed furthur',
      code: 'ORG_NOT_FOUND'
    });
  }
  const name = user.firstName + ' ' + user.lastName;

  if (req.method === 'POST') {
    const data = req.body;
    data.orgId = orgId;
    data.creatorEmail = creatorEmail;
    data.creatorName = name;

    try {
      const existingContact = await prisma.contact.findFirst({
        where: {
          email: data.email,
          orgId: orgId
        }
      });
      if (existingContact) {
        res.status(200).json({
          message: 'Contact already exists',
          data: existingContact.id
        });
      }
      const result = await addContact(data); // Use Prisma service to insert data
      res.status(200).json({
        message: 'Contact added successfully',
        data: result.id
      });
    } catch (error) {
      console.error('Error adding interview:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
