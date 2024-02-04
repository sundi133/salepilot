'use client';
import React from 'react';
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Search from '../../app/search';
import UsersTable from '../../app/table';
import Link from 'next/link';
import { useState } from 'react';
import Contact from '../../components/contact-form';
import { Suspense } from 'react';
import Navbar from '../../app/navbar';
import { auth } from '../../app/auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import SignInButtons from '../../app/sign-in-buttons';
import Breadcrumbs from '../../components/breadcrumbs';
import '../../app/css/globals.css';
import Footer from '../../components/footer';
import { useAuth } from '@clerk/nextjs';

export default function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const breadcrumbs = [
    { label: 'Contact', href: '/contact' },
    { label: 'Add Contact', href: '/add/contact' }
  ];

  const { isLoaded, userId, sessionId, getToken } = useAuth();

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div>
      {userId ? (
        <div>
          <main className="p-4 md:p-0 mx-auto max-w-7xl">
            <Navbar />
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Contact />
          </main>
        </div>
      ) : (
        <SignInButtons />
      )}
    </div>
  );
}
