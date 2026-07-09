import { redirect } from "next/navigation";
import { isAuthed, checkPassword, setGateCookie } from "@/lib/gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthed()) redirect("/");
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const pw = String(formData.get("password") ?? "");
    if (!checkPassword(pw)) redirect("/login?error=1");
    await setGateCookie();
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1720] p-4">
      {/* animated energy aurora */}
      <div className="ss-aurora">
        <div
          className="ss-blob"
          style={{ width: 420, height: 420, top: "-8%", left: "-6%", background: "var(--brand-lime)", animation: "ss-float 16s ease-in-out infinite" }}
        />
        <div
          className="ss-blob"
          style={{ width: 460, height: 460, bottom: "-12%", right: "-8%", background: "var(--brand-teal)", animation: "ss-drift 20s ease-in-out infinite" }}
        />
        <div
          className="ss-blob"
          style={{ width: 260, height: 260, top: "40%", left: "55%", background: "#f39200", opacity: 0.3, animation: "ss-float 22s ease-in-out infinite reverse" }}
        />
      </div>

      <div className="animate-pop relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex items-center gap-2">
          <div className="text-2xl font-extrabold tracking-tight">
            Sam<span className="text-shimmer">Sam</span>
          </div>
          <span className="text-sm text-muted-foreground">Offertes</span>
          <span className="ml-auto text-lg" style={{ animation: "ss-bolt 4s ease-in-out infinite" }} aria-hidden>
            ⚡
          </span>
        </div>
        <form action={login} className="space-y-4">
          <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
            <h1 className="mb-1 text-lg font-semibold">Inloggen</h1>
            <p className="text-sm text-muted-foreground">Voer het wachtwoord in om verder te gaan.</p>
          </div>
          {error && (
            <p className="animate-fade-up rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Onjuist wachtwoord.
            </p>
          )}
          <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input id="password" name="password" type="password" required autoFocus autoComplete="current-password" />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
            <Button
              type="submit"
              className="w-full bg-brand-lime text-brand-lime-ink transition-transform hover:bg-brand-lime/90 hover:-translate-y-0.5 active:translate-y-0"
            >
              Inloggen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
