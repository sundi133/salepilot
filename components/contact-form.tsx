'use client';

import React, { useState, useRef, useEffect } from 'react';
import '../app/css/globals.css';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import type { PutBlobResult } from '@vercel/blob';
import { put } from '@vercel/blob';
import Link from 'next/link';
import { c } from '@vercel/blob/dist/put-96a1f07e';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume_file, setResumeFile] = useState(null);
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [resume, setResume] = useState('');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [candidateId, setCandidateId] = useState('');

  const handleFileImport = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;

        if (typeof text === 'string') {
          const lines = text.split('\n');
          const numberOfLines = lines.length;
          if (numberOfLines > 100) {
            setErrorMessage('Max 100 rows are allowed');
            setIsLoading(false);
            return;
          }
          const promises: Promise<any>[] = [];

          lines.forEach((line: string) => {
            if (line.trim() === '') return;
            if (line.includes(',')) {
              const [
                firstName,
                lastName,
                email,
                phone,
                company,
                jobTitle,
                companyWebsite,
                linkedIn
              ] = line.split(',');

              if (firstName === '' && lastName === '') return;
              if (email === '') return;
              if (!email.includes('@')) return;

              try {
                const promise = fetch('/api/add/contact', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                    company,
                    jobTitle,
                    companyWebsite,
                    linkedIn
                  })
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {})
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
            .then(() => {
              setSuccessMessage('Contacts are added successfully');
              setIsLoading(false);
            })
            .catch((error) => {
              console.error(
                'Error with one of the candidate creations:',
                error
              );
            });
        } else {
          // Handle the case where 'text' is not a string
          console.error('File content is not a string.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto p-4 items-center justify-center">
      <div className="mt-8">
        <div className="max-w-lg mx-auto">
          <label className="block text-lg text-gray-700 font-semibold mb-4">
            {isLoading ? 'Processing...' : 'Import Contacts'}
          </label>
          <p className="text-gray-600 text-sm mb-4 flex flex-wrap w-full">
            Upload a <span className="font-medium">.csv file</span> with the
            following columns in order:
            <br />
            <span className="font-medium mt-2">
              {' '}
              FirstName, LastName, Email, Phone, Company, JobTitle,
              CompanyWebsite, LinkedIn
            </span>
            .
          </p>
          <div className="flex flex-wrap w-full items-center justify-center bg-gray-50 p-6 border border-gray-200 rounded-lg shadow-sm">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              className={`w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
          ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={isLoading}
            />
            {isLoading && (
              <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 text-gray-900 text-sm rounded text-center justify-center items-center rounded">
          <div
            className="flex justify-center items-center rounded bg-white text-red-500 text-sm px-4 py-3"
            role="alert"
          >
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="mt-4 text-gray-900 text-sm rounded text-center justify-center items-center rounded">
          <div
            className="flex justify-center items-center rounded bg-white text-blue-500 text-sm px-4 py-3"
            role="alert"
          >
            <p>{successMessage}</p>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="mt-4 text-gray-900 text-sm rounded text-center justify-center items-center rounded">
          <div className="text-gray-500 mt-2">
            Uploading
            <span className="dot-flashing"></span>
          </div>
        </div>
      )}
    </div>
  );
}
