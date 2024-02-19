import { v4 as uuidv4 } from "uuid";

export const generateFigmaId = (): string => {
  return uuidv4(); // Generates a UUID v4
};
