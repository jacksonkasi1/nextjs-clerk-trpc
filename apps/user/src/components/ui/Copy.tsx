"use client";

import React from "react";
import toast from "react-hot-toast";

import { PiCopySimple } from "react-icons/pi";
import { Text } from "rizzui";

const Copy = ({ value }: { value: string }) => {
  if (!value) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success(<Text as="b">Copied!</Text>)
  };

  return (
    <button onClick={handleCopy} type="button" >
      <PiCopySimple className="h-6 w-6 text-secondary-text cursor-pointer" />
    </button>
  );
};

export default Copy;
