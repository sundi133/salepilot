import { useEffect, useState } from 'react';
import axios from 'axios';

const InvitationPage = ({ user }: { user: any }) => {
  const [candidateEmail, setCandidateEmail] = useState('');
  const [selectedInterviews, setSelectedInterviews] = useState('');
  const [availableInterviews, setAvailableInterviews] = useState([]);

  // Security fix: Input validation functions
  const isValidEmail = (email: string) => {
    // Simple email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const areValidInterviewIds = (ids: any) => {
    // Accepts a string or array, checks if all are numbers or valid strings (UUIDs, etc.)
    if (Array.isArray(ids)) {
      return ids.every(
        (id) =>
          (typeof id === 'string' && id.length > 0 && id.length < 100) ||
          (typeof id === 'number' && Number.isFinite(id))
      );
    }
    if (typeof ids === 'string') {
      // Comma-separated string of IDs
      const splitIds = ids.split(',').map((id) => id.trim());
      return splitIds.every(
        (id) => id.length > 0 && id.length < 100
      );
    }
    return false;
  };

  const handleSendInvitation = async () => {
    // Security fix: Validate candidateEmail and selectedInterviews before sending to backend
    if (!isValidEmail(candidateEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!areValidInterviewIds(selectedInterviews)) {
      alert('Please select valid interview(s).');
      return;
    }
    try {
      // Make a POST request to create the invitation
      const response = await axios.post('/api/send-invitation', {
        candidateEmail,
        interviewIds: selectedInterviews
      });

      // Handle success and display a confirmation message
      console.log(response.data);
    } catch (error) {
      // Security fix: Avoid logging sensitive error details to the console
      console.error('Error sending invitation.'); 
      // Handle the error and provide feedback to the user
    }
  };

  useEffect(() => {
    const fetchAvailableInterviews = async () => {
      try {
        // Security fix: Do NOT send user-controlled identifiers as query parameters.
        // The backend should use the authenticated user context to determine access.
        const response = await axios.get('/api/available-interviews');
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