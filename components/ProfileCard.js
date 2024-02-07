import React from 'react';

const ProfileCard = ({ data, organic_results }) => {
  const { person } = data;

  return person ? (
    <div className="bg-white p-6 shadow rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center mb-4">
        <div className="flex-1">
          <div className="text-xl font-semibold">{person.name}</div>
          <p className="text-gray-600">{person.headline}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4 grid md:grid-cols-2 gap-4">
        {/* Contact Information and Professional Functions */}
      </div>

      {/* Employment History and Recent News in the same row */}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {/* Employment History */}
        <div>
          <h2 className="text-xl font-semibold">Employment History:</h2>
          <ul className="list-disc pl-5 mt-4">
            {person.employment_history.map((job, index) => (
              <li key={index} className="text-gray-800">
                {job.title} at {job.organization_name} ({job.start_date} -{' '}
                {job.end_date || 'Present'})
              </li>
            ))}
          </ul>
        </div>

        {/* Recent News */}
        {organic_results && organic_results.organic_results && (
          <div>
            <h2 className="text-xl font-semibold">Recent News:</h2>
            <div className="space-y-4 mt-4">
              {organic_results.organic_results
                .slice(0, 4)
                .map((result, index) => (
                  <div
                    key={index}
                    className="transition duration-300 ease-in-out hover:shadow-md"
                  >
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 font-medium"
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
  ) : (
    <div>No data found</div>
  );
};

export default ProfileCard;
