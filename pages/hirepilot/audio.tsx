import { useState } from 'react';
import fetch from 'node-fetch';
import Navbar from '../../app/navbar';
import SignInButtons from '../../app/sign-in-buttons';
import { signIn, signOut, useSession } from 'next-auth/react';
import '../../app/css/globals.css';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import AudioTable from './audio-table'; // Adjust the path to your component

const TextToSpeech = () => {
  const [questions, setQuestions] = useState('');
  const [audioLinks, setAudioLinks] = useState<string[]>([]);
  const [questionArray, setQuestionArray] = useState<
    { question: string; followUpDepth: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const generateAudioLink = async (text: string) => {
    const proxyUrl = '/api/playhtproxy'; // The proxy endpoint
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text
      })
    };

    try {
      const response = await fetch(proxyUrl, options);
      const audioData = await response.json();

      if (audioData.stage === 'complete') {
        return audioData.url;
      }
    } catch (error) {
      console.error('Error generating audio link:', error);
    }

    return null;
  };

  const { data: session } = useSession();

  return <div></div>;
};

export default TextToSpeech;
