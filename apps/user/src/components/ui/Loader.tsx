import React from 'react';
import LoaderIcon from "../icons/loader";

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/30 dark:bg-gray-900/30">
      <div className="flex items-center justify-center">
        <LoaderIcon />
      </div>
    </div>
  );
};

export default Loader;
