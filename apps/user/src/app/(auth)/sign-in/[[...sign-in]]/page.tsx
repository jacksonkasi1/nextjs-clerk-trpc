'use client';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md px-4 py-8 ">
        <SignIn />
      </div>
    </div>
  );
}
