import { requireUser } from "@/lib/auth-guard";
import { clearGateCookie } from "@/lib/gate";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { PageFade } from "@/components/page-fade";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  async function doSignOut() {
    "use server";
    await clearGateCookie();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r bg-card md:flex">
        <AppNav />
        <div className="border-t p-3">
          <form action={doSignOut}>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
              <LogOut className="size-4" /> Uitloggen
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <PageFade>{children}</PageFade>
      </main>
    </div>
  );
}
