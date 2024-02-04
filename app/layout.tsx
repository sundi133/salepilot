import './css/globals.css';
import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
import Toast from './toast';
import { Suspense } from 'react';
import AuthProvider from './authprovider';
import { ClerkProvider } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';

export const metadata = {
  title: 'Bytegram: Redefining Interviews with Smart Assistance',
  description:
    'A user friendly hiring companion to help you remove bias from interviews and make well informed hiring decisions'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full bg-white">
        <body className="h-full">
          <main className="mx-auto max-w-7xl">
            <Suspense>
              <Nav />
            </Suspense>
            <AuthProvider>{children}</AuthProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
