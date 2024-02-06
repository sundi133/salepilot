import React, { useState, useEffect } from 'react';
import EmailEventsDisplay from './email-event-display';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  company: string;
  companyWebsite: string;
}
const maxContacts = 10;
interface Template {
  id: number;
  name: string;
  content: string;
}

function CampaignForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(-1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  const [campaign, setCampaign] = useState(null);
  const [campaignId, setCampaignId] = useState<number>(-1);
  const [emailContent, setEmailContent] = useState(''); // State for email content

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [creatorEmail, setCreatorEmail] = useState('');

  const [emailError, setEmailError] = useState('');

  // Function to validate the business email
  const validateEmail = (email: string) => {
    const freeEmailDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'aol.com',
      'outlook.com'
    ];
    const emailDomain = email.split('@')[1];

    if (freeEmailDomains.includes(emailDomain)) {
      setEmailError('Please use your business email address.');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleEmailChange = (e: string) => {
    const email = e;
    setCreatorEmail(email);
    validateEmail(email);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual endpoint
        const response = await fetch('/api/contacts');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        setContacts(data);
        setFilteredContacts(data); // Initialize filtered contacts
      } catch (error) {
        setErrorMessage('Failed to load contacts.');
        console.error('There was an error!', error);
      }
      setIsLoading(false);
    };

    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (!response.ok) throw new Error('Failed to fetch templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
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
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/add/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          templateId: selectedTemplate,
          contacts: selectedContacts,
          status: 'created',
          numUsers: selectedContacts.length,
          creatorEmail,
          emailContent
        })
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setCampaign(data.data);
      setCampaignId(data.data.id);
      setSuccessMessage('Campaign created successfully, generating emails...');
    } catch (error) {
      setErrorMessage('Failed to create campaign.');
      console.error('There was an error!', error);
    }
    setIsLoading(false);
  };
  if (templates.length === 0 || contacts.length === 0) {
    return (
      <div className="container mx-auto p-4 items-center justify-center">
        Loading...
      </div>
    );
  }
  function findContactIndexById(contactId: number) {
    const index = contacts.findIndex((contact) => contact.id === contactId);
    return contacts[index].email;
  }

  const getTemplateContent = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    return template
      ? template.content
      : 'Please select a template to view its content.';
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
        <div>
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label className="block text-gray-700 font-bold mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3 text-gray-700"
                required
              />
            </div>

            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label className="block text-gray-700 font-bold mb-2">
                Your Business Email
              </label>
              <input
                type="text"
                value={creatorEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="w-full border rounded-lg p-3 text-gray-700"
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>
          </div>

          <div className="w-full px-2 mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Select Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(parseInt(e.target.value))}
              className="w-full border rounded-lg p-3 text-gray-700"
              required
            >
              <option value="">Select Template</option>
              {templates.map((template: any) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <div className="px-2 py-4 border rounded-lg bg-gray-50 text-gray-700">
              <div
                contentEditable
                dangerouslySetInnerHTML={{
                  __html: getTemplateContent().replace(/\n\n/g, '<br /><br />')
                }}
                onClick={() => setEmailContent(getTemplateContent())}
                className="outline-none" // Remove outline on focus for aesthetic purposes
              ></div>
            </div>
          </div>
        </div>

        <div className="flex w-full px-2 mb-4 space-x-4 mt-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-bold mb-2">
              Search Contacts
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg p-3 text-gray-700 mb-4"
              placeholder="Search by name or email..."
            />
            <div className="flex flex-wrap w-full mb-2">
              {successMessage && (
                <div className="w-full mb-2">
                  <div className="text-blue-600">{successMessage}</div>
                </div>
              )}

              {errorMessage && (
                <div className="w-full px-2 mb-2 text-red-500">
                  {errorMessage}
                </div>
              )}

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Create'}
              </button>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-gray-700 font-bold mb-2">
              Select Contacts
            </label>
            <select
              id="contactSelect"
              multiple
              value={selectedContacts}
              onChange={(e) =>
                setSelectedContacts(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="w-full border rounded-lg p-3 text-gray-700 h-40 overflow-y-scroll shadow"
              required
            >
              {filteredContacts.map((contact: any) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName} - {contact.email}{' '}
                  {contact.company}
                </option>
              ))}
            </select>
            {selectedContacts.length === 0 && (
              <div className="w-full mb-2 mt-2">
                <li key="no-contacts">No contacts selected</li>
              </div>
            )}

            {selectedContacts.length > 0 && (
              <div className="w-full mb-2 mt-2">
                {selectedContacts.length > 0 && (
                  <p className="text-blue-600">
                    Total contacts selected: {selectedContacts.length}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {successMessage ? (
          <div className="w-full max-w-8xl mx-auto">
            {campaignId >= 0 && <EmailEventsDisplay campaignId={campaignId} />}
          </div>
        ) : (
          campaignId >= 0 && (
            <div className="w-full max-w-8xl mx-auto">Generating email...</div>
          )
        )}

        {/* <div className="flex flex-wrap w-full mb-2">
          {successMessage && (
            <div className="w-full mb-2">
              <div className="text-blue-600">{successMessage}</div>
            </div>
          )}

          {errorMessage && (
            <div className="w-full px-2 mb-2 text-red-500">{errorMessage}</div>
          )}

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Create'}
          </button>
        </div> */}
      </form>
    </div>
  );
}

export default CampaignForm;
