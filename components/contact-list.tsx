import { PrismaClient } from '@prisma/client';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You need to install axios if not already installed
import '../app/css/globals.css';
import Link from 'next/link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faChevronRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';

function ContactList({ searchTerm }: { searchTerm: string }) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const [objects, setObjects] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [userMessage, setUserMessage] =
    useState(`No contacts found. Click add button
  above to get started!`); // Message to display to the user
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(0); // Message to display to the user
  const { session } = useClerk();

  useEffect(() => {
    // Fetch interviews using Prisma
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const response = await axios.get(`/api/interviews`); // Adjust the API route URL if needed
        // const fetchedInterviews = response.data;
        // setInterviews(fetchedInterviews);
        if (searchTerm.trim() !== '') {
          // If search term is non-empty, hit the search API
          const searchResponse = await axios.get(
            `/api/search/contacts?search=${searchTerm}`
          );
          const searchResults = searchResponse.data;
          setObjects(searchResults);
        } else {
          // If search term is empty, use the default API route
          const response = await axios.get(
            `/api/contacts?orgId=${session?.lastActiveOrganizationId}`
          );
          const fetchedObjects = response.data;
          setObjects(fetchedObjects);
        }
        setIsLoading(false); // Data has been fetched
        setSuccessMessage(1);
      } catch (error: any) {
        const code = error.response.data.code;
        setUserMessage('Please create an organization to get started.');
        setSuccessMessage(0);
        console.error('Error fetching interviews:', error);
        setIsLoading(false); // Data fetching failed
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleRowClick = (object: any) => {
    setSelectedInterview((prevSelectedInterview: any) => {
      if (prevSelectedInterview && prevSelectedInterview.id === object.id) {
        return null; // Hide details if the same row is clicked again
      } else {
        return object; // Show details for the clicked row
      }
    });
  };

  if (isLoading || !isLoaded || !userId || !session) {
    // Render loading message
    return (
      <div
        className="container min-w-full text-sm"
        style={{ marginTop: '16px' }}
      >
        Loading...
      </div>
    );
  }
  return (
    <div className="container min-w-full" style={{ marginTop: '16px' }}>
      {objects.length === 0 ? (
        <div className="text-sm">
          <div>
            {successMessage === 1 ? (
              <>{userMessage}</>
            ) : (
              <div>
                {userMessage}
                <Link href={'/create-organization'} className="text-blue-500">
                  {' '}
                  Click here
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <table
          className="container min-w-full border-collapse border table-auto shadow-lg"
          style={{ marginTop: '16px' }}
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                FirstName
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                LastName
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Job_Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Company_Website
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                LinkedIn
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {objects.map((contact: any) => (
              <React.Fragment key={contact.id}>
                <tr
                  key={contact.id}
                  onClick={() => handleRowClick(contact)}
                  className="hover:bg-gray-100 cursor-pointer border"
                >
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {contact.firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {contact.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {contact.email ? contact.email : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {contact.phone ? contact.phone : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {contact.company ? contact.company : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {contact.jobTitle ? contact.jobTitle : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {contact.companyWebsite ? (
                      <a
                        href={contact.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-800"
                      >
                        {contact.companyWebsite}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {contact.linkedIn ? (
                      <a
                        href={contact.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-800"
                      >
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="14"
                            width="12.25"
                            viewBox="0 0 448 512"
                          >
                            <path
                              fill="#0099cc"
                              d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"
                            />
                          </svg>
                        </div>
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ContactList;
