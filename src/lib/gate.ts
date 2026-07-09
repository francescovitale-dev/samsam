import { cookies } from "next/headers";

// Simple single shared-password gate for this internal tool.
// No accounts, no email — one password, one cookie.

export const GATE_COOKIE = "samsam_gate";

/** The opaque cookie value set after a correct password (server-only secret). */
function expectedToken(): string {
  return process.env.APP_GATE_TOKEN || "dev-gate-token-change-me";
}

export function checkPassword(input: string): boolean {
  const pw = process.env.APP_PASSWORD || "samsam";
  return input.length > 0 && input === pw;
}

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return c.get(GATE_COOKIE)?.value === expectedToken();
}

export async function setGateCookie(): Promise<void> {
  const c = await cookies();
  c.set(GATE_COOKIE, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearGateCookie(): Promise<void> {
  const c = await cookies();
  c.delete(GATE_COOKIE);
}
