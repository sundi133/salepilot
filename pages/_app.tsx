import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from '@clerk/nextjs';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  name: string;
  email: string;
  orgId: string;
  orgRole: string;
  orgSlug: string;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // if (!user.orgId) {
  //   // Redirect to the create organization page or show an appropriate message
  //   router.push('/create-organization');
  //   return null; // You can also render a loading spinner here
  // }

  return (
    <ClerkProvider {...pageProps}>
      <SignedIn>
        <ClerkLoaded>
          <Component {...pageProps} />
        </ClerkLoaded>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default MyApp;
