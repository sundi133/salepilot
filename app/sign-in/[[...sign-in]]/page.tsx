'use client';
import { SignIn } from '@clerk/nextjs';
import '../../../app/css/globals.css';
import Footer from '../../../components/footer';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Page() {
  const [afterSignInUrl, setAfterSignInUrl] = useState('/');

  const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const redirectUrl = getQueryParam('redirect_url');
    setAfterSignInUrl(redirectUrl ?? '/');
    localStorage.setItem('afterSignInUrl', redirectUrl ?? '/');
  }, []);

  return (
    <div>
      <div className="container flex flex-col justify-center items-center mt-4">
        {/* <span className="text-gray-900 text-lg font-semibold mb-4">
          Discover the power of AI in real-world scenarios!
        </span>

        <div className="fade-in-animation text-blue-600 mb-3">
          <span>🌟 Acing Interviews: Uncover AI-driven strategies to make a lasting impression.</span>
        </div>

        <div className="fade-in-animation text-green-600 mb-3" style={{ animationDelay: '2s' }}>
          <span>💼 Mastering Sales Pitches: Learn how AI can help you deliver compelling pitches.</span>
        </div>

        <div className="fade-in-animation text-purple-600" style={{ animationDelay: '4s' }}>
          <span>🔍 Gathering Insightful Product Feedback: Utilize AI for deep insights from customer feedback.</span>
        </div> */}
      </div>

      <div className="container flex justify-center items-center mt-16">
        {afterSignInUrl === '/' ? (
          <SignIn routing="path" path="/sign-in" />
        ) : (
          <SignIn
            routing="path"
            path="/sign-in"
            afterSignInUrl={afterSignInUrl}
          />
        )}
      </div>
    </div>
  );
}
