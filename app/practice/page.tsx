'use client';

import {
  Metric,
  Text,
  Title,
  BarList,
  Flex,
  Grid,
  Button
} from '@tremor/react';
import Card from './Card'; // Adjust the path based on your project structure

import Search from '../search';
import { signIn, signOut, useSession } from 'next-auth/react';
import SignInButtons from '../sign-in-buttons';
import Footer from '../../components/footer';
import TemplateList from '../../components/template-list';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';

export default function PlaygroundPage() {
  const { session } = useClerk();
  const [searchTerm, setSearchTerm] = useState('');

  // Check if there is an active session
  if (!session) {
    // Handle the case where there is no active session
    return null;
  }

  const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearchTerm(event.currentTarget.value);
    }
  };

  return (
    <div>
      {session ? (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
          {/* <Search /> */}
          <span className="flex items-center justify-center font-semibold text-xl">
            Practice interviews with an AI powered voice assistant.
          </span>
          <div className="flex justify-between items-center mt-4">
            {' '}
            <div className="relative flex items-center w-full">
              {' '}
              <input
                disabled={!session}
                type="text"
                placeholder="Search practice interviews... press enter to submit"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onKeyDown={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Link href="/add/interview">
              <Button className="bg-gray-900 text-white hover:bg-gray-700 border-white hover:border-white">
                <span className="relative inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  &nbsp; New Practice Interview
                </span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-left items-start mt-4">
            <Card
              title="Software Engineer"
              numQuestions={10}
              time={45}
              link=""
            />
            <Card
              title="Platform Engineer"
              numQuestions={10}
              time={45}
              link=""
            />
            <Card
              title="Machine Learning Engineer"
              numQuestions={8}
              time={60}
              link=""
            />
            <Card title="Product Manager" numQuestions={12} time={60} link="" />
            <Card
              title="Product Marketing Manager"
              numQuestions={12}
              time={60}
              link=""
            />
            <Card title="UX Researcher" numQuestions={15} time={45} link="" />
            <Card title="UX Designer" numQuestions={15} time={45} link="" />
            <Card title="Data Scientist" numQuestions={15} time={45} link="" />
            <Card title="DevOps Engineer" numQuestions={10} time={45} link="" />
            <Card
              title="Cloud Data Architect"
              numQuestions={15}
              time={75}
              link=""
            />
            <Card
              title="AI Engineer (LLM + RAGs)"
              numQuestions={8}
              time={45}
              link=""
            />
            <Card
              title="React Frontend Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Angular/Flutter Frontend Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Senior Fullstack Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Site Reliability Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Platform Security Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Network Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Nodejs Backend Engineer"
              numQuestions={10}
              time={45}
              link=""
            />
            <Card
              title="Django Backend Engineer"
              numQuestions={10}
              time={45}
              link=""
            />
            <Card
              title="MongoDB Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Spark/ETL Data Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Test Automation Engineer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Deep Learning Engineer (Pytorch/NLP)"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Deep Learning Engineer (Computer Vision)"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Product Designer"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card title="Project Manager" numQuestions={15} time={45} link="" />
            <Card title="Recruiter" numQuestions={15} time={45} link="" />
            <Card title="Sales Engineer" numQuestions={15} time={45} link="" />
            <Card
              title="Business Development Manager"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Benefits Manager"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card title="Finance Manager" numQuestions={15} time={45} link="" />
            <Card
              title="Senior Business Analyst"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Business Intelligence Analyst"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Analytics Manager"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Supply Chain Manager"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card title="Data Analyst" numQuestions={15} time={45} link="" />
            <Card
              title="Marketing Intern (SEO)"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Marketing Intern (Social Media)"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card
              title="Analytics Intern"
              numQuestions={15}
              time={45}
              link=""
            />
            <Card title="Animator" numQuestions={15} time={45} link="" />
            <Card title="Art Director" numQuestions={15} time={45} link="" />
            <Card title="Choreographer" numQuestions={15} time={45} link="" />
          </div>
        </main>
      ) : (
        <SignInButtons />
      )}
    </div>
  );
}
