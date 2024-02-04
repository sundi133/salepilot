import { useEffect, useState } from 'react';
import axios from 'axios';

const InvitationPage = ({ user }: { user: any }) => {
  const [candidateEmail, setCandidateEmail] = useState('');
  const [selectedInterviews, setSelectedInterviews] = useState('');
  const [availableInterviews, setAvailableInterviews] = useState([]);

  const handleSendInvitation = async () => {
    try {
      // Make a POST request to create the invitation
      const response = await axios.post('/api/send-invitation', {
        candidateEmail,
        interviewIds: selectedInterviews
      });

      // Handle success and display a confirmation message
      console.log(response.data);
    } catch (error) {
      console.error('Error sending invitation:', error);
      // Handle the error and provide feedback to the user
    }
  };

  useEffect(() => {
    const fetchAvailableInterviews = async () => {
      try {
        const creatorEmail = user.email;
        const response = await axios.get(
          `/api/available-interviews?creatorEmail=${creatorEmail}`
        ); // Adjust the API route URL as needed
        const availableInterviewsData = response.data;
        setAvailableInterviews(availableInterviewsData);
      } catch (error) {
        console.error('Error fetching available interviews:', error);
      }
    };

    fetchAvailableInterviews();
  }, []);

  // Render the form for selecting interviews and sending invitations

  return (
    <div>
      <p>Send an invitation to a candidate to take an interview.</p>

      {/* Render a form to enter the candidate's email address */}

      {/* Render a list of available interviews and allow selection */}
      {/* For each interview, create a checkbox or a list of checkboxes */}
      {availableInterviews.map((interview: any) => (
        <div key={interview.id}>
          <label>
            <input
              type="checkbox"
              value={interview.id}
              checked={selectedInterviews.includes(interview.id)}
            />
            {interview.jobRoleName}
          </label>
        </div>
      ))}

      <button onClick={handleSendInvitation}>Send Invitation</button>
    </div>
  );
};

export default InvitationPage;
