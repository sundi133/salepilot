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

function TemplateList({ searchTerm }: { searchTerm: string }) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const tableHeaderCellStyle =
    'px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider';

  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const [objects, setObjects] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [userMessage, setUserMessage] = useState(
    `No templates found. Click add button to get started`
  ); // Message to display to the user
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
            `/api/search/templates?search=${searchTerm}`
          );
          const searchResults = searchResponse.data;
          setObjects(searchResults);
        } else {
          // If search term is empty, use the default API route
          const response = await axios.get(`/api/templates`);
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

  const [expandedTemplateId, setExpandedTemplateId] = useState(null);

  const handleRowClick = (templateId: any) => {
    setExpandedTemplateId(
      expandedTemplateId === templateId ? null : templateId
    );
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
              <th className={tableHeaderCellStyle}>Name</th>
              <th className={tableHeaderCellStyle}>Type</th>
              <th className={tableHeaderCellStyle}>Content</th>
              <th className={tableHeaderCellStyle}>Created By</th>
              <th className={tableHeaderCellStyle}>Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {objects.map((template: any, index: any) => (
              <React.Fragment key={template.id}>
                <tr
                  onClick={() => handleRowClick(template.id)}
                  className="hover:bg-gray-100 cursor-pointer border"
                >
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {template.name}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {template.campaignType}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {template.content.substring(0, 50)}
                    {template.content.length > 50 ? '...' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {template.creatorName || 'Unknown'}{' '}
                    {/* Assuming you fetch and set `creatorName` elsewhere */}
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                    {new Date(template.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
                {expandedTemplateId === template.id && (
                  <tr
                    className={`whitespace-pre-wrap text-sm leading-5 ${
                      index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td
                      colSpan={5}
                      className="px-6 py-4 whitespace-pre-wrap text-sm leading-5 text-gray-700"
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: template.content.replace(
                            /\n\n/g,
                            '<br /><br />'
                          )
                        }}
                      ></div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TemplateList;
