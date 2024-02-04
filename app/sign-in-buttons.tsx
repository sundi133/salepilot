import { Button, Grid } from '@tremor/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import '@fortawesome/fontawesome-free/css/all.css';

export default function SignInButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    // Show a loading indicator or message
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Grid numItemsSm={1} numItemsLg={3} className="gap-12">
          <div
            className="container min-w-full text-sm"
            style={{ marginTop: '16px' }}
          >
            Loading...
          </div>
        </Grid>
      </main>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto space-y-4 h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to Bytegram</h1>
        <span className="text-center text-sm text-gray-900">
          Streamline your workflow, engage with customers or candidates with our
          AI powered voice assistant async, get deep insights to make
          data-driven decisions.
        </span>
        <Button
          onClick={() => signIn('google')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          style={{ marginTop: '24px' }}
        >
          <i className="fab fa-google" style={{ marginRight: '8px' }}></i>
          Sign in with Google
        </Button>

        <Button
          onClick={() => signIn('github')}
          className="flex items-center px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
        >
          <i className="fab fa-github" style={{ marginRight: '8px' }}></i>
          Sign in with GitHub
        </Button>
      </div>
    );
  }
}
