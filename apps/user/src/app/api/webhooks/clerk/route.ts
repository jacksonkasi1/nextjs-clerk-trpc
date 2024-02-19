import { headers } from "next/headers";

// ** import 3rd party packages
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

// ** import types
import { UserData } from "@content-guru/db";

// ** import utils
import { generateFigmaId } from "@/utils";

// ** import helpers
import {
  findUserByExternalId,
  createUser,
  updateUser,
  deleteUser,
} from "./dbOperations";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!WEBHOOK_SECRET || !svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing required headers or secret", {
      status: 400,
    });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    switch (evt.type) {
      case "user.created":
      case "user.updated":
        const { id, ...attributes } = evt.data;

        const primary_email_address_id = evt.data.primary_email_address_id;
        const primary_email =
          evt.data.email_addresses.find(
            (email) => email.id === primary_email_address_id,
          )?.email_address || evt.data.email_addresses?.[0].email_address;

        const userData = {
          figma_id: generateFigmaId(),
          external_id: evt.data.id,
          first_name: evt.data.first_name,
          last_name: evt.data.last_name,
          email: primary_email,
          photo_url: evt.data.image_url,
          attributes,
        };

        const existingUser = await findUserByExternalId(id);

        if (existingUser) {
          await updateUser(id, userData as UserData);

          return new Response("User updated successfully.", {
            status: 200,
          });
        } else {
          await createUser(userData as UserData);

          return new Response("User created successfully.", {
            status: 200,
          });
        }

      case "user.deleted":
        await deleteUser(evt.data.id as string);
        return new Response("User deleted successfully.", {
          status: 200,
        });
      default:
        return new Response(`Unhandled event type = ${evt.type} `, {
          status: 200,
        });
    }
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Webhook verification failed.", {
      status: 400,
    });
  }
}

export async function GET(req: Request) {
  return new Response("Webhook endpoint doesn't support GET requests.", {
    status: 200,
  });
}
