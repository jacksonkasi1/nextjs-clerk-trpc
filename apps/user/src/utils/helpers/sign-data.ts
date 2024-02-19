// utils/cryptoUtils.js

export const generateSignature = async (data: any) => {
  const secret = process.env.SECRET!;

  if (!secret) {
    throw new Error("Missing secret key");
  }

  const encoder = new TextEncoder();
  const dataToHash = encoder.encode(JSON.stringify(data) + secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataToHash);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
