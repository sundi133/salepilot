import { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import '../../app/css/globals.css';
import axios from 'axios';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const CampaignDetails = ({ campaign_id: campaign_id }) => {
  const [campaign, setCampaign] = useState([]);
  const { session } = useClerk();
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailEvents, setEmailEvents] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const tableBodyExpandedCellStyle =
    'px-6 py-4 leading-5 bg-white text-sm text-gray-900 whitespace-no-wrap leading-5';

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmails();
      await fetchCampaignData();
    };

    if (status === 'completed' || status === 'error') {
      setIsCompleted(true);
    } else {
      fetchData();

      const interval = setInterval(() => {
        fetchData();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [session, status]); // Add status as a dependency

  if (!session) {
    return null;
  }

  if (!campaign_id) {
    return <div>No campaign ID provided</div>;
  }
  const fetchCampaignData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/campaigns?campaignId=${campaign_id}`
      );

      const data = response.data;
      setCampaign(data[0]);
    } catch (error) {
      console.error('Error fetching QA data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/email-events?campaignId=${campaign_id}`
      );
      if (!response.ok) throw new Error('Failed to fetch email events.');
      const data = await response.json();
      setEmailEvents(data);
    } catch (error) {
      console.error('Error fetching dataset details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [copiedStatus, setCopiedStatus] = useState({});

  const handleCopyContent = (eventId, eventContent) => {
    navigator.clipboard.writeText(eventContent).then(() => {
      // Set this event as copied
      setCopiedStatus((prevStatus) => ({
        ...prevStatus,
        [eventId]: true
      }));
    });
  };

  const downloadEmailEventsCSV = () => {
    const csvRows = [
      // Define CSV headers
      `"ID","Email","Company","Event Content"`
    ];

    // Iterate over email events and convert each to a CSV row
    emailEvents.forEach((event) => {
      const csvRow = [
        `"${event.id}"`,
        `"${event.contact.email}"`,
        `"${event.contact.company}"`,
        `"${event.eventContent.replace(/"/g, '""')}"` // Escape double quotes
      ].join(',');
      csvRows.push(csvRow);
    });

    // Convert rows to CSV string
    const csvString = csvRows.join('\n');

    // Create a Blob with CSV data
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emails.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-xl font-semibold mb-4">
          Campaign Name: {campaign.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-bold">Status:</span>{' '}
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                campaign.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : campaign.status === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {campaign.status}
            </span>
          </p>
          <p>
            <span className="font-bold">Scheduled Time:</span>{' '}
            {campaign.scheduledTime
              ? new Date(campaign.scheduledTime).toLocaleString()
              : 'Not Scheduled'}
          </p>
          <p>
            <span className="font-bold">Sent Time:</span>{' '}
            {campaign.sentTime
              ? new Date(campaign.sentTime).toLocaleString()
              : 'Not Sent'}
          </p>
          <p>
            <span className="font-bold">Number of Users:</span>{' '}
            {campaign.numUsers}
          </p>
          <p>
            <span className="font-bold">Template Name:</span>{' '}
            {campaign.template?.name || 'No Template'}
          </p>
          <p className="md:col-span-2">
            <span className="font-bold">
              Template Message:
              <br />
            </span>{' '}
            {campaign.template?.content ? (
              <span className="whitespace-pre-wrap">
                {campaign.template?.content}
              </span>
            ) : (
              'No Template'
            )}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Generated Emails</h2>
      <div className="relative flex items-center w-full">
        {' '}
        <input
          disabled={!session}
          type="text"
          placeholder="Search contacts... press enter to submit"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          // onKeyDown={handleSearch}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {emailEvents.length > 0 && (
        <>
          <div className="flex justify-end mt-4">
            <button
              onClick={downloadEmailEventsCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 ease-in-out"
            >
              <FontAwesomeIcon icon={faDownload} /> Download CSV
            </button>
          </div>
          <div className="space-y-6 mt-4">
            {/* Existing map function for displaying email events */}
          </div>
        </>
      )}

      {emailEvents.length > 0 ? (
        <div className="space-y-6 mt-4">
          {emailEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="bg-gray-100 p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">{event.contact.email}</h3>
                <p className="text-sm text-gray-600">{event.contact.company}</p>
              </div>
              <div className="bg-white p-4">
                <div className="whitespace-pre-line text-gray-800 mb-4">
                  {event.eventContent}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() =>
                      handleCopyContent(event.id, event.eventContent)
                    }
                    className={`px-4 py-2 text-white rounded transition-colors duration-200 ease-in-out ${
                      copiedStatus[event.id]
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {copiedStatus[event.id] ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() =>
                      console.log('Send functionality to be implemented')
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 ease-in-out"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No email events found for this campaign.</p>
      )}
    </main>
  );
};

export default CampaignDetails;
