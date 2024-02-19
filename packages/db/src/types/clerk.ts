import type { UserJSON } from "@clerk/clerk-sdk-node";

export interface User {
  id: number;
  external_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string;
  attributes: UserJSON & {
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  figma_id: string;
  external_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string;
  attributes: UserJSON & {
    id: string;
  };
}
