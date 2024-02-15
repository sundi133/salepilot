import {
  addCampaign,
  addEmailEvent,
  addUser
} from '../../../components/prismaService';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { generate } from 'playht';
import OpenAI from 'openai';
import { get } from 'http';
const axios = require('axios');
const cheerio = require('cheerio');
const prisma = require('../../../components/prisma-client');
import apollo from '../../../components/utils/apollo';
import scaleserp from '../../../components/utils/scaleserp';
const maxTokens = 3000;
const puppeteer = require('puppeteer');

const fetchPageContent = async (url) => {
  try {
    // const { data } = axios.get(url, {
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
    //   }
    // })
    // return data;

    const browser = await puppeteer.launch();

    // Open a new page.
    const page = await browser.newPage();

    // Navigate to the specified URL.
    await page.goto(url);

    // Wait for the page title to load.
    const title = await page.title();

    // Log the page title.
    console.log(`The title of the page is: ${title}`);

    const htmlContent = await page.content();

    // Close the browser session.
    await browser.close();

    return htmlContent;
  } catch (error) {
    console.error(`Error fetching the URL: ${url}`, error);
    return '';
  }
};

const extractInformation = (html) => {
  try {
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
  Body Text: ${bodyText}`;
    //${divTexts.join(' ')} ${pTexts.join(
    //   ' '
    // )} ${aTexts.join(' ')} ${h1Texts.join(' ')} ${h2Texts.join(' ')}
  } catch (error) {
    console.error('Error extracting information:', error);
    return '';
  }
};

const getWebsiteSummary = async (url) => {
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  console.log('URL:', url);
  const htmlContent = await fetchPageContent(url);
  const info = extractInformation(htmlContent);
  console.log('Info:', info);
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
            You are an email generator who is generating a email message based on a provided template. 
            ** Never change the text which is in between the template tags {{fixed_text_start}} and {{fixed_text_end}}, keep it exactly as it is in the template.
            ** Personalize the email based on the following template:
            ### start of template
            ${templateContent}   
            ### end of template
            `
        },
        {
          role: 'user',
          content: `
        
        ${userPrompt}`
        }
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
      model: 'gpt-3.5-turbo-0125'
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
  creatorEmail,
  user,
  emailTemplateContent,
  productSummary
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
  const linkedIn = contact.linkedIn || '';

  const personReceiverData =
    contact.apolloData !== null
      ? contact.apolloData
      : JSON.stringify(
          await apollo.fetchPersonData(firstName, lastName, email, linkedIn)
        );
  if (!contact.apolloData) {
    await prisma.contact.update({
      where: {
        id: parseInt(contactId)
      },
      data: {
        apolloData: personReceiverData
      }
    });
  }

  const scaleserpData =
    contact.scaleserpData !== null
      ? contact.scaleserpData
      : JSON.stringify(
          await scaleserp.fetchNewsData(
            `latest+news+on+${contact.companyWebsite}`
          )
        );
  if (contact.scaleserpData === null) {
    await prisma.contact.update({
      where: {
        id: parseInt(contactId)
      },
      data: {
        scaleserpData: scaleserpData
      }
    });
  } else {
  }

  const organic_results = JSON.parse(scaleserpData).organic_results
    ? JSON.parse(scaleserpData).organic_results.slice(0, 5)
    : [];
  console.log('Organic Results:', organic_results);
  const personSenderData =
    user.apolloData !== null
      ? user.apolloData
      : JSON.stringify(
          await apollo.fetchPersonData(
            creatorFirstName,
            creatorLastName,
            creatorEmail,
            ''
          )
        );
  if (user.apolloData === null) {
    //console.log('Updating User Apollo Data:', personSenderData);
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        apolloData: personSenderData
      }
    });
  } else {
    //console.log('User Apollo Data:', user.apolloData);
  }

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

  // console.log('Person Receiver Data:', personReceiverData);
  // console.log('Person Sender Data:', personSenderData);
  // console.log('Common Attributes:', commonAttributes);

  const website = contact.companyWebsite || '';
  const websiteContent = await getWebsiteSummary(website);
  const websiteSummary = await getSummary(websiteContent, key);
  const templateContent = emailTemplateContent;
  const minWords = template.minWords || 150;
  const maxWords = template.maxWords || 300;
  const tone = template.tone || 'professional';
  const userPrompt = `
  **Generate an email to ${firstName} using the provided template in a ${tone} tone.**
  **Personalize the email** to increase the likelihood of a positive response by:
  
  ** Highlighting how our partnership can help them achieve their goals.
  
  ** Personalize by mentioning commonalities between the sender and receipient share (company, roles, titles, etc.). Extract the commonalities from the following:
    ### start of common attributes 
    ${commonAttributes} 
    ### end of common attributes.

    ** Personalize by mentioning about their recent news which is as follows:
    ### start of recent news
    ${organic_results}
    ### end of recent news

    ** Personalize the message based their receiver's company's product / services which is as follows:
    ### start of summary 
    ${websiteSummary} 
    ### end of summary.
   
    ** Personalize the message based their sender's product or services which is as follows
    ### start of summary 
    ${productSummary} 
    ### end of summary.
  
  ** Target word count:** ${minWords} - ${maxWords}.

  **Sender:** ${creatorFirstName} <span class="math-inline">\{creatorLastName\} \(<</span>{creatorEmail}>).

  **Recipient:** ${contact.jobTitle} at ${contact.company}.

  **End with a clear call to action.

  **Note:** The email should be plain text, free of colors, fonts, and formatting.

  `;

  let result = await generateEmailContent(key, templateContent, userPrompt);
  result = result
    .replaceAll('{{fixed_text_start}}', '')
    .replaceAll('{{fixed_text_end}}', '');
  return [result, commonAttributes];
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

    const creatorName = data.creatorName.split(' ');
    const creatorFirstName = creatorName[0];
    const creatorLastName = creatorName.slice(1).join(' ');

    const emailTemplateContent = data.emailContent;
    const contactIds = data.contacts;
    const templateId = data.templateId;
    const productSummary = data.productSummary;

    const key = process.env.OPENAI_API_KEY;

    data.userId = userId;
    data.template = {
      connect: { id: data.templateId }
    };
    data.numUsers = contactIds.length;
    delete data.templateId;
    delete data.contacts;
    delete data.creatorEmail;
    delete data.emailContent;
    delete data.creatorName;
    delete data.productSummary;

    try {
      const campaign = await addCampaign(data); // Use Prisma service to insert data

      res.status(200).json({
        message: 'Template added successfully',
        data: campaign
      });

      let user = await prisma.user.findMany({
        where: {
          userId: userId,
          orgId: data.orgId,
          creatorEmail: creatorEmail,
          creatorName: creatorFirstName + ' ' + creatorLastName
        }
      });
      if (!user[0]) {
        user = await addUser({
          userId: userId,
          orgId: data.orgId,
          creatorEmail: creatorEmail,
          creatorName: creatorFirstName + ' ' + creatorLastName
        });
      } else {
        user = user[0];
      }

      contactIds.forEach(async (contactId) => {
        const [emailContent, commonAttributes] = await generateContent(
          campaign,
          templateId,
          contactId,
          key,
          creatorFirstName,
          creatorLastName,
          creatorEmail,
          user,
          emailTemplateContent,
          productSummary
        );
        const tuple = {
          campaignId: campaign.id,
          contactId: parseInt(contactId),
          eventContent: emailContent, // This should be the content of the email
          eventType: 'Email Generated', // This should be the type of the event based on the template
          eventTime: new Date(), // Ensure eventTime is a Date object
          orgId: data.orgId,
          userId,
          commonAttributes
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
