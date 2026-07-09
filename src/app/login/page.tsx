import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ check?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");
  const { check, error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    await signIn("nodemailer", { email, redirectTo: "/" });
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

        {check ? (
          <div className="space-y-3">
            <h1 className="text-lg font-semibold">Check je e-mail</h1>
            <p className="text-sm text-muted-foreground">
              We hebben een inloglink gestuurd. Klik erop om verder te gaan.
              (In ontwikkeling staat de link in de serverconsole.)
            </p>
            <a href="/login" className="text-sm text-brand-teal underline">
              Opnieuw proberen
            </a>
          </div>
        ) : (
          <form action={login} className="space-y-4">
            <div>
              <h1 className="mb-1 text-lg font-semibold">Inloggen</h1>
              <p className="text-sm text-muted-foreground">
                Voer je e-mailadres in. Alleen toegestane adressen krijgen toegang.
              </p>
            </div>
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Inloggen mislukt. Is dit adres toegestaan?
              </p>
            )}
            <div>
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jimmy@samsam.nu"
                autoComplete="email"
              />
            </div>
            <Button type="submit" className="w-full bg-brand-lime text-brand-lime-ink hover:bg-brand-lime/90">
              Stuur inloglink
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
