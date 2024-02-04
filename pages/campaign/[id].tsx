'use client';
import React from 'react';
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Search from '../../app/search';
import UsersTable from '../../app/table';
import Link from 'next/link';
import { useState } from 'react';
import CampaignForm from '../../components/campaign-form';
import { Suspense } from 'react';
import Navbar from '../../app/navbar';
import { auth } from '../../app/auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import AuthProvider from '../../app/authprovider';
import SignInButtons from '../../app/sign-in-buttons';
import Breadcrumbs from '../../components/breadcrumbs';
import '../../app/css/globals.css';
import Footer from '../../components/footer';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import CampaignDetails from './campaign-details';

export default function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  if (!isLoaded || !userId) {
    return null;
  }
  if (!id) {
    return null;
  }

  const breadcrumbs = [
    { label: 'Campaign', href: '/campaign' },
    { label: 'View Campaign', href: `/campaign/${id}` }
  ];

  return (
    <div>
      {userId ? (
        <div>
          <main className="p-4 md:p-0 mx-auto max-w-7xl">
            <Navbar />
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <CampaignDetails campaign_id={id} />
          </main>
        </div>
      ) : (
        <SignInButtons />
      )}
    </div>
  );
}
