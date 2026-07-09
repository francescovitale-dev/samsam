import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/gate";

/** Guard a server component/action behind the shared-password gate. */
export async function requireUser() {
  if (!(await isAuthed())) redirect("/login");
}
