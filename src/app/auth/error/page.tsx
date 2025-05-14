'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have access to this resource.',
    Verification: 'The verification link may have been used or is invalid.',
    OAuthSignin: 'Error starting the sign in process.',
    OAuthCallback: 'Error during the sign in process.',
    OAuthCreateAccount: 'Error creating your account.',
    EmailCreateAccount: 'Error creating your account.',
    Callback: 'Error during the sign in callback.',
    OAuthAccountNotLinked: 'This email is already associated with another account.',
    EmailSignin: 'Error sending the sign in email.',
    CredentialsSignin: 'Invalid credentials.',
    SessionRequired: 'Please sign in to access this page.',
    Default: 'An error occurred during authentication.',
  };

  const errorMessage = error && errorMessages[error] ? errorMessages[error] : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Authentication Error</h2>
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
          <div className="mt-8">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
