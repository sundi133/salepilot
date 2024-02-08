import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface FollowUpConfig {
  delayDays: number;
  content: string;
  template?: string;
}

const emailTemplates = [
  {
    label: 'The Direct Approach',
    content: `Hey {{firstName}},

{{Start with a personal message addressing {{firstName}}{{lastName}} working at {{company}}

{{ai_personalize}} tailored for {{company}} in a {{tone}} manner.

How about a quick demo to see how we can help you achieve your budget goals?

Best,
{{sender_email_signature}}
`
  },
  {
    label: 'The Problem-Solver',
    content: `Hello {{firstName}},

Struggling to convert leads into loyal customers at {{company}}? You're not alone. As {{jobTitle}}, you have the power to change this narrative. Our platform is the solution you've been seeking.

Generate {{ai_personalize}} message here inspired by {{company_website}} in a {{tone}} manner.

Interested in a solution that works? Let's set up a demo.

Cheers,
{{sender_email_signature}}
`
  },
  {
    label: 'The Visionary',
    content: `Dear {{firstName}},

Imagine a future where every lead becomes a loyal customer of {{company}}. As {{jobTitle}}, you're at the forefront of this transformation, thanks to our advanced email marketing tools.

Generate {{ai_personalize}} message here, curated for {{company_website}} in a {{tone}} manner.

Shall we explore this vision together during a demo?

Sincerely,
{{sender_email_signature}}
`
  },
  {
    label: 'The Challenger',
    content: `Hi {{firstName}},

Ever wonder why some {{company}} campaigns excel and others don't? The difference is often in the tools used. As the {{jobTitle}}, you have the challenge and opportunity to elevate your marketing.

Generate {{ai_personalize}} message here leveraging insights from {{company_website}} in a {{tone}} manner.

Dare to see the difference? I’d love to show you in a demo.

Regards,
{{sender_email_signature}}
`
  },
  {
    label: 'The Enthusiastic Partner',
    content: `Hello {{firstName}},

Excited about taking {{company}}'s marketing to new heights? We are too! With your insights as {{jobTitle}} and our email marketing platform, there's no limit to what we can achieve together.

Generate {{ai_personalize}} message here drawing from {{company_website}} in a {{tone}} manner.

Eager for a collaboration that changes the game? Let’s start with a demo.

Warmly,
{{sender_email_signature}}
`
  }
];

const followUpTemplates = [
  {
    label: 'The Gentle Reminder',
    content: `Hi {{firstName}},

I hope this message finds you well! A little while ago, we discussed how our email marketing platform could empower you as {{jobTitle}} at {{company}}, enabling you to achieve remarkable marketing success. I'm reaching out to see if you've had a chance to consider our conversation and how our solutions can be tailored to meet {{company_website}}'s unique needs in a {{tone}} manner.

We understand how busy you must be, but I believe a quick demo could really showcase the potential impact on your marketing strategies and results. It’s a great opportunity to see firsthand how our platform can simplify your efforts while maximizing engagement and ROI.

{{ai_personalize}} message here, tailored for {{company_website}} in a {{tone}} manner based on {{recent_public_news}}.

Could we schedule a brief call or demo at your convenience this week? Let me know what works best for you.

Looking forward to your reply and hoping to partner with you to take {{company}}'s marketing to the next level.

Best regards,

{{sender_email_signature}}
`
  },
  {
    label: 'The Value Reminder',
    content: `Hello {{firstName}},
    
  I hope you're doing well. I wanted to follow up on our recent conversation about how our email marketing platform can revolutionize {{company}}'s marketing strategies and results.
  
  {{ai_personalize}} message here, tailored for {{company_website}} in a {{tone}} manner based on {{recent_public_news}}.

  Are there any questions or concerns I can address? Your feedback is invaluable, and we’re here to provide all the information you need to make the best decision for {{company}}.

  Could we schedule a brief call or demo at your convenience this week? Let me know what works best for you.

  Warm regards,
  
  {{sender_email_signature}}
    `
  }
];

function TemplateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [status, setStatus] = useState('');
  const [campaignType, setCampaignType] = useState('email');
  const [tone, setTone] = useState('casual');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [emailContent, setEmailContent] = useState(''); // State for email content

  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(
    'The Direct Approach'
  );
  const [minimumWords, setMinimumWords] = useState(200);
  const [maximumWords, setMaximumWords] = useState(250);
  const [followUpDelay, setFollowUpDelay] = useState(1);
  const [followUpContent, setFollowUpContent] = useState('');
  const [showFollowUpConfig, setShowFollowUpConfig] = useState(false);

  const { session } = useClerk();

  // Update email content when the selected template changes
  const handleTemplateChange = (e: any) => {
    const selected = emailTemplates.find(
      (template) => template.label === e.target.value
    );
    setSelectedTemplate(e.target.value);
    setEmailContent(selected ? selected.content : '');
  };

  const handleTemplateChangeFollowUp = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const selectedTemplateLabel = event.target.value;
    const selectedTemplate = followUpTemplates.find(
      (template) => template.label === selectedTemplateLabel
    );

    updateFollowUp(index, 'template', selectedTemplateLabel);
    if (selectedTemplate) {
      updateFollowUp(index, 'content', selectedTemplate.content);
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      // try {
      //   // Replace with your actual endpoint
      //   const response = await fetch('/api/contacts');
      //   if (!response.ok) throw new Error('Network response was not ok.');
      //   const data = await response.json();
      //   setContacts(data);
      //   setFilteredContacts(data); // Initialize filtered contacts
      // } catch (error) {
      //   setErrorMessage('Failed to load contacts.');
      //   console.error('There was an error!', error);
      // }
      setIsLoading(false);
      setSelectedTemplate('The Direct Approach');
      const selected = emailTemplates.find(
        (template) => template.label === 'The Direct Approach'
      );
      setEmailContent(selected ? selected.content : '');
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    // Filter contacts based on the search term
    const filtered = contacts.filter((contact: Contact) =>
      `${contact.firstName} ${contact.lastName} ${contact.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const toggleFollowUpConfig = () => setShowFollowUpConfig(!showFollowUpConfig);

  const handleSubmit = async (e: any) => {
    console.log('selectedContacts', selectedContacts);
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/add/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          campaignType,
          content: emailContent,
          tone,
          minWords: minimumWords,
          maxWords: maximumWords,
          orgId: session?.lastActiveOrganizationId
        })
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setSuccessMessage('Template created successfully');
    } catch (error) {
      setErrorMessage('Failed to create. Try once again');
      console.error('There was an error!', error);
    }
    setIsLoading(false);
  };

  const availableTags = [
    '{{firstName}}',
    '{{lastName}}',
    '{{company}}',
    '{{email}}',
    '{{jobTitle}}',
    '{{ai_personalize}}',
    '{{company_website}}',
    '{{tone}}',
    '{{fixed_text_start}}',
    '{{fixed_text_end}}'
    //'{{recent_public_news}}'
  ];

  const [followUps, setFollowUps] = useState<FollowUpConfig[]>([]);

  // Function to add a new follow-up
  const addFollowUp = () => {
    if (followUps.length < 4) {
      const newFollowUp: FollowUpConfig = {
        delayDays: 1, // Assuming 1 day as a default delay
        content: '', // Default to empty
        template: '' // No default template selected
      };
      setFollowUps([...followUps, newFollowUp]);
    } else {
      alert('Maximum of 4 follow-ups allowed.');
    }
  };

  // Function to remove a follow-up
  const removeFollowUp = (index: number) => {
    setFollowUps(followUps.filter((_, i) => i !== index));
  };

  // Function to update follow-up fields
  const updateFollowUp = (
    index: number,
    field: keyof FollowUpConfig,
    value: string | number
  ) => {
    const newFollowUps = [...followUps];
    if (field === 'delayDays' && typeof value === 'number') {
      newFollowUps[index][field] = value;
    } else if (field === 'content' && typeof value === 'string') {
      newFollowUps[index][field] = value;
    }
    setFollowUps(newFollowUps);
  };

  return (
    <div className="container mx-auto p-4 items-center justify-center">
      <form
        className="w-full border rounded-lg p-4 text-md bg-white shadow-sm"
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full px-2 mb-4">
            <label className="block text-gray-700 font-bold mb-1 mt-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-3 text-gray-700"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-1 mt-1">
              Type
            </label>
            <select
              value={campaignType}
              onChange={(e) => setCampaignType(e.target.value)}
              className="w-full border rounded-lg p-3 text-gray-700"
              required
            >
              <option value="">Select Type</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="w-full md:w-1/2 px-2">
            <label className="block text-gray-700 font-bold mb-1 mt-1">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border rounded-lg p-3 text-gray-700"
              required
            >
              <option value="">Select Type</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="neutral">Neutral</option>
              <option value="informative">Informative</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-1 mt-1">
              Minimum Words
            </label>
            <input
              type="number"
              value={minimumWords}
              onChange={(e) => setMinimumWords(parseInt(e.target.value))}
              className="w-full border rounded-lg p-3 text-gray-700"
              required
            />
          </div>

          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-1 mt-1">
              Maximum Words
            </label>
            <input
              type="number"
              value={maximumWords}
              onChange={(e) => setMaximumWords(parseInt(e.target.value))}
              className="w-full border rounded-lg p-3 text-gray-700"
              required
            />
          </div>
        </div>

        {campaignType === 'email' && (
          <div className="w-full px-2 mb-4">
            <label className="block text-gray-700 font-bold mb-1">
              Content
            </label>
            <p className="text-gray-600 mb-2">
              Use the following tags to personalize your email content:
            </p>
            <div className="mb-4">
              {availableTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {tag}
                </span>
              ))}
            </div>

            <label className="block text-gray-700 font-bold mb-1">
              Select a Template
            </label>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full border rounded-lg p-3 text-gray-700 mb-4 mt-1"
            >
              <option value="">Select a Template</option>
              {emailTemplates.map((template, index) => (
                <option key={index} value={template.label}>
                  {template.label}
                </option>
              ))}
            </select>

            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="w-full border rounded-lg p-3 text-gray-700"
              placeholder="Select a template or start typing here..."
              style={{ minHeight: '300px' }}
            ></textarea>

            <div className="text-gray-600 mt-2 text-sm">
              <p>**Edit the content above to personalize your email. </p>
            </div>
          </div>
        )}
      </form>

      <form
        className="w-full border rounded-lg p-4 text-md bg-white shadow-sm"
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {/* Existing form elements */}

        {/* Render follow-up configurations */}
        {followUps.map((followUp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Follow-Up #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeFollowUp(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Delay (Days)</label>
              <input
                type="number"
                value={followUp.delayDays.toString()}
                onChange={(e) =>
                  updateFollowUp(index, 'delayDays', parseInt(e.target.value))
                }
                className="w-full border rounded-lg p-2"
                min="1"
              />
            </div>
            <div>
              <select
                value={followUp.template}
                onChange={(e) => handleTemplateChangeFollowUp(e, index)}
                className="w-full border rounded-lg p-2 mb-2"
              >
                <option value="">Select a Template</option>
                {followUpTemplates.map((template) => (
                  <option key={template.label} value={template.label}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Email Content</label>
              <textarea
                value={followUp.content}
                onChange={(e) =>
                  updateFollowUp(index, 'content', e.target.value)
                }
                className="w-full border rounded-lg p-2"
                style={{ minHeight: '300px' }}
              ></textarea>
            </div>
          </div>
        ))}

        {errorMessage && (
          <div className="flex flex-wrap w-full px-2 mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="flex flex-wrap w-full px-2 mb-4 text-blue-600">
            {successMessage}
          </div>
        )}
        <div className="flex flex-wrap w-full px-2 mb-4">
          {followUps.length < 4 && (
            <button
              type="button"
              onClick={addFollowUp}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Add Follow-Up
            </button>
          )}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Save Template'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TemplateForm;
