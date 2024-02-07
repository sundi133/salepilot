import React from 'react';

const ProfileCard = ({ data, organic_results }) => {
  const { person } = data;
  const scaleserp = organic_results;
  console.log(scaleserp);
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
            {person.twitter_url && (
              <p>
                Twitter:{' '}
                <a
                  href={person.twitter_url}
                  className="text-blue-500 hover:underline"
                >
                  {person.twitter_url}
                </a>
              </p>
            )}
            {person.functions && person.functions.length > 0 && (
              <div className="py-4">
                <div className="font-semibold">Professional Functions:</div>
                <ul className="list-disc pl-5">
                  {person.functions.map((func, index) => (
                    <li key={index} className="text-gray-800 my-2">
                      {func}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold">Employment History:</div>
            <ul className="list-disc pl-5 mb-4">
              {person.employment_history &&
                person.employment_history.map((job) => (
                  <li key={job.id}>
                    <p className="text-gray-800">
                      {job.title} at {job.organization_name} ({job.start_date} -{' '}
                      {job.end_date || 'Present'})
                    </p>
                  </li>
                ))}
            </ul>
          </div>
          {scaleserp &&
            scaleserp.organic_results &&
            scaleserp.organic_results.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Recent News:
                </h2>
                <div className="space-y-4">
                  {scaleserp.organic_results
                    .slice(0, 4)
                    .map((result, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 shadow rounded-lg transition duration-300 ease-in-out hover:shadow-md"
                      >
                        <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 text-lg font-medium text-gray-900"
                        >
                          {result.title}
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                          {result.snippet}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      </div>
    )) || <div>No data found</div>
  );
};

export default ProfileCard;
