'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@tremor/react';
import UserProfilePage from '../user-profile/[[...user-profile]]/page';
import { dark, neobrutalism } from '@clerk/themes';
import { userInfo } from 'os';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import {
  PlusCircleIcon,
  UserGroupIcon,
  HomeModernIcon
} from '@heroicons/react/24/outline';
import OrganizationListPage from '../discover/page';
import OrganizationSwitcherPage from '../organization-switcher/[[...organization-switcher]]/page';
import { useClerk } from '@clerk/nextjs';
import { OrganizationSwitcher } from '@clerk/nextjs';

// Your existing component remains unchanged

interface user {
  name: string;
  email: string;
  orgId: string;
  orgRole: string;
  orgSlug: string;
}

export default function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Settings', href: '/settings' }
  ];

  const { session } = useClerk();
  const [user, setUser] = useState<user>({} as user);

  useEffect(() => {
    if (session) {
      (async () => {
        fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
            console.log(data);
          });
      })();
    }
  }, [session]);

  // Check if there is an active session
  if (!session) {
    // Handle the case where there is no active session
    return null;
  }

  return (
    <div>
      {session ? (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
          <SignedIn>
            {/* Mount the UserButton component */}
            {/* Add custom buttons for your use cases */}
            <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">User Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-semibold">Name:</p>
                  <p className="text-gray-800">{user.name}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Email:</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-lg font-semibold">Organization Name:</p>
                  <p className="text-gray-800">{user.orgSlug}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Organization Role:</p>
                  <p className="text-gray-800">{user.orgRole}</p>
                </div>
              </div>
              <div className="container flex space-x-4 mt-8">
                {/* <UserButton showName={true}/> */}

                <Link href="/create-organization">
                  <Button className="text-sm text-white bg-gray-900 border border-gray-900 flex items-center hover:bg-gray-700 hover:border-gray-900">
                    <span className="whitespace-nowrap">
                      Create Organization
                    </span>
                  </Button>
                </Link>
                <Link href="/organization-profile">
                  <Button className="text-sm text-white bg-gray-900 border border-gray-900 flex items-center space-x-2 hover:bg-gray-700 hover:border-gray-900">
                    {/* <UserGroupIcon className="h-5 w-5" /> */}
                    <span>Invite Members</span>
                  </Button>
                </Link>
                <Link href="/organization-switcher">
                  <Button className="text-sm text-white bg-gray-900 border border-gray-900 flex items-center space-x-2 hover:bg-gray-700 hover:border-gray-900">
                    <span>Switch Organization</span>
                  </Button>
                </Link>

                <Link href="/openai-key">
                  <Button className="text-sm text-white bg-gray-900 border border-gray-900 flex items-center space-x-2 hover:bg-gray-700 hover:border-gray-900">
                    {/* <HomeModernIcon className="h-5 w-5" /> */}
                    <span>Add OPENAI Key</span>
                  </Button>
                </Link>
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </main>
      ) : (
        <SignInButton></SignInButton>
      )}
    </div>
  );
}
