'use client';
import { useUser, SignUp } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = '/dashboard';
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      {isLoaded && !isSignedIn && (
        <div className="w-full max-w-md px-4 py-8 ">
          <SignUp
            signInUrl="/sign-in"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            path="/"
            key={'sign-up'}
          />
        </div>
      )}
    </div>
  );
}
