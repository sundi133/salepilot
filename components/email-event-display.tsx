import React, { useState, useEffect } from 'react';

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

const EmailEventCard: React.FC<EmailEventCardProps> = ({
  event,
  onSend,
  onCopy
}) => {
  const handleSend = () => onSend(event);
  const handleCopy = () => {
    navigator.clipboard.writeText(event.eventContent);
    onCopy(event);
  };

  return (
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
          onClick={handleCopy}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mr-2"
        >
          Copy
        </button>
        <button
          onClick={handleSend}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

const EmailEventsDisplay: React.FC<EmailEventsDisplayProps> = ({
  campaignId
}) => {
  const [emailEvents, setEmailEvents] = useState<EmailEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>({});
  const [stopFetch, setStopFetch] = useState(false);
  useEffect(() => {
    
    const fetchCampaign = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/campaigns?campaignId=${campaignId}`
          );
          if (!response.ok) throw new Error('Failed to fetch email events.');
          const data = await response.json();
          if(data.length > 0) {
            setCampaign(data[0]);
          }
        } catch (error) {
          console.error('Error fetching email events:', error);
        } finally {
          setIsLoading(false);
        }
      };

    const fetchEmailEvents = async () => {
      setIsLoading(true);
      try {
        if(stopFetch) {
          return;
        }
        const response = await fetch(
          `/api/email-events?campaignId=${campaignId}`
        );
        if (!response.ok) throw new Error('Failed to fetch email events.');
        const data = await response.json();
        setEmailEvents(data);
        if(campaign.numUsers === emailEvents.length) {
          setStopFetch(true);
        }
      } catch (error) {
        console.error('Error fetching email events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
    fetchEmailEvents();

    const intervalId = setInterval(fetchEmailEvents, 10000);
    return () => clearInterval(intervalId);
  }, [campaignId]);

  const handleSendEmail = (event: EmailEvent) => {
    console.log('Sending email:', event);
    // Implement sending email logic here
  };

  const handleCopyEmailContent = (event: EmailEvent) => {
    console.log('Email content copied:', event);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        Generating Emails...
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto mt-2">
      <div className="text-xl flex justify-center items-center font-semibold text-blue-500 mb-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        Generated Emails
        <div className="mt-2 grid grid-cols-4 text-sm">
          <div className="flex justify-start items-justify-start">
            <div className="loader"></div>
          </div>
        </div>
      </div>
      {emailEvents.map((event) => (
        <EmailEventCard
          key={event.id}
          event={event}
          onSend={handleSendEmail}
          onCopy={handleCopyEmailContent}
        />
      ))}
    </div>
  );
};

export default EmailEventsDisplay;
