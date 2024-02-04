import { addCampaign, addEmailEvent } from '../../../components/prismaService';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { generate } from 'playht';
import OpenAI from 'openai';
import { get } from 'http';
const prisma = require('../../../components/prisma-client');
const playwright = require('playwright');
const maxTokens = 3000;

const getWebsiteSummary = async (website) => {
  const browser = await playwright.chromium.launch({
    headless: true, // Set to false if you want to see the browser UI
    timeout: 10000
  });
  const page = await browser.newPage();
  await page.goto(website);

  // Read the title of the page
  const title = await page.title();

  // Read the description of the page
  const description = await page.$eval(
    'meta[name="description"]',
    (el) => el.content
  );

  // Read the body text of the page
  const bodyText = await page.$eval('body', (el) => el.innerText);

  const websiteSummary = `
  Title: ${title}
  Description: ${description}
  Body Text: ${bodyText}
  `;
  await browser.close();
  return websiteSummary;
};

const getSummary = async (content, key) => {
  const openai = new OpenAI({
    apiKey: key
  });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          You are a summary generator who is summarizing a website. You have been given a website to summarize.
        `
      },
      {
        role: 'user',
        content: `
        **Summarize the following content:
        ${content.substring(0, maxTokens)}
      `
      }
    ],
    temperature: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    model: 'gpt-3.5-turbo'
  });

  const result = completion.choices[0].message.content;

  return result;
};

const generateContent = async (campaign, templateId, contactId, key) => {
  const contact = await prisma.contact.findUnique({
    where: {
      id: parseInt(contactId)
    }
  });

  const template = await prisma.template.findUnique({
    where: {
      id: parseInt(templateId)
    }
  });

  const firstName = contact.firstName || '';
  const website = contact.companyWebsite || '';
  const websiteContent = await getWebsiteSummary(website);
  const websiteSummary = await getSummary(websiteContent, key);
  const templateContent = template.content;
  const minWords = template.minWords || 150;
  const maxWords = template.maxWords || 300;
  const userPrompt = `Generate an email to send to ${firstName} using the provided template.
  The email should be personalized to the recipient and should be professional.
  The recipient should be interested in the email and should be willing to respond to it.
  The recepient title is ${contact.jobTitle} and the company name is ${contact.company}
  The summary of the company website is as follows:
  ${websiteSummary}
  **Make sure the make the email personalized as per the recipient and the company, company details and how our company can help them.
  **Make sure the number of words is between ${minWords} and ${maxWords}   
  `;

  const openai = new OpenAI({
    apiKey: key
  });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          You are a email generator who is reaching out to a prospect. You have been given a template to use for the email. The template is as follows:
          ${templateContent}

        `
      },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    model: 'gpt-4'
  });

  const result = completion.choices[0].message.content;

  return result;
};

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
    const contactIds = data.contacts;
    const templateId = data.templateId;
    const key = process.env.OPENAI_API_KEY;

    data.orgId = orgId;
    data.userId = userId;
    data.template = {
      connect: { id: data.templateId }
    };
    data.numUsers = contactIds.length;
    delete data.templateId;
    delete data.contacts;

    try {
      const campaign = await addCampaign(data); // Use Prisma service to insert data

      res.status(200).json({
        message: 'Template added successfully',
        data: campaign
      });

      contactIds.forEach(async (contactId) => {
        const emailContent = await generateContent(
          campaign,
          templateId,
          contactId,
          key
        );
        const tuple = {
          campaignId: campaign.id,
          contactId: parseInt(contactId),
          eventContent: emailContent, // This should be the content of the email
          eventType: 'Email Generated', // This should be the type of the event based on the template
          eventTime: new Date(), // Ensure eventTime is a Date object
          orgId,
          userId
        };
        addEmailEvent(tuple);
      });
    } catch (error) {
      console.error('Error adding Template:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
