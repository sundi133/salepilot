import React, { useState, useEffect } from 'react';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const emailTemplates = [
  {
    label: 'The Direct Approach',
    content: `Hey {{firstName}},

Ready to boost {{company}}'s marketing game to unprecedented levels? Your role as {{jobTitle}} is pivotal, and with our email marketing platform, you're equipped to drive remarkable results.

{{ai_personalize}} tailored for {{company_website}} in a {{tone}} manner.

Let's chat about how our platform can revolutionize your marketing. How about a quick demo?

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

  // Update email content when the selected template changes
  const handleTemplateChange = (e: any) => {
    const selected = emailTemplates.find(
      (template) => template.label === e.target.value
    );
    setSelectedTemplate(e.target.value);
    setEmailContent(selected ? selected.content : '');
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
          tone
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
    '{{sender_email_signature}}'
  ];

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

          <div className="w-full px-2 mb-4">
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

          <div className="w-full px-2 mb-4">
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

        <div className="flex flex-wrap w-full px-2 mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Save Template'}
          </button>
        </div>

        {errorMessage && (
          <div className="flex flex-wrap w-full px-2 mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="flex flex-wrap w-full px-2 mb-4 text-green-500">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default TemplateForm;
