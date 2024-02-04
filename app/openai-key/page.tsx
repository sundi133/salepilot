'use client';

import { UserButton } from '@clerk/nextjs';
import { Session } from 'inspector';
import { useAuth } from '@clerk/nextjs';
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import SignInButtons from '../sign-in-buttons';
import ContactList from '../../components/contact-list';
import Footer from '../../components/footer';
import { useClerk } from '@clerk/nextjs';
import { use, useEffect, useState } from 'react';

export default function Home() {
  const { session } = useClerk();
  const [openaiKey, setOpenaiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [keys, setKeys] = useState([]);
  const [error, setError] = useState('');

  const submitKey = async () => {
    if (!openaiKey || openaiKey.trim() === '') {
      setError('Please enter a valid key to submit.');
      return;
    }
    const proxyUrl = '/api/openaikey'; // The proxy endpoint
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: openaiKey
      })
    };

    try {
      setIsLoading(true);
      const response = await fetch(proxyUrl, options);
      const data = await response.json();
      setSuccessMessage(data.message);
    } catch (error) {
      console.error('Error generating audio link:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (session) {
      // Only fetch data if there is a session
      fetch('/api/openaikey', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setKeys(data);
        })
        .catch((error) => {
          console.error('Error fetching keys:', error);
        });
    }
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <div>
      {session ? (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
          <form
            // className="max-w-md mx-auto p-8 border rounded-md shadow-md"
            className="rounded mt-4 text-sm"
            style={{
              maxHeight: '80vh',
              overflowY: 'auto',
              display: 'flex', // Enable flexbox
              flexDirection: 'column', // Stack children vertically
              justifyContent: 'space-between' // Center vertically
            }}
          >
            <div className="container mb-4 flex">
              <input
                className="appearance-none border border-gray-500 rounded w-full py-2 px-4 text-sm text-gray-900 focus:outline-none focus:shadow-outline"
                type="password"
                name="oai-key"
                placeholder="Paste OPENAI_API_KEY here"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                disabled={isLoading}
              />
              <Button
                className="ml-4 bg-gray-900 hover:bg-gray-700 text-white text-sm py-2 px-4 border border-gray-900 rounded focus:outline-none focus:shadow-outline"
                onClick={submitKey}
                type="button"
                disabled={isLoading}
              >
                Add Key
              </Button>
            </div>
            {successMessage && (
              <div className="container mb-4 flex text-sm text-gray-500">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="container mb-4 flex text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="container mt-4 flex text-sm text-gray-700">
              Key will be securely stored with aes-256-gcm encryption and will
              only be used for interview purposes.
              <Link href="https://platform.openai.com/api-keys" target="_blank">
                &nbsp;
                <span className="underline">Where do I find my API key?</span>
              </Link>
            </div>
          </form>
          <div className="container min-w-full mt-4">
            <h2 className="text-2xl font-bold mb-4">Your Keys</h2>
            <table className="container min-w-full border-collapse border table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keys.map((keyData: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(keyData.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyData.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyData.key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyData.creatorEmail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      ) : (
        <SignInButtons />
      )}
    </div>
  );
}
