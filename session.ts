import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions } from "@/db/schema";

export const SESSION_COOKIE = "sevre_session";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 120,
};

export type SessionRecord = {
  id: number;
  token: string;
  customerId: number | null;
};

async function upsert(token: string): Promise<SessionRecord> {
  const [existing] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  if (existing) return existing;
  const inserted = await db
    .insert(sessions)
    .values({ token })
    .onConflictDoNothing({ target: sessions.token })
    .returning();
  if (inserted[0]) return inserted[0];
  const [again] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  if (!again) throw new Error("Unable to open a salon session.");
  return again;
}

export async function readSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return upsert(token);
}

export async function getWritableSession() {
  const jar = await cookies();
  let token = jar.get(SESSION_COOKIE)?.value;
  if (!token) {
    token = randomBytes(24).toString("hex");
    jar.set(SESSION_COOKIE, token, cookieOptions);
  }
  return upsert(token);
}
