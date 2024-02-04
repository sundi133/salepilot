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
      <div className="mt-4">
        <label className="block text-gray-700 text-sm mb-2">
          {isLoading ? 'Processing' : 'Import Candidates ( *.csv file).'}
        </label>
        <div className="text-gray-600 mt-2 text-sm mb-2">
          Columns should be in order{' '}
          <span className="font-bold">
            firstName, lastName, email, phone, company, jobTitle,
            companyWebsite, linkedIn
          </span>
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileImport}
          className="w-full border rounded p-2 cursor-pointer shadow-sm"
          disabled={isLoading}
          style={{
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
            color: isLoading ? 'gray' : 'black',
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: isLoading ? '#f3f4f6' : 'white'
          }}
        />
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
