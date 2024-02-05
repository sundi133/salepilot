import { addCampaign, addEmailEvent } from '../../../components/prismaService';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { generate } from 'playht';
import OpenAI from 'openai';
import { get } from 'http';
const axios = require('axios');
const cheerio = require('cheerio');
const prisma = require('../../../components/prisma-client');
import apollo from '../../../components/utils/apollo';
const maxTokens = 3000;

const fetchPageContent = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error(`Error fetching the URL: ${url}`, error);
    throw error;
  }
};

const extractInformation = (html) => {
  // Loading the HTML content into cheerio to parse and query the document
  const $ = cheerio.load(html);

  // Extracting the title of the webpage
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');

  // extract all the text from the page
  const bodyText = $('body').text();
  let divTexts = [];
  $('div').each((i, elem) => {
    divTexts.push($(elem).text().trim());
  });

  let pTexts = [];
  $('p').each((i, elem) => {
    pTexts.push($(elem).text().trim());
  });

  let aTexts = [];
  $('a').each((i, elem) => {
    aTexts.push($(elem).text().trim());
  });

  let h1Texts = [];
  $('h1').each((i, elem) => {
    h1Texts.push($(elem).text().trim());
  });

  let h2Texts = [];
  $('h2').each((i, elem) => {
    h2Texts.push($(elem).text().trim());
  });

  return `
  Title: ${title} ${ogTitle}
  Description: ${description} ${ogDescription}
  Body Text: ${bodyText} ${divTexts.join(' ')} ${pTexts.join(
    ' '
  )} ${aTexts.join(' ')} ${h1Texts.join(' ')} ${h2Texts.join(' ')}
  `;
};

const getWebsiteSummary = async (url) => {
  const htmlContent = await fetchPageContent(url);
  const info = extractInformation(htmlContent);
  return info;
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

const generateEmailContent = async (key, templateContent, userPrompt) => {
  const openai = new OpenAI({
    apiKey: key
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
            You are an email generator who is reaching out to a prospect. You have been given a template to use for the email. The template is as follows:
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

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating email:', error);
    throw error; // or return a default error message
  }
};

const generateCommonAttributes = async (key, templateContent, userPrompt) => {
  const openai = new OpenAI({
    apiKey: key
  });

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
          You are an common attributes extractor given data about two people. You have been given the employment data of both the sender and the receiver. 
            ${templateContent}
          `
        },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 600,
      model: 'gpt-4'
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating email:', error);
    throw error; // or return a default error message
  }
};

const generateContent = async (
  campaign,
  templateId,
  contactId,
  key,
  creatorFirstName,
  creatorLastName,
  creatorEmail
) => {
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
  const lastName = contact.lastName || '';
  const email = contact.email || '';

  const personReceiverData = JSON.stringify(
    await apollo.fetchPersonData(firstName, lastName, email)
  );
  const personSenderData = JSON.stringify(
    await apollo.fetchPersonData(
      creatorFirstName,
      creatorLastName,
      creatorEmail
    )
  );

  const systemMessage =
    'You have to extract the common professional attributes between the two people. ';
  const userMessage = `
  **The sender's profile is as follows in JSON format: 
  ### start of JSON
  ${personSenderData}
  ### end of JSON

  **The receiver's profile is as follows in JSON format:
  ### start of JSON
  ${personReceiverData}
  ### end of JSON

  **Parse both the JSON data
  **Generate the common professional attributes between the sender and the receiver based on employment data, location, and other professional attributes.
  `;

  const commonAttributes = await generateCommonAttributes(
    key,
    systemMessage,
    userMessage
  );

  //console.log('Person Receiver Data:', personReceiverData);
  //console.log('Person Sender Data:', personSenderData);
  //console.log('Common Attributes:', commonAttributes);

  const website = contact.companyWebsite || '';
  const websiteContent = await getWebsiteSummary(website);
  const websiteSummary = await getSummary(websiteContent, key);
  const templateContent = template.content;
  const minWords = template.minWords || 150;
  const maxWords = template.maxWords || 300;
  const tone = template.tone || 'professional';
  const userPrompt = `Generate an email to send to ${firstName} using the provided template in a ${tone} tone. 
  **The email should be personalized to the recipient and should be professional.
  **The email should have a personal touch based on the common attributes ${commonAttributes}.
  **Make sure to mention about common professional attributes between the sender and the receiver in order of common company, roles, titles and other professional attributes.
  **Make sure the make the email personalized as per the recipient and the company, company details and how our company can help them.
  **The recipient should be interested in the email and should be willing to respond to it.
  **The recepient title is ${contact.jobTitle} and the company name is ${contact.company}
  **The summary of the company website is as follows:
  ${websiteSummary}
  **Make sure the number of words is between ${minWords} and ${maxWords}
  `;

  const result = await generateEmailContent(key, templateContent, userPrompt);
  return result;
};

export default async function handler(req, res) {
  const { userId, orgId, orgRole, orgSlug } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await clerkClient.users.getUser(userId);
  if (!orgId) {
    res.status(401).json({
      error: 'Please create a organization to proceed furthur',
      code: 'ORG_NOT_FOUND'
    });
  }
  const creatorFirstName = user.firstName;
  const creatorLastName = user.lastName;

  if (req.method === 'POST') {
    const data = req.body;
    const creatorEmail = data.creatorEmail
      ? data.creatorEmail
      : user.emailAddresses[0].emailAddress;
    console.log('creatorEmail', creatorEmail);
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
    delete data.creatorEmail;

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
          key,
          creatorFirstName,
          creatorLastName,
          creatorEmail
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
