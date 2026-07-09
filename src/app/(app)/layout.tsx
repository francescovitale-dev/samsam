import { requireUser } from "@/lib/auth-guard";
import { AppNav } from "@/components/app-nav";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r bg-card md:flex">
        <AppNav />
        <div className="border-t p-3">
          <div className="mb-2 px-2 text-xs text-muted-foreground truncate">{user.email}</div>
          <form action={doSignOut}>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
              <LogOut className="size-4" /> Uitloggen
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  );
}
