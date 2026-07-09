import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Require an authenticated (allowlisted) user in a server component/action. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  return session.user;
}
