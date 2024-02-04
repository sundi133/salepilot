import React from 'react';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Link from 'next/link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../../../app/css/globals.css';
import {
  faCopy,
  faShareAlt,
  faShareAltSquare
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
const tableHeaderCellStyle =
  'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-700 tracking-wider';
const tableBodyCellStyle =
  'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-700 tracking-wider whitespace-no-wrap leading-5 whitespace-no-wrap';

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'not_started':
      return 'not-started-style';
    case 'completed':
      return 'completed-style';
    case 'started':
      return 'started-style';
    default:
      return ''; // Default style or no additional style
  }
};

const ShowInvites = ({ invitations }: { invitations: any }) => {
  return (
    <main className="md:p-0 mx-auto max-w-7xl">
      <Grid numItemsSm={1} numItemsLg={3} className="gap-12">
        <div
          className="container text-sm mx-auto items-center justify-center"
          style={{ marginTop: '8px' }}
        >
          <table className="container min-w-full border-collapse border table-auto">
            <caption className="caption-top"></caption>
            <thead className="mt-2">
              <tr>
                <th className={tableHeaderCellStyle}>Timestamp</th>
                <th className={tableHeaderCellStyle}>InterviewId</th>
                <th className={tableHeaderCellStyle}>Link</th>
                <th className={tableHeaderCellStyle}>PinCode</th>
                <th className={tableHeaderCellStyle}>Status</th>
                <th className={tableHeaderCellStyle}>Created By</th>

                <th className={tableHeaderCellStyle}>Company</th>
                <th className={tableHeaderCellStyle}>Role</th>
                <th className={tableHeaderCellStyle}>Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Array.isArray(invitations) ? (
                invitations.map((invitation: any) => (
                  <tr key={invitation.id}>
                    <td className={tableBodyCellStyle}>
                      <span className="py-4">
                        {new Date(invitation.createdAt).toDateString()}{' '}
                        {/* {new Date(invitation.createdAt).toLocaleTimeString()} */}
                      </span>
                    </td>
                    <td className={tableBodyCellStyle}>
                      <Link
                        href={`/interviews/${invitation.interview.interviewId}`}
                        rel="noopener noreferrer"
                      >
                        <span className="text-gray-700 hover:text-blue-700">
                          {invitation.id}
                        </span>
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-blue-500">
                      <div className="flex items-center">
                        <Link
                          href={`/assessment/interview/${invitation.interview.interviewId}`}
                          target="_blank"
                        >
                          <FontAwesomeIcon icon={faShare} />
                        </Link>
                      </div>
                    </td>
                    <td className={tableBodyCellStyle}>{invitation.pinCode}</td>
                    <td
                      className={`${tableBodyCellStyle} ${getStatusStyle(
                        invitation.status.toLowerCase()
                      )}`}
                    >
                      {invitation.status.toLowerCase()}
                    </td>
                    <td className={tableBodyCellStyle}>
                      {invitation.interview.creatorEmail}
                    </td>

                    <td className={tableBodyCellStyle}>
                      {invitation.interview.jobAtCompany}
                      <p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {' '}
                          ({invitation.interview.interviewType} interview)
                        </span>
                      </p>
                    </td>
                    <td className={tableBodyCellStyle}>
                      {invitation.interview.jobRoleName}
                    </td>
                    <td className={tableBodyCellStyle}>
                      {invitation.interview.durationInMinutes} mins
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </Grid>
    </main>
  );
};

export default ShowInvites;
