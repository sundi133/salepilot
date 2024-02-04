import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../../app/navbar';
import SignInButtons from '../../../app/sign-in-buttons';
import Breadcrumbs from '../../../components/breadcrumbs';
import '../../../app/css/globals.css';
import Link from 'next/link';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import ShowInvites from './show-invites';
import Footer from '../../../components/footer';
import {
  generateRandomHexNumber,
  generateRandomPinCode
} from '../../../components/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@clerk/nextjs';

function InterviewDetails() {
  const router = useRouter();
  const { id } = router.query; // Get the candidate ID from the route
  const [availableInterviews, setAvailableInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const [candidate, setCandidate] = useState();
  const [invitations, setInvitations] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id && !hasFetchedData) {
      (async () => {
        try {
          setIsLoading(true);
          const candidateResponse = await fetch(`/api/candidate/${id}`);
          const candidateData = await candidateResponse.json();
          setCandidate(candidateData);
          setAvailableInterviews(candidateData.interviews);

          const invitationsResponse = await fetch(
            `/api/invitations?candidateId=${parseInt(id)}`
          );
          const invitationsData = await invitationsResponse.json();
          setInvitations(invitationsData);

          setHasFetchedData(true); // Set the flag to true after fetching data
        } catch (error) {
          console.error('Error fetching candidate details:', error);
        }
        setIsLoading(false);
      })();
    }
  }, [id]);

  if (!candidate) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const handleSelectChange = (e) => {
    setSelectedInterview(e.target.value);
  };

  async function refreshInvitations() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/invitations?candidateId=${parseInt(id)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
    setIsLoading(false);
  }

  const handleCreateInvitation = async () => {
    try {
      setIsLoading(true);
      // Make a POST request to your API endpoint to create an invitation
      const invitationId = generateRandomHexNumber(32);
      setSuccessMessage('Sending invitation...');
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidateId: candidate.id,
          interviewId: parseInt(selectedInterview),
          pinCode: generateRandomPinCode(6),
          invitationId: invitationId
        })
      });

      if (response.ok) {
        await response.json();
        const candidateId = parseInt(candidate.id);
        setSuccessMessage('Invitation created successfully');
        const invitations = await fetch(
          `/api/invitations?candidateId=${candidateId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await invitations.json();
        setInvitations(data);
      } else {
        // Handle errors if needed
        // You can also display an error message to the user
      }
    } catch (error) {
      // Handle any network or server errors
      console.error('Error creating invitation:', error);
      // You can set an error message here
    }
    setSuccessMessage('Invitation created successfully');
    setIsLoading(false);
  };

  const breadcrumbs = [
    { label: 'Candidate', href: '/candidate' },
    { label: 'Create Invite', href: `/invite/candidate/${id}` }
  ];

  if (!candidate) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div>
      {candidate ? (
        <div>
          <main className="p-4 md:p-0 mx-auto max-w-7xl">
            <Navbar />
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Grid numItemsSm={1} numItemsLg={3} className="gap-12">
              <main className="p-4 md:p-0 mx-auto max-w-7xl">
                <div
                  className="container w-full rounded p-2 text-sm mx-auto p-0 items-center justify-center text-sm"
                  style={{ marginTop: '8px' }}
                >
                  <h2 className="text-xl font-bold mt-4">Candidate Details:</h2>
                  <p style={{ marginTop: '12px' }}>
                    <span className="font-bold">ID: </span>
                    {candidate.id}
                  </p>
                  <p>
                    <span className="font-bold">Name: </span>
                    {candidate.name}
                  </p>
                  <p>
                    <span className="font-bold">Email: </span>
                    {candidate.email}
                  </p>
                  <p>
                    <span className="font-bold">Resume: </span>

                    {candidate.resume && (
                      <Link
                        href={candidate.resume}
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </Link>
                    )}
                  </p>
                  <p>
                    <span className="font-bold">Phone: </span>
                    {candidate.phone}
                  </p>
                  <p>
                    <span className="font-bold">LinkedIn: </span>
                    {candidate.linkedin}
                  </p>
                  {/* Other candidate details can be displayed here */}

                  {/* Display available interviews as a select box */}
                  <h2 className="text-xl font-bold mt-4">
                    Select an Interview:
                  </h2>

                  <div className="mb-4 flex flex-wrap">
                    <div className="w-full md:w-1/2 pr-2">
                      <select
                        onChange={handleSelectChange}
                        value={selectedInterview}
                        className="mt-2 p-2 border border-gray-900 rounded w-full bg-white text-sm text-gray-800 focus:outline-none focus:ring focus:border-blue-500"
                      >
                        <option value="">-- Select an interview --</option>
                        {availableInterviews.map((interview) => (
                          <option key={interview.id} value={interview.id}>
                            {`${interview.jobRoleName} (ID: ${interview.id})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full md:w-1/2 pr-2">
                      <Button
                        className="mt-2 bg-gray-900 text-white hover:bg-gray-700 border-white hover:border-white"
                        onClick={handleCreateInvitation}
                        disabled={!selectedInterview}
                        style={{
                          marginTop: '8px',
                          padding: '8px', // Add some padding for better spacing
                          borderRadius: '4px', // Add border radius for rounded corners
                          width: '100%' // Make it 100% width
                        }}
                        isLoading={isLoading}
                      >
                        Create Invitation
                      </Button>
                    </div>

                    <div className="w-full pr-2">
                      {successMessage && (
                        <div className="mb-2 py-2 flex flex-wrap text-gray-900 font-semibold rounded text-sm">
                          {successMessage}
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mt-2">
                    Existing Invitations:
                  </h2>

                  <div className="mb-4 flex flex-wrap">
                    <div className="w-full pr-2 mt-2">
                      Share the <span className="font-semibold"> Link</span> and{' '}
                      <span className="font-semibold">Pincode</span> with the
                      candidate
                    </div>
                    <div className="w-full md:w-1/2 pr-2">
                      <Button
                        className="mt-2 bg-gray-900 text-white hover:bg-gray-700 border-white hover:border-white"
                        onClick={refreshInvitations}
                        style={{
                          marginTop: '8px',
                          padding: '8px',
                          borderRadius: '4px',
                          width: '100%'
                        }}
                        isLoading={isLoading}
                      >
                        Refresh Invitations
                      </Button>
                    </div>
                  </div>

                  <ShowInvites invitations={invitations} />
                </div>
              </main>
            </Grid>
          </main>
        </div>
      ) : (
        <SignInButtons />
      )}
    </div>
  );
}

export default InterviewDetails;
