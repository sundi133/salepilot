import React, { useState, useEffect } from 'react';
import '../app/css/globals.css';
import Dot from './dot';

interface Contact {
  email: string;
}

interface EmailEvent {
  id: number;
  contact: Contact;
  eventType: string;
  eventContent: string;
  eventTime: string; // Use string for simplicity, convert to Date for actual use
}

interface EmailEventCardProps {
  event: EmailEvent;
  onSend: (event: EmailEvent) => void;
  onCopy: (event: EmailEvent) => void;
}

interface EmailEventsDisplayProps {
  campaignId: number;
}

interface CopiedStatuses {
  [key: number]: boolean;
}

const EmailEventsDisplay: React.FC<EmailEventsDisplayProps> = ({
  campaignId
}) => {
  const [emailEvents, setEmailEvents] = useState<EmailEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>({});
  const [stopFetch, setStopFetch] = useState(false);
  const [campaignContacts, setCampaignContacts] = useState(-1);

  const fetchEmailEvents = async () => {
    if (stopFetch) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/email-events?campaignId=${campaignId}`
      );
      if (!response.ok) throw new Error('Failed to fetch email events.');
      const emailData = await response.json();
      setEmailEvents(emailData);
      if (campaignContacts === emailData.length) {
        setStopFetch(true); // Stops further fetching if condition is met
      }
    } catch (error) {
      console.error('Error fetching email events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/campaigns?campaignId=${campaignId}`);
        if (!response.ok) throw new Error('Failed to fetch campaign data.');
        const data = await response.json();
        if (data.length > 0) {
          setCampaign(data[0]);
          setCampaignContacts(data[0].numUsers);
        }
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
    // Start interval only after the campaign data is fetched
    if (campaignContacts !== -1) {
      const intervalId = stopFetch
        ? null
        : setInterval(fetchEmailEvents, 10000);
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [campaignId, stopFetch, campaignContacts]); // Added stopFetch to useEffect dependencies

  const handleSendEmail = (event: EmailEvent) => {
    console.log('Sending email:', event);
  };

  const [copiedStatuses, setCopiedStatuses] = useState<CopiedStatuses>({});

  const handleCopy = (eventId: number, event: EmailEvent) => {
    navigator.clipboard
      .writeText(event.eventContent)
      .then(() => {
        // Set the copied status for the specific event ID to true
        setCopiedStatuses((prevStatuses) => ({
          ...prevStatuses,
          [eventId]: true
        }));

        // Optional: Reset copied status for this event ID after 2 seconds
        setTimeout(() => {
          setCopiedStatuses((prevStatuses) => ({
            ...prevStatuses,
            [eventId]: false
          }));
        }, 2000);
      })
      .catch((error) => console.error('Copy failed', error));
  };

  if (isLoading)
    return (
      <div className="text-3xl md:text-4xl font-semibold text-blue-500 mb-8 mt-4 shadow-lg p-2 bg-white-100 rounded-lg border border-white-200 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-300 ease-in-out">
        Loading Emails...
      </div>
    );
  if (!emailEvents.length) {
    return (
      <div className="text-xl flex justify-center items-center font-semibold text-blue-500 mb-2 mt-2">
        <div className="text-xl flex justify-center items-center font-semibold text-blue-500 mb-2 mt-2">
          Generating Emails
          <div className="flex ml-2">
            <Dot delay={300} />
            <Dot delay={600} />
            <Dot delay={900} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto mt-2">
      <div className="text-xl flex justify-center items-center font-semibold text-blue-500 mb-2 mt-2">
        {campaignContacts > 0 && emailEvents.length < campaignContacts
          ? 'Generating Emails'
          : 'Email Generation Completed'}
        <span className="ml-2">
          {campaignContacts > 0
            ? ((emailEvents.length / campaignContacts) * 100).toFixed(2)
            : 0}
          %
        </span>
        {campaignContacts > 0 && emailEvents.length < campaignContacts ? (
          <div className="flex ml-2">
            <Dot delay={300} />
            <Dot delay={600} />
            <Dot delay={900} />
          </div>
        ) : null}
      </div>
      {emailEvents.map((event) => (
        <div className="bg-white p-4 shadow rounded-lg mb-4">
          <div className="mb-2 text-gray-900">
            <strong>To:</strong> {event.contact.email}
          </div>
          <div className="mb-2 text-gray-600">
            <strong>Subject:</strong> {event.eventType}
          </div>
          <div className="mb-4 text-gray-700">
            <strong>Message:</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: event.eventContent.replace(/\n\n/g, '<br /><br />')
              }}
            ></div>
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={() => handleCopy(event.id, event)}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mr-2 ${
                copiedStatuses[event.id]
                  ? 'bg-green-500 hover:bg-green-600'
                  : ''
              }`}
            >
              {copiedStatuses[event.id] ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={() => handleSendEmail(event)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailEventsDisplay;
