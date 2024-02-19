// ** import drizzle-orm query builder
import { db, eq } from "@content-guru/db";

// ** import schema
import { tbl_users } from "@content-guru/db/src/schema";

// ** import types
import type { UserData } from "@content-guru/db";

export const findUserByExternalId = async (externalId: string) => {
  return await db
    .select()
    .from(tbl_users)
    .where(eq(tbl_users.external_id, externalId!)) // Add the non-null assertion operator (!) to ensure that id is not undefined
    .get();
};

export const createUser = async (userData: UserData) => {
  return await db
    .insert(tbl_users)
    .values({ ...userData })
    .returning()
    .get();
};

export const updateUser = async (externalId: string, userData: UserData) => {
  return await db
    .update(tbl_users)
    .set(userData)
    .where(eq(tbl_users.external_id, externalId!))
    .returning()
    .get();
};

export const deleteUser = async (externalId: string) => {
  return await db
    .delete(tbl_users)
    .where(eq(tbl_users.external_id, externalId))
    .execute();
};
