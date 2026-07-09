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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="text-2xl font-extrabold tracking-tight">
            Sam<span className="text-brand-lime">Sam</span>
          </div>
          <span className="text-sm text-muted-foreground">Offertes</span>
        </div>
        <form action={login} className="space-y-4">
          <div>
            <h1 className="mb-1 text-lg font-semibold">Inloggen</h1>
            <p className="text-sm text-muted-foreground">Voer het wachtwoord in om verder te gaan.</p>
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Onjuist wachtwoord.
            </p>
          )}
          <div>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input id="password" name="password" type="password" required autoFocus autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90">
            Inloggen
          </Button>
        </form>
      </div>
    </div>
  );
}
