'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    github: false,
    google: false,
  });

  const handleSignIn = async (provider: string) => {
    setIsLoading({ ...isLoading, [provider]: true });
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your preferred sign in method
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">
              {error === 'OAuthSignin' && 'Error starting the sign in process.'}
              {error === 'OAuthCallback' && 'Error during the sign in process.'}
              {error === 'OAuthCreateAccount' && 'Error creating your account.'}
              {error === 'EmailCreateAccount' && 'Error creating your account.'}
              {error === 'Callback' && 'Error during the sign in callback.'}
              {error === 'OAuthAccountNotLinked' && 'This email is already associated with another account.'}
              {error === 'EmailSignin' && 'Error sending the sign in email.'}
              {error === 'CredentialsSignin' && 'Invalid credentials.'}
              {error === 'SessionRequired' && 'Please sign in to access this page.'}
              {error === 'Default' && 'An error occurred during sign in.'}
            </span>
          </div>
        )}
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleSignIn('github')}
            disabled={isLoading.github}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {isLoading.github ? 'Signing in...' : 'Sign in with GitHub'}
          </button>
          
          <button
            onClick={() => handleSignIn('google')}
            disabled={isLoading.google}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading.google ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
