import React, { useState, useRef, ChangeEvent } from "react";
import toast from "react-hot-toast";
import { Text } from "rizzui";

interface ImageUpdateProps {
  defaultImage?: string;
  onImageSelect: (imageFile: File) => void;
}

const ImageUpdate: React.FC<ImageUpdateProps> = ({
  defaultImage,
  onImageSelect,
}) => {
  const [imagePreview, setImagePreview] = useState<string>(
    defaultImage ||
    "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-11.webp",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    const fileSize = file?.size;

    if (fileSize && fileSize > 5 * 1024 * 1024) {
      toast.error(<Text as="b">Image size should be less than 5MB</Text>);
      return;
    }

    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="relative inline-block cursor-pointer"
      style={{ width: "140px", height: "140px" }}
    >
      <img
        src={imagePreview}
        alt="profile"
        className="w-full h-full object-cover rounded-md"
        sizes="(max-width: 768px) 100vw"
      />
      {/* Hover Overlay */}
      <div
        className="absolute inset-0 z-20 flex justify-center items-center transition-opacity duration-300 opacity-0 hover:opacity-100"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="text-white material-icons">edit</span>
      </div>
      {/* File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
        accept="image/*"
        onClick={(event) => (event.currentTarget.value = "")}
      />
    </div>
  );
};

export default ImageUpdate;
