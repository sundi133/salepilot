// Your React component
import React from 'react';
import Link from 'next/link';

const Card = ({
  title,
  numQuestions,
  time,
  link
}: {
  title: string;
  numQuestions: number;
  time: number;
  link: string;
}) => {
  return (
    <div className="flex-shrink-0 w-full sm:w-1/2 md:w-1/4 lg:w-1/4 p-4">
      <div className="bg-white shadow-md rounded-md p-4 relative">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="text-sm flex justify-between items-center mt-4">
          <span className="text-gray-500">Questions: {numQuestions}</span>
          <span className="text-gray-500">Time: {time} mins</span>
        </div>

        <span className="justify-center items-center rounded-md mt-4 mb-4">
          {/* <Link
            href={link}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-blue-500 mt-4"
          >
            Start
          </Link> */}
        </span>
      </div>
    </div>
  );
};

export default Card;
