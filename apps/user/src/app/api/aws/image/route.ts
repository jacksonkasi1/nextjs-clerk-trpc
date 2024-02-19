import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { Blob } from "buffer";
import { v4 as uuidv4 } from "uuid";

import { env } from "@/env.mjs";

// Assuming you've set these environment variables in your .env.local or equivalent
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file to AWS S3.
 *
 * @param file - The file to be uploaded as a Buffer.
 * @param fileName - The name to save the file as in S3.
 * @returns The file name of the uploaded file.
 */
async function uploadFileToS3(file: Buffer, fileName: string): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ACL: "public-read",
    ContentType: "image/jpeg", // Change this accordingly if you support different content types
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

/**
 * Handles the POST request to upload a file.
 *
 * @param request - The incoming POST request.
 * @returns A NextResponse object with the operation result.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, `${uuidv4()}.jpg`);

    const url = `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    return NextResponse.json({ success: true, data: { fileName, url } });
  } catch (error: any) {
    // If using TypeScript 4.4 or newer, you can type catch clause variables.
    console.error(`☁️ Error uploading file: ${error.message}`);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}

/**
 * Extracts the S3 object key from the given URL.
 *
 * @param url - The URL of the S3 object.
 * @returns The object key.
 */
function extractKeyFromUrl(url: string): string {
  const bucketUrl = `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/`;
  return url.replace(bucketUrl, "");
}

/**
 * Deletes a file from AWS S3.
 *
 * @param key - The key of the file to be deleted.
 */
async function deleteFileFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Handles the DELETE request to remove a file from AWS S3.
 *
 * @param request - The incoming DELETE request.
 * @returns A NextResponse object with the operation result.
 */
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const requestJson = await request.json();
    const fileUrl = requestJson.url;

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required." },
        { status: 400 },
      );
    }

    // check this is aws s3 link or not
    if (
      !fileUrl.startsWith(`https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/`)
    ) {
      // if it's not aws s3 link then return error
      return NextResponse.json({ error: "Invalid file URL." }, { status: 400 });
    }

    const fileKey = extractKeyFromUrl(fileUrl);
    await deleteFileFromS3(fileKey);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error: any) {
    console.error(`Error deleting file: ${error.message}`);
    return NextResponse.json(
      { error: error.message || "An error occurred." },
      { status: 500 },
    );
  }
}
