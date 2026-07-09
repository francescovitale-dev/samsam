/** Emails permitted to sign in, from the ALLOWED_EMAILS env var (comma-separated). */
export function allowedEmails(): string[] {
  return (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = allowedEmails();
  // If no allowlist configured, deny by default (safer than open access).
  if (list.length === 0) return false;
  return list.includes(email.trim().toLowerCase());
}
