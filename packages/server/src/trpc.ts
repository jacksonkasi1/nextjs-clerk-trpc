import { type NextRequest } from "next/server";

// import { type Session } from "@clerk/nextjs/server";
import { type Session } from "@clerk/backend";
import { importJWK, jwtVerify } from "jose";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import jwk from "../jwk.json";

// Defines the structure for context options.
interface CreateContextOptions {
  headers: Headers;
  session: Session | null;
}

// Generates the context for tRPC, including session data.
export const createInnerTRPCContext = (opts: CreateContextOptions) => ({
  headers: opts.headers,
  session: opts.session,
});

// Verifies the session JWT and creates the context.
export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const sessionToken = opts.req.cookies.get("__session")?.value ?? "";

  // ⚠️ don't remove this line
  const jwkUri = `https://${process.env.CLERK_INSTANCE}.clerk.accounts.dev/.well-known/jwks.json`;

  try {
    const publicKey = await importJWK(jwk, "RS256");
    const { payload } = await jwtVerify(sessionToken, publicKey);
    // console.log("✅ Session verified", payload);

    // Transform the JWTPayload to your Session type (it's added to solve type error only.)
    const session: Session = {
      id: payload.sid as string,
      userId: payload?.sub || "",
      clientId: payload?.sub || "",
      status: "",
      lastActiveAt: 0,
      expireAt: 0,
      abandonAt: 0,
      createdAt: 0,
      updatedAt: 0,
    };

    return createInnerTRPCContext({
      headers: opts.req.headers,
      session,
    });
  } catch (error) {
    console.error("❌ Error verifying JWT:", error);
    return createInnerTRPCContext({ headers: opts.req.headers, session: null });
  }
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Middleware to ensure session presence.
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) throw new Error("UNAUTHORIZED");
  return next({ ctx: { session: ctx.session } });
});

// Initializes tRPC router and procedures.
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
