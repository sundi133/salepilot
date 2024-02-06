import React from 'react';

const ProfileCard = ({ data }) => {
  const { person } = data;

  return (
    (person && (
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-5">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-4">
            <div>
              <div className="font-bold text-xl mb-2">{person.name}</div>
              <p className="text-gray-700 text-base">{person.headline}</p>
            </div>
          </div>
          <div className="py-4">
            <div className="font-semibold">Contact Information:</div>
            <p>Email: {person.email}</p>
            <p>
              LinkedIn:{' '}
              <a
                href={person.linkedin_url}
                className="text-blue-500 hover:underline"
              >
                {person.linkedin_url}
              </a>
            </p>
          </div>
          <div>
            <div className="font-semibold">Employment History:</div>
            <ul className="list-disc pl-5 mb-4">
              {person.employment_history.map((job) => (
                <li key={job.id}>
                  <p className="text-gray-800">
                    {job.title} at {job.organization_name} ({job.start_date} -{' '}
                    {job.end_date || 'Present'})
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )) || <div>No data found</div>
  );
};

export default ProfileCard;
