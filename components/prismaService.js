import prisma from './prisma-client';

const addContact = async (data) => {
  const result = prisma.contact.create({ data });
  return result;
};

const addCampaign = async (data) => {
  const result = prisma.campaign.create({ data });
  return result;
};

const addTemplate = async (data) => {
  const result = prisma.template.create({ data });
  return result;
};

const addUser = async (data) => {
  const result = prisma.user.create({ data });
  return result;
};

const addEmailEvent = async (data) => {
  try {
    const emailEvent = await prisma.emailEvent.create({
      data
    });
    return emailEvent;
  } catch (error) {
    console.error('Error adding EmailEvent:', error);
    throw error; // Rethrow or handle as needed
  }
};

module.exports = {
  addContact,
  addCampaign,
  addTemplate,
  addEmailEvent,
  addUser
};
