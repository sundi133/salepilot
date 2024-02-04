import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../app/navbar';
import { signIn, signOut, useSession } from 'next-auth/react';
import SignInButtons from '../../app/sign-in-buttons';
import Breadcrumbs from '../../components/breadcrumbs';
import '../../app/css/globals.css';
import Link from 'next/link';
import React, { Fragment } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Grid } from '@tremor/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@clerk/nextjs';
import TemplateList from '../../components/template-list';
import { useClerk } from '@clerk/nextjs';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import {
  generateRandomHexNumber,
  generateRandomPinCode
} from '../../components/utils';
const maxRating = 10;
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
function InterviewDetails() {
  const router = useRouter();
  const { id } = router.query; // Get the interview ID from the route
  const [linkCopied, setLinkCopied] = useState(false);

  const [interview, setInterview] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-700 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-700 tracking-wider whitespace-no-wrap leading-5';

  const { session } = useClerk();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [candidateIds, setCandidateIds] = useState([]);
  const [listKey, setListKey] = useState(0);

  const fetchData = async (id) => {
    fetch(`/api/interviews/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setInterview(data.interview);
      })
      .catch((error) => {
        console.error('Error fetching interview details:', error);
      });
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
    setInterviewId(id);
  }, [id]);

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;

        // Check if 'text' is a string before splitting
        if (typeof text === 'string') {
          // Assuming the file is a CSV with name and email columns
          const lines = text.split('\n');
          const numberOfLines = lines.length;
          if (numberOfLines > 100) {
            setErrorMessage('Max 100 rows are allowed');
            setIsLoading(false);
            return;
          }
          const promises = [];

          lines.forEach((line) => {
            if (line.trim() === '') return;
            if (line.includes(',')) {
              const [name, email] = line.split(',');

              if (name === '') return;
              if (email === '') return;
              if (!email.includes('@')) return;

              try {
                const promise = fetch('/api/add/candidate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    name,
                    email,
                    resume: '',
                    phone: '',
                    linkedin: ''
                  })
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {
                    const candidateId = data.data;
                    setCandidateIds((prevIds) => [...prevIds, candidateId]);
                    return candidateId;
                  })
                  .catch((error) => {
                    console.error('Error creating candidate:', error);
                  });
                promises.push(promise);
              } catch (error) {
                console.error('Error creating candidate:', error);
              } finally {
              }
            }
          });
          Promise.all(promises)
            .then((allCandidateIds) => {
              const add_interview_promises = [];
              allCandidateIds.forEach((candidateId) => {
                const response = fetch('/api/send-invitation', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    candidateId: candidateId,
                    interviewId: parseInt(interview.id),
                    pinCode: generateRandomPinCode(6),
                    invitationId: generateRandomHexNumber(32)
                  })
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {
                    return data;
                  })
                  .catch((error) => {
                    console.error('Error creating invitation:', error);
                  });

                add_interview_promises.push(response);
              });

              Promise.all(add_interview_promises).then((data) => {
                setSuccessMessage('All invitations are created successfully');
                setIsLoading(false);
                setListKey(listKey + 1);
              });
            })
            .catch((error) => {
              console.error(
                'Error with one of the candidate creations:',
                error
              );
            });
        } else {
          setErrorMessage('Oops! Something went wrong. Please try again.');
          // Handle the case where 'text' is not a string
          console.error('File content is not a string.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleQuestionClick = (questionId) => {
    setSelectedQuestion(questionId === selectedQuestion ? null : questionId);
  };

  const getStarRating = (averageRating) => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 !== 0;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    const stars = Array(fullStars).fill('★'); // Full stars
    if (hasHalfStar) stars.push('½'); // Half star
    const empty = Array(emptyStars).fill('☆'); // Empty stars

    return [...stars, ...empty].join(' ');
  };

  if (!session) {
    // Handle the case where there is no active session
    return null;
  }

  if (!interview) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const breadcrumbs = [
    { label: 'Interview', href: '/' },
    { label: 'Interview Details', href: `/interviews/${interviewId}` }
  ];

  const handleSearch = async (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(event.currentTarget.value);
    }
  };

  const copyInterviewLink = async () => {
    const interviewLink = `${DOMAIN}/assessment/interview/${interview.interviewId}`;
    try {
      await navigator.clipboard.writeText(interviewLink);
      console.log('Interview link copied to clipboard:', interviewLink);
      setLinkCopied(true);
      // Optionally, reset the state after a few seconds
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (error) {
      console.error('Error copying interview link to clipboard:', error);
      // Handle error feedback
    }
  };

  return (
    <div>
      {id ? (
        <div>
          <main className="p-4 md:p-0 mx-auto max-w-7xl">
            <Navbar />
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <div>
              <div>
                <h2 className="text-xl font-bold mb-4">Interview Details</h2>
                <p className="mt-2">
                  <Button
                    onClick={copyInterviewLink}
                    className="px-2 text-white bg-blue-500 text-sm hover:text-gray-100 border border-transparent hover:border-gray-100"
                  >
                    {linkCopied
                      ? 'Copied!'
                      : 'Copy interview link to share with candidates'}
                  </Button>
                </p>

                <p className="mt-2">
                  <span className="font-bold">ID: </span>
                  {interview.id}
                </p>

                <p className="mt-2">
                  <span className="font-bold">Job Role Name: </span>
                  {interview.jobRoleName}
                </p>

                <p className="mt-2">
                  <span className="font-bold">Interview Created Date: </span>
                  {new Date(interview.createdAt).toLocaleString()}
                </p>

                <p className="mt-2">
                  <span className="font-bold">Interview Duration: </span>
                  {interview.durationInMinutes} minutes
                </p>

                <p className="mt-2">
                  <span className="font-bold">Interview Job Link: </span> &nbsp;
                  <a
                    href={interview.jobLink}
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-800"
                    target="_blank"
                  >
                    {interview.jobLink.length > 100
                      ? `${interview.jobLink.slice(0, 100)}...`
                      : interview.jobLink}
                  </a>
                </p>

                <p className="mt-2">
                  <span className="font-bold">Interview Type: </span>
                  {interview.interviewType}
                </p>

                <p className="mt-2">
                  <span className="font-bold">
                    Maximum candidates allowed to be interviewed:{' '}
                  </span>
                  {interview.maxNumberOfInterviews}
                </p>

                <p className="mt-2">
                  <span className="font-bold">Start Date: </span>
                  {interview.startDate
                    ? new Date(interview.startDate).toDateString()
                    : 'Not set'}
                </p>

                <p className="mt-2">
                  <span className="font-bold">End Date: </span>
                  {interview.endDate
                    ? new Date(interview.endDate).toDateString()
                    : 'Not set'}
                </p>

                <p className="mt-2">
                  <span className="font-bold">Interview VoiceType Type: </span>
                  {interview.interviewVoiceType}
                </p>
              </div>

              <h2 className="text-sm mt-4"></h2>
              {interview.interviewQuestionsMedia &&
              interview.interviewQuestionsMedia.length > 0 ? (
                <div className="mb-8">
                  <table className="w-full mt-2 border-collapse border table-auto">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider">
                          Question
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider">
                          Audio
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider">
                          Traits
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider">
                          Number of follow-up questions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {interview.interviewQuestionsMedia.map(
                        (questionMedia) => (
                          <React.Fragment key={questionMedia.id}>
                            <tr
                              className="mb-4 cursor-pointer"
                              onClick={() =>
                                handleQuestionClick(questionMedia.id)
                              }
                            >
                              <td className="py-2 px-4 border-b text-sm">
                                {questionMedia.question.length > 64
                                  ? `${questionMedia.question.slice(0, 64)}...`
                                  : questionMedia.question}
                              </td>
                              <td className="py-2 px-4 border-b">
                                <audio controls>
                                  <source
                                    src={`/api/audio-proxy?audioLink=${encodeURIComponent(
                                      questionMedia.audioLink
                                    )}`}
                                    type="audio/mpeg"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              </td>
                              <td className="py-2 px-4 border-b">
                                {questionMedia.traits}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {questionMedia.followUpDepth}
                              </td>
                            </tr>
                            {selectedQuestion === questionMedia.id && (
                              <tr>
                                <td colSpan="3" className="p-4">
                                  {/* Render additional details here */}
                                  <strong>Full Question</strong>{' '}
                                  <p>{questionMedia.question}</p>
                                  <strong>Evaluation Traits</strong>{' '}
                                  <p>{questionMedia.traits}</p>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      )}
                    </tbody>
                  </table>

                  <h2 className="text-xl font-bold mt-4">
                    Interviewed Candidates
                  </h2>

                  <Grid numItemsSm={1} numItemsLg={3} className="gap-12">
                    {/* <Search /> */}
                    <div className="relative mt-4">
                      <input
                        disabled={!session}
                        type="text"
                        placeholder="Search attempted candidates... press enter to submit"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onKeyDown={handleSearch}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        className="w-full border rounded p-2 cursor-pointer flex justify-between items-center"
                        style={{
                          backgroundColor: '#ffffff',
                          borderColor: '#000',
                          borderWidth: '1px',
                          borderRadius: '0.375rem'
                        }}
                      >
                        <span className="text-gray-900 text-sm">
                          Upload candidates to bulk invite (format: name,email)
                        </span>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleFileImport}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </label>
                    </div>

                    <div className="mt-4">
                      {successMessage && (
                        <div className="">
                          <div className="text-gray-900 text-sm mt-2">
                            {successMessage}
                          </div>
                        </div>
                      )}
                      {errorMessage && (
                        <div className="">
                          <div className="text-gray-900 text-sm mt-2">
                            {errorMessage}
                          </div>
                        </div>
                      )}
                      {isLoading && (
                        <div className="">
                          <div className="text-gray-900 text-sm mt-2">
                            Uploading
                            <span className="dot-flashing"></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Grid>
                  <TemplateList
                    searchTerm={searchTerm}
                    interviewId={interviewId}
                  />
                </div>
              ) : (
                <p>No questions and media found for this interview.</p>
              )}
            </div>
          </main>
        </div>
      ) : (
        <SignInButtons />
      )}
    </div>
  );
}

export default InterviewDetails;
